"use client";

import { useEffect, useState } from "react";

interface ScoreData {
  overallScore: number;
  projectQualityScore: number;
  techDiversityScore: number;
  documentationScore: number;
  consistencyScore: number;
  breakdown: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

export default function PortfolioScoreCard() {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, []);

  async function fetchScore() {
    try {
      setLoading(true);
      const response = await fetch("/api/analysis/portfolio-score");
      const data = await response.json();
      setScoreData(data);
    } catch (error) {
      console.error("Error fetching portfolio score:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Failed to load portfolio score</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      {/* Overall Score */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Portfolio Score
        </h2>
        <div className="relative inline-flex items-center justify-center w-32 h-32">
          {/* Circular progress */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - scoreData.overallScore / 100)}`}
              className={`${getScoreColour(scoreData.overallScore)} transition-all duration-1000`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute">
            <span className="text-4xl font-bold">{scoreData.overallScore}</span>
            <span className="text-gray-500">/100</span>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-3 mb-6">
        <ScoreBar
          label="Project Quality"
          score={scoreData.projectQualityScore}
        />
        <ScoreBar label="Tech Diversity" score={scoreData.techDiversityScore} />
        <ScoreBar label="Documentation" score={scoreData.documentationScore} />
        <ScoreBar label="Consistency" score={scoreData.consistencyScore} />
      </div>

      {/* Feedback */}
      <div className="space-y-4">
        {scoreData.breakdown.strengths.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-green-700 mb-2">
              ✓ Strengths
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {scoreData.breakdown.strengths.map((strength, i) => (
                <li key={i}>• {strength}</li>
              ))}
            </ul>
          </div>
        )}

        {scoreData.breakdown.suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-blue-700 mb-2">
              💡 Suggestions
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {scoreData.breakdown.suggestions.map((suggestion, i) => (
                <li key={i}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchScore}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      >
        Recalculate Score
      </button>
    </div>
  );
}

// Score bar component
function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getScoreColour(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// Helper function for score colours
function getScoreColour(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}
