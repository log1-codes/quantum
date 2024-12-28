import React from 'react';

const CircularProgress = ({ total, easy, medium, hard }) => {
  const easyPercentage = (easy / total) * 100;
  const mediumPercentage = (medium / total) * 100;
  const hardPercentage = (hard / total) * 100;

  // Determine the highest percentage and its corresponding color
  const segments = [
    { percentage: easyPercentage, color: 'text-green-300' },
    { percentage: mediumPercentage, color: 'text-yellow-300' },
    { percentage: hardPercentage, color: 'text-red-300' },
  ];

  // Sort segments by percentage in descending order
  segments.sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="relative bg-gray-800 w-32 h-32 rounded-full flex items-center justify-center">
      <svg className="absolute inset-0" viewBox="0 0 36 36">
        {segments.map((segment, index) => (
          <path
            key={index}
            className={segment.color}
            strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
            d="M18 2 A16 16 0 1 1 18 34 A16 16 0 1 1 18 2"
            fill="none"
            strokeWidth="3"
            transform={`rotate(${index * -90} 18 18)`} // Rotate based on index
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-lg font-bold">{total}</span> {/* Text color set to white */}
      </div>
    </div>
  );
};

export default CircularProgress;