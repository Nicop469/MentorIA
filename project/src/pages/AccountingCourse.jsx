import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

/**
 * AccountingCourse
 * -----------------
 * Page that loads accounting practice exercises from a JSON file and
 * displays them with a simple side navigation. Students can type their
 * answers which are stored in component state. A "Submit" button prints
 * all answers to the console.
 */
export default function AccountingCourse() {
  const [exercises, setExercises] = useState([]); // Loaded exercise data
  const [selectedId, setSelectedId] = useState(null); // Current exercise ID
  const [responses, setResponses] = useState({}); // Map of answers by exercise

  // Load JSON on mount
  useEffect(() => {
    fetch('/preguntas-contabilidad.json')
      .then((res) => res.json())
      .then((data) => {
        // Expect an array of exercises; fall back to []
        if (Array.isArray(data)) setExercises(data);
      })
      .catch((err) => {
        console.error('Failed to load accounting questions:', err);
      });
  }, []);

  const selectedExercise = exercises.find((ex) => ex.id === selectedId);

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // Log the stored answers to the console
    console.log('Submitted answers:', responses);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Side navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Exercises</h2>
          <ul className="space-y-2">
            {exercises.map((ex) => (
              <li key={ex.id}>
                <button
                  onClick={() => setSelectedId(ex.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedId === ex.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                >
                  {ex.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Detail view */}
        <main className="flex-1 p-4">
          {selectedExercise ? (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{selectedExercise.title}</h1>
              {/* Placeholder for exercise details */}
              <div className="bg-white p-4 rounded shadow">
                <pre className="whitespace-pre-wrap text-sm">{selectedExercise.details || 'No details provided.'}</pre>
                <textarea
                  className="mt-3 w-full border rounded p-2"
                  rows={4}
                  value={responses[selectedId] || ''}
                  onChange={(e) => handleChange(selectedId, e.target.value)}
                  placeholder="Type your answer here"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select an exercise from the list.</p>
          )}

          {/* Submit answers */}
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Submit
          </button>
        </main>
      </div>
    </div>
  );
}
