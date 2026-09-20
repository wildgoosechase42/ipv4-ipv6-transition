'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, RotateCcw, Check } from 'lucide-react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const PRE_TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is the address size of IPv4?',
    options: ['16-bit', '32-bit', '64-bit', '128-bit'],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'Approximately how many unique addresses does IPv4 provide?',
    options: ['~4.3 million', '~4.3 billion', '~340 undecillion', 'Unlimited'],
    correctIndex: 1,
  },
  {
    id: 3,
    question: 'What is the primary reason for transitioning to IPv6?',
    options: [
      'IPv4 addresses started running out',
      'IPv4 cannot transmit text',
      'IPv4 only works with fiber optics',
      'IPv4 is restricted to 10 Mbps',
    ],
    correctIndex: 0,
  },
  {
    id: 4,
    question: 'What is the address size of IPv6?',
    options: ['32-bit', '64-bit', '128-bit', '256-bit'],
    correctIndex: 2,
  },
  {
    id: 5,
    question: 'Why can’t the entire Internet switch from IPv4 to IPv6 at once?',
    options: [
      'IPv6 is banned internationally',
      'Billions of devices and networks must coexist during migration',
      'All domain names would have to be deleted',
      'IPv6 requires quantum computers',
    ],
    correctIndex: 1,
  },
];

const POST_TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'In Dual Stack, how does a device operate?',
    options: [
      'Converts packets at every router',
      'Runs both IPv4 and IPv6 at the same time',
      'Uses only IPv4 addresses',
      'Replaces the router with a modem',
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'What is the main disadvantage of Dual Stack?',
    options: [
      'Devices must maintain both protocols, still requiring IPv4',
      'It supports only 10 devices per network',
      'It cannot load web pages',
      'Packets are discarded randomly',
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    question: 'How does Tunneling allow IPv6 to travel across an IPv4 network?',
    options: [
      'Physically replaces all router cables',
      'Puts the IPv6 packet inside an IPv4 packet',
      'Translates addresses into MAC addresses',
      'Strips the headers completely',
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: 'What is the role of Translation (such as NAT64)?',
    options: [
      'Acts like a middleman converting IPv4 into IPv6 or vice versa',
      'Encapsulates packets without header conversion',
      'Speeds up fiber optic routing',
      'Creates physical tunnels between hosts',
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: 'Which mechanism corresponds to the memory rule "IPv6 inside IPv4"?',
    options: ['Dual Stack', 'Translation', 'Tunneling', 'DNS64'],
    correctIndex: 2,
  },
];

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'pre' | 'post';
}

function SpeedometerGauge({ score, total }: { score: number; total: number }) {
  const pct = Math.max(0, Math.min(1, score / total));
  const arcLength = 235.62;
  const strokeOffset = arcLength * (1 - pct);
  const needleAngle = -90 + pct * 180;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative w-56 h-32 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="speedoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff453a" />
              <stop offset="50%" stopColor="#ff9f0a" />
              <stop offset="100%" stopColor="#30d158" />
            </linearGradient>
          </defs>

          <path
            d="M 25 105 A 75 75 0 0 1 175 105"
            fill="none"
            stroke="#27272a"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M 25 105 A 75 75 0 0 1 175 105"
            fill="none"
            stroke="url(#speedoGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />

          <text x="18" y="118" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="middle">
            0
          </text>
          <text x="182" y="118" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="middle">
            {total}
          </text>

          <line
            x1="100"
            y1="105"
            x2="100"
            y2="42"
            stroke="#f4f4f5"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${needleAngle} 100 105)`}
            style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />

          <circle cx="100" cy="105" r="6" fill="#f4f4f5" />
          <circle cx="100" cy="105" r="3" fill="#18181b" />
        </svg>
      </div>

      <div className="text-center pt-1">
        <div className="text-4xl font-black tracking-tight text-zinc-100">
          {score} / {total}
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 mt-1">
          Questions Correct
        </div>
      </div>
    </div>
  );
}

export function TestModal({ isOpen, onClose, type }: TestModalProps) {
  const questions = type === 'pre' ? PRE_TEST_QUESTIONS : POST_TEST_QUESTIONS;
  const title = type === 'pre' ? 'Pre-Test' : 'Post-Test';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const userAnswer = selectedAnswers[currentQ.id];
  const hasAnswered = userAnswer !== undefined;

  const handleSelect = (optionIdx: number) => {
    if (hasAnswered || isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              {type === 'pre' ? 'Pre-Test' : 'Post-Test'}
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="font-mono text-xs text-zinc-400">5 Questions</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isSubmitted ? (
            <>
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-zinc-300 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-5">
                <p className="text-sm sm:text-base font-medium text-zinc-100 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isUserChoice = userAnswer === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let stateStyles = 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-700 cursor-pointer';

                  if (hasAnswered) {
                    if (isCorrect) {
                      stateStyles = 'border-[#30d158]/50 bg-[#30d158]/10 text-[#30d158] font-medium cursor-default';
                    } else if (isUserChoice) {
                      stateStyles = 'border-[#ff453a]/50 bg-[#ff453a]/10 text-[#ff453a] font-medium cursor-default';
                    } else {
                      stateStyles = 'border-zinc-800/50 bg-zinc-950/20 text-zinc-500 opacity-40 cursor-default';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${stateStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md border border-zinc-700 bg-zinc-900 flex items-center justify-center font-mono text-[10px] text-zinc-400 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <Check className="w-4 h-4 text-[#30d158] shrink-0 ml-2" />
                      )}
                      {hasAnswered && isUserChoice && !isCorrect && (
                        <X className="w-4 h-4 text-[#ff453a] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-4 space-y-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-2xl p-6 flex flex-col items-center justify-center">
                <SpeedometerGauge score={score} total={questions.length} />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/40">
          {!isSubmitted ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>View Results</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
