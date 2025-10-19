
import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { generateVideoDescription, generateVideoMetadata } from '../services/geminiService';

interface VideoFormProps {
  video?: Video | null;
  onSubmit: (video: Omit<Video, 'id'> | Video) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    duration: 0,
    category: '',
    tags: '',
    ageRating: '',
    cast: '',
    adBreaks: '',
  });
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isSuggestingMeta, setIsSuggestingMeta] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        duration: video.duration,
        category: video.category,
        tags: video.tags.join(', '),
        ageRating: video.ageRating,
        cast: video.cast.join(', '),
        adBreaks: video.adBreaks.join(', '),
      });
    } else {
      // Reset form for new video
      setFormData({
        title: '',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
        duration: 0,
        category: '',
        tags: '',
        ageRating: '',
        cast: '',
        adBreaks: '',
      });
    }
  }, [video]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      alert("Please enter a title first to generate a description.");
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const description = await generateVideoDescription(formData.title);
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Could not generate AI description. Check the console for details.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSuggestMetadata = async () => {
    if (!formData.title || !formData.description) {
        alert("Please provide a title and description to suggest metadata.");
        return;
    }
    setIsSuggestingMeta(true);
    try {
        const metadata = await generateVideoMetadata(formData.title, formData.description);
        setFormData(prev => ({
            ...prev,
            category: metadata.category,
            tags: metadata.tags.join(', '),
        }));
    } catch (error) {
        alert("Could not suggest metadata. Please try again.");
    } finally {
        setIsSuggestingMeta(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoData = {
      ...formData,
      duration: Number(formData.duration),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      cast: formData.cast.split(',').map(tag => tag.trim()).filter(Boolean),
      adBreaks: formData.adBreaks.split(',').map(t => parseInt(t.trim(), 10)).filter(t => !isNaN(t)),
    };
    if (video) {
      onSubmit({ ...videoData, id: video.id });
    } else {
      onSubmit(videoData);
    }
  };
  
  const isAiBusy = isGeneratingDesc || isSuggestingMeta;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
       <div>
        <Label htmlFor="description">Description</Label>
         <div className="flex items-start space-x-2">
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
            <Button type="button" onClick={handleGenerateDescription} disabled={isAiBusy} className="h-auto">
              {isGeneratingDesc ? '...' : '✨ Gen Desc'}
            </Button>
         </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input id="thumbnailUrl" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} required />
        </div>
         <div className="md:col-span-2">
            <Button type="button" variant="outline" size="sm" onClick={handleSuggestMetadata} disabled={isAiBusy}>
                 {isSuggestingMeta ? 'Suggesting...' : '✨ Suggest Category & Tags with AI'}
            </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (sec)</Label>
          <Input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
        </div>
         <div>
          <Label htmlFor="ageRating">Age Rating</Label>
          <Input id="ageRating" name="ageRating" value={formData.ageRating} onChange={handleChange} placeholder="e.g., PG-13" required />
        </div>
      </div>
       <div>
        <Label htmlFor="cast">Cast (comma-separated)</Label>
        <Input id="cast" name="cast" value={formData.cast} onChange={handleChange} placeholder="e.g., Actor One, Actor Two" />
      </div>
       <div>
        <Label htmlFor="adBreaks">Ad Breaks (timestamps in seconds, comma-separated)</Label>
        <Input id="adBreaks" name="adBreaks" value={formData.adBreaks} onChange={handleChange} placeholder="e.g., 60, 180, 300" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting || isAiBusy}>
          {isSubmitting ? 'Saving...' : 'Save Video'}
        </Button>
      </div>
    </form>
  );
};

export default VideoForm;
