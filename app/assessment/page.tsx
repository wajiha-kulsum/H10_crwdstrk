'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface QuestionData {
  question: string;
  options: string[];
}

interface Insight {
  condition: string;
  confidence: number;
}

export default function MentalHealthQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [responses, setResponses] = useState<{question: string, answer: string}[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<QuestionData[]>([]);

  const fetchNextQuestion = async (previousAnswer?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pathname: '/questions',
          previousAnswer 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      setCurrentQuestion(data);
      setQuestionHistory(prev => [...prev, data]);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeResponses = async (finalResponses: {question: string, answer: string}[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pathname: '/analyze',
          responses: finalResponses 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze responses');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error analyzing responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const handleAnswer = (answer: string) => {
    if (currentQuestion) {
      const newResponses = [...responses, { 
        question: currentQuestion.question, 
        answer 
      }];

      setResponses(newResponses);

      // If you want to limit the number of questions, adjust this condition
      if (newResponses.length >= 5) {
        analyzeResponses(newResponses);
        return;
      }

      fetchNextQuestion(answer);
    }
  };

  const handleBackward = () => {
    if (responses.length > 0) {
      const newResponses = responses.slice(0, -1);
      setResponses(newResponses);
      const newQuestionHistory = questionHistory.slice(0, -1);
      setQuestionHistory(newQuestionHistory);
      setCurrentQuestion(newQuestionHistory[newQuestionHistory.length - 1]);
    }
  };

  const restartQuestionnaire = () => {
    setResponses([]);
    setInsights(null);
    setQuestionHistory([]);
    fetchNextQuestion();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
          <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
        </div>
        <div className="text-2xl font-copernicusMedium z-10">Loading...</div>
      </div>
    );
  }

  if (insights) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
          <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
        </div>
        <div className="shadow-md rounded-lg p-10 pb-8 max-w-xl w-full z-10 bg-white/60">
          <h2 className="text-2xl font-semibold mb-4 text-slate-600 font-copernicusMedium">
            Mental Health Insights
          </h2>
          <div className="whitespace-pre-line text-gray-700 mb-6 font-outfitRegular">
            {insights}
          </div>
          <Button onClick={restartQuestionnaire} className="w-full bg-violet-400 hover:bg-violet-500 text-white font-outfitRegular">
            Restart Questionnaire
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
      <div className="bg-white/50 shadow-md rounded-3xl p-12 max-w-xl w-full z-10">
        <h2 className="text-xl font-copernicusMedium mb-4">
          {currentQuestion.question}
        </h2>
        <div className="space-y-3 font-outfitRegular">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="default"
              className="w-full justify-start p-8 rounded-3xl bg-transparent shadow-none border border-slate-300/60 text-slate-800 hover:bg-violet-200 hover:border-transparent"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={handleBackward}
            disabled={responses.length === 0}
            className="text-sm text-gray-500 font-outfitRegular flex items-center"
            variant="ghost"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="text-sm text-gray-600 font-outfitRegular">
            Question {responses.length + 1} of 5
          </div>
        </div>
      </div>
    </div>
  );
}

