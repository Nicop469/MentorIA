import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Navigation from '../components/Navigation';
import ChapterForm from '../components/ChapterForm';
import { Course, Chapter } from '../types/structuredCourse';

const TeacherOnboardingPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const handleChapterChange = (index: number, updated: Chapter) => {
    const newChapters = [...chapters];
    newChapters[index] = updated;
    setChapters(newChapters);
  };

  const addChapter = () => {
    setChapters([...chapters, { id: uuidv4(), title: '', subtopics: [] }]);
  };

  const deleteChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course: Course = { id: uuidv4(), title, chapters };
    console.log(course);
    alert(JSON.stringify(course, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-2xl font-bold mb-4">Create Course</h1>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <h2 className="font-semibold mb-2">Chapters</h2>
              {chapters.map((chapter, index) => (
                <ChapterForm
                  key={chapter.id}
                  chapter={chapter}
                  onChange={(c) => handleChapterChange(index, c)}
                  onDelete={() => deleteChapter(index)}
                />
              ))}
              <button type="button" onClick={addChapter} className="text-sm text-primary-600">
                + Add Chapter
              </button>
            </div>
            <div className="pt-4">
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                Save Course
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherOnboardingPage;
