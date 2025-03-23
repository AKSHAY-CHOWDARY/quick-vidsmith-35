
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, Captions } from 'lucide-react';
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

interface VideoInputProps {
  onVideoSubmit: (data: { 
    type: 'url' | 'file', 
    source: string | File, 
    query: string,
    aspectRatio: '1:1' | '16:9' | '9:16',
    captions: boolean
  }) => void;
  isProcessing: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSubmit, isProcessing }) => {
  const [inputType, setInputType] = useState<'url' | 'file'>('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [enableCaptions, setEnableCaptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toast.error('Please enter a valid video URL');
      return;
    }
    
    onVideoSubmit({ 
      type: 'url', 
      source: videoUrl,
      query: userQuery,
      aspectRatio,
      captions: enableCaptions
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = () => {
    if (!selectedFile) {
      toast.error('Please select a video file');
      return;
    }
    
    onVideoSubmit({ 
      type: 'file', 
      source: selectedFile,
      query: userQuery,
      aspectRatio,
      captions: enableCaptions
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please drop a valid video file');
        return;
      }
      setSelectedFile(file);
      setInputType('file');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-md shadow-md p-6">
        {/* Query input field */}
        <div className="space-y-2 mb-6">
          <label htmlFor="user-query" className="block text-sm text-gray-300 text-left">
            What clips would you like to generate? (optional)
          </label>
          <Textarea
            id="user-query"
            placeholder="E.g., 'Extract the most exciting moments' or 'Create clips showing product demos'"
            className="min-h-[80px] text-white bg-[#151515] border-[#2A2A2A]"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-3 text-left">
            Aspect Ratio
          </label>
          <div className="flex space-x-4 justify-center">
            {/* Square 1:1 */}
            <div 
              className={`aspect-ratio-option cursor-pointer transition-all duration-200 ${aspectRatio === '1:1' ? 'ring-2 ring-vidsmith-accent scale-105' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => !isProcessing && setAspectRatio('1:1')}
            >
              <div className="w-20 h-20 bg-[#151515] rounded-md flex items-center justify-center">
                <div className="w-14 h-14 border border-white/30 rounded"></div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-300">1:1 Square</p>
            </div>
            
            {/* Landscape 16:9 */}
            <div 
              className={`aspect-ratio-option cursor-pointer transition-all duration-200 ${aspectRatio === '16:9' ? 'ring-2 ring-vidsmith-accent scale-105' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => !isProcessing && setAspectRatio('16:9')}
            >
              <div className="w-20 h-20 bg-[#151515] rounded-md flex items-center justify-center">
                <div className="w-16 h-9 border border-white/30 rounded"></div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-300">16:9 Landscape</p>
            </div>
            
            {/* Portrait 9:16 */}
            <div 
              className={`aspect-ratio-option cursor-pointer transition-all duration-200 ${aspectRatio === '9:16' ? 'ring-2 ring-vidsmith-accent scale-105' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => !isProcessing && setAspectRatio('9:16')}
            >
              <div className="w-20 h-20 bg-[#151515] rounded-md flex items-center justify-center">
                <div className="w-9 h-16 border border-white/30 rounded"></div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-300">9:16 Portrait</p>
            </div>
          </div>
        </div>

        {/* Captions Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center gap-2">
            <Captions size={16} className="text-gray-300" />
            <label className="text-sm text-gray-300">
              Generate Captions
            </label>
          </div>
          <Switch
            checked={enableCaptions}
            onCheckedChange={setEnableCaptions}
            disabled={isProcessing}
          />
        </div>

        {/* Upload area */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-vidsmith-accent bg-vidsmith-accent/5' : 'border-gray-600'
            } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <div className="flex flex-col items-center">
              <Upload className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-sm text-gray-300 mb-1">
                {selectedFile ? selectedFile.name : 'Drag and drop your video here'}
              </p>
              <p className="text-xs text-gray-500">
                {selectedFile 
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                  : 'or click to select a file'}
              </p>
            </div>
          </div>
          
          <button
            className="w-full bg-vidsmith-accent hover:bg-vidsmith-accent-light text-white py-3 rounded-md font-medium transition-colors"
            onClick={handleFileSubmit}
            disabled={!selectedFile || isProcessing}
          >
            Generate Clips
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInput;
