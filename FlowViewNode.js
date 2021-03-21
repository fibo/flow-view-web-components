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
          border: 1px solid transparent;
        }

        :host(:hover) {
          border: 1px solid black;
        }

        ::slotted(div[slot="inputs"]),
        ::slotted(div[slot="outputs"]) {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          / *min-height: --fv-pin-size; */
          height: 15px;
        }
      </style>

      <slot name="inputs"></slot>

      <div>${this.label}</div>

      <slot></slot>

      <slot name="outputs"></slot>
    `

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes() {
    return [
      /* position */ 'x', 'y',
      /* dimension */ 'width', 'height',
      'label'
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    switch (name) {
      case 'label': {
        this.label = newValue
        break
      }
      case 'y':
      case 'x': {
        const num = Math.round(newValue)

        if (typeof num === 'number') {
          if (name === 'y') this.style.top = `${num}px`
          if (name === 'x') this.style.left = `${num}px`
        }

        break
      }

      case 'width':
      case 'height': {
        const { scale } = this

        const num = Math.round(newValue * scale)

        if (typeof num === 'number' && num >= 0) {
          this.style[name] = `${num}px`
        }

        break
      }
    }
  }

  connectedCallback () {
    this.addEventListener('pointerdown', this.onpointerdown)
  }

  disconnectedCallback () {
    this.removeEventListener('pointerdown', this.onpointerdown)
  }

  onpointerdown (event) {
    const { clientX, clientY, pageX, pageY } = event

    const { canvas } = this

    const { left, top } = this.getBoundingClientRect()

    const shiftX = clientX - left
    const shiftY = clientY - top

    const canvasOnpointermove = (event) => {
      const { pageX, pageY } = event

      this.setAttribute('x', Math.round(pageX - shiftX))
      this.setAttribute('y', Math.round(pageY - shiftY))
    }

    const removeListeners = () => {
      canvas.removeEventListener('pointermove', canvasOnpointermove)

      canvas.removeEventListener('pointerleave', removeListeners)
      canvas.removeEventListener('pointerup', removeListeners)
    }

    canvas.addEventListener('pointermove', canvasOnpointermove)

    canvas.addEventListener('pointerleave', removeListeners)
    canvas.addEventListener('pointerup', removeListeners)
  }

  get canvas () {
    const { parentNode } = this

    if (parentNode && parentNode.tagName === 'FV-CANVAS') {
      return parentNode
    }
  }

  get label () {
    return this.getAttribute('label') || ''
  }

  get scale () {
    return 1
  }

  set label (value) {
    this.setAttribute('label', value)
  }
}
