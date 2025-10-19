
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoCarousel from '../components/VideoCarousel';

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getVideoById, getVideosByCategory, getRecommendedVideos } = useApp();

  const video = id ? getVideoById(id) : undefined;

  if (!video) {
    return (
      <div className="container mx-auto text-center py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">Video not found</h1>
        <Link to="/" className="text-brand-red hover:underline">Go back to Home</Link>
      </div>
    );
  }

  const relatedVideos = getVideosByCategory(video.category).filter(v => v.id !== video.id);
  const recommendedVideos = getRecommendedVideos().filter(v => v.id !== video.id);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-8 md:px-16">
      <VideoPlayer video={video} />
      <div className="mt-8">
        <h1 className="text-4xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center space-x-4 text-muted-foreground mb-4">
            <span>{video.ageRating}</span>
            <span>&middot;</span>
            <span>{video.category}</span>
        </div>
        <p className="text-lg max-w-4xl">{video.description}</p>
        <p className="text-sm text-muted-foreground mt-4">
            <strong>Starring:</strong> {video.cast.join(', ')}
        </p>
      </div>
      <div className="mt-16 space-y-12">
        <VideoCarousel title="Recommended For You" videos={recommendedVideos} />
        <VideoCarousel title="Related Videos" videos={relatedVideos} />
      </div>
    </div>
  );
};

export default WatchPage;
