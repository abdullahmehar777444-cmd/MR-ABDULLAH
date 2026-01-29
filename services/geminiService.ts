import { GoogleGenAI } from "@google/genai";
import { type NotesFormData, type TestFormData, type DefinitionsFormData } from '../types';

// Per guidelines, assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContent = async (prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { temperature: 0.2 } // Lower temperature for more deterministic, factual output
        });
        return response.text || '';
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to communicate with the AI model. Please check the console for details.");
    }
}

export const generateNotes = async (formData: NotesFormData): Promise<string> => {
    const { subject, chapters, medium, notesType, isSmartSyllabus } = formData;

    const prompt = `
ROLE: Senior PTB Subject Specialist for Class 9.
TASK: Generate high-quality, exam-oriented study notes.
SESSION: Annual Examination 2026.

**CRITICAL INSTRUCTIONS:**
1.  **EDITION:** Strictly use the REVISED NEW EDITION (2024-2025 textbooks). IGNORE ALL OLD COURSE CONTENT.
2.  **SYLLABUS:** ${isSmartSyllabus ? 'Strictly adhere to the REVISED After Smart Syllabus (ALP) for 2026 exams.' : 'Cover the full chapters from the new edition.'}
3.  **ACCURACY:** All information, definitions, and exercise numbers must match the new textbooks precisely.

**INPUT:**
*   **Subject:** ${subject}
*   **Chapters:** ${chapters}
*   **Medium:** ${medium}
*   **Notes Type:** ${notesType}

**OUTPUT REQUIREMENTS:**
- Generate notes in the requested format ('${notesType}').
- For "Board-Important Notes", focus only on topics with the highest probability of appearing in the exam, based on past paper patterns adapted for the new syllabus.
- For "Key Points", use concise bullet points.
- For "Long Notes", provide detailed explanations with headings and subheadings.
- Use clean, professional formatting suitable for printing. For Urdu/Islamiyat, use appropriate directionality and formatting for headings, poetry, and religious text.
`;

    return generateContent(prompt);
};

// --- Official PECTAA 2026 Rules Engine ---
const subjectRules: Record<string, { alp: string; scheme: string }> = {
    urdu: {
        alp: `The following 4 lessons are excluded from Hisa Nasar: سبق 'لتہوا', سبق 'بیگم کی بلی', سبق 'دستک', سبق 'ہوا چلی'. The total lessons are 15 instead of 19.`,
        scheme: `Total Marks: 75. Time: 2h 30m.
- **Objective Part (15 marks, 20 mins):** 15 MCQs. 
  - 7 MCQs from Hisa Nasar (prose).
  - 2 MCQs from Hisa Nazm (poetry).
  - 1 MCQ from Hisa Ghazal.
  - 5 MCQs from Grammar (مذکر مؤنث, واحد جمع, مترادف, متضاد, محاورات).
- **Subjective Part (60 marks, 2h 10m):**
  - **Q2 (Ashar ki Tashreeh - 10 marks):** 3 out of 4 couplets from Nazm. 2 out of 3 from Ghazal.
  - **Q3 (Nasar paron ki Tashreeh - 10 marks):** Explain 1 out of 2 given paragraphs, including author name, lesson name, and meaning of underlined words.
  - **Q4 (Short Questions - 10 marks):** Answer 5 out of 8 questions (4 from Nasar, 2 from Nazm, 2 from Ghazal).
  - **Q5 (Khulasa - 5 marks):** Write a summary of 1 out of 2 given lessons from Hisa Nasar.
  - **Q6 (Markazi Khayal/Khulasa - 5 marks):** Write the central idea or summary of 1 out of 2 given poems (Nazm).
  - **Q7 (Darkhwast/Khat - 10 marks):** Write one application or letter.
  - **Q8 (Kahani/Mukalma - 5 marks):** Write one story or dialogue.
  - **Q9 (Jumlo ki Durusti/Takmeel - 5 marks):** Correct/complete 5 out of 7 sentences/proverbs.`,
    },
    english: {
        alp: `The following units are completely excluded: Unit 5 (Women Empowerment), Unit 8 (Impact of Globalisation), Unit 10 (The Silent Predator).`,
        scheme: `Total Marks: 75. Time: 2h 30m.
- **Objective Part (19 marks, 20 mins):** 19 MCQs.
  - 5 MCQs: Correct form of verb.
  - 4 MCQs: Correct spellings.
  - 5 MCQs: Correct meanings of underlined words.
  - 5 MCQs: Grammar options.
- **Subjective Part (56 marks, 2h 10m):**
  - **Q2 (Short Questions - 10 marks):** Part A: Answer 3 out of 5 questions from Units 1,2,3,4,6. Part B: Answer 1 out of 2 questions from Unit 11 (Play).
  - **Q3 (Translation - 8 marks):** Translate 2 out of 3 paragraphs into Urdu OR rewrite in simple English.
  - **Q4 (Summary/Stanza - 5 marks):** Write the summary of one poem OR explain a stanza with reference to the context.
  - **Q5 (Idioms/Phrases - 5 marks):** Use any 5 out of 8 in sentences.
  - **Q6 (Letter/Story/Dialogue - 8 marks).**
  - **Q7 (Comprehension - 10 marks):** Read a passage and answer 5 questions.
  - **Q8 (Translation - 5 marks):** Translate 5 out of 8 sentences into English OR write a paragraph for English Medium candidates.
  - **Q9 (Change the Voice - 5 marks).**`,
    },
    mathematics: {
        alp: `Complete chapter 8 is excluded. Many specific exercises, examples, and topics from other chapters are also excluded as per the detailed list in the official PECTAA notification.`,
        scheme: `Total Marks: 75. Time: 2h 30m.
- **Objective Part (15 marks, 20 mins):** 15 MCQs. Distribution: 1 MCQ each from Ch 1,2,5,7,9,10,11,12,13. 2 MCQs each from Ch 3,4,6.
- **Subjective Part (60 marks, 2h 10m):**
  - **Part I (Short Questions - 36 marks):**
    - **Q2:** Attempt 6 of 9 (2 from Ch 1, 2 from Ch 2, 2 from Ch 3, 2 from Ch 4, 1 from Ch 5).
    - **Q3:** Attempt 6 of 9 (3 from Ch 6, 3 from Ch 7, 3 from Ch 9).
    - **Q4:** Attempt 6 of 9 (2 from Ch 10, 2 from Ch 11, 3 from Ch 12, 2 from Ch 13).
  - **Part II (Long Questions - 24 marks):** Attempt any 3 out of 5 questions. Each question has two parts (a, b).
    - **Q5:** (a) from Ch 1, (b) from Ch 2.
    - **Q6:** (a) from Ch 3, (b) from Ch 4.
    - **Q7:** (a) from Ch 5, (b) from Ch 6.
    - **Q8:** (a) from Ch 7 or 10, (b) from Ch 9.
    - **Q9:** (a) from Ch 12, (b) from Ch 11 or 13.`,
    },
    physics: {
        alp: `Specific topics and exercise questions are excluded from all chapters as per the detailed list in the official PECTAA notification.`,
        scheme: `Total Marks: 60. Time: 2 hours.
- **Objective Part (12 marks, 15 mins):** 12 MCQs. Distribution: 1 MCQ each from Ch 1,2,5,7,8,9. 2 MCQs each from Ch 3,4,6.
- **Subjective Part (48 marks, 1h 45m):**
  - **Part I (Short Questions - 30 marks):** Attempt 5 of 8 in each section.
    - **Q2:** From Ch 1 (3 Qs), Ch 2 (2 Qs), Ch 3 (3 Qs).
    - **Q3:** From Ch 4 (3 Qs), Ch 5 (3 Qs), Ch 6 (2 Qs).
    - **Q4:** From Ch 7 (3 Qs), Ch 8 (3 Qs), Ch 9 (2 Qs).
  - **Part II (Long Questions - 18 marks):** Attempt 2 out of 3. Each question has two parts (a=4 marks, b=5 marks).
    - **Q5:** From Ch 1, 2, or 3.
    - **Q6:** From Ch 4, 5, or 6.
    - **Q7:** From Ch 7, 8, or 9.`,
    },
    chemistry: {
        alp: `Chapters 12 and 13 are completely deleted. Specific topics and exercise questions are excluded from Chapters 1-11 as per the official notification.`,
        scheme: `Total Marks: 60. Time: 2 hours.
- **Objective Part (12 marks, 15 mins):** 12 MCQs. Distribution: 1 MCQ from each chapter 1-10, 2 MCQs from chapter 11.
- **Subjective Part (48 marks, 1h 45m):**
  - **Part I (Short Questions - 30 marks):** Attempt 5 of 8 in each section.
    - **Q2:** From Ch 1 (1 Q), Ch 2 (2 Qs), Ch 3 (2 Qs), Ch 4 (3 Qs).
    - **Q3:** From Ch 5 (3 Qs), Ch 6 (2 Qs), Ch 7 (1 Q), Ch 8 (2 Qs).
    - **Q4:** From Ch 9 (3 Qs), Ch 10 (2 Qs), Ch 11 (3 Qs).
  - **Part II (Long Questions - 18 marks):** Attempt 2 out of 3. Each question has two parts (a=5 marks, b=4 marks).
    - **Q5:** (a) from Ch 1, (b) from Ch 2.
    - **Q6:** (a) from Ch 3, (b) from Ch 7.
    - **Q7:** (a) from Ch 8, (b) from Ch 10.`,
    },
    biology: {
        alp: `Chapter 11 (Biostatistics) and the Glossary are completely deleted. Specific topics and questions from Chapters 1-10 are excluded as per the official notification.`,
        scheme: `Total Marks: 60. Time: 2 hours.
- **Objective Part (12 marks, 15 mins):** 12 MCQs. Distribution: 1 MCQ each from Ch 1-8. 2 MCQs each from Ch 9, 10.
- **Subjective Part (48 marks, 1h 45m):**
  - **Part I (Short Questions - 30 marks):** Attempt 5 of 8 in each section.
    - **Q2:** From Ch 1 (4 Qs), Ch 2 (2 Qs), Ch 3 (2 Qs).
    - **Q3:** From Ch 4 (2 Qs), Ch 5 (2 Qs), Ch 6 (2 Qs), Ch 10 (2 Qs).
    - **Q4:** From Ch 7 (2 Qs), Ch 8 (3 Qs), Ch 9 (3 Qs).
  - **Part II (Long Questions - 18 marks):** Attempt 2 out of 3. Each question has two parts.
    - **Q5:** (a) Ch 2 (5 marks), (b) Ch 3 (4 marks).
    - **Q6:** (a) Ch 6 (5 marks), (b) Ch 7 (4 marks).
    - **Q7:** (a) Ch 9 (5 marks), (b) Ch 10 (4 marks).`,
    },
    islamiyat: {
        alp: `Chapter 7 is completely deleted. Specific Ahadees (3, 6, 7, 12, 14) from Bab Awal are excluded. Specific topics from Bab Chaharam, Panjam, and Shasham are also excluded.`,
        scheme: `Total Marks: 100. Time: 3 hours.
- **Part 1 (Objective - 20 marks):** 20 MCQs from the entire book. Distribution: Bab 1,4,5,6 (3 MCQs each), Bab 2,3 (4 MCQs each).
- **Part 2 (Short Questions - 40 marks):**
  - **Q2:** 6 of 9 from Bab 1 & 2.
  - **Q3:** 6 of 9 from Bab 3 & 4.
  - **Q4:** 8 of 12 from Bab 5 & 6.
- **Part 3 (Subjective - 40 marks):**
  - **Q5 (Hadith Translation - 10 marks):** Translate 2 out of 4 selected Ahadees from Bab Awal.
  - **Q6 (Personalities Note - 10 marks):** Write a note on 2 out of 4 personalities from Bab Shasham.
  - **Q7 (Long Questions - 20 marks):** Answer 2 out of 4 long questions.`,
    },
    computerscience: {
        alp: `Specific topics and exercise questions are excluded from Units 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 as per the detailed official PECTAA list.`,
        scheme: `Total Marks: 50. Time: 2 hours.
- **Objective Part (10 marks, 15 mins):** 10 MCQs. 1 MCQ from each unit except unit 5.
- **Subjective Part (40 marks, 1h 45m):**
  - **Part I (Short Questions - 24 marks):** Attempt 4 of 6 in each section.
    - **Q2:** From Ch 1, 2, 3, 4.
    - **Q3:** From Ch 5, 6, 7, 8.
    - **Q4:** From Ch 9, 10, 11, 12.
  - **Part II (Long Questions - 16 marks):** Attempt 2 out of 3.
    - **Q5:** From Ch 3.
    - **Q6:** From Ch 6.
    - **Q7:** From Ch 7 & 8 (parts a and b).`,
    },
};

export const generateTest = async (formData: TestFormData): Promise<string> => {
    const { subject, chapters, medium, testType, totalMarks, isSmartSyllabus, choiceEnabled, includeBoardImportant, includeAdditionalQuestions, includeMathExamples } = formData;
    
    // Normalize subject name to a simple key for the rules object
    const subjectKey = subject.toLowerCase().split('(')[0].trim().replace(/\s+/g, '');

    const rules = subjectRules[subjectKey] || {
        alp: 'General Smart Syllabus rules apply.',
        scheme: 'Follow the standard PTB paper pattern for the given marks.',
    };

    const prompt = `
ROLE: Head Paper Setter, Punjab Textbook Board (PTB) / PECTAA.
TASK: Generate a Class 9 ${testType} for Subject: ${subject}.
SESSION: Annual Examination 2026.

**CRITICAL DIRECTIVES:**
You must generate the paper based on the official documentation provided by PECTAA for the 2026 session. This includes the Smart Syllabus (ALP), the official Pairing Scheme, and the Model Paper format. Failure to adhere to these rules will result in an unacceptable paper.

**1. SMART SYLLABUS (ALP) ADHERENCE:**
- You have been provided with a list of EXCLUDED topics, chapters, and questions for ${subject}.
- You MUST NOT include any question, topic, or concept from these excluded sections.
- The official list of excluded content for ${subject} is:
--- START EXCLUDED CONTENT ---
${rules.alp}
--- END EXCLUDED CONTENT ---
- The entire paper must be strictly filtered through this Smart Syllabus.

**2. OFFICIAL PAPER PATTERN & PAIRING SCHEME:**
- You must strictly follow the official structure, marks distribution, and chapter pairings for ${subject}.
- The official scheme is as follows:
--- START PAPER SCHEME ---
${rules.scheme}
--- END PAPER SCHEME ---

**3. MODEL PAPER STYLE & QUALITY:**
- Questions must be of board standard and must closely reflect the style, language, and difficulty level of the official PECTAA model papers for 2026.
- Prioritize important, exam-relevant questions that test conceptual understanding.

**INPUT FOR THIS SPECIFIC GENERATION:**
*   **Subject:** ${subject}
*   **Chapters to Cover:** ${chapters}
*   **Medium:** ${medium}
*   **Total Marks:** ${totalMarks} (Must match the scheme)
*   **Question Choice:** ${choiceEnabled ? 'Include standard board choices as defined in the scheme.' : 'No choice, all questions are compulsory.'}
*   **Importance Filter:** ${includeBoardImportant ? 'Prioritize questions that are highly probable to appear in the 2026 exam, based on the scheme and model paper patterns.' : 'Use a standard mix of questions from the allowed syllabus.'}
*   **Math Solved Examples:** ${includeMathExamples && subject.toLowerCase().includes('math') ? 'Include solved examples from the textbook, formatted as proper exam questions, if they are part of the Smart Syllabus.' : 'Do not include solved examples.'}

**FINAL OUTPUT FORMAT:**
- Create a professionally formatted paper with clear Objective (MCQs) and Subjective (Short/Long Questions) sections, exactly as specified in the scheme.
- The language and directionality must be appropriate for the medium (e.g., right-to-left for Urdu).
- **DO NOT PROVIDE AN ANSWER KEY OR SOLUTIONS.**
`;

    return generateContent(prompt);
};

export const generateDefinitions = async (formData: DefinitionsFormData): Promise<string> => {
    const { subject, chapters, medium, isFullBook, includeBoardRepeated, isSmartSyllabus } = formData;

    const prompt = `
ROLE: Senior PTB Subject Examiner.
TASK: Create a comprehensive "Definitions Bank" for Class 9.
SESSION: Annual Examination 2026.

**CRITICAL INSTRUCTIONS:**
1.  **SOURCE:** Use the exact wording for all definitions from the glossary and text of the REVISED NEW EDITION of the ${subject} textbook.
2.  **SYLLABUS:** ${isSmartSyllabus ? 'Only include definitions that are part of the REVISED After Smart Syllabus (ALP).' : 'Include all definitions from the specified chapters.'}

**INPUT:**
*   **Subject:** ${subject}
*   **Scope:** ${isFullBook ? 'Entire Book' : `Chapters: ${chapters}`}
*   **Medium:** ${medium}

**OUTPUT REQUIREMENTS:**
- Format each entry clearly (e.g., "Q: Define [Term]. Ans: [Official Definition]").
- ${includeBoardRepeated ? 'After each highly important/repeated definition, add the tag "[Board-Important]".' : ''}
- Ensure the list is clean, accurate, and ready for student preparation.
`;

    return generateContent(prompt);
};