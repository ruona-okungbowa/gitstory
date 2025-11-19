const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo/Title */}
          <h1 className="text-5xl font-bold text-white mb-4">GitStory</h1>

          {/* Tagline */}
          <p className="text-xl text-gray-300 mb-8">
            Transform your GitHub projects into interview-ready portfolio
            stories with AI
          </p>

          {/* Login Button */}
          <a
            href="/api/auth/github"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {/* GitHub Icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </a>

          {/* Error Message (if any) */}
          {/* You can add this later to show OAuth errors */}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-white font-semibold mb-2">Portfolio Scoring</h3>
            <p className="text-gray-400">
              Get a comprehensive 0-100 score for your GitHub portfolio
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-white font-semibold mb-2">STAR Stories</h3>
            <p className="text-gray-400">
              AI-generated interview stories from your projects
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-white font-semibold mb-2">
              Skill Gap Analysis
            </h3>
            <p className="text-gray-400">
              Identify missing skills for your target role
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
