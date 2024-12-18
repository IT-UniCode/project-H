import { marked } from "marked";

export function confMarkdownNews() {
  const renderer = new marked.Renderer();

  renderer.image = ({ href, title, text }) => {
    return `
    <figure>
      <img src="${href}" class="w-full" alt="${text}" title="${title || text}"/>
    </figure>
  `;
  };

  renderer.heading = ({ depth, text }) => {
    return `<h${depth} class='text-${6 - depth}xl mb-4'>${text}</h${depth}>`;
  };

  renderer.listitem = ({ text }) => {
    return `<li class="list-decimal list-inside">${text}</li>`;
  };

  renderer.space = () => {
    return "<br />";
  };

  return renderer;
}

export interface ConfMarkdownAsParagraph {
  classText?: string;
}
export function confMarkdownAsParagraph({
  classText,
}: ConfMarkdownAsParagraph = {}) {
  const renderer = new marked.Renderer();

  renderer.text = ({ text }) => {
    return `<p class='text-base ${classText}'>${text}</p>`;
  };

  return renderer;
}

export function confMarkdownForum() {
  const renderer = new marked.Renderer();

  renderer.heading = ({ depth, text }) => {
    return `<h${depth} class='text-${6 - depth}xl'>${text}</h${depth}>`;
  };

  renderer.listitem = ({ text }) => {
    return `<li class='list-decimal list-inside'>${text}</li>`;
  };

  return renderer;
}
