"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const user = searchParams.get("username");
    if (user) {
      setUsername(user);
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleSignOut = () => {
    setUsername("");
    router.push("/");
  };

  return (
    <div className="min-h-screen moving-gradient p-8 text-gray-800">
      <header className="mb-16">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-700">Welcome, {username}!</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
          >
            Sign out
          </button>
        </div>
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-12">
          Welcome to your dashboard, {username}
        </h2>
      </header>

      {/* Main content - Games section */}
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((game) => (
            <Link href={`/game/${game}`} key={game} className="block">
              <div className="relative transition-transform duration-300 transform hover:scale-105">
                <Image
                  src={`/game${game}.jpg`} // Make sure these images exist
                  alt={`Game ${game}`}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                {/* Move the text below the image */}
                <p className="text-center text-xl font-bold text-white bg-black bg-opacity-60 p-2 rounded-lg mx-4 mt-2">
                  Game {game}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-600">
        <p>&copy; 2023 Story World. All rights reserved.</p>
      </footer>
    </div>
  );
}