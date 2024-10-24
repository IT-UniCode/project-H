import { marked } from "marked";

export function confMarkdownNews() {
  const renderer = new marked.Renderer();

  renderer.image = ({ href, title, text }) => {
    // Повертаємо кастомну HTML-структуру для зображень
    return `
    <div>
      <img src="${href}" class="w-full" alt="${text}" title="${title || text}"/>
    </div>
  `;
  };
  return renderer;
}

export function confMarldownNewsSmall() {
  let firstImageRendered = false;
  let firstTextRendered = false;

  const renderer = new marked.Renderer();

  renderer.text = (text) => {
    // console.log(text);
    if (firstTextRendered) return "";

    firstTextRendered = true;

    return `<p>${text.text}</p>`;
  };

  renderer.image = ({ href, title, text }) => {
    if (firstImageRendered) return "";

    firstImageRendered = true;

    return `
    <div>
      <img src="${href}" class="h-40" alt="${text}" title="${title || text}"/>
    </div>
  `;
  };

  return renderer;
}
