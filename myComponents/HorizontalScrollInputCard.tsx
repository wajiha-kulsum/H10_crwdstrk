'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Activity {
  emoji: string
  label: string
  bgColor: string
}

interface InputData {
  date: string
  mood: {
    emoji: string
    label: string
    color: string
  }
  time: string
  activities: Activity[]
  note: string
}

const HorizontalScrollInputCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const inputs: InputData[] = [
    {
      date: "Monday, 2 December",
      mood: { emoji: "😄", label: "Good", color: "green" },
      time: "8:00 pm",
      activities: [
        { emoji: "💚", label: "Happy", bgColor: "green" },
        { emoji: "🛏️", label: "Medium sleep", bgColor: "blue" },
        { emoji: "🧘", label: "Meditation", bgColor: "purple" }
      ],
      note: "Had a great day!"
    },
    {
      date: "Tuesday, 3 December",
      mood: { emoji: "😊", label: "Great", color: "blue" },
      time: "9:30 am",
      activities: [
        { emoji: "🏃‍♂️", label: "Morning run", bgColor: "green" },
        { emoji: "☕", label: "Coffee", bgColor: "yellow" }
      ],
      note: "Feeling energized today!"
    },
    {
      date: "Wednesday, 4 December",
      mood: { emoji: "😌", label: "Relaxed", color: "purple" },
      time: "2:00 pm",
      activities: [
        { emoji: "📚", label: "Reading", bgColor: "indigo" },
        { emoji: "🍵", label: "Tea time", bgColor: "green" }
      ],
      note: "Taking it easy today."
    },
    {
      date: "Thursday, 5 December",
      mood: { emoji: "🤔", label: "Thoughtful", color: "yellow" },
      time: "11:00 am",
      activities: [
        { emoji: "💻", label: "Coding", bgColor: "blue" },
        { emoji: "🎵", label: "Music", bgColor: "pink" }
      ],
      note: "Working on a new project."
    },
    {
      date: "Friday, 6 December",
      mood: { emoji: "🥳", label: "Excited", color: "red" },
      time: "6:00 pm",
      activities: [
        { emoji: "🍽️", label: "Dinner out", bgColor: "orange" },
        { emoji: "🎉", label: "Party", bgColor: "purple" }
      ],
      note: "TGIF! Ready for the weekend!"
    }
  ]

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : inputs.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < inputs.length - 1 ? prevIndex + 1 : 0))
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {inputs.map((input, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="bg-white rounded-3xl pr-6 pl-6 transition-shadow duration-300">
                {/* Date Section */}
                <div className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wide">
                  {input.date}
                </div>

                {/* Mood Section */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-full bg-${input.mood.color}-100 flex justify-center items-center text-2xl shadow-inner`}>
                    {input.mood.emoji}
                  </div>
                  <div>
                    <span className={`text-${input.mood.color}-500 font-bold text-xl`}>{input.mood.label}</span>
                    <span className="text-slate-400 text-sm ml-2">{input.time}</span>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="text-slate-600 text-sm flex flex-wrap gap-4 mb-6">
                  {input.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className={`flex items-center space-x-2 bg-${activity.bgColor}-50 px-3 py-1 rounded-full`}>
                      <span className="text-lg">{activity.emoji}</span>
                      <span className="font-medium">{activity.label}</span>
                    </div>
                  ))}
                </div>

                {/* Note Section */}
                <div className="text-slate-600 text-sm bg-gray-50 p-3 rounded-xl italic">
                  "{input.note}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Previous input"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Next input"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>

      {/* Input Counter */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4 text-sm text-gray-500">
        {currentIndex + 1} / {inputs.length}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-8 flex space-x-2 p-6">
        {inputs.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HorizontalScrollInputCard

