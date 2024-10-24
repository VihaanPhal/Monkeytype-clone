"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const words = [
  "the",
  "be",
  "of",
  "and",
  "a",
  "to",
  "in",
  "he",
  "have",
  "it",
  "that",
  "for",
  "they",
  "with",
  "as",
  "not",
  "on",
  "she",
  "at",
  "by",
  "this",
  "we",
  "you",
  "do",
  "but",
  "from",
  "or",
  "which",
  "one",
  "would",
  "all",
  "will",
  "there",
  "say",
  "who",
  "make",
  "when",
  "can",
  "more",
  "if",
  "no",
  "man",
  "out",
  "other",
  "so",
  "what",
  "time",
  "up",
  "go",
  "about",
  "than",
  "into",
  "could",
  "state",
  "only",
  "new",
  "year",
  "some",
  "take",
  "come",
  "these",
  "know",
  "see",
  "use",
  "get",
  "like",
  "then",
  "first",
  "any",
  "work",
  "now",
  "may",
  "such",
  "give",
  "over",
  "think",
  "most",
  "even",
  "find",
  "day",
  "also",
  "after",
  "way",
  "many",
  "must",
  "look",
  "before",
  "great",
  "back",
  "through",
  "long",
  "where",
  "much",
  "should",
  "well",
  "people",
  "down",
  "own",
  "just",
  "because",
  "good",
  "each",
  "those",
  "feel",
  "seem",
  "how",
  "high",
  "too",
  "place",
  "little",
  "world",
  "very",
  "still",
  "nation",
  "hand",
  "life",
];

const themes = {
  light: "bg-white text-black",
  dark: "bg-zinc-900 text-zinc-300",
  sepia: "bg-[#f4ecd8] text-[#433422]",
} as const;

type MonkeyTypeCloneProps = {
  initialTheme: "light" | "dark";
  initialTestDuration: number;
};

export default function MonkeyTypeClone({
  initialTheme,
  initialTestDuration,
}: MonkeyTypeCloneProps) {
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [testDuration, setTestDuration] = useState(initialTestDuration);
  const [timeLeft, setTimeLeft] = useState(initialTestDuration);
  const [testActive, setTestActive] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wpmData, setWpmData] = useState<{ time: number; wpm: number }[]>([]);
  const [theme, setTheme] = useState<keyof typeof themes>(initialTheme);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  const generateWords = useCallback((count: number) => {
    return Array(count)
      .fill(null)
      .map(() => words[Math.floor(Math.random() * words.length)]);
  }, []);

  const addMoreWords = useCallback(() => {
    setCurrentWords((prevWords) => [...prevWords, ...generateWords(50)]);
  }, [generateWords]);

  useEffect(() => {
    setCurrentWords(generateWords(100));
    setTypedChars([]);
  }, [generateWords]);

  useEffect(() => {
    if (testActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testActive, timeLeft]);

  useEffect(() => {
    if (wordIndex > currentWords.length - 20) {
      addMoreWords();
    }
  }, [wordIndex, currentWords.length, addMoreWords]);

  const startTest = () => {
    setTestActive(true);
    setTimeLeft(testDuration);
    setWordIndex(0);
    setCharIndex(0);
    setTypedChars([]);
    setMistakes(0);
    setWpmData([]);
    setTestCompleted(false);
    setCurrentWords(generateWords(100));
    if (inputRef.current) inputRef.current.focus();
  };

  const endTest = () => {
    setTestActive(false);
    setTestCompleted(true);
    calculateResults();
  };

  const calculateResults = () => {
    const totalChars = typedChars.filter((char) => char !== "").length;
    const calculatedWpm = Math.round(totalChars / 5 / (testDuration / 60));
    setWpm(calculatedWpm);
    const calculatedAccuracy =
      totalChars > 0
        ? Math.round(((totalChars - mistakes) / totalChars) * 100)
        : 100;
    setAccuracy(calculatedAccuracy);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!testActive) {
      startTest();
    }

    if (e.key === " ") {
      e.preventDefault();
      if (charIndex === currentWords[wordIndex].length) {
        setWordIndex(wordIndex + 1);
        setCharIndex(0);
        scrollWordsIfNeeded();
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (charIndex > 0) {
        const newTypedChars = [...typedChars];
        newTypedChars[getAbsoluteIndex() - 1] = "";
        setTypedChars(newTypedChars);
        setCharIndex(charIndex - 1);
      } else if (wordIndex > 0) {
        setWordIndex(wordIndex - 1);
        setCharIndex(currentWords[wordIndex - 1].length);
      }
    } else if (e.key.length === 1) {
      e.preventDefault();
      const newTypedChars = [...typedChars];
      newTypedChars[getAbsoluteIndex()] = e.key;
      setTypedChars(newTypedChars);
      if (e.key !== currentWords[wordIndex][charIndex]) {
        setMistakes(mistakes + 1);
      }
      if (charIndex === currentWords[wordIndex].length - 1) {
        setWordIndex(wordIndex + 1);
        setCharIndex(0);
        scrollWordsIfNeeded();
      } else {
        setCharIndex(charIndex + 1);
      }

      // Update WPM data
      const elapsedTime = testDuration - timeLeft;
      const wordsTyped = typedChars.filter((char) => char !== "").length / 5;
      const currentWpm = Math.round((wordsTyped / elapsedTime) * 60);
      setWpmData([...wpmData, { time: elapsedTime, wpm: currentWpm }]);
    }
  };

  const getAbsoluteIndex = () => {
    return (
      currentWords.slice(0, wordIndex).join(" ").length + charIndex + wordIndex
    );
  };

  const scrollWordsIfNeeded = () => {
    if (wordsContainerRef.current) {
      const wordElements = wordsContainerRef.current.children;
      if (wordElements[wordIndex]) {
        wordElements[wordIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const renderWord = (word: string, wordIdx: number) => {
    const isActive = wordIdx === wordIndex;
    const startIndex =
      currentWords.slice(0, wordIdx).join(" ").length + wordIdx;

    return (
      <span
        key={wordIdx}
        className={`inline-block mr-2 ${isActive ? "bg-primary/20" : ""}`}
      >
        {word.split("").map((char, idx) => {
          const absoluteIndex = startIndex + idx;
          const typedChar = typedChars[absoluteIndex];
          let className = "";

          if (typedChar !== undefined) {
            className =
              typedChar === char ? "text-emerald-500" : "text-red-500";
          } else {
            className = "text-muted-foreground";
          }

          if (isActive && idx === charIndex) {
            className += " border-l-2 border-primary animate-pulse";
          }

          return (
            <span key={idx} className={className}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Typing Test</h2>
        <div className="flex items-center space-x-4">
          <Select
            value={testDuration.toString()}
            onValueChange={(value) => setTestDuration(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Test Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="120">120 seconds</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={theme}
            onValueChange={(value) => setTheme(value as keyof typeof themes)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(themes).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!testCompleted ? (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-2xl mb-4 font-mono">
              Time left: {timeLeft}s
            </div>
            <div
              ref={wordsContainerRef}
              className="text-2xl mb-8 leading-relaxed h-40 overflow-y-auto font-mono"
            >
              {currentWords.map(renderWord)}
            </div>
            <input
              ref={inputRef}
              type="text"
              className="w-full p-4 text-xl bg-transparent border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono opacity-0"
              autoFocus
              onKeyDown={handleKeyDown}
            />
            {!testActive && (
              <div className="text-center text-xl mt-4">
                Start typing to begin the test
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Here's how you performed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <p className="text-3xl font-bold">{wpm}</p>
                    <p className="text-sm text-muted-foreground">WPM</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{accuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {typedChars.filter((char) => char !== "").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Characters</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{mistakes}</p>
                    <p className="text-sm text-muted-foreground">Mistakes</p>
                  </div>
                </div>
                <div className="h-64 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wpmData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        label={{
                          value: "Time (seconds)",
                          position: "insideBottom",
                          offset: -10,
                        }}
                      />
                      <YAxis
                        label={{
                          value: "WPM",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <Button onClick={startTest} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
