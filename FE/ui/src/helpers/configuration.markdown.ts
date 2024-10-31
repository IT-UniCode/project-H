import { marked } from "marked";

export function confMarkdownNews() {
  const renderer = new marked.Renderer();

  renderer.image = ({ href, title, text }) => {
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

export function confMarkdownForum() {
  const renderer = new marked.Renderer();

  renderer.heading = ({ depth, raw, text, tokens, type }) => {
    // console.log({ depth, raw, text, tokens, type });

    return `<h${depth} class='text-${6 - depth}xl'>${text}</h${depth}>`;
  };

  // renderer.paragraph = ({ raw, text, tokens, type }) => {
  //   return `<p class='text-base'>${text}</p>`;
  // };

  renderer.listitem = ({ text, type, loose, raw, task, checked }) => {
    console.log({
      text,
      type,
      loose,
      raw,
      task,
      checked,
    });

    return `<li class='list-decimal'>${text}</li>`;
  };

  return renderer;
}
