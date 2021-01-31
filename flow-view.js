export class FlowViewCanvas extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--flow-view-canvas-background-color, #fefefe);
          box-shadow: 1px 1px 7px 1px rgba(0, 0, 0, 0.17);
          width: 100%;
          height: 100%;
          position: relative;
        }
      </style>
      <slot></slot>
      `

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }
}

customElements.define('fv-canvas', FlowViewCanvas)

export class FlowViewNode extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          background-color: var(--flow-view-node-background-color, #dfdfdf);
          position: absolute;
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
    console.log(name, oldValue, newValue)
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

customElements.define('fv-node', FlowViewNode)
