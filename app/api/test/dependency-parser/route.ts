import { NextResponse } from "next/server";
import { extractSkillsFromDependencies } from "@/lib/analysis/parseDependencies";

/**
 * Test endpoint for dependency file parsing
 * GET /api/test/dependency-parser
 */
export async function GET() {
  try {
    // Mock dependency files
    const mockPackageJson = {
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        next: "^14.0.0",
        typescript: "^5.0.0",
        "@supabase/supabase-js": "^2.0.0",
        tailwindcss: "^3.0.0",
      },
      devDependencies: {
        vitest: "^1.0.0",
        "@types/node": "^20.0.0",
      },
    };

    const mockRequirementsTxt = `
django==4.2.0
djangorestframework==3.14.0
psycopg2-binary==2.9.5
celery==5.2.7
redis==4.5.1
pytest==7.2.0
    `.trim();

    const mockPomXml = `
<project>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-core</artifactId>
    </dependency>
  </dependencies>
</project>
    `.trim();

    // Test JavaScript project
    const jsSkills = extractSkillsFromDependencies({
      packageJson: mockPackageJson,
    });

    // Test Python project
    const pythonSkills = extractSkillsFromDependencies({
      requirementsTxt: mockRequirementsTxt,
    });

    // Test Java project
    const javaSkills = extractSkillsFromDependencies({
      pomXml: mockPomXml,
    });

    // Test full-stack project
    const fullStackSkills = extractSkillsFromDependencies({
      packageJson: mockPackageJson,
      requirementsTxt: mockRequirementsTxt,
    });

    return NextResponse.json({
      success: true,
      message: "Dependency parsing test",
      tests: {
        javascript: {
          skills: jsSkills,
          count: jsSkills.length,
        },
        python: {
          skills: pythonSkills,
          count: pythonSkills.length,
        },
        java: {
          skills: javaSkills,
          count: javaSkills.length,
        },
        fullStack: {
          skills: fullStackSkills,
          count: fullStackSkills.length,
        },
      },
      validation: {
        jsHasReact: jsSkills.includes("React"),
        jsHasNextJs: jsSkills.includes("Next.js"),
        jsHasTypeScript: jsSkills.includes("TypeScript"),
        pythonHasDjango: pythonSkills.includes("Django"),
        pythonHasRedis: pythonSkills.includes("Redis"),
        javaHasSpring: javaSkills.includes("Spring"),
        javaHasHibernate: javaSkills.includes("Hibernate"),
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
