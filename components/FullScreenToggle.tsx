import React, { useState, useEffect } from 'react';
import { FullScreenIcon } from './icons/FullScreenIcon';
import { ExitFullScreenIcon } from './icons/ExitFullScreenIcon';

export const FullScreenToggle: React.FC = () => {
    const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

    const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
    };

    const toggleFullScreen = async () => {
        if (!document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            }
        } else {
            if (document.exitFullscreen) {
                try {
                    await document.exitFullscreen();
                } catch (err) {
                    console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    return (
        <button
            onClick={toggleFullScreen}
            title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className="p-2.5 bg-brand-surface rounded-lg text-brand-text-secondary hover:bg-slate-700 hover:text-brand-text-primary transition-colors border border-brand-border"
        >
            {isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
        </button>
    );
};