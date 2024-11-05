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

  renderer.heading = ({ depth, text }) => {
    return `<h${depth} class='text-${6 - depth}xl'>${text}</h${depth}>`;
  };

  renderer.listitem = ({ loose, text, raw, task, type }) => {
    // console.log({ loose, text, raw, task, type });

    return `<li class="list-decimal list-inside">${text}</li>`;
  };

  // renderer.list = ({ loose, items, ordered, raw, start, type }) => {
  //   console.log({ loose, items, ordered, raw, start, type });
  //   return `<ol></ol>`;
  // };

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

  renderer.heading = ({ depth, text }) => {
    return `<h${depth} class='text-${6 - depth}xl'>${text}</h${depth}>`;
  };

  // renderer.paragraph = ({ raw, text, tokens, type }) => {
  //   return `<p class='text-base'>${text}</p>`;
  // };

  renderer.listitem = ({ text }) => {
    return `<li class='list-decimal list-inside'>${text}</li>`;
  };

  return renderer;
}
