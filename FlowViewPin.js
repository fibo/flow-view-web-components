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

  static get observedAttributes() {
    return [
      'id'
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    switch (name) {
      // The `id` attribute cannot be changed.
      case 'id': {
        if (oldValue !== null && newValue !== this._id) {
          this.setAttribute('id', this._id)
        }
        break
      }
    }
  }

  connectedCallback () {
    const { node } = this

    if (node) {
      this.addEventListener('pointerdown', this.onpointerdown)

      // Set a readonly id, prefixed by node id.
      const idPrefix = node.id
      const id = node.canvas.generateId(idPrefix)
      Object.defineProperty(this, '_id', { value: id, writable: false })
      this.setAttribute('id', id)
    }
  }

  disconnectedCallback () {
    const { node } = this

    if (node) {
      this.removeEventListener('pointerdown', this.onpointerdown)
    }
  }

  onpointerdown (event) {
    event.stopPropagation()
  }

  get node () {
    const { parentNode } = this

    if (parentNode.tagName === 'DIV' && (
      ['inputs', 'outputs'].includes(parentNode.slot)
    )) {
      const grandParentNode = parentNode.parentNode

      if (grandParentNode.tagName === 'FV-NODE') {
        return grandParentNode
      }
    }
  }
}
