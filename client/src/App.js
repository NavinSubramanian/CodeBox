import {BrowserRouter, Routes, Route} from 'react-router-dom'
import UploadTest from './Pages/UploadTest';
import './App.css';

import Homepage from './Pages/Homepage';
import TestList from './Pages/TestList';
import Login from './Components/Login';
import AfterLogin from './Pages/AfterLogin';
import SeperateCourse from './Components/SeperateCourse';
import TestPage from './Pages/TestPage';
import SignUp from './Pages/Signup';
import Leaderboard from './Pages/Leaderboard';
import PrivateRoute from './PrivateRoute';
import TestSubmitted from './Pages/TestSubmitted';

import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          <Route element={<PrivateRoute />}>
            <Route path='/home' element={<AfterLogin />} />
            <Route path='/course/:id' element={<SeperateCourse />} />
            <Route path='/testlist' element={<TestList />} />
            <Route path='/test/:testid' element={<TestPage />} />
            <Route path='/Uploadtest' element={<UploadTest />} />
            <Route path='/Leaderboard' element={<Leaderboard />} />
            <Route path='/testresult/:testid' Component={TestSubmitted}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
