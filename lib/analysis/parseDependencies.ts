interface DependencyFiles {
  packageJson?: Record<string, unknown>;
  requirementsTxt?: string;
  pomXml?: string;
  gemfile?: string;
  goMod?: string;
  composerJson?: Record<string, unknown>;
  cargoToml?: string;
}

/**
 * Extract skills from dependency files
 * Parses package.json, requirements.txt, pom.xml, etc.
 */
export function extractSkillsFromDependencies(
  files: DependencyFiles
): string[] {
  const skills = new Set<string>();

  // Parse package.json (JavaScript/TypeScript)
  if (files.packageJson) {
    const packageJson = files.packageJson as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const jsFrameworks: Record<string, string> = {
      react: "React",
      "react-dom": "React",
      next: "Next.js",
      vue: "Vue",
      "@angular/core": "Angular",
      svelte: "Svelte",
      express: "Express",
      fastify: "Fastify",
      "@nestjs/core": "NestJS",
      tailwindcss: "Tailwind CSS",
      typescript: "TypeScript",
      jest: "Jest",
      vitest: "Vitest",
      webpack: "Webpack",
      vite: "Vite",
      redux: "Redux",
      "@reduxjs/toolkit": "Redux",
      zustand: "Zustand",
      prisma: "Prisma",
      "@prisma/client": "Prisma",
      mongoose: "MongoDB",
      pg: "PostgreSQL",
      mysql: "MySQL",
      mysql2: "MySQL",
      redis: "Redis",
      "@supabase/supabase-js": "Supabase",
      firebase: "Firebase",
      axios: "Axios",
      graphql: "GraphQL",
      "@apollo/client": "GraphQL",
      "socket.io": "Socket.io",
      nodemon: "Node.js",
      dotenv: "Node.js",
    };

    Object.keys(deps).forEach((dep) => {
      if (jsFrameworks[dep]) {
        skills.add(jsFrameworks[dep]);
      }
    });

    // Add Node.js if it's a backend project
    if (deps.express || deps.fastify || deps["@nestjs/core"] || deps.nodemon) {
      skills.add("Node.js");
    }

    // Add JavaScript if not TypeScript
    if (!deps.typescript) {
      skills.add("JavaScript");
    }
  }

  // Parse requirements.txt (Python)
  if (files.requirementsTxt) {
    const pythonFrameworks: Record<string, string> = {
      django: "Django",
      flask: "Flask",
      fastapi: "FastAPI",
      pandas: "Pandas",
      numpy: "NumPy",
      tensorflow: "TensorFlow",
      torch: "PyTorch",
      pytorch: "PyTorch",
      "scikit-learn": "Scikit-learn",
      sklearn: "Scikit-learn",
      requests: "Requests",
      sqlalchemy: "SQLAlchemy",
      celery: "Celery",
      pytest: "Testing",
      beautifulsoup: "Web Scraping",
      selenium: "Selenium",
    };

    const lines = files.requirementsTxt.toLowerCase().split("\n");
    lines.forEach((line) => {
      Object.entries(pythonFrameworks).forEach(([key, value]) => {
        if (line.includes(key)) {
          skills.add(value);
        }
      });
    });

    skills.add("Python");
  }

  // Parse pom.xml (Java)
  if (files.pomXml) {
    const xmlLower = files.pomXml.toLowerCase();

    if (xmlLower.includes("spring")) {
      skills.add("Spring");
    }
    if (xmlLower.includes("spring-boot")) {
      skills.add("Spring Boot");
    }
    if (xmlLower.includes("hibernate")) {
      skills.add("Hibernate");
    }
    if (xmlLower.includes("junit")) {
      skills.add("Testing");
    }

    skills.add("Java");
    skills.add("Maven");
  }

  // Parse Gemfile (Ruby)
  if (files.gemfile) {
    const gemfileLower = files.gemfile.toLowerCase();

    if (gemfileLower.includes("rails")) {
      skills.add("Rails");
    }
    if (gemfileLower.includes("sinatra")) {
      skills.add("Sinatra");
    }
    if (gemfileLower.includes("rspec")) {
      skills.add("Testing");
    }

    skills.add("Ruby");
  }

  // Parse go.mod (Go)
  if (files.goMod) {
    const goModLower = files.goMod.toLowerCase();

    if (goModLower.includes("gin")) {
      skills.add("Gin");
    }
    if (goModLower.includes("echo")) {
      skills.add("Echo");
    }

    skills.add("Go");
  }

  // Parse composer.json (PHP)
  if (files.composerJson) {
    const composerJson = files.composerJson as {
      require?: Record<string, string>;
      "require-dev"?: Record<string, string>;
    };

    const deps = {
      ...composerJson.require,
      ...composerJson["require-dev"],
    };

    if (deps) {
      Object.keys(deps).forEach((dep) => {
        if (dep.includes("laravel")) {
          skills.add("Laravel");
        }
        if (dep.includes("symfony")) {
          skills.add("Symfony");
        }
      });
    }

    skills.add("PHP");
  }

  // Parse Cargo.toml (Rust)
  if (files.cargoToml) {
    const cargoLower = files.cargoToml.toLowerCase();

    if (cargoLower.includes("actix")) {
      skills.add("Actix");
    }
    if (cargoLower.includes("rocket")) {
      skills.add("Rocket");
    }

    skills.add("Rust");
  }

  return Array.from(skills);
}
