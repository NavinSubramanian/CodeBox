const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Test = require('../models/Test');
const User = require('../models/User');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Route to upload test and assign to students
router.post('/upload', upload.single('file'), async (req, res) => {
    const { testName, testDuration, totalScore } = req.body;
    
    try {
        // Check if testName already exists
        const existingTest = await Test.findOne({ testName });
        if (existingTest) {
            return res.status(400).json({ message: 'Test name already exists' });
        }

        // Read and parse the Excel file from memory
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const questions = xlsx.utils.sheet_to_json(sheet);

        // Create new test with questions
        const newTest = new Test({
            testName,
            testDuration,
            totalScore,
            questions,
        });

        // Assign test to all non-admin students
        const students = await User.find({ isAdmin: false });
        students.forEach(student => {
            newTest.assignedTo.push({
                studentId: student._id,
                isAttended: false,
                marksScored: 0
            });
        });

        await newTest.save();
        res.status(200).json({ message: 'Test uploaded and assigned successfully' });
    } catch (error) {
        console.error('Error uploading test:', error);
        res.status(500).json({ message: 'Error uploading test' });
    }
});

// Route to get assigned tests
router.get('/assigned-tests', async (req, res) => {
    const email = req.headers.email;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tests = await Test.find({
            assignedTo: { $elemMatch: { studentId: user._id, isAttended: false } }
        }).select('testId testName testDescription assignedTo');

        res.status(200).json({ tests });
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ message: 'Error fetching tests' });
    }
});

// Route to get test questions
router.get('/:testId', async (req, res) => {
    const { testId } = req.params;

    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.status(200).json({ questions: test.questions, duration: test.testDuration });
    } catch (error) {
        console.error('Error fetching test questions:', error);
        res.status(500).json({ message: 'Error fetching test questions' });
    }
});

// Route to check attendance status
router.get('/:testId/check-attendance', async (req, res) => {
    const { testId } = req.params;
    const email = req.headers.email;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const studentTest = test.assignedTo.find(
            (assignment) => assignment.studentId.toString() === user._id.toString()
        );

        if (studentTest) {
            return res.status(200).json({ isAttended: studentTest.isAttended });
        } else {
            return res.status(404).json({ message: 'Student assignment not found' });
        }
    } catch (error) {
        console.error('Error checking attendance status:', error);
        res.status(500).json({ message: 'Error checking attendance status' });
    }
});

// Route to submit test
router.post('/:testId/submit', async (req, res) => {
    const { testId } = req.params;
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const studentTest = test.assignedTo.find(
            (assignment) => assignment.studentId.toString() === user._id.toString()
        );

        if (studentTest) {
            studentTest.isAttended = true;
            await test.save();
            res.status(200).json({ message: 'Test submission received' });
        } else {
            return res.status(404).json({ message: 'Student assignment not found' });
        }
    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Error submitting test' });
    }
});

// Route to update score
router.put('/:testId/update', async (req, res) => {
    const { testId } = req.params;
    const { score, email, timeTaken } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const studentTest = test.assignedTo.find(
            (assignment) => assignment.studentId.toString() === user._id.toString()
        );

        if (studentTest) {
            studentTest.marksScored = score;
            studentTest.timecompleted = timeTaken;
            studentTest.isAttended = true;
            await test.save();
            res.status(200).json({ message: 'Score updated successfully' });
        } else {
            return res.status(404).json({ message: 'Student assignment not found' });
        }
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: 'Error updating score' });
    }
});

module.exports = router;