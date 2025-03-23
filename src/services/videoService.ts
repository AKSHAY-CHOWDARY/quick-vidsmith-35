import axios from 'axios';
import { VideoInput } from '@/lib/types';

const API_URL = 'http://localhost:8000'; // Replace with your actual FastAPI backend URL

export interface VideoProcessingResponse {
  id: string;
  status: string;
  progress: number;
  message: string;
  output_video?: string;
  error?: string;
}

/**
 * Send video data to backend for processing
 * @param videoData The video data including source, query, aspect ratio and captions options
 * @returns Promise with the processing response
 */
export const processVideo = async (videoData: VideoInput): Promise<VideoProcessingResponse> => {
  try {
    // Create form data to send files and other data
    const formData = new FormData();
    
    // Add all parameters to form data
    formData.append('query', videoData.query || '');
    formData.append('aspect_ratio', mapAspectRatio(videoData.aspectRatio));
    formData.append('add_captions', videoData.captions.toString());
    
    // Append either file or URL
    if (videoData.type === 'url') {
      formData.append('video_url', videoData.source as string);
    } else {
      formData.append('video_file', videoData.source as File);
    }
    
    // Log what we're sending (for debugging)
    console.log('Sending data to backend:', {
      type: videoData.type,
      aspectRatio: videoData.aspectRatio,
      captions: videoData.captions,
      query: videoData.query
    });
    
    // Make the POST request
    const response = await axios.post<VideoProcessingResponse>(
      `${API_URL}/process`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error processing video:', error);
    
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      return {
        id: '',
        status: 'failed',
        progress: 0,
        message: 'Failed to process video',
        error: error.response?.data?.detail || error.message
      };
    }
    
    // Handle other errors
    return {
      id: '',
      status: 'failed',
      progress: 0,
      message: 'An unexpected error occurred',
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Check the status of a video processing job
 * @param jobId The ID of the job to check
 * @returns Promise with the job status
 */
export const checkJobStatus = async (jobId: string): Promise<VideoProcessingResponse> => {
  try {
    const response = await axios.get<VideoProcessingResponse>(
      `${API_URL}/status/${jobId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error checking job status:', error);
    
    if (axios.isAxiosError(error)) {
      return {
        id: jobId,
        status: 'failed',
        progress: 0,
        message: 'Failed to check job status',
        error: error.response?.data?.detail || error.message
      };
    }
    
    return {
      id: jobId,
      status: 'failed',
      progress: 0,
      message: 'An unexpected error occurred',
      error: 'An unexpected error occurred'
    };
  }
};

/**
 * Maps frontend aspect ratio format to backend aspect ratio format
 */
function mapAspectRatio(aspectRatio: '1:1' | '16:9' | '9:16'): string {
  switch (aspectRatio) {
    case '1:1':
      return 'square';
    case '16:9':
      return 'youtube';
    case '9:16':
      return 'reel';
    default:
      return 'youtube';
  }
}

/**
 * Get the full URL for a video from the backend
 */
export const getVideoUrl = (videoPath: string): string => {
  // If the path already starts with http, it's already a full URL
  if (videoPath.startsWith('http')) {
    return videoPath;
  }
  
  // Otherwise, append it to the API URL
  return `${API_URL}${videoPath}`;
};
