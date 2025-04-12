import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const QuizContext = createContext();

// Custom hook to use the quiz context
export const useQuizContext = () => useContext(QuizContext);

// Provider component
export const QuizProvider = ({ children }) => {
  // Quiz statistics state
  const [quizStats, setQuizStats] = useState({
    totalQuizzesCompleted: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0,
    averageScore: 0,
    highestScore: 0,
    totalBankroll: 0,
    highestStreak: 0,
    userLevel: 1,
    experiencePoints: 0,
    achievements: [],
    quizHistory: []
  });

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadQuizData = () => {
      try {
        // Load quiz history
        const savedQuizHistory = localStorage.getItem('quizHistory');
        if (savedQuizHistory) {
          const parsedHistory = JSON.parse(savedQuizHistory);
          setQuizStats(prev => ({
            ...prev,
            quizHistory: parsedHistory,
            totalQuizzesCompleted: parsedHistory.length
          }));
        }

        // Load user data
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          setQuizStats(prev => ({
            ...prev,
            userLevel: userData.level || 1,
            experiencePoints: userData.experience || 0,
            totalExperience: userData.totalExperience || 0,
            highestStreak: userData.highestStreak || 0,
            totalCorrectAnswers: userData.totalCorrectAnswers || 0,
            totalQuizzesCompleted: userData.totalQuizzesCompleted || 0
          }));
        }

        // Load achievements
        const savedAchievements = localStorage.getItem('achievements');
        if (savedAchievements) {
          setQuizStats(prev => ({
            ...prev,
            achievements: JSON.parse(savedAchievements)
          }));
        }

        // Calculate derived statistics
        calculateDerivedStats();
      } catch (error) {
        console.error('Error loading quiz data:', error);
      }
    };

    loadQuizData();
  }, []);

  // Calculate derived statistics
  const calculateDerivedStats = () => {
    setQuizStats(prev => {
      const { quizHistory } = prev;
      
      if (quizHistory.length === 0) return prev;
      
      // Calculate total questions
      const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
      
      // Calculate average score
      const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
      const averageScore = Math.round(totalScore / quizHistory.length);
      
      // Find highest score
      const highestScore = Math.max(...quizHistory.map(quiz => quiz.score));
      
      // Calculate total bankroll (sum of all final bankrolls)
      const totalBankroll = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
      
      return {
        ...prev,
        totalQuestions,
        averageScore,
        highestScore,
        totalBankroll
      };
    });
  };

  // Update quiz statistics
  const updateQuizStats = (newStats) => {
    setQuizStats(prev => {
      const updated = { ...prev, ...newStats };
      calculateDerivedStats();
      return updated;
    });
  };

  // Add a new quiz result to history
  const addQuizResult = (quizResult) => {
    setQuizStats(prev => {
      const newHistory = [...prev.quizHistory, quizResult];
      const newTotalQuizzes = prev.totalQuizzesCompleted + 1;
      
      // Update localStorage
      localStorage.setItem('quizHistory', JSON.stringify(newHistory));
      
      return {
        ...prev,
        quizHistory: newHistory,
        totalQuizzesCompleted: newTotalQuizzes
      };
    });
    
    // Recalculate derived stats
    calculateDerivedStats();
  };

  // Context value
  const value = {
    quizStats,
    updateQuizStats,
    addQuizResult
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContext; 