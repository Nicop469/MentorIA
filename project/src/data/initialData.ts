import { Course, Question, UserProfile } from '../types';

export const initialCourses: Course[] = [
  {
    id: 'arithmetic',
    name: 'Arithmetic',
    description: 'Basic arithmetic concepts and operations',
  },
  {
    id: 'algebra',
    name: 'Algebra',
    description: 'Solving equations and working with variables',
  },
  {
    id: 'geometry',
    name: 'Geometry',
    description: 'Introduction to Euclidean geometry',
  },
  {
    id: 'calculus',
    name: 'Calculus',
    description: 'Derivatives, integrals and their applications',
  },
  {
    id: 'probability',
    name: 'Probability',
    description: 'Understanding chance and random events',
  },
  {
    id: 'statistics',
    name: 'Statistics',
    description: 'Data analysis and interpretation',
  },
];

export const initialQuestions: Question[] = [
  // Arithmetic questions (difficulty 1-10)
  {
    id: 'arith-1',
    courseId: 'arithmetic',
    statement: 'What is 7 × 8?',
    correctAnswer: '56',
    difficulty: 2,
    targetTime: 20,
  },
  {
    id: 'arith-2',
    courseId: 'arithmetic',
    statement: 'What is 12 × 15?',
    correctAnswer: '180',
    difficulty: 3,
    targetTime: 30,
  },
  {
    id: 'arith-3',
    courseId: 'arithmetic',
    statement: 'What is 7 × 8 – (3 + 5)?',
    correctAnswer: '48',
    difficulty: 4,
    targetTime: 40,
  },
  {
    id: 'arith-4',
    courseId: 'arithmetic',
    statement: 'What is 356 + 289?',
    correctAnswer: '645',
    difficulty: 5,
    targetTime: 45,
  },
  {
    id: 'arith-5',
    courseId: 'arithmetic',
    statement: 'What is 729 ÷ 9?',
    correctAnswer: '81',
    difficulty: 6,
    targetTime: 50,
  },
  {
    id: 'arith-6',
    courseId: 'arithmetic',
    statement: 'What is the result of 15% of 240?',
    correctAnswer: '36',
    difficulty: 7,
    targetTime: 60,
  },
  {
    id: 'arith-7',
    courseId: 'arithmetic',
    statement: 'If a number is increased by 20% and then decreased by 25%, what is the overall percentage change?',
    correctAnswer: '-10',
    difficulty: 8,
    targetTime: 90,
  },
  
  // Algebra questions
  {
    id: 'alg-1',
    courseId: 'algebra',
    statement: 'Solve for x: 3x + 5 = 20',
    correctAnswer: '5',
    difficulty: 3,
    targetTime: 40,
  },
  {
    id: 'alg-2',
    courseId: 'algebra',
    statement: 'Solve for x: 2x - 7 = 13',
    correctAnswer: '10',
    difficulty: 4,
    targetTime: 45,
  },
  {
    id: 'alg-3',
    courseId: 'algebra',
    statement: 'Simplify: 3(2x - 5) + 4(x + 3)',
    correctAnswer: '10x - 3',
    difficulty: 5,
    targetTime: 60,
  },
  {
    id: 'alg-4',
    courseId: 'algebra',
    statement: 'Solve the system: x + y = 5, x - y = 3',
    correctAnswer: 'x = 4, y = 1',
    difficulty: 6,
    targetTime: 90,
  },
  {
    id: 'alg-5',
    courseId: 'algebra',
    statement: 'Solve the quadratic equation: x² - 5x + 6 = 0',
    correctAnswer: 'x = 2, x = 3',
    difficulty: 7,
    targetTime: 120,
  },
  
  // Geometry questions
  {
    id: 'geom-1',
    courseId: 'geometry',
    statement: 'What is the area of a rectangle with width 6 and length 9?',
    correctAnswer: '54',
    difficulty: 3,
    targetTime: 30,
  },
  {
    id: 'geom-2',
    courseId: 'geometry',
    statement: 'What is the area of a circle with radius 5?',
    correctAnswer: '25π',
    difficulty: 4,
    targetTime: 45,
  },
  {
    id: 'geom-3',
    courseId: 'geometry',
    statement: 'If a triangle has sides of lengths 3, 4, and 5, what is its area?',
    correctAnswer: '6',
    difficulty: 5,
    targetTime: 60,
  },
  
  // Calculus questions
  {
    id: 'calc-1',
    courseId: 'calculus',
    statement: 'What is the derivative of f(x) = 3x² + 5x?',
    correctAnswer: '6x + 5',
    difficulty: 5,
    targetTime: 60,
  },
  {
    id: 'calc-2',
    courseId: 'calculus',
    statement: 'What is the derivative of f(x) = e^x?',
    correctAnswer: 'e^x',
    difficulty: 6,
    targetTime: 50,
  },
  {
    id: 'calc-3',
    courseId: 'calculus',
    statement: 'Evaluate the definite integral ∫₀¹ x² dx',
    correctAnswer: '1/3',
    difficulty: 7,
    targetTime: 90,
  },
];

export const initialUserProfile: UserProfile = {
  name: '',
  isTeacher: false,
  diagnosticResults: [],
  practiceSessions: [],
};