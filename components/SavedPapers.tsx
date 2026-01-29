import React from 'react';
import { type SavedItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface SavedItemsProps {
    items: SavedItem[];
    onLoad: (item: SavedItem) => void;
    onDelete: (id: number) => void;
}

const TypeBadge: React.FC<{ type: 'notes' | 'test' | 'definitions' }> = ({ type }) => {
    const colors = {
        notes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        test: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        definitions: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
    return (
        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${colors[type]} border`}>
            {type}
        </span>
    );
};

export const SavedItems: React.FC<SavedItemsProps> = ({ items, onLoad, onDelete }) => {
    if (items.length === 0) return null;

    return (
        <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border shadow-2xl shadow-black/20">
            <h2 className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                </svg>
                Generation Archive
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                    <div key={item.id} className="group relative bg-brand-background p-3 rounded-lg border border-brand-border hover:border-brand-primary/50 hover:bg-brand-surface/50 transition-all cursor-pointer" onClick={() => onLoad(item)}>
                        <div className="flex flex-col space-y-1.5 pr-8">
                            <p className="font-semibold text-sm text-brand-text-primary truncate">{item.data.subject}</p>
                            <div className="flex items-center space-x-2">
                                <TypeBadge type={item.data.mode} />
                                <p className="text-xs text-brand-text-secondary font-medium truncate">{item.data.chapters.split('\n')[0]}</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};