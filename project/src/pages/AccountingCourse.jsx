import React, { createContext, useContext, useState } from 'react';

// Context to hold accounting exercise answers. This simplifies wiring
// different components and prepares for future Redux or persistence layers.
const AccountingContext = createContext();

export const useAccounting = () => useContext(AccountingContext);

const AccountingCourse = () => {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitted accounting answers:', answers);
    // TODO: Persist answers via Redux or another storage mechanism
  };

  return (
    <AccountingContext.Provider value={{ answers, setAnswers }}>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Accounting Basics</h1>
        <div className="space-y-6">
          <div>
            <label className="block mb-1 font-medium" htmlFor="q1">
              What is an asset?
            </label>
            <input
              id="q1"
              type="text"
              name="q1"
              value={answers.q1}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="q2">
              Define liability:
            </label>
            <input
              id="q2"
              type="text"
              name="q2"
              value={answers.q2}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="q3">
              What is double-entry bookkeeping?
            </label>
            <textarea
              id="q3"
              name="q3"
              value={answers.q3}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            className="mt-4 bg-primary-600 text-white py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </AccountingContext.Provider>
  );
};

export default AccountingCourse;
