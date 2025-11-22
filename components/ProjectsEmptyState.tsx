"use client";

import { Paper, Typography, Button, alpha } from "@mui/material";
import { GitHub, Sync } from "@mui/icons-material";

interface ProjectsEmptyStateProps {
  onSync: () => void;
  syncing: boolean;
}

export default function ProjectsEmptyState({
  onSync,
  syncing,
}: ProjectsEmptyStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 8,
        textAlign: "center",
        borderRadius: 4,
        bgcolor: "#1a1a1a",
        border: `2px dashed ${alpha("#667eea", 0.3)}`,
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GitHub sx={{ fontSize: 80, color: alpha("#667eea", 0.5), mb: 3 }} />
      <Typography variant="h5" color="#e0e0e0" gutterBottom fontWeight={700}>
        No Projects Yet
      </Typography>
      <Typography variant="body1" color="#b0b0b0" sx={{ mb: 3 }}>
        Sync with GitHub to load your repositories and start building your
        portfolio
      </Typography>
      <Button
        variant="outlined"
        startIcon={<Sync />}
        onClick={onSync}
        disabled={syncing}
        sx={{
          borderRadius: 3,
          px: 4,
          py: 1.5,
          fontWeight: 700,
          borderWidth: 2,
          borderColor: "#667eea",
          color: "#667eea",
          "&:hover": {
            borderWidth: 2,
            bgcolor: alpha("#667eea", 0.1),
          },
        }}
      >
        Sync with GitHub
      </Button>
    </Paper>
  );
}
