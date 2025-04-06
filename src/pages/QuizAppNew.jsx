import React, { useState, useEffect } from 'react';
import { 
  Info, Settings, TrendingUp, ChevronRight, Award, Home, RefreshCw, 
  Coins, AlertTriangle, Zap, Star, Trophy, Shield, Heart, Gift, Lock
} from 'lucide-react';

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

  // Gamification features
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);
  const [playerRank, setPlayerRank] = useState('Novice');
  const [achievements, setAchievements] = useState([]);
  const [secondChanceAvailable, setSecondChanceAvailable] = useState(true);
  const [bonusQuestionAvailable, setBonusQuestionAvailable] = useState(false);
  const [showingBonusQuestion, setShowingBonusQuestion] = useState(false);
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Regular questions
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
      difficulty: 1
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
      difficulty: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci",
      difficulty: 2
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean",
      difficulty: 2
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au",
      difficulty: 3
    }
  ];

  // Bonus questions (harder, worth more XP and points)
  const bonusQuestions = [
    {
      question: "Which of these elements has the highest atomic number?",
      options: ["Uranium", "Plutonium", "Curium", "Nobelium"],
      correctAnswer: "Nobelium",
      difficulty: 4,
      reward: 50
    },
    {
      question: "Which of these programming languages was developed first?",
      options: ["Python", "Java", "C", "COBOL"],
      correctAnswer: "COBOL",
      difficulty: 4,
      reward: 50
    },
    {
      question: "Which of these works was not written by William Shakespeare?",
      options: ["Hamlet", "Macbeth", "The Canterbury Tales", "Romeo and Juliet"],
      correctAnswer: "The Canterbury Tales",
      difficulty: 3,
      reward: 40
    }
  ];

  // Define achievements
  const achievementsList = [
    { id: 'first_win', name: 'First Victory', description: 'Complete your first quiz', icon: <Trophy size={20} />, xpReward: 50 },
    { id: 'streak_3', name: 'Winning Streak', description: 'Get 3 questions correct in a row', icon: <Zap size={20} />, xpReward: 100 },
    { id: 'reach_level_5', name: 'Apprentice', description: 'Reach level 5', icon: <Star size={20} />, xpReward: 250 },
    { id: 'bankroll_250', name: 'Fortune Favors', description: 'Reach a bankroll of 250 points', icon: <Coins size={20} />, xpReward: 150 },
    { id: 'bonus_master', name: 'Bonus Master', description: 'Complete 3 bonus questions correctly', icon: <Gift size={20} />, xpReward: 200 }
  ];

  // Player ranks based on level
  const ranks = [
    { level: 1, title: 'Novice' },
    { level: 5, title: 'Apprentice' },
    { level: 10, title: 'Scholar' },
    { level: 15, title: 'Master' },
    { level: 20, title: 'Grandmaster' },
    { level: 25, title: 'Quiz Legend' }
  ];

  // Calculate XP required for level up
  const getXpForNextLevel = (level) => {
    return level * 100;
  };

  // Update player's rank based on level
  useEffect(() => {
    const newRank = ranks.filter(r => r.level <= playerLevel).pop().title;
    if (newRank !== playerRank) {
      setPlayerRank(newRank);
      displayNotification(`Rank Up! You are now a ${newRank}`, 'success');
    }
  }, [playerLevel, playerRank]);

  // Check for achievements
  useEffect(() => {
    // Only check registered achievements
    const earnedAchievements = achievements.map(a => a.id);
    
    // First victory achievement
    if (!earnedAchievements.includes('first_win') && quizHistory.length >= 1) {
      unlockAchievement('first_win');
    }
    
    // Streak achievement
    if (!earnedAchievements.includes('streak_3') && streak >= 3) {
      unlockAchievement('streak_3');
    }
    
    // Level achievement
    if (!earnedAchievements.includes('reach_level_5') && playerLevel >= 5) {
      unlockAchievement('reach_level_5');
    }
    
    // Bankroll achievement
    if (!earnedAchievements.includes('bankroll_250') && totalBankroll >= 250) {
      unlockAchievement('bankroll_250');
    }
  }, [streak, quizHistory, playerLevel, totalBankroll, achievements]);

  // Handle unlocking an achievement
  const unlockAchievement = (achievementId) => {
    const achievement = achievementsList.find(a => a.id === achievementId);
    if (!achievement) return;

    // Add achievement to list
    setAchievements([...achievements, achievement]);
    
    // Award XP for achievement
    addXP(achievement.xpReward);
    
    // Display notification
    displayNotification(`Achievement Unlocked: ${achievement.name}! +${achievement.xpReward} XP`, 'achievement');
  };

  // Add XP and handle level ups
  const addXP = (amount) => {
    const newXP = playerXP + amount;
    setPlayerXP(newXP);
    
    // Check for level up
    const xpForNextLevel = getXpForNextLevel(playerLevel);
    if (newXP >= xpForNextLevel) {
      const newLevel = playerLevel + 1;
      setPlayerLevel(newLevel);
      setPlayerXP(newXP - xpForNextLevel);
      
      // Unlock rewards at certain levels
      checkLevelRewards(newLevel);
      
      displayNotification(`Level Up! You are now level ${newLevel}`, 'levelup');
    }
  };

  // Check and unlock level-based rewards
  const checkLevelRewards = (level) => {
    const newRewards = [];
    
    if (level === 3 && !unlockedRewards.includes('second_chance')) {
      newRewards.push('second_chance');
      setSecondChanceAvailable(true);
      displayNotification('Reward Unlocked: Second Chance - Use once per game to retry a question!', 'reward');
    }
    
    if (level === 5 && !unlockedRewards.includes('bonus_questions')) {
      newRewards.push('bonus_questions');
      setBonusQuestionAvailable(true);
      displayNotification('Reward Unlocked: Bonus Questions - Harder questions with special rewards!', 'reward');
    }
    
    if (newRewards.length > 0) {
      setUnlockedRewards([...unlockedRewards, ...newRewards]);
    }
  };

  // Display notification
  const displayNotification = (message, type) => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Get current question (regular or bonus)
  const getCurrentQuestion = () => {
    if (showingBonusQuestion) {
      // Select a random bonus question
      const randomIndex = Math.floor(Math.random() * bonusQuestions.length);
      return bonusQuestions[randomIndex];
    }
    return questions[currentQuestionIndex];
  };

  // Handle navigation between pages
  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'game') {
      resetGame();
    } else if (page === 'achievements') {
      // No special handling needed
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
    setSecondChanceAvailable(unlockedRewards.includes('second_chance'));
    setBonusQuestionAvailable(unlockedRewards.includes('bonus_questions'));
    setShowingBonusQuestion(false);
  };

  // Handle bet change
  const handleBetChange = (amount) => {
    const newBet = Math.min(Math.max(5, currentBet + amount), totalBankroll);
    setCurrentBet(newBet);
  };

  // Use 50/50 lifeline
  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || answered) return;
    
    const currentQuestion = getCurrentQuestion();
    const correctAnswer = currentQuestion.correctAnswer;
    
    const incorrectOptions = currentQuestion.options.filter(option => option !== correctAnswer);
    const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, Math.min(2, incorrectOptions.length));
    
    setEliminatedOptions(toEliminate);
    setFiftyFiftyUsed(true);
    setTotalBankroll(totalBankroll - 10);
  };

  // Use second chance
  const useSecondChance = () => {
    if (!secondChanceAvailable || !answered || selectedOption === getCurrentQuestion().correctAnswer) return;
    
    setSecondChanceAvailable(false);
    setSelectedOption(null);
    setAnswered(false);
    setTimer(10); // Less time for second chance
    setTimerActive(true);
    setEliminatedOptions([]);
    
    displayNotification('Second Chance Used! Choose wisely...', 'info');
  };

  // Toggle bonus question
  const toggleBonusQuestion = () => {
    if (!bonusQuestionAvailable || answered) return;
    
    setShowingBonusQuestion(!showingBonusQuestion);
    setSelectedOption(null);
    setAnswered(false);
    setEliminatedOptions([]);
    
    if (!showingBonusQuestion) {
      setTimer(30); // More time for bonus questions
      displayNotification('Bonus Question! Worth more XP and points but more difficult!', 'info');
    } else {
      setTimer(20); // Back to regular time
    }
  };

  // Handle answer selection
  const handleOptionSelect = (option) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    setTimerActive(false);
    
    const currentQuestion = getCurrentQuestion();
    
    if (option === currentQuestion.correctAnswer) {
      // Correct answer
      const difficultyXP = currentQuestion.difficulty * 10; // XP based on difficulty
      const streakBonus = streak > 0 ? (streak * 0.2) : 0;
      let winAmount = Math.round(currentBet * (1 + streakBonus));
      
      // Extra rewards for bonus questions
      if (showingBonusQuestion) {
        winAmount += currentQuestion.reward || 30;
        addXP(difficultyXP * 2); // Double XP for bonus questions
        
        // Check bonus master achievement
        const bonusCorrect = (achievements.find(a => a.id === 'bonus_correct_count')?.count || 0) + 1;
        const bonusAchievement = achievements.find(a => a.id === 'bonus_correct_count');
        
        if (bonusAchievement) {
          bonusAchievement.count = bonusCorrect;
          setAchievements([...achievements.filter(a => a.id !== 'bonus_correct_count'), bonusAchievement]);
        } else {
          setAchievements([...achievements, { id: 'bonus_correct_count', count: 1 }]);
        }
        
        if (bonusCorrect >= 3 && !achievements.some(a => a.id === 'bonus_master')) {
          unlockAchievement('bonus_master');
        }
      } else {
        addXP(difficultyXP);
      }
      
      setScore(score + winAmount);
      setTotalBankroll(totalBankroll + winAmount);
      setStreak(streak + 1);
      
      // Special reward for streak of 5
      if (streak + 1 === 5) {
        setBonusQuestionAvailable(true);
        displayNotification('5 Correct Answers in a Row! Bonus question unlocked!', 'success');
      }
      
    } else {
      // Wrong answer
      setTotalBankroll(totalBankroll - currentBet);
      setStreak(0);
      
      // Still award some XP for the attempt
      addXP(2);
    }
  };

  // Move to next question or end game
  const handleNextQuestion = () => {
    if (showingBonusQuestion) {
      // After bonus question, go back to regular questions
      setShowingBonusQuestion(false);
      setBonusQuestionAvailable(false);
    }
    
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
    
    // Give XP for completing the quiz
    addXP(50);
    
    const newQuizResult = {
      date: new Date().toLocaleDateString(),
      score: totalBankroll,
      initialBankroll: 100,
      totalQuestions: questions.length,
      level: playerLevel,
      xpGained: playerXP - (playerXP % getXpForNextLevel(playerLevel - 1)), // Approximate XP gained during this quiz
      percentage: Math.round((totalBankroll / 100 - 1) * 100)
    };
    
    setQuizHistory([...quizHistory, newQuizResult]);
    localStorage.setItem('quizHistory', JSON.stringify([...quizHistory, newQuizResult]));
    
    // First win achievement check
    if (achievements.length === 0) {
      unlockAchievement('first_win');
    }
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

  // Load saved data from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    const savedAchievements = localStorage.getItem('achievements');
    const savedLevel = localStorage.getItem('playerLevel');
    const savedXP = localStorage.getItem('playerXP');
    const savedRewards = localStorage.getItem('unlockedRewards');
    
    if (savedHistory) setQuizHistory(JSON.parse(savedHistory));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedLevel) setPlayerLevel(parseInt(savedLevel));
    if (savedXP) setPlayerXP(parseInt(savedXP));
    if (savedRewards) {
      const rewards = JSON.parse(savedRewards);
      setUnlockedRewards(rewards);
      setSecondChanceAvailable(rewards.includes('second_chance'));
      setBonusQuestionAvailable(rewards.includes('bonus_questions'));
    }
  }, []);
  
  // Save player progress to localStorage
  useEffect(() => {
    localStorage.setItem('playerLevel', playerLevel);
    localStorage.setItem('playerXP', playerXP);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('unlockedRewards', JSON.stringify(unlockedRewards));
  }, [playerLevel, playerXP, achievements, unlockedRewards]);

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
        return <HomePage navigateTo={navigateTo} playerLevel={playerLevel} playerXP={playerXP} playerRank={playerRank} />;
      case 'game':
        return (
          <GamePage
            question={getCurrentQuestion()}
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
            playerLevel={playerLevel}
            playerXP={playerXP}
            nextLevelXP={getXpForNextLevel(playerLevel)}
            secondChanceAvailable={secondChanceAvailable}
            useSecondChance={useSecondChance}
            bonusQuestionAvailable={bonusQuestionAvailable}
            toggleBonusQuestion={toggleBonusQuestion}
            showingBonusQuestion={showingBonusQuestion}
          />
        );
      case 'statistics':
        return <StatisticsPage quizHistory={quizHistory} navigateTo={navigateTo} />;
      case 'achievements':
        return <AchievementsPage 
          achievements={achievements} 
          achievementsList={achievementsList} 
          playerLevel={playerLevel} 
          playerXP={playerXP}
          nextLevelXP={getXpForNextLevel(playerLevel)}
          playerRank={playerRank}
          unlockedRewards={unlockedRewards}
          navigateTo={navigateTo} 
        />;
      default:
        return <HomePage navigateTo={navigateTo} playerLevel={playerLevel} playerXP={playerXP} playerRank={playerRank} />;
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
                onClick={() => navigateTo('achievements')}
                className={`px-3 py-1 rounded-lg flex items-center ${currentPage === 'achievements' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              >
                <Trophy size={16} className="mr-1" /> Achievements
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
          {/* Notification system */}
          {showNotification && (
            <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50
              ${notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 
                notification.type === 'achievement' ? 'bg-purple-100 border-l-4 border-purple-500 text-purple-700' : 
                notification.type === 'levelup' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
                notification.type === 'reward' ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' :
                'bg-gray-100 border-l-4 border-gray-500 text-gray-700'}`}
            >
              {notification.message}
            </div>
          )}
          
          {/* Level bar on game page */}
          {currentPage !== 'home' && (
            <div className="mb-4 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-blue-600 h-full"
                style={{ width: `${(playerXP / getXpForNextLevel(playerLevel)) * 100}%` }}
              ></div>
              <div className="text-xs text-center -mt-4 text-white">
                Level {playerLevel} • {playerXP}/{getXpForNextLevel(playerLevel)} XP • {playerRank}
              </div>
            </div>
          )}
          
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
const HomePage = ({ navigateTo, playerLevel, playerXP, playerRank }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="home-card rounded-lg shadow-lg p-8 mb-6">
        <div className="text-6xl mb-4 text-blue-500 flex justify-center">
          <Award />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to QuizMaster!</h2>
        
        {/* Player stats */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 inline-flex items-center space-x-4">
          <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            {playerLevel}
          </div>
          <div className="text-left">
            <div className="text-sm text-gray-600">Current Rank</div>
            <div className="font-bold text-blue-800">{playerRank}</div>
          </div>
        </div>
        
        <p className="text-lg mb-6">
          Test your knowledge, earn achievements, and rise through the ranks!
        </p>
        <button
          onClick={() => navigateTo('game')}
          className="text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center mx-auto transition"
        >
          Start Quiz <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card rounded-lg shadow p-6">
          <div className="text-3xl mb-3 text-blue-500 flex justify-center">
            <Trophy />
          </div>
          <h3 className="text-xl font-bold mb-2">Achievements</h3>
          <p>
            Complete quizzes to unlock achievements and earn bonus XP and rewards!
          </p>
        </div>
        <div className="feature-card rounded-lg shadow p-6">
          <div className="text-3xl mb-3 text-blue-500 flex justify-center">
            <Coins />
          </div>
          <h3 className="text-xl font-bold mb-2">Betting System</h3>
          <p>
            Place bets and increase your winnings with streaks of correct answers!
          </p>
        </div>
        <div className="feature-card rounded-lg shadow p-6">
          <div className="text-3xl mb-3 text-blue-500 flex justify-center">
            <Gift />
          </div>
          <h3 className="text-xl font-bold mb-2">Bonus Questions</h3>
          <p>
            Unlock special bonus questions for extra rewards and challenges!
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
  totalBankroll,
  playerLevel,
  playerXP,
  nextLevelXP,
  secondChanceAvailable,
  useSecondChance,
  bonusQuestionAvailable,
  toggleBonusQuestion,
  showingBonusQuestion
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
            onClick={() => navigateTo('achievements')}
            className="action-button text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center"
          >
            <Trophy size={16} className="mr-2" /> View Achievements
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
        {/* Status Bar */</div>