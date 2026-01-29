import React from 'react';
import { type GeneratorFormData, type GeneratorMode, TestFormData, NotesFormData } from '../types';
import { GenerateIcon } from './icons/GenerateIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface GeneratorFormProps {
    mode: GeneratorMode;
    onModeChange: (mode: GeneratorMode) => void;
    formData: GeneratorFormData;
    setFormData: React.Dispatch<React.SetStateAction<GeneratorFormData>>;
    onGenerate: (data: GeneratorFormData) => void;
    isLoading: boolean;
}

const CustomToggle: React.FC<{
    label: string;
    description: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, description, name, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group p-4 bg-brand-background/50 rounded-lg hover:bg-brand-background transition-colors">
        <div className="flex flex-col pr-4">
            <span className="font-semibold text-sm text-brand-text-primary">{label}</span>
            <span className="text-xs text-brand-text-secondary">{description}</span>
        </div>
        <div className="relative flex-shrink-0">
            <input name={name} type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-12 h-7 rounded-full transition-colors peer-checked:bg-brand-primary bg-slate-700"></div>
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow"></div>
        </div>
    </label>
);

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ mode, onModeChange, formData, setFormData, onGenerate, isLoading }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(formData);
    };

    const isMath = formData.subject.toLowerCase().includes('math');

    return (
        <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border shadow-2xl shadow-black/20">
            <div className="grid grid-cols-3 gap-2 bg-brand-background p-2 rounded-xl mb-6">
                {(['notes', 'test', 'definitions'] as GeneratorMode[]).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => onModeChange(m)}
                        className={`py-2.5 text-xs font-bold rounded-lg transition-all tracking-wide uppercase ${
                            mode === m 
                            ? 'bg-brand-primary text-white shadow-md shadow-indigo-500/20' 
                            : 'text-brand-text-secondary hover:bg-slate-700'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-text-secondary ml-1">Subject (New Edition)</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-brand-background border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent transition-all outline-none font-semibold text-brand-text-primary" required />
                </div>
                {(!(formData.mode === 'definitions' && formData.isFullBook)) && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-brand-text-secondary ml-1">Syllabus / Units</label>
                        <textarea name="chapters" value={formData.chapters} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-brand-background border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent transition-all outline-none font-medium text-slate-300 resize-none" required />
                    </div>
                )}
                
                <div className="pt-2 space-y-4">
                    <div className="border-t border-brand-border/50"></div>
                    <h3 className="text-sm font-bold text-brand-text-primary px-1">Core Settings</h3>
                    <div className="space-y-2">
                         { mode === 'notes' && (
                            <div className="p-2 bg-brand-background/50 rounded-lg">
                                <label className="text-xs font-semibold text-brand-text-secondary uppercase">Notes Type</label>
                                <select name="notesType" value={(formData as NotesFormData).notesType} onChange={handleChange} className="mt-1 w-full px-3 py-2.5 bg-slate-700 border border-brand-border rounded-md outline-none font-semibold text-brand-text-primary text-sm">
                                    <option>Short Notes</option>
                                    <option>Long Notes</option>
                                    <option>Key Points</option>
                                    <option>Board-Important Notes</option>
                                </select>
                            </div>
                        )}
                        { mode === 'test' && (
                             <div className="p-2 bg-brand-background/50 rounded-lg">
                                <label className="text-xs font-semibold text-brand-text-secondary uppercase">Total Marks</label>
                                <input type="text" name="totalMarks" value={(formData as TestFormData).totalMarks} onChange={handleChange} className="mt-1 w-full px-3 py-2.5 bg-slate-700 border border-brand-border rounded-md outline-none font-semibold text-brand-text-primary text-sm" placeholder="e.g., 75" />
                            </div>
                        )}
                        <CustomToggle label="Revised Smart Syllabus" description="Filter by ALP 2026" name="isSmartSyllabus" checked={formData.isSmartSyllabus} onChange={handleChange} />
                        { mode === 'definitions' && (
                            <>
                                <CustomToggle label="Full New Book" description="Cover all chapters" name="isFullBook" checked={(formData as any).isFullBook} onChange={handleChange} />
                                <CustomToggle label="Tag Board Repeats" description="Highlight key definitions" name="includeBoardRepeated" checked={(formData as any).includeBoardRepeated} onChange={handleChange} />
                            </>
                        )}
                    </div>
                </div>

                { mode === 'test' && (
                    <div className="pt-2 space-y-4">
                        <div className="border-t border-brand-border/50"></div>
                        <h3 className="text-sm font-bold text-brand-text-primary px-1">Test Content</h3>
                        <div className="space-y-2">
                            <CustomToggle label="Choice Enabled" description="Follow board paper pattern" name="choiceEnabled" checked={(formData as TestFormData).choiceEnabled} onChange={handleChange} />
                            <CustomToggle label="Board-Important" description="Prioritize key questions" name="includeBoardImportant" checked={(formData as TestFormData).includeBoardImportant} onChange={handleChange} />
                            <CustomToggle label="Additional Questions" description="Add conceptual questions" name="includeAdditionalQuestions" checked={(formData as TestFormData).includeAdditionalQuestions} onChange={handleChange} />
                            {isMath && <CustomToggle label="Include Solved Examples" description="Add textbook examples" name="includeMathExamples" checked={(formData as TestFormData).includeMathExamples} onChange={handleChange} />}
                        </div>
                    </div>
                )}
                
                <button type="submit" disabled={isLoading} className="w-full px-6 py-4 bg-brand-accent text-white font-bold rounded-xl transition-all hover:bg-teal-600 active:scale-[0.98] disabled:bg-slate-600 disabled:opacity-50 shadow-lg shadow-teal-500/20">
                    <div className="flex items-center justify-center">
                        {isLoading ? (
                            <>
                                <SpinnerIcon />
                                <span className="ml-2">GENERATING...</span>
                            </>
                        ) : (
                            <>
                                <GenerateIcon />
                                <span className="ml-2 uppercase tracking-wide">Generate {mode}</span>
                            </>
                        )}
                    </div>
                </button>
            </form>
        </div>
    );
};