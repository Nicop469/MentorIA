import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course, Question } from '../types';
import { 
  getCourses, 
  getQuestions, 
  saveCourse, 
  saveQuestion, 
  deleteCourse, 
  deleteQuestion 
} from '../services/storageService';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';
import { Plus, Edit, Trash2, BookOpen, HelpCircle } from 'lucide-react';

const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'questions'>('courses');
  
  // Form states
  const [showCourseForm, setShowCourseForm] = useState<boolean>(false);
  const [courseFormData, setCourseFormData] = useState<Course>({
    id: '',
    name: '',
    description: '',
  });
  
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [questionFormData, setQuestionFormData] = useState<Question>({
    id: '',
    courseId: '',
    statement: '',
    correctAnswer: '',
    difficulty: 5,
    targetTime: 60,
  });
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [filterCourseId, setFilterCourseId] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<number | ''>('');
  
  useEffect(() => {
    // Redirect if not a teacher
    if (!userProfile.isTeacher) {
      navigate('/');
      return;
    }
    
    // Load data
    setCourses(getCourses());
    setQuestions(getQuestions());
  }, [navigate, userProfile.isTeacher]);
  
  // Filter questions based on selected filters
  const filteredQuestions = questions.filter(q => {
    if (filterCourseId && q.courseId !== filterCourseId) {
      return false;
    }
    if (filterDifficulty !== '' && q.difficulty !== filterDifficulty) {
      return false;
    }
    return true;
  });
  
  // Course form handlers
  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseFormData.name || !courseFormData.description) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Generate ID if new course
    if (!courseFormData.id) {
      courseFormData.id = courseFormData.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Save course
    saveCourse(courseFormData);
    
    // Reset form and refresh data
    setCourseFormData({ id: '', name: '', description: '' });
    setShowCourseForm(false);
    setCourses(getCourses());
    setIsEditing(false);
  };
  
  const handleEditCourse = (course: Course) => {
    setCourseFormData({ ...course });
    setShowCourseForm(true);
    setIsEditing(true);
  };
  
  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated questions.')) {
      deleteCourse(courseId);
      setCourses(getCourses());
      setQuestions(getQuestions());
    }
  };
  
  // Question form handlers
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestionFormData(prev => ({ 
      ...prev, 
      [name]: name === 'difficulty' || name === 'targetTime' ? Number(value) : value 
    }));
  };
  
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !questionFormData.courseId ||
      !questionFormData.statement ||
      !questionFormData.correctAnswer
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Generate ID if new question
    if (!questionFormData.id) {
      questionFormData.id = `q-${Date.now()}`;
    }
    
    // Save question
    saveQuestion(questionFormData);
    
    // Reset form and refresh data
    setQuestionFormData({
      id: '',
      courseId: questionFormData.courseId, // Keep selected course
      statement: '',
      correctAnswer: '',
      difficulty: 5,
      targetTime: 60,
    });
    setShowQuestionForm(false);
    setQuestions(getQuestions());
    setIsEditing(false);
  };
  
  const handleEditQuestion = (question: Question) => {
    setQuestionFormData({ ...question });
    setShowQuestionForm(true);
    setIsEditing(true);
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(questionId);
      setQuestions(getQuestions());
    }
  };
  
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">
            Manage courses and questions for your students
          </p>
        </motion.div>
        
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen size={18} className="inline mr-2" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <HelpCircle size={18} className="inline mr-2" />
                Questions
              </button>
            </nav>
          </div>
          
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Manage Courses</h2>
                <button
                  onClick={() => {
                    setCourseFormData({ id: '', name: '', description: '' });
                    setShowCourseForm(true);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add New Course
                </button>
              </div>
              
              {showCourseForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-4 rounded-md mb-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {isEditing ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  
                  <form onSubmit={handleCourseSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={courseFormData.name}
                        onChange={handleCourseChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={courseFormData.description}
                        onChange={handleCourseChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowCourseForm(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        {isEditing ? 'Update Course' : 'Save Course'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No courses available. Add your first course above.
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {questions.filter(q => q.courseId === course.id).length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="text-primary-600 hover:text-primary-800 mr-4"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Manage Questions</h2>
                <button
                  onClick={() => {
                    setQuestionFormData({
                      id: '',
                      courseId: courses.length > 0 ? courses[0].id : '',
                      statement: '',
                      correctAnswer: '',
                      difficulty: 5,
                      targetTime: 60,
                    });
                    setShowQuestionForm(true);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  disabled={courses.length === 0}
                >
                  <Plus size={16} className="mr-1" />
                  Add New Question
                </button>
              </div>
              
              {courses.length === 0 && (
                <div className="bg-yellow-50 p-4 rounded-md mb-6">
                  <p className="text-yellow-700">
                    Please create at least one course before adding questions.
                  </p>
                </div>
              )}
              
              {courses.length > 0 && (
                <>
                  {/* Filter controls */}
                  <div className="bg-gray-50 p-4 rounded-md mb-6 flex flex-wrap gap-4">
                    <div>
                      <label htmlFor="filterCourse" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Course
                      </label>
                      <select
                        id="filterCourse"
                        value={filterCourseId}
                        onChange={(e) => setFilterCourseId(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="filterDifficulty" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Difficulty
                      </label>
                      <select
                        id="filterDifficulty"
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value === '' ? '' : Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">All Levels</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <option key={level} value={level}>
                            Level {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="ml-auto self-end">
                      <button
                        onClick={() => {
                          setFilterCourseId('');
                          setFilterDifficulty('');
                        }}
                        className="p-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                  
                  {/* Question form */}
                  {showQuestionForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-4 rounded-md mb-6"
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? 'Edit Question' : 'Add New Question'}
                      </h3>
                      
                      <form onSubmit={handleQuestionSubmit}>
                        <div className="mb-4">
                          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                            Course
                          </label>
                          <select
                            id="courseId"
                            name="courseId"
                            value={questionFormData.courseId}
                            onChange={handleQuestionChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-1">
                            Question Statement
                          </label>
                          <textarea
                            id="statement"
                            name="statement"
                            value={questionFormData.statement}
                            onChange={handleQuestionChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={3}
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer
                          </label>
                          <input
                            type="text"
                            id="correctAnswer"
                            name="correctAnswer"
                            value={questionFormData.correctAnswer}
                            onChange={handleQuestionChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                              Difficulty Level (1-10)
                            </label>
                            <input
                              type="range"
                              id="difficulty"
                              name="difficulty"
                              min="1"
                              max="10"
                              value={questionFormData.difficulty}
                              onChange={handleQuestionChange}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Beginner (1)</span>
                              <span>Advanced (10)</span>
                            </div>
                            <div className="text-center font-medium">
                              {questionFormData.difficulty}/10
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="targetTime" className="block text-sm font-medium text-gray-700 mb-1">
                              Target Time (seconds)
                            </label>
                            <input
                              type="number"
                              id="targetTime"
                              name="targetTime"
                              value={questionFormData.targetTime}
                              onChange={handleQuestionChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              min="10"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setShowQuestionForm(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                          >
                            {isEditing ? 'Update Question' : 'Save Question'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                  
                  {/* Questions list */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Question
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Answer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time (s)
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredQuestions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              No questions found matching your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredQuestions.map((question) => {
                            const course = courses.find(c => c.id === question.courseId);
                            return (
                              <tr key={question.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {course?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {question.statement}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {question.correctAnswer}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {question.difficulty}/10
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {question.targetTime}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                  <button
                                    onClick={() => handleEditQuestion(question)}
                                    className="text-primary-600 hover:text-primary-800 mr-4"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;