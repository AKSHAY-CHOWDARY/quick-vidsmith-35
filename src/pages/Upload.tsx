
import React from 'react';
import Layout from '../components/Layout';
import VideoProcessor from '../components/VideoProcessor';

const Upload = () => {
  return (
    <Layout>
      <section className="py-8 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Create <span className="text-vidsmith-accent">Smart Clips</span> with AI
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload a video or paste a URL and let our AI generate engaging clips
              optimized for social media.
            </p>
          </div>

          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <VideoProcessor />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Upload;
