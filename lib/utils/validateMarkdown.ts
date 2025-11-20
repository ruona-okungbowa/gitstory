export function validateMarkdown(markdown: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!markdown.includes("#")) {
    errors.push("No headings found");
  }

  if (markdown.trim().length < 100) {
    errors.push("Content too short");
  }

  const codeBlockCount = (markdown.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push("Unclosed code block");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
