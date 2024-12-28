"use client"; // Marking this file as a Client Component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/myComponents/Navbar";
import Bargraph from "@/myComponents/Bargraph";
import Piechart from "@/myComponents/Piechart";
import Areachart1 from "@/myComponents/Areachart";
import Radialchart from "@/myComponents/Radialchart"
import FinalScore from "@/myComponents/FinalScore";
import MoodCounter from "@/myComponents/Moodcounter";

import EverydayInputCard from "@/myComponents/HorizontalScrollInputCard";

function Page() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", { method: "GET" });

        // Check if the status is 401 (Unauthorized)
        if (response.status === 401) {
          console.warn("Unauthorized access: Redirecting to /auth/login");
          router.push("/auth/login");
          return;
        }

        // Check for other non-successful statuses
        if (!response.ok) {
          console.error("Unexpected response:", await response.text());
          router.push("/auth/login");
          return;
        }

        const data = await response.json();

        if (data.username) {
          setUsername(data.username);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false); // Stop loading once fetch is complete
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        console.error("Logout error:", errorData.error);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="loader border-t-4 border-violet-500 rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen px-8 gap-4 flex flex-col">
      {/* Navbar */}
      <div className="pt-4">
        <div className="rounded-full bg-white">
          <Navbar />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 bg-slate-100 rounded-3xl gap-4 p-4 flex-1">
        {/* Left Column */}
        <div className="bg-white rounded-3xl p-4 flex flex-col col-span-5 shadow-md">
          {/* Greeting Section */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-800">
              Good Morning, <span className="text-violet-700">{username}</span>
            </h1>
            <p className="text-slate-600">
              Here’s a quick summary of your stats:
            </p>
          </div>

          {/* Bargraph */}
          <div className=" flex items-end justify-center">
            <div className="w-full">
              <Bargraph />
            </div>
          </div>
          <div >
          <MoodCounter/>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Piechart */}
            <div className="col-span-4 bg-white rounded-3xl p-4 px-0 flex items-start justify-center shadow-md">
              <Piechart />
            </div>

            {/* Areachart */}
            <div className="col-span-8 bg-white rounded-3xl p-4 flex items-start justify-center shadow-md">
              <Areachart1 />
            </div>
          </div>

          {/* Placeholder for Additional Components */}
          <div className=" rounded-3xl grid grid-cols-3 h-full gap-4">
            {/* Add more graphs or components here */}
            {/* Everyday input card */}
            <div className="col-span-2 bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
             <EverydayInputCard/>
            </div>

            <div className="col-span-1 bg-white rounded-3xl p-4 flex items-start justify-center shadow-md">
           <div>
            <FinalScore/>
           </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
