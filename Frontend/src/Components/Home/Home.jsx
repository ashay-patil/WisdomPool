import React from 'react';
import './Home.css';
const Home = () => {
  return (
    <div className='home-container'>
      <h1 className='home-title'>
        Welcome to Experience Sharing Platform!
      </h1>
      <p className='home-description'>
        This platform is designed to help students share, discover interview experiences of candidates of All Companies
      </p>
      <ul className='home-list'>
        <li>Browse interview experiences shared by candidates.</li>
        <li>Upload your own experiences to help others.</li>
        <li>AI Assistance to give more insights about the experience</li>
      </ul>
      <p className='home-description'>
        Get started by browsing experiences or uploading your own!
      </p>
    </div>
  );
};

export default Home;