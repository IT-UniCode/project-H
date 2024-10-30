export function extractFirstTextAndImage(markdown: string) {
  // Знайдемо перший абзац
  const textMatch = markdown.match(/(?:^|\n)([^#\n>!\*+\-]*)/);
  const firstText = textMatch ? textMatch[1].trim() : "";

  // Знайдемо перше зображення
  const imageMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
  const firstImage = imageMatch ? imageMatch[0] : ""; // Зберігаємо весь рядок зображення

  let newMarkdown = "";
  if (firstText) {
    newMarkdown += firstText + "\n\n";
  }
  if (firstImage) {
    newMarkdown += firstImage;
  }

  return newMarkdown.trim();
}
