"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Toolbar,
  Chip,
  Stack,
  Paper,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Grid,
} from "@mui/material";
import {
  GitHub,
  AutoAwesome,
  Description,
  Psychology,
  TrendingUp,
  ArrowForward,
  CheckCircle,
  Code,
  WorkOutline,
  Speed,
  Security,
  CloudDone,
  EmojiObjects,
  Star,
} from "@mui/icons-material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function LandingPage() {
  const theme = useTheme();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const features = [
    {
      icon: <AutoAwesome />,
      title: "AI-Powered Analysis",
      description:
        "Advanced AI analyzes your GitHub repos to generate professional content and identify strengths.",
      color: "#667eea",
    },
    {
      icon: <Description />,
      title: "Resume-Ready Content",
      description:
        "Automatically generate STAR stories and achievement bullets that impress recruiters.",
      color: "#764ba2",
    },
    {
      icon: <Psychology />,
      title: "Interview Preparation",
      description:
        "Practice with AI-powered mock interviews tailored to your projects and target roles.",
      color: "#f093fb",
    },
    {
      icon: <TrendingUp />,
      title: "Skill Gap Analysis",
      description:
        "Discover missing skills for your dream role and get personalized project recommendations.",
      color: "#4facfe",
    },
    {
      icon: <Code />,
      title: "Portfolio Scoring",
      description:
        "Get a comprehensive 0-100 score with actionable insights to improve your portfolio.",
      color: "#43e97b",
    },
    {
      icon: <WorkOutline />,
      title: "Job Matching",
      description:
        "Match your portfolio against job descriptions to see how you stack up.",
      color: "#fa709a",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect GitHub",
      description: "Sign in with GitHub and grant access to your repositories.",
      icon: <GitHub />,
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI analyzes your code, commits, and project structure.",
      icon: <AutoAwesome />,
    },
    {
      number: "03",
      title: "Get Results",
      description:
        "Receive your portfolio score, stories, and career insights.",
      icon: <Star />,
    },
  ];

  const benefits = [
    "Stand out in competitive job markets",
    "Save hours writing resume content",
    "Identify and fill skill gaps",
    "Practice interviews with confidence",
    "Showcase projects professionally",
    "Get personalized career guidance",
  ];

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", overflow: "hidden" }}>
      {/* Navbar */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 10, md: 20 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1100,
          width: { xs: "95%", md: "90%" },
          maxWidth: "1000px",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: alpha("#2a2a2a", 0.85),
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            border: `1px solid ${alpha("#667eea", 0.3)}`,
            boxShadow: `0 8px 32px ${alpha("#000000", 0.4)}`,
          }}
        >
          <Toolbar
            sx={{
              py: { xs: 1, md: 1.5 },
              px: { xs: 2, md: 3 },
              minHeight: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <GitHub
                sx={{
                  mr: { xs: 0.5, md: 1 },
                  color: "primary.main",
                  fontSize: { xs: 28, md: 32 },
                }}
              />
              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textDecoration: "none",
                  fontSize: { xs: "1.1rem", md: "1.5rem" },
                }}
              >
                GitStory
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button
                color="inherit"
                href="#features"
                sx={{
                  color: "#e0e0e0",
                  fontWeight: 600,
                  "&:hover": { color: "#667eea" },
                }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                href="#how-it-works"
                sx={{
                  color: "#e0e0e0",
                  fontWeight: 600,
                  "&:hover": { color: "#667eea" },
                }}
              >
                How It Works
              </Button>
              <Button
                color="inherit"
                href="#benefits"
                sx={{
                  color: "#e0e0e0",
                  fontWeight: 600,
                  "&:hover": { color: "#667eea" },
                }}
              >
                Benefits
              </Button>
            </Stack>
            <Button
              component={Link}
              href="/api/auth/github"
              variant="contained"
              startIcon={
                <GitHub sx={{ display: { xs: "none", sm: "block" } }} />
              }
              sx={{
                ml: { xs: 1, md: 3 },
                borderRadius: 3,
                px: { xs: 2, md: 3 },
                py: { xs: 0.75, md: 1 },
                fontWeight: 700,
                fontSize: { xs: "0.875rem", md: "1rem" },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: `0 4px 20px ${alpha("#667eea", 0.3)}`,
                "&:hover": {
                  boxShadow: `0 6px 30px ${alpha("#667eea", 0.4)}`,
                },
              }}
            >
              Get Started
            </Button>
          </Toolbar>
        </Paper>
      </Box>

      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          pt: { xs: 15, md: 18 },
          pb: { xs: 12, md: 18 },
          background: `linear-gradient(180deg, ${alpha("#667eea", 0.15)} 0%, #0a0a0a 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            style={{ opacity: heroOpacity, scale: heroScale }}
            sx={{ textAlign: "center", position: "relative", zIndex: 2 }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Chip
                icon={<AutoAwesome sx={{ fontSize: { xs: 16, md: 18 } }} />}
                label="AI-Powered Career Platform"
                sx={{
                  mb: { xs: 3, md: 4 },
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 2.5, md: 3 },
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2.5rem",
                    sm: "3.5rem",
                    md: "5rem",
                    lg: "6rem",
                  },
                  fontWeight: 900,
                  mb: 3,
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                Turn Your GitHub
                <br />
                Into Interview Gold
              </Typography>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  maxWidth: 700,
                  mx: "auto",
                  lineHeight: 1.7,
                  color: "#c0c0c0",
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  fontWeight: 400,
                }}
              >
                Transform your repositories into professional portfolios,
                compelling STAR stories, and interview-ready content—all powered
                by AI.
              </Typography>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button
                  component={Link}
                  href="/api/auth/github"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: `0 8px 30px ${alpha("#667eea", 0.35)}`,
                    "&:hover": {
                      boxShadow: `0 12px 40px ${alpha("#667eea", 0.45)}`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Start Free with GitHub
                </Button>
                <Button
                  href="#features"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderWidth: 2,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderWidth: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  See How It Works
                </Button>
              </Stack>
            </MotionBox>
          </MotionBox>
        </Container>

        {/* Animated Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          {/* Large rotating icons */}
          <MotionBox
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "10%",
              left: "5%",
              opacity: 0.08,
              color: "#667eea",
            }}
          >
            <GitHub sx={{ fontSize: 280 }} />
          </MotionBox>
          <MotionBox
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "50%",
              right: "5%",
              opacity: 0.08,
              color: "#764ba2",
            }}
          >
            <GitHub sx={{ fontSize: 240 }} />
          </MotionBox>
          <MotionBox
            animate={{
              rotate: 360,
              scale: [1, 1.15, 1],
              y: [0, 25, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              bottom: "10%",
              left: "15%",
              opacity: 0.08,
              color: "#667eea",
            }}
          >
            <GitHub sx={{ fontSize: 260 }} />
          </MotionBox>

          {/* Additional smaller floating icons */}
          <MotionBox
            animate={{
              rotate: -360,
              y: [0, -40, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "30%",
              left: "40%",
              opacity: 0.06,
              color: "#f093fb",
            }}
          >
            <GitHub sx={{ fontSize: 180 }} />
          </MotionBox>
          <MotionBox
            animate={{
              rotate: 360,
              y: [0, 30, 0],
              x: [0, -25, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "70%",
              right: "30%",
              opacity: 0.06,
              color: "#4facfe",
            }}
          >
            <GitHub sx={{ fontSize: 160 }} />
          </MotionBox>
          <MotionBox
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
              y: [0, -35, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              bottom: "40%",
              right: "10%",
              opacity: 0.05,
              color: "#43e97b",
            }}
          >
            <GitHub sx={{ fontSize: 200 }} />
          </MotionBox>
          <MotionBox
            animate={{
              rotate: 360,
              x: [0, 40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "20%",
              right: "25%",
              opacity: 0.05,
              color: "#fa709a",
            }}
          >
            <GitHub sx={{ fontSize: 140 }} />
          </MotionBox>
        </Box>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 10, md: 15 }, bgcolor: "#0f0f0f" }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: 2,
              }}
            >
              FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                mt: 2,
                mb: 2,
                color: "#ffffff",
              }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography
              variant="h6"
              color="#c0c0c0"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Comprehensive tools to transform your GitHub presence into career
              opportunities
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                  }}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    bgcolor: "#1a1a1a",
                    border: `2px solid ${alpha(feature.color, 0.3)}`,
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 20px ${alpha("#000000", 0.3)}`,
                    "&:hover": {
                      borderColor: alpha(feature.color, 0.6),
                      bgcolor: "#222222",
                      boxShadow: `0 8px 30px ${alpha(feature.color, 0.3)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 3,
                        background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(
                          feature.color,
                          0.7
                        )} 100%)`,
                        boxShadow: `0 8px 24px ${alpha(feature.color, 0.3)}`,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      gutterBottom
                      color="#ffffff"
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#c0c0c0"
                      lineHeight={1.7}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        id="how-it-works"
        sx={{
          py: { xs: 10, md: 15 },
          background: `linear-gradient(180deg, #0f0f0f 0%, ${alpha("#667eea", 0.1)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: "center", mb: 10 }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: 2,
              }}
            >
              HOW IT WORKS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                mt: 2,
                mb: 2,
                color: "#ffffff",
              }}
            >
              Get Started in Minutes
            </Typography>
            <Typography
              variant="h6"
              color="#c0c0c0"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Three simple steps to transform your GitHub into interview gold
            </Typography>
          </MotionBox>

          <Grid container spacing={6} alignItems="center">
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <MotionBox
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  sx={{ textAlign: "center", position: "relative" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontSize: "3rem",
                        fontWeight: 800,
                        boxShadow: `0 12px 40px ${alpha("#667eea", 0.4)}`,
                      }}
                    >
                      {step.icon}
                    </Avatar>
                    <Chip
                      label={step.number}
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        background:
                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        color: "white",
                        boxShadow: `0 4px 12px ${alpha("#f093fb", 0.4)}`,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    gutterBottom
                    color="#ffffff"
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="#c0c0c0"
                    sx={{ maxWidth: 300, mx: "auto", lineHeight: 1.7 }}
                  >
                    {step.description}
                  </Typography>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: "none", md: "block" },
                        position: "absolute",
                        top: 50,
                        right: -60,
                        width: 120,
                        height: 2,
                        background: `linear-gradient(90deg, ${alpha(
                          "#667eea",
                          0.3
                        )} 0%, ${alpha("#764ba2", 0.3)} 100%)`,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          right: 0,
                          top: -4,
                          width: 0,
                          height: 0,
                          borderLeft: `8px solid ${alpha("#764ba2", 0.3)}`,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                        },
                      }}
                    />
                  )}
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box id="benefits" sx={{ py: { xs: 10, md: 15 }, bgcolor: "#0f0f0f" }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "1rem",
                    letterSpacing: 2,
                  }}
                >
                  WHY GITSTORY
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 800,
                    mt: 2,
                    mb: 3,
                  }}
                >
                  Your Career Deserves Better
                </Typography>
                <Typography
                  variant="h6"
                  color="#c0c0c0"
                  sx={{ mb: 4, lineHeight: 1.7 }}
                >
                  Stop letting great projects go unnoticed. GitStory helps you
                  articulate your technical achievements in ways that resonate
                  with recruiters and hiring managers.
                </Typography>

                <Stack spacing={2}>
                  {benefits.map((benefit, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CheckCircle
                          sx={{
                            color: "primary.main",
                            fontSize: 28,
                          }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#ffffff"
                        >
                          {benefit}
                        </Typography>
                      </Stack>
                    </MotionBox>
                  ))}
                </Stack>
              </MotionBox>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MotionBox
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    bgcolor: "#1a1a1a",
                    border: `2px solid ${alpha("#667eea", 0.3)}`,
                    boxShadow: `0 4px 20px ${alpha("#000000", 0.3)}`,
                  }}
                >
                  <Stack spacing={4}>
                    <Box>
                      <Speed
                        sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                      />
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                        color="#ffffff"
                      >
                        Lightning Fast
                      </Typography>
                      <Typography variant="body1" color="#c0c0c0">
                        Get comprehensive analysis and content in minutes, not
                        hours
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Security
                        sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                      />
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                        color="#ffffff"
                      >
                        Secure & Private
                      </Typography>
                      <Typography variant="body1" color="#c0c0c0">
                        Your code stays on GitHub. We only analyze metadata and
                        structure
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <CloudDone
                        sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                      />
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                        color="#ffffff"
                      >
                        Always Improving
                      </Typography>
                      <Typography variant="body1" color="#c0c0c0">
                        Our AI learns from thousands of successful portfolios
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: "center", position: "relative", zIndex: 2 }}
          >
            <EmojiObjects
              sx={{ fontSize: 80, color: "white", mb: 3, opacity: 0.9 }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                color: "white",
                mb: 3,
              }}
            >
              Ready to Stand Out?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: alpha("#ffffff", 0.9),
                mb: 5,
                lineHeight: 1.7,
              }}
            >
              Join thousands of developers who are landing better jobs with
              GitStory. Start transforming your GitHub today—it&apos;s free!
            </Typography>
            <Button
              component={Link}
              href="/api/auth/github"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 6,
                py: 2.5,
                borderRadius: 3,
                fontSize: "1.2rem",
                fontWeight: 700,
                bgcolor: "white",
                color: "primary.main",
                boxShadow: `0 12px 40px ${alpha("#000000", 0.3)}`,
                "&:hover": {
                  bgcolor: alpha("#ffffff", 0.95),
                  boxShadow: `0 16px 50px ${alpha("#000000", 0.4)}`,
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started Free
            </Button>
            <Typography
              variant="body2"
              sx={{
                color: alpha("#ffffff", 0.8),
                mt: 3,
                fontSize: "1rem",
              }}
            >
              No credit card required • Connect with GitHub in seconds
            </Typography>
          </MotionBox>
        </Container>

        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background:
              "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)",
          }}
        />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 6,
          bgcolor: "#0a0a0a",
          borderTop: `1px solid ${alpha("#667eea", 0.2)}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <GitHub sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  GitStory
                </Typography>
              </Stack>
              <Typography variant="body2" color="#c0c0c0">
                Transform your GitHub into interview gold with AI-powered career
                tools.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction="row"
                spacing={3}
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
              >
                <Link href="#features" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    color="#c0c0c0"
                    sx={{ "&:hover": { color: "#667eea" } }}
                  >
                    Features
                  </Typography>
                </Link>
                <Link href="#how-it-works" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    color="#c0c0c0"
                    sx={{ "&:hover": { color: "#667eea" } }}
                  >
                    How It Works
                  </Typography>
                </Link>
                <Link href="#benefits" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    color="#c0c0c0"
                    sx={{ "&:hover": { color: "#667eea" } }}
                  >
                    Benefits
                  </Typography>
                </Link>
                <Link
                  href="/api/auth/github"
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="body2"
                    color="#c0c0c0"
                    sx={{ "&:hover": { color: "#667eea" } }}
                  >
                    Login
                  </Typography>
                </Link>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="#808080" textAlign="center">
            © {new Date().getFullYear()} GitStory. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
