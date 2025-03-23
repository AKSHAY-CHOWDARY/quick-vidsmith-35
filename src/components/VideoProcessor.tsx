
import React, { useState, useEffect } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';

interface VideoSource {
  type: 'url' | 'file';
  source: string | File;
  query: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

interface ApiResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
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

  // Make API call to your endpoint
  const processVideoWithApi = async (data: VideoSource) => {
    const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE'; // Replace with your actual API endpoint
    
    try {
      // Create form data for sending to API
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('query', data.query || '');
      formData.append('aspectRatio', data.aspectRatio);
      formData.append('captions', data.captions.toString());
      
      if (data.type === 'url') {
        formData.append('url', data.source as string);
      } else {
        formData.append('file', data.source as File);
      }
      
      // Make the API call
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process video');
      }
      
      // Return the processed video URL
      return result.videoUrl;
    } catch (error) {
      console.error('API Processing Error:', error);
      throw error;
    }
  };

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

  const handleVideoSubmit = async (data: VideoSource) => {
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
      // Comment out the actual API call for now and simulate a response
      // const videoUrl = await processVideoWithApi(data);
      
      // Simulate processing time for demo purposes
      // In a real application, you would use the actual API response
      setTimeout(() => {
        // Simulate a successful response with a sample video URL
        const sampleVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        
        setProcessedVideoUrl(sampleVideoUrl);
        setIsProcessing(false);
        setProgress(100);
        toast.success('Video processing complete!');
      }, 12000); // Longer processing time for better demo
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
