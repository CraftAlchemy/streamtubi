
import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';

const AD_VIDEOS: Record<string, string> = {
  'Action & Adventure': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'Comedies': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'Sci-Fi Movies': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'Documentaries': 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'default': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
};
const AD_DURATION_SECONDS = 5;

const VideoPlayer: React.FC<{ video: Video }> = ({ video }) => {
  const { currentUser } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Ad-related state
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(AD_DURATION_SECONDS);
  const [playedAdBreaks, setPlayedAdBreaks] = useState<number[]>([]);
  const prerollPlayedRef = useRef(false);

  const adUrl = AD_VIDEOS[video.category as keyof typeof AD_VIDEOS] || AD_VIDEOS.default;
  const isPremium = currentUser?.subscriptionPlan === 'Premium';
  const controlsTimeoutRef = useRef<number | null>(null);
  
  // Effect to handle initial play and pre-roll ads
  useEffect(() => {
    if (isPremium || prerollPlayedRef.current) {
        setIsPlaying(true);
    } else {
        setIsShowingAd(true);
        prerollPlayedRef.current = true;
    }
  }, [isPremium, video.id]);

  // Effect to manage video state synchronization, progress, and ad breaks
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Sync component state with the video element's actual state
    const syncIsPlaying = () => setIsPlaying(!videoElement.paused);
    videoElement.addEventListener('play', syncIsPlaying);
    videoElement.addEventListener('pause', syncIsPlaying);
    
    // Time update listener for progress bar and mid-roll ad checks
    const updateProgress = () => {
      if (isShowingAd || !videoElement.duration) return;

      setProgress((videoElement.currentTime / videoElement.duration) * 100);

      if (isPremium) return;

      const nextAdBreak = video.adBreaks.find(
        (breakTime) => 
          videoElement.currentTime >= breakTime && 
          !playedAdBreaks.includes(breakTime)
      );

      if (nextAdBreak) {
        setPlayedAdBreaks(prev => [...prev, nextAdBreak]);
        setIsShowingAd(true); // Switch to the ad
      }
    };
    
    videoElement.addEventListener('timeupdate', updateProgress);

    // If user intent is to pause, we must explicitly call pause.
    // The autoPlay prop handles playing, but not stopping an already playing video.
    if (!isPlaying && !videoElement.paused) {
        videoElement.pause();
    }
    
    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('play', syncIsPlaying);
      videoElement.removeEventListener('pause', syncIsPlaying);
    };
  }, [isPlaying, isShowingAd, isPremium, video.adBreaks, playedAdBreaks]);

  // Effect to manage the ad countdown timer
  useEffect(() => {
    let adTimer: number;
    if (isShowingAd) {
      setAdCountdown(AD_DURATION_SECONDS);
      adTimer = window.setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(adTimer);
            handleAdFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(adTimer);
  }, [isShowingAd]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    if(videoRef.current) {
      if(isMuted || videoRef.current.volume === 0) {
          const newVolume = volume > 0 ? volume : 0.5;
          videoRef.current.volume = newVolume;
          setVolume(newVolume);
          setIsMuted(false);
      } else {
          videoRef.current.volume = 0;
          setIsMuted(true);
      }
    }
  };

  const handleAdFinish = () => {
    setIsShowingAd(false);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full aspect-video bg-black" onMouseMove={handleMouseMove} onMouseLeave={() => setShowControls(false)}>
      <video 
        ref={videoRef} 
        className="w-full h-full" 
        src={isShowingAd ? adUrl : video.videoUrl} 
        muted={isShowingAd || isMuted} 
        loop={isShowingAd} 
        onClick={handleTogglePlay}
        // This declarative prop tells the browser to play when ready, avoiding the race condition.
        autoPlay={isPlaying} 
      />
      
      {isShowingAd && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-start justify-end p-4 text-white">
          <div className="bg-black bg-opacity-70 p-2 rounded">
            Ad playing... Content will resume in {adCountdown}
          </div>
          <button onClick={handleAdFinish} className="mt-2 bg-yellow-500 text-black py-1 px-3 rounded text-sm font-bold">Skip Ad</button>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls && !isShowingAd ? 'opacity-100' : 'opacity-0'}`}>
        <input type="range" min="0" max="100" value={progress} onChange={handleProgressChange} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm" style={{ backgroundSize: `${progress}% 100%` }} />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-4">
            <button onClick={handleTogglePlay}>
                {isPlaying ? 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                }
            </button>
            <div className="flex items-center space-x-2">
                <button onClick={toggleMute}>
                {isMuted || volume === 0 ? 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06Z" /><path d="M17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L19.5 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L19.5 10.94l-1.72-1.72Z" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.807 3.808 3.807 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M16.466 7.224a.75.75 0 0 1 1.06 0 5.25 5.25 0 0 1 0 7.424.75.75 0 0 1-1.06-1.06 3.75 3.75 0 0 0 0-5.304.75.75 0 0 1 0-1.06Z" /></svg>
                }
                </button>
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm" />
            </div>
          </div>
          <span className="text-sm font-mono text-white">{formatTime(videoRef.current?.currentTime ?? 0)} / {formatTime(videoRef.current?.duration ?? 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
