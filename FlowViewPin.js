export class FlowViewPin extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--fv-pin-background-color, #dbdbdb);
          width: var(--fv-pin-size, 10px);
          height: var(--fv-pin-size, 10px);
        }
      </style>
      <slot></slot>
    `

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }

  connectedCallback () {
    this.addEventListener('pointerdown', this.onpointerdown)
  }

  disconnectedCallback () {
    this.removeEventListener('pointerdown', this.onpointerdown)
  }

  onpointerdown (event) {
    event.stopPropagation()
  }
}
