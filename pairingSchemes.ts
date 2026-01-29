import { type PairingScheme } from './types';

export const pairingSchemes: Record<string, PairingScheme[]> = {
  "Physics": [
    { name: 'New Scheme 1 (Ch 1-3)', chapters: '1, 2, 3' },
    { name: 'New Scheme 2 (Ch 4-6)', chapters: '4, 5, 6' },
    { name: 'New Scheme 3 (Ch 7-9)', chapters: '7, 8, 9' },
    { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "Chemistry": [
    { name: 'New Scheme A (Ch 1-4)', chapters: '1, 2, 3, 4' },
    { name: 'New Scheme B (Ch 5-8)', chapters: '5, 6, 7, 8' },
    { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "Biology": [
    { name: 'New Scheme 1 (Ch 1-4)', chapters: '1, 2, 3, 4' },
    { name: 'New Scheme 2 (Ch 5-7)', chapters: '5, 6, 7' },
    { name: 'New Scheme 3 (Ch 8-9)', chapters: '8, 9' },
    { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "Mathematics": [
    { name: 'New Pairing 1 (Units 1, 2, 3, 5, 7)', chapters: '1, 2, 3, 5, 7' },
    { name: 'New Pairing 2 (Units 4, 6, 8, 9)', chapters: '4, 6, 8, 9' },
    { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "Computer Science": [
      { name: 'New Scheme 1 (Ch 1, 2, 5)', chapters: '1, 2, 5' },
      { name: 'New Scheme 2 (Ch 3, 4)', chapters: '3, 4' },
      { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "Islamiyat": [
      { name: 'New Scheme 1 (Surah Anfal)', chapters: 'Surah Al-Anfal' },
      { name: 'New Scheme 2 (Ahadees 1-10)', chapters: 'Ahadees 1-10' },
      { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "Urdu": [
      { name: 'New Scheme A (Nasar 1-7)', chapters: 'Hisa Nasar Chapters 1 to 7' },
      { name: 'New Scheme B (Nazam & Ghazal)', chapters: 'All Nazams and Ghazals' },
      { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
  "English": [
    { name: 'New Scheme 1 (Ch 1-6)', chapters: '1, 2, 3, 4, 6' },
    { name: 'New Scheme 2 (Ch 7-11)', chapters: '7, 9, 11' },
    { name: 'Full New Book Syllabus', chapters: 'Full Book' },
  ],
};