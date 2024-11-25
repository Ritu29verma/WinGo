import React from 'react';
import { FaHome, FaCrown, FaGamepad, FaEllipsisH } from 'react-icons/fa';
import logo from "../assets/image.png";
import Slider from "../components/slider";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import Footer from '../components/Footer';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">  
     <Header isLogin={true} isLogout={true} isRegister={true} isWingo={true}/>
    <Slider/>

      {/* Tabs Section */}
      <div className="flex justify-around py-4 bg-gray-800">
        <div className="text-center flex flex-col items-center">
          <FaHome className="text-2xl " />
          <p>Home</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <img src={logo} alt="logo" style={{ width: '25px', height: '25px' }} />
          <p className=''>Lottery</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <FaCrown className="text-2xl" />
          <p className=''>Originals</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <FaGamepad className="text-2xl" />
          <p>Slots</p>
        </div>
        <div className="text-center flex flex-col items-center">
          <FaEllipsisH className="text-2xl" />
          <p>More</p>
        </div>
      </div>

      {/* Activity and Invite Section */}
      <div className="flex justify-around p-4 bg-gray-900">
        <div>
          <h2 className="font-semibold">Activity</h2>
          <p className="text-sm text-gray-400">Rich reward activities.</p>
        </div>
        <div>
          <h2 className="font-semibold">Invite</h2>
          <p className="text-sm text-gray-400">Invite friends to receive rewards.</p>
        </div>
      </div>


      {/* Content Carousel */}
      <div className="bg-gray-800 p-4">
        <h2 className="font-bold">Lottery Game</h2>
        {/* Add your carousel here */}
      </div>
  

    <Footer/>
    </div>
  );
}

export default App;
