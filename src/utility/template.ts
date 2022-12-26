import { CSS_PREFIX } from "@/conf/index.conf";
export interface TemplateNodes {
  element: HTMLElement;
  container: HTMLElement;
  primary: HTMLElement;
}

export function createTemplate(element: HTMLElement): TemplateNodes {
  const ppx = CSS_PREFIX;
  const html = `
    <div class="${ppx}-container">
      <div class="${ppx}-primary-area"></div>
    </div>
  `;
  element.innerHTML = html;
  return {
    element,
    container: element.querySelector(`.${ppx}-container`),
    primary: element.querySelector(`.${ppx}-primary-area`),
  };
}
