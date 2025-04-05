import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Award, DollarSign, HelpCircle, X, Check, TrendingUp } from 'lucide-react';

const QuizGameScreen = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentBet, setCurrentBet] = useState(100);
  const [confirmed, setConfirmed] = useState(false);
  const [availableBonuses, setAvailableBonuses] = useState([
    { id: 1, name: 'Hint', icon: <HelpCircle size={18} />, active: true },
    { id: 2, name: '50/50', icon: <X size={18} />, active: true },
    { id: 3, name: 'Extra Time', icon: <Clock size={18} />, active: true },
  ]);
  
  // Mock question data
  const question = {
    text: "Which planet in our solar system has the most moons?",
    options: [
      { id: 'A', text: "Jupiter" },
      { id: 'B', text: "Saturn" },
      { id: 'C', text: "Uranus" },
      { id: 'D', text: "Neptune" }
    ],
    correctAnswer: 'B'
  };
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !confirmed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, confirmed]);
  
  // Timer color based on time remaining
  const getTimerColor = () => {
    if (timeLeft > 15) return 'text-green-500';
    if (timeLeft > 5) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Handle bet changes
  const adjustBet = (amount) => {
    const newBet = Math.max(50, currentBet + amount);
    setCurrentBet(newBet);
  };
  
  // Use a bonus
  const useBonus = (bonusId) => {
    setAvailableBonuses(availableBonuses.map(bonus => 
      bonus.id === bonusId ? {...bonus, active: false} : bonus
    ));
    
    // Bonus effects would be implemented here
    if (bonusId === 3) {
      setTimeLeft(timeLeft + 15); // Add 15 seconds for Extra Time bonus
    }
  };
  
  // Handle answer selection
  const selectAnswer = (answerId) => {
    if (!confirmed) {
      setSelectedAnswer(answerId);
    }
  };
  
  // Submit answer
  const confirmAnswer = () => {
    if (selectedAnswer) {
      setConfirmed(true);
      // Here you would handle scoring logic
    }
  };
  
  // Double the bet
  const doubleBet = () => {
    if (!confirmed) {
      setCurrentBet(currentBet * 2);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <button className="flex items-center">
          <ArrowLeft size={24} />
          <span className="ml-2">Exit Quiz</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Award size={18} className="mr-1" />
            <span>Score: 450</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={18} className="mr-1" />
            <span>Total Bet: 700</span>
          </div>
        </div>
      </header>
      
      {/* Timer */}
      <div className="flex justify-center p-4">
        <div className={`flex items-center justify-center rounded-full w-16 h-16 border-4 border-gray-200 ${getTimerColor()}`}>
          <Clock size={20} className="mr-1" />
          <span className="font-bold">{timeLeft}</span>
        </div>
      </div>
      
      {/* Question */}
      <div className="p-6 bg-white rounded-lg m-4 shadow-lg">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {question.text}
        </h1>
        
        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedAnswer === option.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              } ${
                confirmed && option.id === question.correctAnswer
                  ? 'bg-green-500 text-white'
                  : ''
              } ${
                confirmed && selectedAnswer === option.id && option.id !== question.correctAnswer
                  ? 'bg-red-500 text-white'
                  : ''
              }`}
              onClick={() => selectAnswer(option.id)}
              disabled={confirmed}
            >
              <span className="font-bold mr-2">{option.id}:</span>
              {option.text}
            </button>
          ))}
        </div>
      </div>
      
      {/* Betting and Bonuses Section */}
      <div className="p-4 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bet Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-gray-700 mb-2">Place Your Bet</h2>
            <div className="flex items-center justify-between">
              <button 
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center"
                onClick={() => adjustBet(-50)}
                disabled={confirmed}
              >
                -
              </button>
              <div className="flex items-center">
                <DollarSign size={20} className="text-green-600" />
                <span className="text-2xl font-bold">{currentBet}</span>
              </div>
              <button 
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center"
                onClick={() => adjustBet(50)}
                disabled={confirmed}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Bonuses */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-gray-700 mb-2">Bonuses</h2>
            <div className="flex justify-between">
              {availableBonuses.map(bonus => (
                <button 
                  key={bonus.id} 
                  className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                    bonus.active 
                      ? 'text-indigo-600 hover:bg-indigo-100' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => bonus.active && useBonus(bonus.id)}
                  disabled={!bonus.active || confirmed}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    bonus.active ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    {bonus.icon}
                  </div>
                  <span className="text-xs mt-1">{bonus.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex mt-4 space-x-4">
          <button 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center disabled:opacity-50"
            onClick={confirmAnswer}
            disabled={!selectedAnswer || confirmed}
          >
            <Check size={20} className="mr-2" />
            Confirm Answer
          </button>
          <button 
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold flex items-center justify-center disabled:opacity-50"
            onClick={doubleBet}
            disabled={confirmed}
          >
            <TrendingUp size={20} className="mr-2" />
            Double Bet
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGameScreen;