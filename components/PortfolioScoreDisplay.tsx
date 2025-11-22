"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  alpha,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Launch,
  Description,
  Code,
  GitHub,
} from "@mui/icons-material";

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

interface PortfolioScoreDisplayProps {
  portfolioScore: PortfolioScore;
}

export default function PortfolioScoreDisplay({
  portfolioScore,
}: PortfolioScoreDisplayProps) {
  const [scoreAnchorEl, setScoreAnchorEl] = useState<HTMLElement | null>(null);

  // Convert score to letter grade
  const getLetterGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "#4caf50" };
    if (score >= 80) return { grade: "A", color: "#4caf50" };
    if (score >= 70) return { grade: "B+", color: "#8bc34a" };
    if (score >= 60) return { grade: "B", color: "#cddc39" };
    if (score >= 50) return { grade: "C+", color: "#ffc107" };
    if (score >= 40) return { grade: "C", color: "#ff9800" };
    if (score >= 30) return { grade: "D", color: "#ff5722" };
    return { grade: "F", color: "#f44336" };
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp sx={{ fontSize: 16, color: "#4caf50" }} />;
      case "down":
        return <TrendingDown sx={{ fontSize: 16, color: "#f44336" }} />;
      default:
        return <TrendingFlat sx={{ fontSize: 16, color: "#808080" }} />;
    }
  };

  const letterGrade = getLetterGrade(portfolioScore.overall);
  const previousScore = portfolioScore.previousScore || portfolioScore.overall;
  const scoreDiff = portfolioScore.overall - previousScore;

  const prioritizedMetrics = [
    {
      label: "Project Quality",
      value: portfolioScore.breakdown.projectQuality,
      color: "#667eea",
      priority:
        portfolioScore.breakdown.projectQuality < 50 ? "high" : "normal",
      action: "Improve READMEs",
      icon: <Description sx={{ fontSize: 16 }} />,
    },
    {
      label: "Documentation",
      value: portfolioScore.breakdown.documentation,
      color: "#f093fb",
      priority: portfolioScore.breakdown.documentation < 40 ? "high" : "normal",
      action: "Add Documentation",
      icon: <GitHub sx={{ fontSize: 16 }} />,
    },
    {
      label: "Tech Diversity",
      value: portfolioScore.breakdown.techDiversity,
      color: "#764ba2",
      priority: "normal",
      action: "Learn New Tech",
      icon: <Code sx={{ fontSize: 16 }} />,
    },
    {
      label: "Consistency",
      value: portfolioScore.breakdown.consistency,
      color: "#4facfe",
      priority: portfolioScore.breakdown.consistency < 30 ? "high" : "normal",
      action: "Regular Commits",
      icon: <TrendingUp sx={{ fontSize: 16 }} />,
    },
  ].sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (b.priority === "high" && a.priority !== "high") return 1;
    return a.value - b.value; // Sort by lowest score first
  });

  return (
    <>
      <Paper
        elevation={0}
        onMouseEnter={(e) => setScoreAnchorEl(e.currentTarget)}
        onMouseLeave={() => setScoreAnchorEl(null)}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "#1a1a1a",
          border: `2px solid ${alpha(letterGrade.color, 0.3)}`,
          boxShadow: `0 4px 20px ${alpha("#000000", 0.3)}`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          minWidth: 200,
          maxWidth: 250,
          "&:hover": {
            borderColor: alpha(letterGrade.color, 0.6),
            transform: "translateY(-2px)",
            boxShadow: `0 8px 30px ${alpha(letterGrade.color, 0.2)}`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="#b0b0b0">
              Portfolio Score
            </Typography>
            {getTrendIcon(portfolioScore.trend)}
          </Box>

          <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
            <CircularProgress
              variant="determinate"
              value={portfolioScore.overall}
              size={80}
              thickness={4}
              sx={{
                color: letterGrade.color,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={4}
              sx={{
                color: alpha(letterGrade.color, 0.2),
                position: "absolute",
                left: 0,
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: letterGrade.color,
                  fontSize: "1.8rem",
                }}
              >
                {letterGrade.grade}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "#808080",
                  fontSize: "0.7rem",
                }}
              >
                {portfolioScore.overall}/100
              </Typography>
            </Box>
          </Box>

          {scoreDiff !== 0 && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}
            >
              <Typography
                variant="caption"
                color={scoreDiff > 0 ? "#4caf50" : "#f44336"}
                sx={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {scoreDiff > 0 ? "+" : ""}
                {scoreDiff} points
              </Typography>
            </Box>
          )}

          {portfolioScore.percentile && (
            <Typography
              variant="caption"
              color="#667eea"
              sx={{ fontSize: "0.7rem" }}
            >
              Top {100 - portfolioScore.percentile}%
            </Typography>
          )}
        </Box>
      </Paper>

      {Boolean(scoreAnchorEl) && (
        <Paper
          elevation={8}
          onMouseEnter={() => setScoreAnchorEl(scoreAnchorEl)}
          onMouseLeave={() => setScoreAnchorEl(null)}
          sx={{
            position: "fixed",
            top: scoreAnchorEl?.getBoundingClientRect().top || 0,
            left: Math.max(
              20,
              (scoreAnchorEl?.getBoundingClientRect().left || 0) - 420
            ),
            p: 3,
            width: 400,
            bgcolor: "#1a1a1a",
            border: `2px solid ${alpha("#667eea", 0.4)}`,
            borderRadius: 3,
            boxShadow: `0 12px 40px ${alpha("#000000", 0.6)}`,
            zIndex: 1300,
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography
            variant="h6"
            color="#ffffff"
            gutterBottom
            sx={{ mb: 3, fontSize: "1.1rem", fontWeight: 700 }}
          >
            Portfolio Breakdown
          </Typography>

          <Box sx={{ mb: 3 }}>
            {prioritizedMetrics.map((item) => (
              <Box key={item.label} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: item.color }}>{item.icon}</Box>
                    <Typography
                      variant="body2"
                      color="#ffffff"
                      fontWeight={600}
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {item.label}
                    </Typography>
                    {item.priority === "high" && (
                      <Chip
                        label="Priority"
                        size="small"
                        sx={{
                          height: 16,
                          fontSize: "0.6rem",
                          bgcolor: alpha("#f44336", 0.2),
                          color: "#f44336",
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="#ffffff"
                    fontWeight={700}
                    sx={{ fontSize: "0.9rem" }}
                  >
                    {item.value}%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(item.color, 0.2),
                      "& .MuiLinearProgress-bar": {
                        bgcolor: item.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Launch sx={{ fontSize: 12 }} />}
                    sx={{
                      minWidth: 110,
                      height: 28,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      borderColor: alpha(item.color, 0.6),
                      color: item.color,
                      borderWidth: 1.5,
                      "&:hover": {
                        borderColor: item.color,
                        bgcolor: alpha(item.color, 0.15),
                        borderWidth: 1.5,
                      },
                    }}
                  >
                    {item.action}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ borderTop: `1px solid ${alpha("#667eea", 0.2)}`, pt: 2 }}>
            <Typography
              variant="subtitle2"
              color="#667eea"
              gutterBottom
              sx={{ fontSize: "0.9rem", fontWeight: 700 }}
            >
              💡 Quick Wins
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {portfolioScore.tips.slice(0, 2).map((tip, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Typography
                    variant="body2"
                    color="#e0e0e0"
                    sx={{ fontSize: "0.85rem", flexGrow: 1, lineHeight: 1.4 }}
                  >
                    • {tip}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#667eea",
                      minWidth: "auto",
                      px: 1.5,
                      "&:hover": {
                        bgcolor: alpha("#667eea", 0.15),
                      },
                    }}
                  >
                    Fix Now
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
}
