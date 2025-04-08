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
  
  // Gambling features
  const [currentBet, setCurrentBet] = useState(10);
  const [streak, setStreak] = useState(0);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [totalBankroll, setTotalBankroll] = useState(100);

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
    setTotalBankroll(100);
  };

  // Handle bet change
  const handleBetChange = (amount) => {
    const newBet = Math.min(Math.max(5, currentBet + amount), totalBankroll);
    setCurrentBet(newBet);
  };

  // Use 50/50 lifeline
  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || answered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    
    const incorrectOptions = currentQuestion.options.filter(option => option !== correctAnswer);
    const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, Math.min(2, incorrectOptions.length));
    
    setEliminatedOptions(toEliminate);
    setFiftyFiftyUsed(true);
    setTotalBankroll(totalBankroll - 10);
  };

  // Handle answer selection
  const handleOptionSelect = (option) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    setTimerActive(false);
    
    if (option === questions[currentQuestionIndex].correctAnswer) {
      // Correct answer - add bet to score with streak bonus
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
      score: totalBankroll,
      initialBankroll: 100,
      totalQuestions: questions.length,
      percentage: Math.round((totalBankroll / 100 - 1) * 100)
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
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Header with neon effect */}
      <header className="bg-gray-900 border-b border-cyan-500 shadow-lg py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{textShadow: '0 0 10px #0ff, 0 0 20px #0ff'}}>
            QuizMaster
          </h1>
          <nav className="flex space-x-2">
            <button 
              onClick={() => navigateTo('home')}
              className={`px-4 py-2 rounded-l-full ${
                currentPage === 'home' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={currentPage === 'home' ? {boxShadow: '0 0 10px #b300ff'} : {}}
            >
              <Home size={16} className="inline mr-2" /> Home
            </button>
            <button 
              onClick={() => navigateTo('statistics')}
              className={`px-4 py-2 rounded-r-full ${
                currentPage === 'statistics' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={currentPage === 'statistics' ? {boxShadow: '0 0 10px #b300ff'} : {}}
            >
              <TrendingUp size={16} className="inline mr-2" /> Stats
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      
      <footer className="py-4 text-center text-gray-400 border-t border-gray-800">
        <p>QuizMaster © 2025 - Challenge Your Knowledge!</p>
      </footer>
    </div>
  );
};

// Home Page Component
const HomePage = ({ navigateTo }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border-2 border-cyan-500" 
          style={{boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'}}>
        <div className="text-6xl mb-6 flex justify-center text-purple-400" 
            style={{textShadow: '0 0 15px #b300ff'}}>
          <Award />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Welcome to QuizMaster!</h2>
        <p className="text-lg mb-8 text-gray-300">
          Test your knowledge with our interactive quizzes. Challenge yourself, place bets, and increase your bankroll!
        </p>
        <button
          onClick={() => navigateTo('game')}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold flex items-center justify-center mx-auto transition hover:from-cyan-600 hover:to-blue-600"
          style={{boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'}}
        >
          Start Quiz <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-pink-500">
          <div className="text-3xl mb-3 text-pink-400 flex justify-center" 
              style={{textShadow: '0 0 10px #ff00ff'}}>
            <Info />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">How to Play</h3>
          <p className="text-gray-300">
            Answer questions within the time limit. Place bets on your answers and build up your bankroll. Use the 50/50 lifeline for hard questions!
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
          <div className="text-3xl mb-3 text-yellow-400 flex justify-center" 
              style={{textShadow: '0 0 10px #ffff00'}}>
            <Coins />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Betting System</h3>
          <p className="text-gray-300">
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
      <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl p-8 text-center border-2 border-purple-500"
          style={{boxShadow: '0 0 20px rgba(177, 0, 255, 0.3)'}}>
        <div className="text-6xl mb-6 text-yellow-400 flex justify-center"
            style={{textShadow: '0 0 15px #ffff00'}}>
          <Coins />
        </div>
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="mb-2 text-lg">Final Bankroll: <span className="font-bold text-cyan-400">{totalBankroll} points</span></p>
        <p className="mb-8">
          Gain/Loss: <span className={`font-bold ${totalBankroll > 100 ? 'text-green-400' : 'text-red-400'}`}
              style={totalBankroll > 100 ? {textShadow: '0 0 10px rgba(0, 255, 128, 0.5)'} : {textShadow: '0 0 10px rgba(255, 0, 128, 0.5)'}}>
            {totalBankroll > 100 ? '+' : ''}{totalBankroll - 100} points ({Math.round((totalBankroll / 100 - 1) * 100)}%)
          </span>
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center"
            style={{boxShadow: '0 0 10px rgba(0, 255, 128, 0.5)'}}
          >
            <RefreshCw size={16} className="mr-2" /> Play Again
          </button>
          <button
            onClick={() => navigateTo('statistics')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center"
            style={{boxShadow: '0 0 10px rgba(0, 128, 255, 0.5)'}}
          >
            <TrendingUp size={16} className="mr-2" /> View Statistics
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center hover:from-gray-700 hover:to-gray-800"
          >
            <Home size={16} className="mr-2" /> Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-cyan-500"
          style={{boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'}}>
        {/* Status Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            Question {questionNumber}/{totalQuestions}
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-900 px-4 py-2 rounded-full text-yellow-300 flex items-center"
                style={{textShadow: '0 0 5px #ffff00'}}>
              <Coins size={16} className="mr-2" /> {totalBankroll}
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              timer > 10 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}
            style={timer > 10 ? {textShadow: '0 0 5px #00ff00'} : {textShadow: '0 0 5px #ff0000'}}>
              {timer}s
            </div>
          </div>
        </div>
        
        {/* Streak Indicator */}
        {streak > 0 && (
          <div className="bg-purple-900 px-4 py-2 rounded-lg mb-4 text-purple-300 text-center font-medium"
              style={{textShadow: '0 0 5px #b300ff'}}>
            <Zap size={16} className="inline mr-2" /> Streak: {streak} - Bonus: +{streak * 20}%
          </div>
        )}
        
        {/* Betting Controls */}
        <div className="mb-6 p-4 rounded-lg bg-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-white">Your Bet</h3>
            <div className="flex items-center">
              <button 
                onClick={() => handleBetChange(-5)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                disabled={answered || currentBet <= 5}
              >
                -
              </button>
              <span className="mx-4 font-bold text-cyan-400" 
                  style={{textShadow: '0 0 5px #0ff'}}>{currentBet}</span>
              <button 
                onClick={() => handleBetChange(5)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 text-white"
                disabled={answered || currentBet >= totalBankroll}
              >
                +
              </button>
            </div>
          </div>
          
          {/* 50/50 Lifeline */}
          <div className="text-center mt-3">
            <button 
              onClick={useFiftyFifty}
              disabled={fiftyFiftyUsed || answered || totalBankroll < 10}
              className={`px-4 py-2 rounded-full text-white flex items-center mx-auto ${
                fiftyFiftyUsed ? 'bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
              }`}
              style={!fiftyFiftyUsed ? {boxShadow: '0 0 10px rgba(255, 128, 0, 0.5)'} : {}}
            >
              <AlertTriangle size={16} className="mr-2" /> 
              50/50 Help (-10 points)
            </button>
          </div>
        </div>
        
        {/* Question */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-xl font-medium text-white text-center">{question.question}</h2>
        </div>
        
        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isEliminated = eliminatedOptions.includes(option);
            let optionStyle = {};
            
            if (answered) {
              if (option === question.correctAnswer) {
                optionStyle = {
                  background: 'linear-gradient(to right, #00b894, #00cec9)',
                  boxShadow: '0 0 15px rgba(0, 255, 128, 0.5)'
                };
              } else if (option === selectedOption) {
                optionStyle = {
                  background: 'linear-gradient(to right, #ff7675, #d63031)',
                  boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)'
                };
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={answered || isEliminated}
                className={`w-full p-4 rounded-lg text-left transition ${
                  isEliminated ? 'opacity-30 cursor-not-allowed bg-gray-700 text-gray-400' : 
                  !answered ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'text-white'
                }`}
                style={optionStyle}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {/* Feedback & Next Button */}
        {answered && (
          <div className="mt-6 text-center">
            {selectedOption === question.correctAnswer ? (
              <p className="text-green-400 font-medium mb-4" 
                  style={{textShadow: '0 0 10px rgba(0, 255, 128, 0.5)'}}>
                Correct! +{Math.round(currentBet * (1 + (streak - 1) * 0.2))} points!
              </p>
            ) : (
              <p className="text-red-400 font-medium mb-4"
                  style={{textShadow: '0 0 10px rgba(255, 0, 0, 0.5)'}}>
                Incorrect. The correct answer is {question.correctAnswer}. -{currentBet} points.
              </p>
            )}
            <button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600"
              style={{boxShadow: '0 0 15px rgba(177, 0, 255, 0.5)'}}
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
      <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-purple-500"
          style={{boxShadow: '0 0 20px rgba(177, 0, 255, 0.3)'}}>
        <h2 className="text-2xl font-bold mb-8 text-center" 
            style={{textShadow: '0 0 10px #b300ff'}}>
          Your Gambling Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-700 rounded-lg p-4 text-center border-b-2 border-blue-500">
            <p className="text-gray-400 mb-1">Total Games</p>
            <p className="text-3xl font-bold text-blue-400" 
                style={{textShadow: '0 0 10px rgba(0, 128, 255, 0.5)'}}>
              {quizHistory.length}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center border-b-2 border-green-500">
            <p className="text-gray-400 mb-1">Avg. Gain/Loss</p>
            <p className={`text-3xl font-bold ${calculateAverageGain() >= 0 ? 'text-green-400' : 'text-red-400'}`}
                style={calculateAverageGain() >= 0 
                  ? {textShadow: '0 0 10px rgba(0, 255, 128, 0.5)'} 
                  : {textShadow: '0 0 10px rgba(255, 0, 0, 0.5)'}}>
              {calculateAverageGain() >= 0 ? '+' : ''}{calculateAverageGain()}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center border-b-2 border-pink-500">
            <p className="text-gray-400 mb-1">Best Bankroll</p>
            <p className="text-3xl font-bold text-pink-400"
                style={{textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'}}>
              {getBestScore()}
            </p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4">Game History</h3>
        {quizHistory.length > 0 ? (
          <div className="overflow-x-auto bg-gray-700 rounded-lg p-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="p-3 text-left text-gray-300">Date</th>
                  <th className="p-3 text-left text-gray-300">Final Score</th>
                  <th className="p-3 text-left text-gray-300">Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.slice().reverse().map((quiz, index) => {
                  const gainLoss = quiz.score - (quiz.initialBankroll || 100);
                  return (
                    <tr key={index} className="border-b border-gray-600">
                      <td className="p-3 text-gray-300">{quiz.date}</td>
                      <td className="p-3 text-cyan-400">{quiz.score}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          gainLoss > 0 ? 'bg-green-900 text-green-300' : 
                          gainLoss === 0 ? 'bg-gray-600 text-gray-300' : 
                          'bg-red-900 text-red-300'
                        }`}
                        style={gainLoss > 0 
                          ? {textShadow: '0 0 5px rgba(0, 255, 128, 0.5)'} 
                          : gainLoss < 0 
                            ? {textShadow: '0 0 5px rgba(255, 0, 0, 0.5)'} 
                            : {}}>
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
          <p className="text-gray-400 text-center py-8 bg-gray-700 rounded-lg">No game history yet. Take a quiz to see your statistics!</p>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo('game')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600"
            style={{boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'}}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;