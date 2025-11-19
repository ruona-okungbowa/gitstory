"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  languages: Record<string, number>;
  complexity_score?: number;
  analysed_at?: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Fetch projects from database
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  async function fetchProjects() {
    try {
      setLoading(true);
      // You'll need to create this API route
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function syncWithGitHub() {
    try {
      setSyncing(true);
      const response = await fetch("/api/github/repos");
      const data = await response.json();

      if (response.ok) {
        // Refresh projects list
        await fetchProjects();
        alert(`Synced ${data.count} repositories!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error syncing:", error);
      alert("Failed to sync with GitHub");
    } finally {
      setSyncing(false);
    }
  }

  async function analyseProject(projectId: string) {
    try {
      const response = await fetch(`/api/github/analyse/${projectId}`, {
        method: "POST",
      });

      if (response.ok) {
        // Refresh projects to show updated score
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error analysing project:", error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button
          onClick={syncWithGitHub}
          disabled={syncing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync with GitHub"}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No projects found</p>
          <button
            onClick={syncWithGitHub}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Import from GitHub
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onAnalyse={() => analyseProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  onAnalyse,
}: {
  project: Project;
  onAnalyse: () => void;
}) {
  const [analysing, setAnalysing] = useState(false);

  async function handleAnalyse() {
    setAnalysing(true);
    await onAnalyse();
    setAnalysing(false);
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Project Name */}
      <h3 className="text-xl font-semibold mb-2">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600"
        >
          {project.name}
        </a>
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description || "No description"}
      </p>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-500 mb-4">
        <span>⭐ {project.stars}</span>
        <span>🔀 {project.forks}</span>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(project.languages || {})
          .slice(0, 3)
          .map(([lang, percent]) => (
            <span
              key={lang}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {lang} {Math.round(percent)}%
            </span>
          ))}
      </div>

      {/* Complexity Score */}
      {project.complexity_score !== undefined ? (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Complexity Score</div>
          <div className="text-2xl font-bold text-blue-600">
            {project.complexity_score}/100
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAnalyse}
          disabled={analysing}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {analysing ? "Analysing..." : "Analyse"}
        </button>
        <Link
          href={`/projects/${project.id}`}
          className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-center text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
