import React, { useState, useEffect, useRef } from 'react';
import { Question, QuestionAttempt } from '../types';
import QuestionTimer from './QuestionTimer';
import { generateFeedback } from '../utils/adaptiveLogic';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  onAnswer: (attempt: QuestionAttempt) => void;
  questionNumber?: number;
  totalQuestions?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const answerInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Reset state when question changes
    setAnswer('');
    setIsSubmitted(false);
    setFeedback('');
    setStartTime(Date.now());
    
    // Focus the answer input
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [question]);
  
  const handleSubmit = () => {
    if (isSubmitted || !answer.trim()) return;
    
    const endTime = Date.now();
    const seconds = Math.round((endTime - startTime) / 1000);
    setTimeTaken(seconds);
    
    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
    setFeedback(generateFeedback(isCorrect, seconds, question.targetTime));
    setIsSubmitted(true);
    
    onAnswer({
      questionId: question.id,
      correct: isCorrect,
      timeTaken: seconds,
      difficulty: question.difficulty,
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitted) {
      handleSubmit();
    }
  };
  
  const handleTimeUp = () => {
    if (!isSubmitted) {
      const seconds = question.targetTime;
      setTimeTaken(seconds);
      setIsSubmitted(true);
      setFeedback("Time's up! Let's move on to the next question.");
      
      onAnswer({
        questionId: question.id,
        correct: false,
        timeTaken: seconds,
        difficulty: question.difficulty,
      });
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {questionNumber && totalQuestions && (
        <div className="text-sm text-gray-500 mb-2">
          Question {questionNumber} of {totalQuestions}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded">
            Difficulty: {question.difficulty}/10
          </span>
        </div>
      </div>
      
      <QuestionTimer 
        targetTime={question.targetTime}
        onTimeUp={handleTimeUp}
        isActive={!isSubmitted}
      />
      
      <h3 className="text-lg font-semibold mb-4">{question.statement}</h3>
      
      <div className="mb-6">
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        <input
          id="answer"
          ref={answerInputRef}
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitted}
          placeholder="Type your answer here..."
        />
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitted || !answer.trim()}
          className={`px-4 py-2 rounded-md ${
            isSubmitted
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 transition-colors'
          }`}
        >
          Submit Answer
        </button>
      </div>
      
      {isSubmitted && (
        <motion.div 
          className={`mt-4 p-3 rounded-md ${
            feedback.startsWith('Incorrect') || feedback.startsWith('Time')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-medium">{feedback}</p>
          <p className="text-sm mt-1">
            Time taken: {timeTaken} seconds (Target: {question.targetTime} seconds)
          </p>
          <p className="text-sm mt-1">
            Correct answer: {question.correctAnswer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;