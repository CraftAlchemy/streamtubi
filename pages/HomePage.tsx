
import React from 'react';
import { useApp } from '../context/AppContext';
import Hero from '../components/Hero';
import VideoCarousel from '../components/VideoCarousel';

const HomePage: React.FC = () => {
  const { videos, categories } = useApp();

  // For the Hero component, let's pick a specific "trending" video or the first one.
  const heroVideo = videos.find(v => v.category === 'Trending Now') || videos[0];

  if (!heroVideo) {
    return <div className="container mx-auto text-center py-20">Loading...</div>;
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
