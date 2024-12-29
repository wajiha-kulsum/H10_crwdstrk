'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

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
      setInsights(`Dear Client,

Based on your responses, I've identified some potential areas of concern that we should discuss:

${data.insights}

Potential Conditions and Recommendations:
1. Anxiety Indicators: Your responses suggest you might be experiencing elevated stress levels or anxiety symptoms.
2. Emotional Regulation: There are signs that you may benefit from developing stronger emotional coping mechanisms.
3. Mental Health Support: I recommend considering:
   - Regular counseling sessions
   - Stress management techniques
   - Potential cognitive behavioral therapy (CBT)

Important Notes:
- These insights are preliminary and not a definitive diagnosis
- Professional in-person assessment is crucial
- Your mental health journey is unique and personal

Remember, seeking help is a sign of strength, not weakness. Would you like to discuss these insights further?

Compassionately,
Your Mental Health Professional`);
    } catch (error) {
      console.error('Error analyzing responses:', error);
      setInsights(`Dear Client,

I apologize, but there was an issue processing your assessment. This can happen due to technical difficulties.

Recommendations:
- Please try again later
- Consider speaking with a mental health professional directly
- Your mental well-being is important

Warmly,
Your Support Team`);
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
        <div className="absolute inset-0 overflow-hidden">
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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
          <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
        </div>
        <div className="shadow-lg rounded-2xl p-8 max-w-3xl w-full z-10 bg-white/80 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-violet-700 font-copernicusMedium text-center">
            Your Mental Health Insights
          </h2>
          <div className="space-y-4 text-gray-700 mb-8 font-outfitRegular">
            {insights.split('\n').map((paragraph, index) => (
              <p 
                key={index} 
                className={cn(
                  "text-lg leading-relaxed",
                  paragraph.includes('Compassionately,') || paragraph.includes('Warmly,') ? 'text-right italic text-gray-600' : '',
                  paragraph.includes('Potential Conditions') || paragraph.includes('Important Notes') ? 'font-semibold text-violet-700' : ''
                )}
              >
                {paragraph} </p>
            ))}
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={restartQuestionnaire} 
              className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-outfitRegular text-lg rounded-full transition-colors duration-300 ease-in-out"
            >
              Take the Questionaire Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
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
        <div className="flex flex-col gap-3 font-outfitRegular">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="default"
              className={cn(
                "w-full p-4 rounded-3xl bg-transparent shadow-none",
                "border border-slate-300/60 text-slate-800",
                "hover:bg-violet-200 hover:border-transparent",
                "flex items-center justify-start",
                "min-h-[4rem] h-auto",
                "text-left"
              )}
              onClick={() => handleAnswer(option)}
            >
              <span 
                className={cn(
                  "w-full",
                  "break-words",
                  "whitespace-normal",
                  "line-clamp-3",
                  "overflow-hidden",
                  "text-start"
                )}
              >
                {option}
              </span>
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
          <div className="text-sm text-gray-500 font-outfitRegular">
            Question {responses.length + 1} of 5
          </div>
        </div>
      </div>
    </div>
  );
}