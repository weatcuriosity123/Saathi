"use client";

import React, { useState } from "react";

const VideoPlayer = ({ videoPlaceholderUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full bg-black relative">
      <div className="aspect-video w-full group relative overflow-hidden">
        <img
          alt="Video Content Placeholder"
          className="w-full h-full object-cover opacity-90"
          src={videoPlaceholderUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCHU0dyc9PDRvWb9fs6VIF0vlkpxF_oC-xhrpHF4eeG1UnKJ-lnBgMETjsRW3cMnO7m7mFF6cuWLm52ge_0FVX6oRNQ6HaZuvciiMFbmqX6D81PyV4_ITxtK9QvWV3JnDVuEw4HKR_u77PGfwaO03B9VCxG4PCQu2-LgU6YxAxxufep58vMLsjeJTiLwl0Q7AoGLQPiHQrPc1MSjdGZhJc7yVCpaHVBsyMNsHGe6qyfKnhIHPoKrPneqoxjad5nabDBEQ1SETh9v60"}
        />
        
        {/* Video Controls Overlay - Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
          {!isPlaying && (
            <button 
              onClick={() => setIsPlaying(true)}
              className="w-24 h-24 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group/play"
            >
              <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center group-hover/play:bg-primary transition-colors">
                <span className="material-symbols-outlined text-5xl font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Custom Player UI Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" 
             style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)' }}>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer relative group/progress">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary scale-0 group-hover/progress:scale-100 transition-transform"></div>
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors font-['Material_Symbols_Outlined']"
              >
                {isPlaying ? "pause_circle" : "play_circle"}
              </button>
              <button className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors font-['Material_Symbols_Outlined']">
                skip_next
              </button>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors font-['Material_Symbols_Outlined']">
                  volume_up
                </span>
                <div className="w-20 h-1 bg-white/20 rounded-full hidden sm:block">
                  <div className="w-3/4 h-full bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-sm font-medium font-label">12:45 / 34:20</span>
            </div>
            
            <div className="flex items-center gap-8">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors font-['Material_Symbols_Outlined']">
                closed_caption
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors font-['Material_Symbols_Outlined']">
                settings
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors font-['Material_Symbols_Outlined']">
                fullscreen
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
