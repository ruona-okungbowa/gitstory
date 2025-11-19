"use client";

import { useAuth } from "@/lib/auth/AuthProvider";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8">Please log in</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.user_metadata.user_name}!</p>
      <p className="text-gray-600">Email: {user.email}</p>
    </div>
  );
}
