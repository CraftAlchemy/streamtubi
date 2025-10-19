
import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';

interface HeroProps {
  video: Video;
}

const Hero: React.FC<HeroProps> = ({ video }) => {
  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full text-white">
      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/70 to-transparent"></div>

      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-16 mb-8 md:w-1/2">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{video.title}</h1>
        <p className="text-md md:text-lg mb-6 max-w-xl drop-shadow-md line-clamp-3">{video.description}</p>
        <div className="flex space-x-4">
          <Link to={`/watch/${video.id}`} className="flex items-center justify-center bg-brand-red text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
            Play
          </Link>
          <button className="flex items-center justify-center bg-gray-500 bg-opacity-70 text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-50 transition-all duration-200">
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
