"use client";

import { Button, CircularProgress, alpha } from "@mui/material";
import { Sync } from "@mui/icons-material";

interface SyncButtonProps {
  onSync: () => void;
  syncing: boolean;
  hasProjects: boolean;
}

export default function SyncButton({
  onSync,
  syncing,
  hasProjects,
}: SyncButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={
        syncing ? <CircularProgress size={20} color="inherit" /> : <Sync />
      }
      onClick={onSync}
      disabled={syncing}
      sx={{
        borderRadius: 3,
        px: 4,
        py: 1.5,
        fontWeight: 700,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: `0 4px 20px ${alpha("#667eea", 0.3)}`,
        "&:hover": {
          boxShadow: `0 6px 30px ${alpha("#667eea", 0.4)}`,
        },
        "&:disabled": {
          background: alpha("#667eea", 0.5),
        },
      }}
    >
      {syncing
        ? "Syncing..."
        : hasProjects
          ? "Update Projects"
          : "Sync with GitHub"}
    </Button>
  );
}
