import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import GetAllMyExperiences from './Components/GetAllMyExperiences';
import CreateExperience from './Components/CreateExperience';
import GetAllExperiences from './Components/GetAllExperiences';
import GetAnExperience from './Components/GetAnExperience';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import UpdateExperience from './Components/UpdateExperience';
import './App.css';
import CareerMentor from './Components/Ai_Career_Mentor/CareerMentor';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/experiences" element={<GetAllExperiences />} />
          <Route path="/my-experiences" element={<GetAllMyExperiences />} />
          <Route path="/share-experience" element={<CreateExperience />} />
          <Route path="/experience/:id" element={<GetAnExperience />} />
          <Route path="/update-experience/:id" element={<UpdateExperience />} />
          <Route path="/ai-career-mentor" element={<CareerMentor />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App;