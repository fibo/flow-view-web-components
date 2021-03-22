import { findCanvasOf } from './mixins.js'

export class FlowViewNode extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          box-sizing: border-box;
          background-color: var(--fv-node-background-color, #fefefe);
          position: absolute;
          box-shadow: 1px 1px 7px 1px var(--fv-shadow-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid transparent;
        }

        ::slotted(div[slot="inputs"]),
        ::slotted(div[slot="outputs"]) {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
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
      /* dimensions */ 'width', 'height',
      'label',
      'id'
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    switch (name) {
      case 'label': {
        this.label = newValue
        break
      }

      // The `id` attribute cannot be changed.
      case 'id': {
        if (oldValue !== null && newValue !== this._id) {
          this.setAttribute('id', this._id)
        }
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
        const num = Math.round(newValue)
        const { minSize } = this

        if (typeof num === 'number' && num >= 0) {
          // Use `minSize` if any.
          if (typeof minSize === 'number' && minSize > num) {
            this.setAttribute(name, minSize)
          } else {
            this.style[name] = `${num}px`
          }
        }

        break
      }
    }
  }

  connectedCallback () {
    const { canvas, minSize } = this

    if (canvas) {
      this.addEventListener('pointerdown', this.onpointerdown)

      // Set a readonly id.
      const id = this.id || canvas.generateId()
      Object.defineProperty(this, '_id', { value: id, writable: false })
      this.setAttribute('id', id)
    }

    // Make sure dimensions are defined.
    if (!this.getAttribute('width')) {
      this.setAttribute('width', minSize)
    }
    if (!this.getAttribute('height')) {
      this.setAttribute('height', minSize)
    }

    // Make sure position is defined.
    if (!this.getAttribute('x')) {
      this.setAttribute('x', 0)
    }
    if (!this.getAttribute('y')) {
      this.setAttribute('y', 0)
    }
  }

  disconnectedCallback () {
    const { canvas } = this

    if (canvas) {
      this.removeEventListener('pointerdown', this.onpointerdown)
    }
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
    return findCanvasOf(this)
  }

  get minSize () {
    const { canvas } = this

    if (canvas) {
      return canvas.pinSize * 4
    }
  }

  get label () {
    return this.getAttribute('label') || ''
  }

  set label (value) {
    this.setAttribute('label', value)
  }
}
