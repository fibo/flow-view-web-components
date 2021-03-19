export class FlowViewPinsBar extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: var(--fv-pin-size, 10px);
        }
      </style>
      <slot></slot>
    `

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }
}
