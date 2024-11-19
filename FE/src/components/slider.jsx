import React from 'react';
import Slider from 'react-slick';
import { MdEmail } from 'react-icons/md';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpeg";
import img3 from "../assets/3.jpeg";

const slider = () => {
    const slides = [
        img1,img2,img3
      ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
   <div className='p-5 rounded-sm'>
     {/* Download Banner */}
     <div className="flex items-center justify-between p-3 bg-gray-700  rounded-tr-xl rounded-tl-xl">
        <span className="text-sm">Download Mobile App</span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Download</button>
      </div>
     <div className="relative w-full h-[400px] bg-blue-800 overflow-hidden rounded-sm">
     <div> <Slider {...settings} className="w-full h-full">
        {slides.map((slide, index) => (
          <div key={index}>
            <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-[400px] object-cover" />
          </div>
        ))}
      </Slider>
      </div>
      {/* Email Icon in Bottom Right */}
      {/* <MdEmail className="absolute bottom-4 right-4 text-2xl text-white" /> */}</div>
     <div className="flex items-center justify-between p-5 bg-gray-700 rounded-br-xl rounded-bl-xl">
        <MdEmail className=" text-white absolute right-9 text-2xl " />
      </div>
    
   </div>
  );
};

export default slider;
