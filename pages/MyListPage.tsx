import React from 'react';
import { useApp } from '../context/AppContext';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const MyListPage: React.FC = () => {
  const { currentUser, videos } = useApp();

  const myListVideos = videos.filter(video => currentUser?.myList.includes(video.id));

  return (
    <div className="container mx-auto py-8 px-4 sm:px-8 md:px-16">
      <h1 className="text-3xl font-bold mb-8">My List</h1>
      {myListVideos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {myListVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl text-muted-foreground mb-4">Your list is empty.</h2>
          <p className="text-muted-foreground mb-6">Add shows and movies to your list to watch them later.</p>
          <Link to="/">
            <Button>Browse Content</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyListPage;