import React from 'react';
import { useApp } from '@/context/AppContext';
import Hero from '@/components/Hero';
import VideoCarousel from '@/components/VideoCarousel';

const HomePage: React.FC = () => {
  const { videos, categories, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const heroVideo = videos.find(v => v.category === 'Trending Now') || videos[0];

  if (!heroVideo) {
    return <div className="container mx-auto text-center py-20">No videos available.</div>;
  }
  
  return (
    <div>
      <Hero video={heroVideo} />
      <div className="py-8">
        {categories.map(category => (
          <VideoCarousel
            key={category.id}
            title={category.name}
            videos={videos.filter(v => v.category === category.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
