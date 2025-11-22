"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  alpha,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "@/lib/auth/AuthProvider";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProjectCard from "@/components/ProjectCard";
import PortfolioScoreDisplay from "@/components/PortfolioScoreDisplay";
import ProjectsEmptyState from "@/components/ProjectsEmptyState";
import SyncButton from "@/components/SyncButton";

const drawerWidth = 280;
const collapsedWidth = 80;

interface Project {
  id: number;
  name: string;
  language: string;
  stars: number;
  description: string | null;
  lastUpdated: string;
  url: string;
}

interface PortfolioScore {
  overall: number;
  breakdown: {
    projectQuality: number;
    techDiversity: number;
    documentation: number;
    consistency: number;
  };
  tips: string[];
  trend?: "up" | "down" | "flat";
  previousScore?: number;
  percentile?: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioScore, setPortfolioScore] = useState<PortfolioScore | null>(
    null
  );
  const [syncing, setSyncing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Load existing projects and portfolio score on component mount
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user) return;

      try {
        setInitialLoading(true);

        // Fetch existing projects from database
        const projectsResponse = await fetch("/api/projects");
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();

          // Transform projects to match component state
          const transformedProjects = projectsData.projects.map(
            (project: {
              id: number;
              name: string;
              description: string | null;
              languages: Record<string, number>;
              stars: number;
              last_commit_date: string;
              url: string;
            }) => ({
              id: project.id,
              name: project.name,
              description: project.description,
              language: Object.keys(project.languages || {})[0] || "Unknown",
              stars: project.stars || 0,
              lastUpdated: project.last_commit_date,
              url: project.url,
            })
          );

          setProjects(transformedProjects);

          // If we have projects, also load the portfolio score
          if (transformedProjects.length > 0) {
            const scoreResponse = await fetch("/api/analysis/portfolio-score");
            if (scoreResponse.ok) {
              const scoreData = await scoreResponse.json();
              setPortfolioScore({
                overall: Math.round(scoreData.overallScore),
                breakdown: {
                  projectQuality: Math.round(
                    scoreData.projectQualityScore || 0
                  ),
                  techDiversity: Math.round(scoreData.techDiversityScore || 0),
                  documentation: Math.round(scoreData.documentationScore || 0),
                  consistency: Math.round(scoreData.consistencyScore || 0),
                },
                tips: [
                  "Add detailed README files to improve documentation score",
                  "Diversify your tech stack with different languages",
                  "Increase project activity with regular commits",
                  "Add comprehensive project descriptions",
                ],
                trend: "up",
                previousScore: Math.round(scoreData.overallScore) - 5,
                percentile: 68,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading existing data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadExistingData();
  }, [user]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Fetch repos from GitHub and store in database
      const reposResponse = await fetch("/api/github/repos");
      if (!reposResponse.ok) {
        throw new Error("Failed to sync repositories");
      }
      await reposResponse.json();

      // Fetch stored projects from database
      const projectsResponse = await fetch("/api/projects");
      if (!projectsResponse.ok) {
        throw new Error("Failed to fetch projects");
      }
      const projectsData = await projectsResponse.json();

      // Transform projects to match component state
      const transformedProjects = projectsData.projects.map(
        (project: {
          id: number;
          name: string;
          languages: Record<string, number>;
          stars: number;
        }) => ({
          id: project.id,
          name: project.name,
          language: Object.keys(project.languages || {})[0] || "Unknown",
          stars: project.stars || 0,
        })
      );

      setProjects(transformedProjects);

      // Calculate portfolio score
      const scoreResponse = await fetch("/api/analysis/portfolio-score");
      if (scoreResponse.ok) {
        const scoreData = await scoreResponse.json();
        setPortfolioScore({
          overall: Math.round(scoreData.overallScore),
          breakdown: {
            projectQuality: Math.round(scoreData.projectQualityScore || 0),
            techDiversity: Math.round(scoreData.techDiversityScore || 0),
            documentation: Math.round(scoreData.documentationScore || 0),
            consistency: Math.round(scoreData.consistencyScore || 0),
          },
          tips: [
            "Add detailed README files to improve documentation score",
            "Diversify your tech stack with different languages",
            "Increase project activity with regular commits",
            "Add comprehensive project descriptions",
          ],
          trend: "up",
          previousScore: Math.round(scoreData.overallScore) - 5,
          percentile: 68,
        });
      }
    } catch (error) {
      console.error("Error syncing:", error);
      alert("Failed to sync repositories. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#0a0a0a",
        }}
      >
        <CircularProgress sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#0a0a0a",
        }}
      >
        <Typography variant="h5" color="#e0e0e0">
          Please log in
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0a0a0a" }}>
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          display: { sm: "none" },
          bgcolor: alpha("#2a2a2a", 0.9),
          color: "#667eea",
          "&:hover": { bgcolor: alpha("#2a2a2a", 1) },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Side Navigation */}
      <DashboardSidebar
        user={user}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        onLogout={handleLogout}
        drawerWidth={drawerWidth}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        collapsedWidth={collapsedWidth}
        currentPath={pathname}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: {
            sm: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          },
          mt: { xs: 8, sm: 0 },
          transition: "width 0.3s ease",
        }}
      >
        {/* Header with Portfolio Score */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#ffffff",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Your Projects
          </Typography>

          {portfolioScore && (
            <PortfolioScoreDisplay portfolioScore={portfolioScore} />
          )}
        </Box>

        {/* Sync Button */}
        <Box sx={{ mb: 4 }}>
          <SyncButton
            onSync={handleSync}
            syncing={syncing}
            hasProjects={projects.length > 0}
          />
        </Box>

        {/* Projects Grid or Empty State */}
        {projects.length === 0 ? (
          <ProjectsEmptyState onSync={handleSync} syncing={syncing} />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
