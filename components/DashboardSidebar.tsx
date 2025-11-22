"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Paper,
  Avatar,
  alpha,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Lightbulb,
  Description,
  TrendingUp,
  WorkOutline,
  Language,
  Mic,
  GitHub,
  Settings,
  Logout,
  ChevronLeft,
  ChevronRight,
  Star,
} from "@mui/icons-material";
import Link from "next/link";

interface User {
  user_metadata?: {
    avatar_url?: string;
    user_name?: string;
  };
  email?: string;
}

interface DashboardSidebarProps {
  user: User;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onLogout: () => void;
  drawerWidth: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  collapsedWidth: number;
  currentPath?: string;
}

const navigationItems = [
  {
    text: "Dashboard",
    icon: <GitHub />,
    href: "/dashboard",
    category: "main",
  },
  {
    text: "Project Recommendations",
    icon: <Lightbulb />,
    href: "/project-recommendations",
    category: "ai-tools",
    badge: "AI",
  },
  {
    text: "Generate Resume",
    icon: <Description />,
    href: "/generate-resume",
    category: "ai-tools",
    badge: "AI",
  },
  {
    text: "Skill Gap Analysis",
    icon: <TrendingUp />,
    href: "/skill-gap",
    category: "analysis",
  },
  {
    text: "Job Match Scoring",
    icon: <WorkOutline />,
    href: "/job-match",
    category: "analysis",
  },
  {
    text: "Portfolio Website",
    icon: <Language />,
    href: "/portfolio",
    category: "showcase",
  },
  {
    text: "Mock Interview",
    icon: <Mic />,
    href: "/mock-interview",
    category: "practice",
    badge: "NEW",
  },
  {
    text: "Settings",
    icon: <Settings />,
    href: "/settings",
    category: "account",
  },
];

export default function DashboardSidebar({
  user,
  mobileOpen,
  onDrawerToggle,
  onLogout,
  drawerWidth,
  collapsed,
  onToggleCollapse,
  collapsedWidth,
  currentPath = "/dashboard",
}: DashboardSidebarProps) {
  const drawer = (isCollapsed: boolean = false) => (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0f0f0f",
        borderRight: `1px solid ${alpha("#667eea", 0.2)}`,
        display: "flex",
        flexDirection: "column",
        width: isCollapsed ? collapsedWidth : drawerWidth,
        transition: "width 0.3s ease",
      }}
    >
      {/* Header Section with Toggle */}
      <Box sx={{ p: isCollapsed ? 1 : 3, mb: 2 }}>
        {/* Toggle Button - Top Right */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          <IconButton
            onClick={onToggleCollapse}
            size="small"
            sx={{
              color: "#667eea",
              bgcolor: alpha("#667eea", 0.1),
              width: 32,
              height: 32,
              "&:hover": {
                bgcolor: alpha("#667eea", 0.2),
              },
            }}
          >
            {isCollapsed ? (
              <ChevronRight sx={{ fontSize: 18 }} />
            ) : (
              <ChevronLeft sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: isCollapsed ? 1 : 2,
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Avatar
            src={user?.user_metadata?.avatar_url}
            alt={user?.user_metadata?.user_name || "User"}
            sx={{
              mr: isCollapsed ? 0 : 1.5,
              width: 40,
              height: 40,
              border: `2px solid ${alpha("#667eea", 0.3)}`,
            }}
          >
            <GitHub sx={{ color: "#667eea", fontSize: 24 }} />
          </Avatar>
          {!isCollapsed && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "1.3rem",
                  lineHeight: 1.2,
                }}
              >
                GitStory
              </Typography>
              <Typography
                variant="caption"
                color="#808080"
                sx={{ fontSize: "0.75rem" }}
              >
                Dashboard
              </Typography>
            </Box>
          )}
        </Box>

        {!isCollapsed && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha("#667eea", 0.08),
              border: `1px solid ${alpha("#667eea", 0.2)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                color="#b0b0b0"
                sx={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Logged in as
              </Typography>
              <Chip
                label="PRO"
                size="small"
                sx={{
                  height: 16,
                  fontSize: "0.6rem",
                  bgcolor: alpha("#667eea", 0.3),
                  color: "#667eea",
                  fontWeight: 700,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              color="#ffffff"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              {user?.user_metadata?.user_name || user?.email?.split("@")[0]}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Star sx={{ fontSize: 14, color: "#ffd700" }} />
              <Typography
                variant="caption"
                color="#c0c0c0"
                sx={{ fontSize: "0.7rem" }}
              >
                12 projects analyzed
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List sx={{ px: isCollapsed ? 1 : 2, py: 1 }}>
          {/* Main Navigation */}
          {navigationItems
            .filter((item) => item.category === "main")
            .map((item) => {
              const isActive = currentPath === item.href;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                  {isCollapsed ? (
                    <Tooltip title={item.text} placement="right">
                      <ListItemButton
                        component={Link}
                        href={item.href}
                        sx={{
                          borderRadius: 3,
                          color: isActive ? "#ffffff" : "#c0c0c0",
                          py: 2,
                          px: 1,
                          minHeight: 56,
                          justifyContent: "center",
                          bgcolor: isActive
                            ? alpha("#667eea", 0.2)
                            : "transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: alpha("#667eea", 0.12),
                            color: "#ffffff",
                            "& .MuiListItemIcon-root": {
                              color: "#667eea",
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive ? "#667eea" : "inherit",
                            minWidth: "auto",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </Box>
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                  ) : (
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      sx={{
                        borderRadius: 3,
                        color: isActive ? "#ffffff" : "#c0c0c0",
                        py: 2,
                        px: 2.5,
                        bgcolor: isActive
                          ? alpha("#667eea", 0.2)
                          : "transparent",
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          bgcolor: "#667eea",
                          transform: isActive ? "scaleY(1)" : "scaleY(0)",
                          transition: "transform 0.2s ease",
                        },
                        "&:hover": {
                          bgcolor: alpha("#667eea", 0.12),
                          color: "#ffffff",
                          transform: "translateX(4px)",
                          "&::before": {
                            transform: "scaleY(1)",
                          },
                          "& .MuiListItemIcon-root": {
                            color: "#667eea",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "#667eea" : "inherit",
                          minWidth: 48,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 600,
                          letterSpacing: 0.2,
                        }}
                      />
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
        </List>

        <List sx={{ px: isCollapsed ? 1 : 2, py: 1 }}>
          {navigationItems
            .filter((item) => item.category === "ai-tools")
            .map((item) => {
              const isActive = currentPath === item.href;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                  {isCollapsed ? (
                    <Tooltip
                      title={`${item.text} ${item.badge ? `(${item.badge})` : ""}`}
                      placement="right"
                    >
                      <ListItemButton
                        component={Link}
                        href={item.href}
                        sx={{
                          borderRadius: 3,
                          color: isActive ? "#ffffff" : "#c0c0c0",
                          py: 2,
                          px: 1,
                          minHeight: 56,
                          justifyContent: "center",
                          bgcolor: isActive
                            ? alpha("#667eea", 0.2)
                            : "transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: alpha("#667eea", 0.12),
                            color: "#ffffff",
                            "& .MuiListItemIcon-root": {
                              color: "#667eea",
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive ? "#667eea" : "inherit",
                            minWidth: "auto",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </Box>
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                  ) : (
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      sx={{
                        borderRadius: 3,
                        color: isActive ? "#ffffff" : "#c0c0c0",
                        py: 2,
                        px: 2.5,
                        bgcolor: isActive
                          ? alpha("#667eea", 0.2)
                          : "transparent",
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          bgcolor: "#667eea",
                          transform: isActive ? "scaleY(1)" : "scaleY(0)",
                          transition: "transform 0.2s ease",
                        },
                        "&:hover": {
                          bgcolor: alpha("#667eea", 0.12),
                          color: "#ffffff",
                          transform: "translateX(4px)",
                          "&::before": {
                            transform: "scaleY(1)",
                          },
                          "& .MuiListItemIcon-root": {
                            color: "#667eea",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "#667eea" : "inherit",
                          minWidth: 48,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>{item.text}</span>
                            {item.badge && (
                              <Chip
                                label={item.badge}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.6rem",
                                  bgcolor:
                                    item.badge === "NEW"
                                      ? alpha("#4caf50", 0.3)
                                      : alpha("#667eea", 0.3),
                                  color:
                                    item.badge === "NEW"
                                      ? "#4caf50"
                                      : "#667eea",
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 600,
                          letterSpacing: 0.2,
                        }}
                      />
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
        </List>

        <List sx={{ px: isCollapsed ? 1 : 2, py: 1 }}>
          {navigationItems
            .filter((item) => !["main", "ai-tools"].includes(item.category))
            .map((item) => {
              const isActive = currentPath === item.href;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                  {isCollapsed ? (
                    <Tooltip
                      title={`${item.text} ${item.badge ? `(${item.badge})` : ""}`}
                      placement="right"
                    >
                      <ListItemButton
                        component={Link}
                        href={item.href}
                        sx={{
                          borderRadius: 3,
                          color: isActive ? "#ffffff" : "#c0c0c0",
                          py: 2,
                          px: 1,
                          minHeight: 56,
                          justifyContent: "center",
                          bgcolor: isActive
                            ? alpha("#667eea", 0.2)
                            : "transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: alpha("#667eea", 0.12),
                            color: "#ffffff",
                            "& .MuiListItemIcon-root": {
                              color: "#667eea",
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive ? "#667eea" : "inherit",
                            minWidth: "auto",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </Box>
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                  ) : (
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      sx={{
                        borderRadius: 3,
                        color: isActive ? "#ffffff" : "#c0c0c0",
                        py: 2,
                        px: 2.5,
                        bgcolor: isActive
                          ? alpha("#667eea", 0.2)
                          : "transparent",
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          bgcolor: "#667eea",
                          transform: isActive ? "scaleY(1)" : "scaleY(0)",
                          transition: "transform 0.2s ease",
                        },
                        "&:hover": {
                          bgcolor: alpha("#667eea", 0.12),
                          color: "#ffffff",
                          transform: "translateX(4px)",
                          "&::before": {
                            transform: "scaleY(1)",
                          },
                          "& .MuiListItemIcon-root": {
                            color: "#667eea",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "#667eea" : "inherit",
                          minWidth: 48,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>{item.text}</span>
                            {item.badge && (
                              <Chip
                                label={item.badge}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.6rem",
                                  bgcolor:
                                    item.badge === "NEW"
                                      ? alpha("#4caf50", 0.3)
                                      : alpha("#667eea", 0.3),
                                  color:
                                    item.badge === "NEW"
                                      ? "#4caf50"
                                      : "#667eea",
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 600,
                          letterSpacing: 0.2,
                        }}
                      />
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ mt: "auto", p: isCollapsed ? 1 : 2 }}>
        {isCollapsed ? (
          <Tooltip title="Logout" placement="right">
            <IconButton
              onClick={onLogout}
              sx={{
                width: "100%",
                height: 48,
                borderRadius: 3,
                border: `2px solid ${alpha("#f44336", 0.5)}`,
                color: "#f44336",
                "&:hover": {
                  borderColor: "#f44336",
                  bgcolor: alpha("#f44336", 0.1),
                },
              }}
            >
              <Logout />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            onClick={onLogout}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              borderColor: alpha("#f44336", 0.5),
              color: "#f44336",
              "&:hover": {
                borderWidth: 2,
                borderColor: "#f44336",
                bgcolor: alpha("#f44336", 0.1),
              },
            }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: collapsed ? collapsedWidth : drawerWidth },
        flexShrink: { sm: 0 },
        transition: "width 0.3s ease",
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#0f0f0f",
          },
        }}
      >
        {drawer(false)}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: collapsed ? collapsedWidth : drawerWidth,
            bgcolor: "#0f0f0f",
            borderRight: "none",
            transition: "width 0.3s ease",
          },
        }}
        open
      >
        {drawer(collapsed)}
      </Drawer>
    </Box>
  );
}
