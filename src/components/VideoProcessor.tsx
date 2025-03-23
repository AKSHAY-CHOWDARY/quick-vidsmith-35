
import React, { useState, useEffect, useCallback } from 'react';
import VideoInput from './VideoInput';
import ProcessingStatus from './ProcessingStatus';
import VideoPlayer from './VideoPlayer';
import { toast } from 'sonner';
import { processVideo, checkJobStatus, getVideoUrl } from '@/services/videoService';
import { VideoInput as VideoInputType } from '@/lib/types';

const VideoProcessor: React.FC = () => {
  const [videoSource, setVideoSource] = useState<VideoInputType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Initializing');
  const [detailedStatus, setDetailedStatus] = useState<string>('');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Polling function to check job status
  const pollJobStatus = useCallback(async (id: string) => {
    try {
      const status = await checkJobStatus(id);
      
      // Update progress and status message
      setProgress(status.progress);
      setProcessingStage(status.message || 'Processing');
      
      if (status.status === 'completed' && status.output_video) {
        // Job completed successfully
        const videoUrl = getVideoUrl(status.output_video);
        setProcessedVideoUrl(videoUrl);
        setIsProcessing(false);
        toast.success('Video processing complete!');
        return true;
      } else if (status.status === 'failed') {
        // Job failed
        setIsProcessing(false);
        toast.error(`Processing failed: ${status.error || 'Unknown error'}`);
        return true;
      }
      
      // If job is still processing, return false to continue polling
      return false;
    } catch (error) {
      console.error('Error polling job status:', error);
      setIsProcessing(false);
      toast.error('Error checking processing status');
      return true;  // Stop polling on error
    }
  }, []);

  // Effect for polling job status
  useEffect(() => {
    if (!isProcessing || !jobId) return;
    
    let timerId: number;
    
    const poll = async () => {
      const shouldStop = await pollJobStatus(jobId);
      
      if (!shouldStop) {
        // Continue polling every 2 seconds
        timerId = window.setTimeout(poll, 2000);
      }
    };
    
    // Start polling
    poll();
    
    // Cleanup
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isProcessing, jobId, pollJobStatus]);

  const handleVideoSubmit = async (data: VideoInputType) => {
    setVideoSource(data);
    setIsProcessing(true);
    setProgress(0);
    setProcessingStage('Initializing');
    setDetailedStatus('Preparing video processor');
    setProcessedVideoUrl(null);
    setJobId(null);
    
    toast.info(`Starting video processing with ${data.aspectRatio} aspect ratio${data.captions ? ' and captions' : ''}`);
    console.log('Processing with options:', {
      aspectRatio: data.aspectRatio,
      captions: data.captions,
      query: data.query
    });
    
    try {
      // Call API to start processing
      const response = await processVideo(data);
      
      if (response.status === 'failed' || response.error) {
        throw new Error(response.error || 'Failed to start processing');
      }
      
      // Set job ID for status polling
      setJobId(response.id);
      setProgress(response.progress);
      setProcessingStage(response.message || 'Processing started');
      
      // If the job was already completed (unlikely but possible)
      if (response.status === 'completed' && response.output_video) {
        const videoUrl = getVideoUrl(response.output_video);
        setProcessedVideoUrl(videoUrl);
        setIsProcessing(false);
        toast.success('Video processing complete!');
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
          
          <div className="flex justify-center mt-6">
            <button 
              className="bg-vidsmith-accent hover:bg-vidsmith-accent-light text-white font-medium px-6 py-3 rounded-md transition-all duration-200"
              onClick={() => {
                setVideoSource(null);
                setProcessedVideoUrl(null);
                setIsProcessing(false);
                setJobId(null);
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
