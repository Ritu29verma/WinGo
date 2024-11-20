import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MdEmail } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Pagination } from 'swiper/modules'; 

import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpeg";
import img3 from "../assets/3.jpeg";

const SliderComponent = () => {
  const slides = [img1, img2, img3];

  return (
    <div className='p-5 rounded-sm'>
      {/* Download Banner */}
      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-tr-xl rounded-tl-xl">
        <span className="text-sm">Download Mobile App</span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Download</button>
      </div>

      <div className="relative w-full h-[400px] bg-blue-800 overflow-hidden rounded-sm">
        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-[400px] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex items-center justify-between p-5 bg-gray-700 rounded-br-xl rounded-bl-xl">
        <MdEmail className="text-white absolute right-9 text-2xl" />
      </div>
    </div>
  );
};

export default SliderComponent;
