export {
  confMarkdownNews,
  confMarkdownForum,
  confMarkdownAsParagraph,
} from "./configuration.markdown";
export { clamp } from "./clamp";
import { extractFirstTextAndImage } from "./extractors";
import { useLocalStorage } from "./localStorageHelper";
import { useSessionStorage } from "./sessionStorageHelper";

export { useLocalStorage, useSessionStorage, extractFirstTextAndImage };
