import { format } from 'prettier';

export function ensureCodeFormatting(codeSnippet: string): string {
  const formattedCodeSnippet = format(codeSnippet, { parser: "typescript" }); // Adjust parser based on language
  return formattedCodeSnippet;
}
