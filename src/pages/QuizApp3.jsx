import React, { useState, useEffect } from 'react';
import { Info, Settings, TrendingUp, ChevronRight, Award, Home, RefreshCw, Coins, AlertTriangle, Zap } from 'lucide-react';

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
  
  // New gambling features
  const [currentBet, setCurrentBet] = useState(10);
  const [streak, setStreak] = useState(0);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [totalBankroll, setTotalBankroll] = useState(100); // Starting bankroll

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
    setStreak(0);
    setCurrentBet(10);
    setFiftyFiftyUsed(false);
    setEliminatedOptions([]);
    setTotalBankroll(100); // Reset bankroll
  };

  // Handle bet change
  const handleBetChange = (amount) => {
    // Ensure bet is not less than 5 or more than the total bankroll
    const newBet = Math.min(Math.max(5, currentBet + amount), totalBankroll);
    setCurrentBet(newBet);
  };

  // Use 50/50 lifeline
  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || answered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    
    // Get incorrect options
    const incorrectOptions = currentQuestion.options.filter(option => option !== correctAnswer);
    
    // Randomly select two incorrect options to eliminate
    const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, Math.min(2, incorrectOptions.length));
    
    setEliminatedOptions(toEliminate);
    setFiftyFiftyUsed(true);
    
    // Cost of using 50/50
    setTotalBankroll(totalBankroll - 10);
  };

  // Handle answer selection
  const handleOptionSelect = (option) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    setTimerActive(false);
    
    if (option === questions[currentQuestionIndex].correctAnswer) {
      // Correct answer - add bet to score
      // Increase bet by streak factor (20% per streak)
      const streakBonus = streak > 0 ? (streak * 0.2) : 0;
      const winAmount = Math.round(currentBet * (1 + streakBonus));
      
      setScore(score + winAmount);
      setTotalBankroll(totalBankroll + winAmount);
      setStreak(streak + 1);
    } else {
      // Wrong answer - lose bet
      setTotalBankroll(totalBankroll - currentBet);
      setStreak(0);
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
      setEliminatedOptions([]);
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
      score: totalBankroll, // Use bankroll as final score
      initialBankroll: 100,
      totalQuestions: questions.length,
      percentage: Math.round((totalBankroll / 100 - 1) * 100) // Percentage gain/loss
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
      // Lose bet if time runs out
      setTotalBankroll(totalBankroll - currentBet);
      setStreak(0);
    }
    return () => clearInterval(interval);
  }, [timer, timerActive, totalBankroll, currentBet]);

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
            currentBet={currentBet}
            handleBetChange={handleBetChange}
            streak={streak}
            useFiftyFifty={useFiftyFifty}
            fiftyFiftyUsed={fiftyFiftyUsed}
            eliminatedOptions={eliminatedOptions}
            totalBankroll={totalBankroll}
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
      <header className="bg-dark text-white py-3" style={{boxShadow: '0 2px 5px rgba(0,0,0,0.2)'}}>
  <div className="container d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center">
      
      <h1 className="fs-4 fw-bold mb-0" style={{letterSpacing: '0.5px', color: '#000000'}}>QuizMaster</h1>
      <nav>
        
          <button 
            onClick={() => navigateTo('home')}
            className={`btn d-flex align-items-center ${currentPage === 'home' ? 'btn-info' : 'btn-outline-info'}`}
            style={{borderRadius: '20px 0 0 20px', transition: 'all 0.3s ease'}}
          >
            <Home size={16} className="me-1" /> Home
          </button>
          <button 
            onClick={() => navigateTo('statistics')}
            className={`btn d-flex align-items-center ${currentPage === 'statistics' ? 'btn-info' : 'btn-outline-info'}`}
            style={{borderRadius: '0 20px 20px 0', transition: 'all 0.3s ease'}}
          >
            <TrendingUp size={16} className="me-1" /> Stats
          </button>
        
      </nav>
    </div>
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
          Test your knowledge with our interactive quizzes. Challenge yourself, place bets, and increase your bankroll!
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
            Answer questions within the time limit. Place bets on your answers and build up your bankroll. Use the 50/50 lifeline for hard questions!
          </p>
        </div>
        <div className="feature-card rounded-lg shadow p-6">
          <div className="text-3xl mb-3 text-blue-500 flex justify-center">
            <Coins />
          </div>
          <h3 className="text-xl font-bold mb-2">Betting System</h3>
          <p>
            Increase your bet size with consecutive correct answers. The longer your streak, the higher your potential winnings!
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
  timer,
  currentBet,
  handleBetChange,
  streak,
  useFiftyFifty,
  fiftyFiftyUsed,
  eliminatedOptions,
  totalBankroll
}) => {
  if (gameOver) {
    return (
      <div className="results-container max-w-md mx-auto rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-6 text-blue-500 flex justify-center">
          <Coins />
        </div>
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="results-score mb-2">Final Bankroll: <span className="font-bold">{totalBankroll} points</span></p>
        <p className="results-score mb-6">
          Gain/Loss: <span className={`font-bold ${totalBankroll > 100 ? 'text-green-600' : 'text-red-600'}`}>
            {totalBankroll > 100 ? '+' : ''}{totalBankroll - 100} points ({Math.round((totalBankroll / 100 - 1) * 100)}%)
          </span>
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
        {/* Status Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="question-indicator px-4 py-2 rounded-lg">
            Question {questionNumber}/{totalQuestions}
          </div>
          <div className="flex items-center">
            <div className="bankroll-indicator px-4 py-2 rounded-lg mr-3 bg-yellow-100 text-yellow-800">
              <Coins size={16} className="inline mr-1" /> {totalBankroll}
            </div>
            <div className={`timer-indicator px-4 py-2 rounded-lg ${
              timer > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Time: {timer}s
            </div>
          </div>
        </div>
        
        {/* Streak Indicator */}
        {streak > 0 && (
          <div className="streak-indicator px-4 py-2 rounded-lg mb-4 bg-purple-100 text-purple-800 text-center">
            <Zap size={16} className="inline mr-1" /> Streak: {streak} - Bonus: +{streak * 20}%
          </div>
        )}
        
        {/* Betting Controls */}
        <div className="betting-controls mb-4 p-4 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Your Bet</h3>
            <div className="flex items-center">
              <button 
                onClick={() => handleBetChange(-5)} 
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={answered || currentBet <= 5}
              >
                -
              </button>
              <span className="mx-3 font-bold">{currentBet}</span>
              <button 
                onClick={() => handleBetChange(5)} 
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
                disabled={answered || currentBet >= totalBankroll}
              >
                +
              </button>
            </div>
          </div>
          
          {/* 50/50 Lifeline */}
          <div className="text-center mt-2">
            <button 
              onClick={useFiftyFifty}
              disabled={fiftyFiftyUsed || answered || totalBankroll < 10}
              className={`px-4 py-1 rounded-lg text-white flex items-center mx-auto ${
                fiftyFiftyUsed ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              <AlertTriangle size={16} className="mr-1" /> 
              50/50 Help (-10 points)
            </button>
          </div>
        </div>
        
        <h2 className="question-text">{question.question}</h2>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isEliminated = eliminatedOptions.includes(option);
            
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={answered || isEliminated}
                className={`option-button w-full rounded-lg text-left transition ${
                  isEliminated ? 'opacity-30 cursor-not-allowed' : ''
                } ${
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
            );
          })}
        </div>
        
        {answered && (
          <div className="mt-4 text-center">
            {selectedOption === question.correctAnswer ? (
              <p className="feedback-text text-green-600 font-medium mb-4">
                Correct! +{Math.round(currentBet * (1 + (streak - 1) * 0.2))} points!
              </p>
            ) : (
              <p className="feedback-text text-red-600 font-medium mb-4">
                Incorrect. The correct answer is {question.correctAnswer}. -{currentBet} points.
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
  const calculateAverageGain = () => {
    if (quizHistory.length === 0) return 0;
    const totalGain = quizHistory.reduce((sum, quiz) => sum + (quiz.score - quiz.initialBankroll || 0), 0);
    return Math.round(totalGain / quizHistory.length);
  };

  const getBestScore = () => {
    if (quizHistory.length === 0) return 0;
    return Math.max(...quizHistory.map(quiz => quiz.score || 0));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="stats-container rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Gambling Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stats-card bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Total Games</p>
            <p className="stats-value text-3xl font-bold text-blue-600">{quizHistory.length}</p>
          </div>
          <div className="stats-card bg-green-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Avg. Gain/Loss</p>
            <p className={`stats-value text-3xl font-bold ${calculateAverageGain() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {calculateAverageGain() >= 0 ? '+' : ''}{calculateAverageGain()}
            </p>
          </div>
          <div className="stats-card bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Best Bankroll</p>
            <p className="stats-value text-3xl font-bold text-purple-600">{getBestScore()}</p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4">Game History</h3>
        {quizHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Final Score</th>
                  <th className="p-3 text-left">Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.slice().reverse().map((quiz, index) => {
                  const gainLoss = quiz.score - (quiz.initialBankroll || 100);
                  return (
                    <tr key={index}>
                      <td className="p-3">{quiz.date}</td>
                      <td className="p-3">{quiz.score}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${
                          gainLoss > 0 ? 'bg-green-100 text-green-800' : 
                          gainLoss === 0 ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {gainLoss > 0 ? '+' : ''}{gainLoss} ({Math.round((gainLoss / (quiz.initialBankroll || 100)) * 100)}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No game history yet. Take a quiz to see your statistics!</p>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigateTo('game')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;