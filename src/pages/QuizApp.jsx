import React, { useState, useEffect } from 'react';
import { Info, Settings, TrendingUp, ChevronRight, Award, Home, RefreshCw } from 'lucide-react';

// Main App Component
const QuizApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [timer, setTimer] = useState(20);
  const [timerActive, setTimerActive] = useState(false);

  // Sample quiz questions
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au"
    }
  ];

  // Handle navigation between pages
  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'game') {
      resetGame();
    }
  };

  // Reset game state
  const resetGame = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setGameOver(false);
    setTimer(20);
    setTimerActive(true);
  };

  // Handle answer selection
  const handleOptionSelect = (option) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    setTimerActive(false);
    
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  // Move to next question or end game
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
      setTimer(20);
      setTimerActive(true);
    } else {
      endGame();
    }
  };

  // End game and save results
  const endGame = () => {
    setGameOver(true);
    setTimerActive(false);
    
    const newQuizResult = {
      date: new Date().toLocaleDateString(),
      score: score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100)
    };
    
    setQuizHistory([...quizHistory, newQuizResult]);
    localStorage.setItem('quizHistory', JSON.stringify([...quizHistory, newQuizResult]));
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && timerActive) {
      setAnswered(true);
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  // Load quiz history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      setQuizHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Anti-Design CSS
  const antiDesignStyles = `
    body {
      font-family: "Comic Sans MS", "Chalkboard SE", cursive;
      background-image: linear-gradient(45deg, #ff00ff, #00ffff);
    }
  `;

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'game':
        return (
          <GamePage
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={selectedOption}
            answered={answered}
            handleOptionSelect={handleOptionSelect}
            handleNextQuestion={handleNextQuestion}
            score={score}
            gameOver={gameOver}
            resetGame={resetGame}
            navigateTo={navigateTo}
            timer={timer}
          />
        );
      case 'statistics':
        return <StatisticsPage quizHistory={quizHistory} navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: antiDesignStyles }} />
      <div className="quiz-app-container min-h-screen flex flex-col">
        <header className="p-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">QuizMaster</h1>
            <nav className="flex space-x-4">
              <button 
                onClick={() => navigateTo('home')}
                className={`px-3 py-1 rounded-lg flex items-center ${currentPage === 'home' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              >
                <Home size={16} className="mr-1" /> Home
              </button>
              <button 
                onClick={() => navigateTo('statistics')}
                className={`px-3 py-1 rounded-lg flex items-center ${currentPage === 'statistics' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              >
                <TrendingUp size={16} className="mr-1" /> Stats
              </button>
            </nav>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4">
          {renderPage()}
        </main>
        
        <footer className="p-4 text-center">
          <p>QuizMaster © 2025 - Challenge Your Knowledge!</p>
        </footer>
      </div>
    </>
  );
};

// Home Page Component
const HomePage = ({ navigateTo }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="home-card rounded-lg shadow-lg p-8 mb-6">
        <div className="text-6xl mb-4 text-blue-500 flex justify-center">
          <Award />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to QuizMaster!</h2>
        <p className="text-lg mb-6">
          Test your knowledge with our interactive quizzes. Challenge yourself and track your progress!
        </p>
        <button
          onClick={() => navigateTo('game')}
          className="text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center mx-auto transition"
        >
          Start Quiz <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="feature-card rounded-lg shadow p-6">
          <div className="text-3xl mb-3 text-blue-500 flex justify-center">
            <Info />
          </div>
          <h3 className="text-xl font-bold mb-2">How to Play</h3>
          <p>
            Answer questions within the time limit. Each correct answer earns you points. Try to get the highest score!
          </p>
        </div>
        <div className="feature-card rounded-lg shadow p-6">
          <div className="text-3xl mb-3 text-blue-500 flex justify-center">
            <Settings />
          </div>
          <h3 className="text-xl font-bold mb-2">Features</h3>
          <p>
            Multiple topics, timed questions, and detailed statistics to track your improvement over time.
          </p>
        </div>
      </div>
    </div>
  );
};

// Game Page Component
const GamePage = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  answered,
  handleOptionSelect,
  handleNextQuestion,
  score,
  gameOver,
  resetGame,
  navigateTo,
  timer
}) => {
  if (gameOver) {
    return (
      <div className="results-container max-w-md mx-auto rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-6 text-blue-500 flex justify-center">
          <Award />
        </div>
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="results-score mb-2">Your Score: <span className="font-bold">{score}/{totalQuestions}</span></p>
        <p className="results-score mb-6">
          Percentage: <span className="font-bold">{Math.round((score / totalQuestions) * 100)}%</span>
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={resetGame}
            className="action-button text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <RefreshCw size={16} className="mr-2" /> Play Again
          </button>
          <button
            onClick={() => navigateTo('statistics')}
            className="action-button text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <TrendingUp size={16} className="mr-2" /> View Statistics
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="action-button text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <Home size={16} className="mr-2" /> Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="game-container rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="question-indicator px-4 py-2 rounded-lg">
            Question {questionNumber}/{totalQuestions}
          </div>
          <div className="flex items-center">
            <div className="score-indicator px-4 py-2 rounded-lg mr-3">
              Score: {score}
            </div>
            <div className={`timer-indicator px-4 py-2 rounded-lg ${
              timer > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Time: {timer}s
            </div>
          </div>
        </div>
        
        <h2 className="question-text">{question.question}</h2>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={answered}
              className={`option-button w-full rounded-lg text-left transition ${
                !answered
                  ? ''
                  : option === question.correctAnswer
                    ? 'correct-answer'
                    : option === selectedOption
                      ? 'wrong-answer'
                      : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {answered && (
          <div className="mt-4 text-center">
            {selectedOption === question.correctAnswer ? (
              <p className="feedback-text text-green-600 font-medium mb-4">Correct! Well done!</p>
            ) : (
              <p className="feedback-text text-red-600 font-medium mb-4">
                Incorrect. The correct answer is {question.correctAnswer}.
              </p>
            )}
            <button
              onClick={handleNextQuestion}
              className="next-button text-white rounded-lg"
            >
              {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Statistics Page Component
const StatisticsPage = ({ quizHistory, navigateTo }) => {
  const calculateAverage = () => {
    if (quizHistory.length === 0) return 0;
    const total = quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0);
    return Math.round(total / quizHistory.length);
  };

  const getBestScore = () => {
    if (quizHistory.length === 0) return 0;
    return Math.max(...quizHistory.map(quiz => quiz.percentage));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="stats-container rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Quiz Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stats-card bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Total Quizzes</p>
            <p className="stats-value text-3xl font-bold text-blue-600">{quizHistory.length}</p>
          </div>
          <div className="stats-card bg-green-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Average Score</p>
            <p className="stats-value text-3xl font-bold text-green-600">{calculateAverage()}%</p>
          </div>
          <div className="stats-card bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Best Score</p>
            <p className="stats-value text-3xl font-bold text-purple-600">{getBestScore()}%</p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4">Quiz History</h3>
        {quizHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.slice().reverse().map((quiz, index) => (
                  <tr key={index}>
                    <td className="p-3">{quiz.date}</td>
                    <td className="p-3">{quiz.score}/{quiz.totalQuestions}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded ${
                        quiz.percentage >= 70 ? 'bg-green-100 text-green-800' : 
                        quiz.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {quiz.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No quiz history yet. Take a quiz to see your statistics!</p>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigateTo('game')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Take a New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp; 