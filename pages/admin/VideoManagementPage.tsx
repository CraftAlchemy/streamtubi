import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import VideoForm from '../../components/VideoForm';
import { Button } from '../../components/ui/Button';

const VideoManagementPage: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNew = () => {
    setEditingVideo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const handleDelete = (videoId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideo(videoId);
    }
  };

  const handleFormSubmit = (videoData: Omit<Video, 'id'> | Video) => {
    setIsSubmitting(true);
    if ('id' in videoData) {
      updateVideo(videoData);
    } else {
      addVideo(videoData);
    }
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFormOpen(false);
    }, 500);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
        <Button onClick={handleAddNew}>Add New Video</Button>
      </div>

      {isFormOpen && (
        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
          <VideoForm
            video={editingVideo}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      <div className="overflow-x-auto bg-card border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Age Rating</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(video => (
              <tr key={video.id} className="border-b last:border-b-0">
                <td className="p-4 align-top">{video.title}</td>
                <td className="p-4 align-top">{video.category}</td>
                <td className="p-4 align-top">{video.ageRating}</td>
                <td className="p-4 align-top">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(video.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VideoManagementPage;