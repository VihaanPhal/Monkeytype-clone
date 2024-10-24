"use client";

import React, { useState } from "react";
import {
  Moon,
  Sun,
  Settings,
  User,
  BarChart,
  Info,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MonkeyTypeClone from "./homepage";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showTest, setShowTest] = useState(false);
  const [testType, setTestType] = useState("time");
  const [testDuration, setTestDuration] = useState("30");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const startTest = () => {
    setShowTest(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "light"
          ? "bg-white text-zinc-900"
          : "bg-zinc-900 text-zinc-100"
      }`}
    >
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showTest ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTest(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold">monkeytype</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {showTest ? (
          <MonkeyTypeClone
            initialTheme={theme}
            initialTestDuration={parseInt(testDuration)}
          />
        ) : (
          <div className="w-full max-w-3xl space-y-8">
            <div className="flex justify-center space-x-4">
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">time</SelectItem>
                  <SelectItem value="words">words</SelectItem>
                  <SelectItem value="quote">quote</SelectItem>
                  <SelectItem value="zen">zen</SelectItem>
                  <SelectItem value="custom">custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={testDuration} onValueChange={setTestDuration}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Test length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="60">60</SelectItem>
                  <SelectItem value="120">120</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-center space-y-4">
              <p className="text-6xl font-mono">monkey see</p>
              <p className="text-3xl text-zinc-500 font-mono">monkey type</p>
            </div>

            <div className="text-center">
              <p className="text-lg">
                The most customizable typing test in the world
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={startTest}
              >
                Start Test
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">
            about
          </a>
          <a href="#" className="hover:underline">
            contact
          </a>
          <a href="#" className="hover:underline">
            privacy
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <BarChart className="h-5 w-5" />
          <span>1,234,567 tests completed</span>
        </div>
      </footer>
    </div>
  );
}
