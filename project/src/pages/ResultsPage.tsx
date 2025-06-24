import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DiagnosticResult } from '../types';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';
import PerformanceChart from '../components/PerformanceChart';
import { ArrowRight, Award, Clock, CheckCircle } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { userProfile } = useUser();
  
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  
  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    // Find diagnostic result for this course
    const diagnosticResult = userProfile.diagnosticResults.find(r => r.courseId === courseId);
    
    if (!diagnosticResult) {
      navigate(`/diagnostic/${courseId}`);
      return;
    }
    
    setResult(diagnosticResult);
  }, [courseId, navigate, userProfile.diagnosticResults]);
  
  const getSkillLevelDescription = (level: number) => {
    if (level >= 9) return 'Advanced';
    if (level >= 7) return 'Proficient';
    if (level >= 5) return 'Intermediate';
    if (level >= 3) return 'Basic';
    return 'Beginner';
  };
  
  const handleContinueToPractice = () => {
    if (courseId) {
      navigate(`/practice/${courseId}`);
    }
  };
  
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Diagnostic Results</h1>
          <p className="text-gray-600">
            Here's a summary of your performance in the diagnostic assessment.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Award size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Skill Level</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.skillLevel}/10
            </div>
            <p className="text-gray-600">
              {getSkillLevelDescription(result.skillLevel)}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <CheckCircle size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Accuracy</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.correctPercentage}%
            </div>
            <p className="text-gray-600">
              {result.correctPercentage >= 80 
                ? 'Excellent understanding' 
                : result.correctPercentage >= 60 
                ? 'Good grasp of concepts' 
                : 'Room for improvement'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Clock size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Average Time</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.averageTime}s
            </div>
            <p className="text-gray-600">
              {result.averageTime <= 30 
                ? 'Quick response time' 
                : result.averageTime <= 60 
                ? 'Average response time' 
                : 'Taking a bit longer than average'}
            </p>
          </motion.div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Analysis</h3>
          <PerformanceChart attempts={result.attempts} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendation</h3>
          <p className="text-gray-700 mb-4">
            Based on your diagnostic assessment, we recommend starting with level {result.skillLevel} content and advancing gradually. 
            You showed {result.correctPercentage >= 70 ? 'strong' : 'adequate'} understanding of the concepts, 
            with an average response time of {result.averageTime} seconds.
          </p>
          
          <p className="text-gray-700 mb-6">
            Continue to Practice Mode to further improve your skills and track your progress over time.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToPractice}
            className="inline-flex items-center bg-primary-600 text-white font-medium py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continue to Practice Mode
            <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;