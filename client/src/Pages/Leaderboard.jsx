import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // For checking cookies

const LeaderboardPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('marksScored');
    const [sortOrder, setSortOrder] = useState('desc');
    const [emailFilter, setEmailFilter] = useState('');
    const [testNameFilter, setTestNameFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const navigate = useNavigate();

    // Admin check
    useEffect(() => {
        // Check if the user is admin
        const token = Cookies.get('token');
        const isAdmin = Cookies.get('isAdmin') === 'true'; // Get isAdmin from the cookie and convert it to boolean

        if (!token || !isAdmin) {
            // If there's no token or the user is not an admin, navigate to home page
            navigate('/home');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/leaderboard');
                setData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filtering and sorting logic
        let filtered = data;

        if (emailFilter) {
            filtered = filtered.filter(item =>
                item.email.toLowerCase().includes(emailFilter.toLowerCase())
            );
        }

        if (testNameFilter) {
            filtered = filtered.filter(item =>
                item.testName.toLowerCase().includes(testNameFilter.toLowerCase())
            );
        }

        if (departmentFilter) {
            filtered = filtered.filter(item =>
                item.department.toLowerCase().includes(departmentFilter.toLowerCase())
            );
        }

        filtered = filtered.sort((a, b) => {
            if (sortField === 'marksScored') {
                return sortOrder === 'asc' ? a.marksScored - b.marksScored : b.marksScored - a.marksScored;
            } else if (sortField === 'timeCompleted') {
                return sortOrder === 'asc' ? a.timeCompleted.localeCompare(b.timeCompleted) : b.timeCompleted.localeCompare(a.timeCompleted);
            }
            return 0;
        });

        setFilteredData(filtered);
    }, [data, emailFilter, testNameFilter, departmentFilter, sortField, sortOrder]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // const generatePDF = () => {
    //     const doc = new jsPDF();
    //     doc.setFontSize(16);
    //     doc.text(20, 20, 'Leaderboard');
    //     doc.setFontSize(12);

    //     const tableColumn = ["Email", "Department", "Year", "Test Name", "Total Score", "Marks Scored", "Time Completed"];
    //     const tableRows = filteredData.map(item => [
    //         item.email,
    //         item.department,
    //         item.year,
    //         item.testName,
    //         item.totalScore,
    //         item.marksScored,
    //         item.timeCompleted
    //     ]);

    //     doc.autoTable({
    //         head: [tableColumn],
    //         body: tableRows,
    //         startY: 40,
    //         styles: {
    //             fillColor: [52, 73, 94],
    //             textColor: [255, 255, 255],
    //             halign: 'center'
    //         },
    //         headStyles: {
    //             fillColor: [52, 73, 94],
    //             textColor: [255, 255, 255]
    //         },
    //         alternateRowStyles: {
    //             fillColor: [240, 240, 240]
    //         },
    //         columnStyles: {
    //             0: { cellWidth: 50 },
    //             1: { cellWidth: 50 },
    //             2: { cellWidth: 20 },
    //             3: { cellWidth: 60 },
    //             4: { cellWidth: 30 },
    //             5: { cellWidth: 30 },
    //             6: { cellWidth: 30 }
    //         }
    //     });

    //     doc.save('Leaderboard.pdf');
    // };
    const generatePDF = () => {
        const doc = new jsPDF('landscape'); // Switch to landscape for wider tables
        doc.setFontSize(16);
        doc.text(20, 20, 'Leaderboard');
        doc.setFontSize(12);
    
        const tableColumn = ["Email", "Department", "Year", "Test Name", "Total Score", "Marks Scored", "Time Completed"];
        const tableRows = filteredData.map(item => [
            item.email,
            item.department,
            item.year,
            item.testName,
            item.totalScore,
            item.marksScored,
            item.timeCompleted
        ]);
    
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid', // Basic grid theme without row coloring
            styles: {
                fillColor: [52, 73, 94],
                textColor: [255, 255, 255],
                halign: 'center', // Horizontal alignment for text
                cellPadding: 3, // Add some padding for better spacing
            },
            headStyles: {
                fillColor: [52, 73, 94],
                textColor: [255, 255, 255],
            },
            columnStyles: {
                0: { cellWidth: 60 }, // Email
                1: { cellWidth: 50 }, // Department
                2: { cellWidth: 20 }, // Year
                3: { cellWidth: 60 }, // Test Name
                4: { cellWidth: 30 }, // Total Score
                5: { cellWidth: 30 }, // Marks Scored
                6: { cellWidth: 30 }, // Time Completed
            },
            margin: { top: 30 }, // Adjust margin for spacing
            pageBreak: 'auto', // Automatically break pages if the content overflows
            tableWidth: 'auto', // Adjust table width to fit content
        });
    
        doc.save('Leaderboard.pdf');
    };
    
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">Leaderboard</h1>

            {/* Separate Filters for Email, Test Name, and Department */}
            <div className="filters">
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by Email"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by Test Name"
                    value={testNameFilter}
                    onChange={(e) => setTestNameFilter(e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by Department"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                />
            </div>

            <div className="sort-options">
                <label>Sort By:</label>
                <select onChange={(e) => setSortField(e.target.value)}>
                    <option value="marksScored">Marks Scored</option>
                    <option value="timeCompleted">Time Completed</option>
                </select>
                <label>Order:</label>
                <select onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Test Name</th>
                        <th>Total Score</th>
                        <th>Marks Scored</th>
                        <th>Time Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.email}</td>
                            <td>{item.department}</td>
                            <td>{item.year}</td>
                            <td>{item.testName}</td>
                            <td>{item.totalScore}</td>
                            <td>{item.marksScored}</td>
                            <td>{item.timeCompleted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={generatePDF} className="pdf-button">Download PDF</button>

            <div className="pagination">
                {[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map(page => (
                    <button key={page} onClick={() => handlePageChange(page + 1)}>
                        {page + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardPage;
