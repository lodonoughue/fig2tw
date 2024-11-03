export function createHiddenElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
) {
  const element = document.createElement(tagName);

  element.style.position = "fixed";
  element.style.left = "-999999px";
  element.style.top = "-999999px";

  document.body.appendChild(element);

  return element;
}
