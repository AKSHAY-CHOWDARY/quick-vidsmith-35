
import axios from 'axios';
import { VideoInput } from '@/lib/types';

const API_URL = 'https://your-backend-url.com/api'; // Replace with your actual backend URL

export interface VideoProcessingResponse {
  success: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
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
    formData.append('type', videoData.type);
    formData.append('query', videoData.query || '');
    formData.append('aspectRatio', videoData.aspectRatio);
    formData.append('captions', videoData.captions.toString());
    
    // Append either file or URL
    if (videoData.type === 'url') {
      formData.append('url', videoData.source as string);
    } else {
      formData.append('file', videoData.source as File);
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
      `${API_URL}/process-video`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Optional: track upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          console.log('Upload progress:', percentCompleted);
          // You could update a progress state here
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error processing video:', error);
    
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to process video'
      };
    }
    
    // Handle other errors
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
};
