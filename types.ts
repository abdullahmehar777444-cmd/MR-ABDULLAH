export type GeneratorMode = 'notes' | 'test' | 'definitions';

export interface BaseFormData {
    subject: string;
    chapters: string;
    medium: 'English' | 'Urdu';
    isSmartSyllabus: boolean;
}

export interface NotesFormData extends BaseFormData {
    mode: 'notes';
    notesType: 'Short Notes' | 'Long Notes' | 'Key Points' | 'Board-Important Notes';
    highlightQuestions: boolean; // Kept for backward compatibility or nuanced use
}

export interface TestFormData extends BaseFormData {
    mode: 'test';
    testType: string;
    totalMarks: string;
    choiceEnabled: boolean;
    includeBoardImportant: boolean;
    includeAdditionalQuestions: boolean;
    includeMathExamples: boolean;
}

export interface DefinitionsFormData extends BaseFormData {
    mode: 'definitions';
    isFullBook: boolean;
    includeBoardRepeated: boolean;
}

export type GeneratorFormData = NotesFormData | TestFormData | DefinitionsFormData;

export interface SavedItem {
    id: number;
    content: string;
    data: GeneratorFormData;
}

export interface PairingScheme {
    name: string;
    chapters: string;
}