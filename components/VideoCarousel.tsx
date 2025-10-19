
import React from 'react';
import { Video } from '../types';
import VideoCard from './VideoCard';

interface VideoCarouselProps {
  title: string;
  videos: Video[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ title, videos }) => {
  if (videos.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 px-4 sm:px-8 md:px-16">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 sm:px-8 md:px-16 scrollbar-hide">
          {videos.map(video => (
            <div key={video.id} className="flex-shrink-0 w-64 md:w-72 lg:w-80">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS for scrollbar hiding as Tailwind plugin is not available in CDN
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.append(style);

export default VideoCarousel;
