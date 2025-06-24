'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      // total users
      // const { data: usersData, error: usersError } = await supabase
      //   .from("Users")
      //   .select("*", { count: "exact", head: true }); 

      // // total users yang aktif
      // const { data: onlineData, error: onlineError } = await supabase
      //   .from("Users")
      //   .select("last_sign_in_at");

      // const now = new Date();
      // const onlineCount = (onlineData || []).filter((user) => {
      //   const lastSignIn = new Date(user.last_sign_in_at);
      //   const diffMinutes = (now.getTime() - lastSignIn.getTime()) / 1000 / 60;
      //   return diffMinutes < 10;
      // }).length;

      // total review yang ada
      const { count: reviewsCount, error: reviewError } = await supabase
        .from("review")
        .select("*", { count: "exact", head: true });

      // setTotalUsers(usersData?.length || 0);
      // setOnlineUsers(onlineCount);
      setTotalReviews(reviewsCount || 0);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers || 10}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Online Users</p>
          <p className="text-2xl font-bold">{onlineUsers || 2}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Reviews</p>
          <p className="text-2xl font-bold">{totalReviews}</p>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-800 pb-4">
            <p>New review posted for "Song Title"</p>
            <p className="text-sm text-gray-400">2 hours ago</p>
          </div>
          
          <div className="border-b border-gray-800 pb-4">
            <p>New user registered: user@example.com</p>
            <p className="text-sm text-gray-400">5 hours ago</p>
          </div>
          
          <div className="pb-4">
            <p>New playlist created: "Summer Vibes"</p>
            <p className="text-sm text-gray-400">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}