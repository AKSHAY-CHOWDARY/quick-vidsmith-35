import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';
import { processVideo } from '@/services/videoService';
import { VideoInput as VideoInputType } from '@/lib/types';

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoInputType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [detailedStatus, setDetailedStatus] = useState<string>('');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  
  // Processing stages with realistic timing
  const processingStages = [
    { stage: 'Initializing', details: ['Loading video processor', 'Setting up environment'] },
    { stage: 'Analyzing video content', details: ['Scanning video frames', 'Detecting scene changes', 'Analyzing audio track'] },
    { stage: 'Identifying key moments', details: ['Detecting important segments', 'Scoring content relevance', 'Finding peak moments'] },
    { stage: 'Generating clips', details: ['Cutting video segments', 'Applying transitions', 'Optimizing for selected aspect ratio'] },
    { stage: 'Creating captions', details: ['Transcribing audio', 'Generating timed subtitles', 'Formatting captions'] },
    { stage: 'Finalizing output', details: ['Rendering final video', 'Optimizing file size', 'Preparing download'] }
  ];

  // Simulate processing with progress updates
  useEffect(() => {
    if (!isProcessing || !videoSource) return;
    
    let currentProgress = 0;
    let currentStageIndex = 0;
    let detailIndex = 0;
    
    // Update progress and stage at intervals
    const progressInterval = setInterval(() => {
      // Increment progress
      const increment = Math.random() * 2 + 0.1;
      currentProgress += increment;
      
      // Update stage based on progress
      if (currentProgress > (currentStageIndex + 1) * (100 / processingStages.length)) {
        currentStageIndex = Math.min(currentStageIndex + 1, processingStages.length - 1);
        setProcessingStage(processingStages[currentStageIndex].stage);
        detailIndex = 0; // Reset detail index for new stage
      }
      
      // Cycle through detailed status messages
      if (currentProgress % 5 < 0.2) { // Change details occasionally
        const currentStage = processingStages[currentStageIndex];
        detailIndex = (detailIndex + 1) % currentStage.details.length;
        setDetailedStatus(currentStage.details[detailIndex]);
      }
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        return;
      }
      
      setProgress(currentProgress);
    }, 200);
    
    return () => clearInterval(progressInterval);
  }, [isProcessing, videoSource]);

  const handleVideoSubmit = async (data: VideoInputType) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setDetailedStatus('Preparing video processor');
    setProcessedVideoUrl(null);
    
    toast.info(`Starting video processing with ${data.aspectRatio} aspect ratio${data.captions ? ' and captions' : ''}`);
    console.log('Processing with options:', {
      aspectRatio: data.aspectRatio,
      captions: data.captions
    });
    
    try {
      // For development/demo purposes, you can choose between the real API call and simulation
      const USE_REAL_API = false; // Set to true to use the real backend
      
      if (USE_REAL_API) {
        // Use our axios service to make the real API call
        const response = await processVideo(data);
        
        if (!response.success) {
          throw new Error(response.error);
        }
        
        setProcessedVideoUrl(response.videoUrl || null);
        setIsProcessing(false);
        setProgress(100);
        toast.success('Video processing complete!');
      } else {
        // Simulate processing time for demo purposes when no real backend is available
        setTimeout(() => {
          // Simulate a successful response with a sample video URL
          const sampleVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
          
          setProcessedVideoUrl(sampleVideoUrl);
          setIsProcessing(false);
          setProgress(100);
          toast.success('Video processing complete!');
        }, 12000); // Longer processing time for better demo
      }
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      toast.error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!isProcessing && !processedVideoUrl && (
        <VideoInput onVideoSubmit={handleVideoSubmit} isProcessing={isProcessing} />
      )}
      
      {isProcessing && (
        <ProcessingStatus 
          progress={progress} 
          stage={processingStage} 
          detailedStatus={detailedStatus}
          isComplete={!isProcessing && processedVideoUrl !== null} 
        />
      )}
      
      {processedVideoUrl && (
        <div className="space-y-6">
          <VideoPlayer src={processedVideoUrl} title="Your Processed Video" />
          
          <div className="flex justify-center">
            <button 
              className="btn-primary"
              onClick={() => {
                setVideoSource(null);
                setProcessedVideoUrl(null);
                setIsProcessing(false);
              }}
            >
              Process another video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;
