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
        const gameDatas = {
          "1": {
            "title": "Escape the Mysterious House",
            "nodes": {
              "start": {
                "content": "You find yourself in the basement of an unfamiliar house. The air is musty, and you can't remember how you got here. You need to find a way out...",
                "choices": [
                  {"text": "Go upstairs", "next": "hallway"},
                  {"text": "Enter the storage room", "next": "storage_room"},
                  {"text": "Check the utility room", "next": "utility_room"}
                ]
              },
              "hallway": {
                "content": "You climb the creaky stairs, emerging into a dimly lit hallway. There are several doors and a continuation of the staircase leading up.",
                "choices": [
                  {"text": "Go to the living room", "next": "living_room"},
                  {"text": "Check the kitchen", "next": "kitchen"},
                  {"text": "Climb to the second floor", "next": "upper_hallway"},
                  {"text": "Go back to the basement", "next": "start"}
                ]
              },
              "storage_room": {
                "content": "The storage room is filled with dusty shelves and old boxes. You spot a small window, but it's too high to reach.",
                "choices": [
                  {"text": "Search the boxes", "next": "storage_room_search"},
                  {"text": "Return to the basement", "next": "start"}
                ]
              },
              "storage_room_search": {
                "content": "You find an old flashlight in one of the boxes. It might come in handy.",
                "choices": [
                  {"text": "Take the flashlight and return to the basement", "next": "start"}
                ]
              },
              "utility_room": {
                "content": "The utility room is dark and filled with various pipes and machinery. You can hear a faint humming sound.",
                "choices": [
                  {"text": "Investigate the humming sound", "next": "utility_room_fuse_box"},
                  {"text": "Return to the basement", "next": "start"}
                ]
              },
              "utility_room_fuse_box": {
                "content": "You find a fuse box. One of the switches is labeled 'Main Floor Lights'.",
                "choices": [
                  {"text": "Flip the switch", "next": "hallway"},
                  {"text": "Leave it alone and return to the basement", "next": "start"}
                ]
              },
              "living_room": {
                "content": "You enter a spacious living room with antique furniture. A large painting on the wall seems oddly out of place.",
                "choices": [
                  {"text": "Examine the painting", "next": "living_room_painting"},
                  {"text": "Look out the window", "next": "living_room_window"},
                  {"text": "Return to the hallway", "next": "hallway"}
                ]
              },
              "living_room_painting": {
                "content": "As you examine the painting, you notice it's slightly askew. Behind it, you find a safe embedded in the wall!",
                "choices": [
                  {"text": "Try to open the safe", "next": "safe_puzzle"},
                  {"text": "Leave the painting alone", "next": "living_room"}
                ]
              },
              "living_room_window": {
                "content": "You look out the window and see a well-maintained garden. The front gate seems to be locked.",
                "choices": [
                  {"text": "Return to the living room", "next": "living_room"}
                ]
              },
              "kitchen": {
                "content": "The kitchen is surprisingly modern compared to the rest of the house. A faint beeping sound comes from one of the cabinets.",
                "choices": [
                  {"text": "Investigate the beeping", "next": "kitchen_beeping"},
                  {"text": "Check the refrigerator", "next": "kitchen_fridge"},
                  {"text": "Go back to the hallway", "next": "hallway"}
                ]
              },
              "kitchen_beeping": {
                "content": "You open the cabinet and find an old digital clock. The display shows four blinking numbers: 5-2-8-9.",
                "choices": [
                  {"text": "Remember the numbers and close the cabinet", "next": "kitchen"}
                ]
              },
              "kitchen_fridge": {
                "content": "The refrigerator is empty except for a single bottle of water.",
                "choices": [
                  {"text": "Take the water and return to the kitchen", "next": "kitchen"}
                ]
              },
              "upper_hallway": {
                "content": "The upper hallway has several closed doors and a small table with a vase.",
                "choices": [
                  {"text": "Enter the master bedroom", "next": "master_bedroom"},
                  {"text": "Check the bathroom", "next": "bathroom"},
                  {"text": "Go back downstairs", "next": "hallway"}
                ]
              },
              "master_bedroom": {
                "content": "The master bedroom is luxurious but seems untouched. A large wardrobe dominates one wall.",
                "choices": [
                  {"text": "Open the wardrobe", "next": "master_bedroom_wardrobe"},
                  {"text": "Look under the bed", "next": "master_bedroom_bed"},
                  {"text": "Return to the upper hallway", "next": "upper_hallway"}
                ]
              },
              "master_bedroom_wardrobe": {
                "content": "The wardrobe is filled with old-fashioned clothes. Nothing seems useful.",
                "choices": [
                  {"text": "Close the wardrobe and return to the bedroom", "next": "master_bedroom"}
                ]
              },
              "master_bedroom_bed": {
                "content": "You find a dusty notebook under the bed. It seems to contain some kind of diary entries.",
                "choices": [
                  {"text": "Read the diary", "next": "master_bedroom_diary"},
                  {"text": "Leave it and return to the bedroom", "next": "master_bedroom"}
                ]
              },
              "master_bedroom_diary": {
                "content": "The last entry mentions something about 'the old clock in the kitchen holding the key to escape'.",
                "choices": [
                  {"text": "Return to the bedroom", "next": "master_bedroom"}
                ]
              },
              "bathroom": {
                "content": "The bathroom is pristine. An ornate mirror hangs above the sink, and the shower curtain is drawn.",
                "choices": [
                  {"text": "Look in the mirror", "next": "bathroom_mirror"},
                  {"text": "Check behind the shower curtain", "next": "bathroom_shower"},
                  {"text": "Go back to the upper hallway", "next": "upper_hallway"}
                ]
              },
              "bathroom_mirror": {
                "content": "As you look in the mirror, you notice a small key taped to the back of the mirror frame.",
                "choices": [
                  {"text": "Take the key and return to the bathroom", "next": "bathroom"}
                ]
              },
              "bathroom_shower": {
                "content": "There's nothing unusual behind the shower curtain.",
                "choices": [
                  {"text": "Return to the bathroom", "next": "bathroom"}
                ]
              },
              "safe_puzzle": {
                "content": "The safe requires a 4-digit code. You need to enter the correct combination to open it.",
                "choices": [
                  {"text": "Enter the code 5289", "next": "safe_open"},
                  {"text": "Try a different combination", "next": "safe_puzzle"},
                  {"text": "Give up and return to the living room", "next": "living_room"}
                ]
              },
              "safe_open": {
                "content": "The safe clicks open! Inside, you find a key with a tag that reads 'Front Door'.",
                "choices": [
                  {"text": "Take the key and go to the front door", "next": "front_door"},
                  {"text": "Explore more of the house", "next": "hallway"}
                ]
              },
              "front_door": {
                "content": "You stand before the front door, key in hand. This might be your way out!",
                "choices": [
                  {"text": "Use the key and open the door", "next": "escape"},
                  {"text": "Have second thoughts and explore more", "next": "hallway"}
                ]
              },
              "escape": {
                "content": "The key fits! You turn it, open the door, and step out into the fresh air. You've escaped the mysterious house!",
                "choices": [
                  {"text": "Restart the adventure", "next": "start"}
                ]
              }
            }
          }
        };
        const gameData = gameDatas[1];
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
