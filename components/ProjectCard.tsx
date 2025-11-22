"use client";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Chip,
  Box,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Folder,
  Launch,
  Description,
  Psychology,
  Code,
  AccessTime,
} from "@mui/icons-material";

interface Project {
  id: number;
  name: string;
  language: string;
  stars: number;
  description: string | null;
  lastUpdated: string;
  url: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      sx={{
        height: 320,
        width: "100%",
        borderRadius: 4,
        bgcolor: "#1a1a1a",
        border: `2px solid ${alpha("#667eea", 0.3)}`,
        transition: "all 0.3s ease",
        boxShadow: `0 4px 20px ${alpha("#000000", 0.3)}`,
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          borderColor: alpha("#667eea", 0.6),
          bgcolor: "#222222",
          boxShadow: `0 8px 30px ${alpha("#667eea", 0.3)}`,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 4,
          pb: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha("#667eea", 0.2),
              color: "#667eea",
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            <Folder sx={{ fontSize: 32 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="#ffffff" fontWeight={700}>
              {project.name}
            </Typography>
            <Typography variant="body2" color="#b0b0b0">
              {project.language}
            </Typography>
          </Box>
        </Box>

        {/* Project Description */}
        <Typography
          variant="body2"
          color="#c0c0c0"
          sx={{
            mb: 2,
            minHeight: 40,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {project.description || "No description available"}
        </Typography>

        {/* Stats Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            mt: "auto",
          }}
        >
          <Chip
            label={`⭐ ${project.stars} stars`}
            size="small"
            sx={{
              bgcolor: alpha("#667eea", 0.2),
              color: "#667eea",
              fontWeight: 600,
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 16, color: "#808080" }} />
            <Typography variant="caption" color="#808080">
              {new Date(project.lastUpdated).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <CardActions
        sx={{
          px: 2,
          pb: 3,
          pt: 1,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Tooltip title="View on GitHub">
          <IconButton
            size="large"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#667eea",
              width: 56,
              height: 56,
              borderRadius: 3,
              border: `2px solid ${alpha("#667eea", 0.3)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha("#667eea", 0.1),
                borderColor: "#667eea",
                transform: "scale(1.05)",
              },
            }}
          >
            <Launch sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Generate README">
          <IconButton
            size="large"
            sx={{
              color: "#764ba2",
              width: 56,
              height: 56,
              borderRadius: 3,
              border: `2px solid ${alpha("#764ba2", 0.3)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha("#764ba2", 0.1),
                borderColor: "#764ba2",
                transform: "scale(1.05)",
              },
            }}
          >
            <Description sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create STAR Story">
          <IconButton
            size="large"
            sx={{
              color: "#f093fb",
              width: 56,
              height: 56,
              borderRadius: 3,
              border: `2px solid ${alpha("#f093fb", 0.3)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha("#f093fb", 0.1),
                borderColor: "#f093fb",
                transform: "scale(1.05)",
              },
            }}
          >
            <Psychology sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Analyze Code">
          <IconButton
            size="large"
            sx={{
              color: "#4facfe",
              width: 56,
              height: 56,
              borderRadius: 3,
              border: `2px solid ${alpha("#4facfe", 0.3)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha("#4facfe", 0.1),
                borderColor: "#4facfe",
                transform: "scale(1.05)",
              },
            }}
          >
            <Code sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
