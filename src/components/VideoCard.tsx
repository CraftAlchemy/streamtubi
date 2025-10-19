
import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '@/types';
import { useApp } from '@/context/AppContext';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { isAuthenticated, addToMyList, removeFromMyList, isInMyList } = useApp();
  const isBookmarked = isInMyList(video.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(isBookmarked) {
      removeFromMyList(video.id);
    } else {
      addToMyList(video.id);
    }
  };

  return (
    <Link to={`/watch/${video.id}`} className="block group relative aspect-video bg-card border border-border rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">{video.title}</h3>
        {isAuthenticated && (
           <button 
             onClick={handleBookmarkClick} 
             className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75"
             title={isBookmarked ? "Remove from My List" : "Add to My List"}
           >
             {isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
             )}
           </button>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;
