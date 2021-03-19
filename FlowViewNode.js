export class FlowViewNode extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          background-color: var(--fv-node-background-color, #fefefe);
          position: absolute;
          box-shadow: 1px 1px 7px 1px var(--fv-shadow-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      </style>
      <slot></slot>
    `

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes() {
    return [
      /* position */
      'x', 'y',
      /* dimension */
      'width', 'height'
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    switch (name) {
      case 'y':
      case 'x': {
        const num = Math.round(newValue);

        if (typeof num === 'number') {
          if (name === 'y') this.style.top = `${num}px`;
          if (name === 'x') this.style.left = `${num}px`;
        }

        break;
      }

      case 'width':
      case 'height': {
        const { scale } = this;

        const num = Math.round(newValue * scale);

        if (typeof num === 'number' && num >= 0) {
          this.style[name] = `${num}px`;
        }

        break;
      }
    }
  }

  get scale () {
    return 1
  }
}
