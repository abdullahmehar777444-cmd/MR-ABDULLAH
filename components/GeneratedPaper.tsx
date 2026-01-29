import React, { useState, useEffect, useRef } from 'react';
import { PrintIcon } from './icons/PrintIcon';
import { FullScreenIcon } from './icons/FullScreenIcon';
import { ExitFullScreenIcon } from './icons/ExitFullScreenIcon';
import { GeneratorMode } from '../types';

interface GeneratedOutputProps {
    mode: GeneratorMode;
    content: string;
    isLoading: boolean;
    error: string | null;
    subject: string;
}

const EmptyState: React.FC<{mode: GeneratorMode}> = ({ mode }) => (
    <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
        <div className="w-24 h-24 bg-brand-surface rounded-2xl flex items-center justify-center mb-6 border border-brand-border shadow-inner shadow-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-text-primary">PTB Pro Generator</h3>
        <p className="text-brand-text-secondary max-w-md mt-2 text-sm leading-relaxed">
            Configure the generation parameters to begin. All materials are created according to the official PTB standards for the 2026 Annual Exam.
        </p>
    </div>
);

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-brand-accent rounded-full animate-spin"></div>
        <div className="text-center">
            <p className="font-semibold text-brand-text-primary">Compiling Document</p>
            <p className="text-xs text-brand-text-secondary">AI Head Examiner In Session...</p>
        </div>
    </div>
);

export const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ mode, content, isLoading, error, subject }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => window.print();
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const toggleFullScreen = async () => {
        const elem = containerRef.current;
        if (!elem) return;
        if (!document.fullscreenElement) await elem.requestFullscreen();
        else await document.exitFullscreen();
    };
    
    useEffect(() => {
        const onFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    const isUrdu = subject.toLowerCase().includes('islamiyat') || subject.toLowerCase().includes('urdu') || subject.toLowerCase().includes('pakistan studies');

    return (
        <div ref={containerRef} className={`transition-all duration-300 ${isFullScreen ? 'bg-brand-background p-4' : ''}`}>
            <div className="bg-brand-surface rounded-2xl shadow-2xl shadow-black/20 border border-brand-border overflow-hidden min-h-[80vh]">
                <div className="flex items-center justify-between p-3 border-b border-brand-border print:hidden">
                    <span className="px-3 py-1 text-xs font-bold text-brand-text-secondary bg-brand-background rounded-md">{subject} | {mode.toUpperCase()}</span>
                    {content && !isLoading && (
                         <div className="flex items-center space-x-2">
                             <button onClick={handleCopy} className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${copied ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-brand-background border-brand-border text-brand-text-secondary hover:bg-slate-700'}`}>
                                 {copied ? 'Copied!' : 'Copy Text'}
                             </button>
                             <button onClick={toggleFullScreen} title="Toggle Fullscreen" className="p-2 bg-brand-background border border-brand-border text-brand-text-secondary rounded-md hover:bg-slate-700">{isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}</button>
                             <button onClick={handlePrint} className="flex items-center space-x-2 px-3 py-1.5 bg-brand-accent text-white text-xs font-bold rounded-md hover:bg-teal-600 transition-all shadow-md shadow-teal-500/10">
                                <PrintIcon /> <span>Export</span>
                             </button>
                         </div>
                    )}
                </div>
                
                <div id="printable-paper" className={`p-8 md:p-12 lg:p-16 bg-white text-slate-800 relative ${isUrdu ? 'font-serif text-right' : 'font-sans'}`}>
                    {isLoading && <Loader />}
                    {error && (
                        <div className="py-20 text-center text-red-500">
                            <p className="font-bold">System Interruption</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && !content && <EmptyState mode={mode} />}
                    {!isLoading && !error && content && (
                        <div className="prose prose-slate max-w-none animate-in fade-in duration-500">
                             <pre className={`whitespace-pre-wrap break-words ${isUrdu ? 'font-serif text-2xl leading-[3.2rem]' : 'font-sans text-base leading-relaxed'}`}>
                                {content}
                             </pre>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 1.5cm; }
                    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
                    #root > main { display: block !important; }
                    #printable-paper {
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        width: 100% !important;
                    }
                    pre {
                        white-space: pre-wrap !important;
                        word-break: break-word !important;
                        font-size: 11pt !important;
                        color: black !important;
                    }
                }
            `}</style>
        </div>
    );
};