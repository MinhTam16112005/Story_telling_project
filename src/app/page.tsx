"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const user = searchParams.get("username");
    if (user) {
      setUsername(user);
    }
  }, [searchParams]);

  const handleSignOut = () => {
    setUsername("");
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)] bg-white text-black">
      <header className="mb-16">
        <div className="text-right mb-4">
          {!username ? (
            <>
              <Link href="/login">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <>
              <span className="mr-4 text-xl">Welcome, {username}!</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign out
              </button>
            </>
          )}
        </div>
        <h1 className="text-4xl font-bold text-center">Welcome to the world of Stories</h1>
      </header>

      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((game) => (
            <Link href={`/game/${game}`} key={game} className="block">
              <div className="relative transition-transform duration-300 transform hover:scale-105">
                <Image
                  src={`/game${game}.jpg`} // Make sure these images exist
                  alt={`Game ${game}`}
                  width={400} // Set the same width and height as MainPage
                  height={400} // Set height as in MainPage
                  className="w-full h-64 object-cover" // Ensuring it matches the format of MainPage
                />
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
