"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Define types for choices and story nodes
type Choice = {
  text: string;
  next: string;
};

type StoryNode = {
  content: string;
  choices: Choice[];
};

type GameState = {
  title: string;
  currentNode: string;
  nodes: Record<string, StoryNode>;
  history: string[];
};

export default function Page({ params }: { params: { id: string } }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [displayedText, setDisplayedText] = useState<string>(""); // For the typing effect
  const storyBoxRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Keeps track of typing progress

  // Fetch the story data when the page loads
  useEffect(() => {
    fetch("/storyData.json")
      .then((response) => response.json())
      .then((data) => {
        const gameData = data[params.id];
        setGameState({
          title: gameData.title,
          currentNode: "start",
          nodes: gameData.nodes,
          history: [gameData.nodes.start.content],
        });
      });
  }, [params.id]);

  // Typing effect for displaying text smoothly
  useEffect(() => {
    if (gameState && currentIndex < gameState.history.length) {
      const text = gameState.history[currentIndex];
      let charIndex = 0;
      let currentText = "";

      const typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          currentText += text[charIndex];
          setDisplayedText(currentText); // Append characters
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 30); // Adjust the speed (30ms per character)

      return () => clearInterval(typingInterval); // Clear interval when the effect is done
    }
  }, [gameState, currentIndex]);

  // Scrolls the story box to the bottom whenever new content is added
  useEffect(() => {
    if (storyBoxRef.current) {
      storyBoxRef.current.scrollTop = storyBoxRef.current.scrollHeight;
    }
  }, [gameState?.history]);

  // Handle user choice and update the game state
  const handleChoice = (choice: Choice) => {
    if (!gameState) return;
    const newNode = gameState.nodes[choice.next];
    setGameState((prevState) => ({
      ...prevState!,
      currentNode: choice.next,
      history: [...prevState!.history, newNode.content],
    }));
    setCurrentIndex((prev) => prev + 1); // Move to the next text
  };

  if (!gameState) return <div>Loading...</div>;

  const currentNode = gameState.nodes[gameState.currentNode];

  return (
    <div className="min-h-screen p-8 bg-white text-black flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">{gameState.title}</h1>

      {/* Story content with typing effect */}
      <div
        ref={storyBoxRef}
        className="w-3/5 bg-gray-100 p-6 rounded-lg shadow-md mb-8 whitespace-pre-wrap overflow-y-auto max-h-[70vh]"
      >
        {/* Show the previous paragraphs (dimmed) */}
        {gameState.history.slice(0, -1).map((content, index) => (
          <p key={index} className="text-lg mb-4 dimmed">
            {content}
          </p>
        ))}

        {/* Display the currently typed content (not dimmed) */}
        <p className="text-lg mb-4">{displayedText}</p>
      </div>

      {/* Choice buttons */}
      <div className="w-3/5 flex justify-between gap-4">
        {currentNode.choices.map((choice, index) => (
          <button
            key={index}
            className="flex-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => handleChoice(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>

      {/* Back to Home link */}
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
