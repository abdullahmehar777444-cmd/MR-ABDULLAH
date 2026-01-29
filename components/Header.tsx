import React from 'react';
import { FullScreenToggle } from './FullScreenToggle';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border">
            <div className="container mx-auto px-4 sm:px-6 py-4 max-w-screen-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-brand-primary rounded-lg shadow-lg shadow-indigo-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">
                                PTB Pro Generator
                            </h1>
                            <p className="text-xs font-medium text-brand-text-secondary">
                                Academic Command Center
                            </p>
                        </div>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-4">
                         <div className="flex items-center space-x-2 px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">
                            <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                            <span className="text-xs font-bold uppercase tracking-wide">2026 Edition</span>
                        </div>
                        <FullScreenToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
};