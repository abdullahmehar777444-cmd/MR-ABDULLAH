
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/PaperForm';
import { GeneratedOutput } from './components/GeneratedPaper';
import { SavedItems } from './components/SavedPapers';
import { generateNotes, generateTest, generateDefinitions } from './services/geminiService';
import { type GeneratorFormData, type SavedItem, type GeneratorMode, NotesFormData, TestFormData, DefinitionsFormData } from './types';

const defaultNotesData: NotesFormData = {
    mode: 'notes',
    subject: 'Physics (New Course)',
    chapters: '1, 2, 3',
    medium: 'English',
    notesType: 'Key Points',
    highlightQuestions: true,
    isSmartSyllabus: true,
};

const defaultTestData: TestFormData = {
    mode: 'test',
    subject: 'Mathematics (New Course)',
    chapters: `Units 1-4`,
    medium: 'English',
    testType: 'Mid-Term Exam',
    totalMarks: '50',
    isSmartSyllabus: true,
    choiceEnabled: true,
    includeBoardImportant: true,
    includeAdditionalQuestions: false,
    includeMathExamples: false,
};

const defaultDefinitionsData: DefinitionsFormData = {
    mode: 'definitions',
    subject: 'Chemistry (New Course)',
    chapters: 'Full Book',
    medium: 'English',
    isFullBook: true,
    includeBoardRepeated: true,
    isSmartSyllabus: true,
};

const App: React.FC = () => {
    // FIX: Added missing '=' to the useState declaration. This was causing a major parsing error.
    const [mode, setMode] = useState<GeneratorMode>('test');
    const [formData, setFormData] = useState<GeneratorFormData>(defaultTestData);
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedItems');
            if (saved) {
                setSavedItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load items from localStorage", e);
        }
    }, []);
    
    const handleModeChange = (newMode: GeneratorMode) => {
        setMode(newMode);
        if (newMode === 'notes') setFormData(defaultNotesData);
        else if (newMode === 'test') setFormData(defaultTestData);
        else setFormData(defaultDefinitionsData);
        setGeneratedContent('');
        setError(null);
    };

    const handleGenerate = useCallback(async (data: GeneratorFormData) => {
        setIsLoading(true);
        setError(null);
        setGeneratedContent('');
        try {
            let content = '';
            if (data.mode === 'notes') {
                content = await generateNotes(data);
            } else if (data.mode === 'test') {
                content = await generateTest(data);
            } else if (data.mode === 'definitions') {
                content = await generateDefinitions(data);
            }
            setGeneratedContent(content);
            
            const newItem: SavedItem = { id: Date.now(), data, content };
            setSavedItems(prevItems => {
                const updatedItems = [newItem, ...prevItems].slice(0, 10); // Keep last 10
                localStorage.setItem('savedItems', JSON.stringify(updatedItems));
                return updatedItems;
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLoadItem = useCallback((item: SavedItem) => {
        setMode(item.data.mode);
        setFormData(item.data);
        setGeneratedContent(item.content);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleDeleteItem = useCallback((id: number) => {
        setSavedItems(prevItems => {
            const updatedItems = prevItems.filter(p => p.id !== id);
            localStorage.setItem('savedItems', JSON.stringify(updatedItems));
            return updatedItems;
        });
    }, []);

    return (
        <div className="min-h-screen bg-brand-background font-sans selection:bg-brand-primary/20 selection:text-white">
            <Header />
            <main className="container mx-auto p-4 md:p-8 max-w-screen-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-8 sticky top-24">
                        <GeneratorForm
                            mode={mode}
                            onModeChange={handleModeChange}
                            formData={formData}
                            setFormData={setFormData}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                        />
                        <SavedItems
                            items={savedItems}
                            onLoad={handleLoadItem}
                            onDelete={handleDeleteItem}
                        />
                    </aside>
                    <div className="lg:col-span-8 xl:col-span-9">
                        <GeneratedOutput
                            mode={mode}
                            content={generatedContent}
                            isLoading={isLoading}
                            error={error}
                            subject={formData.subject}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;