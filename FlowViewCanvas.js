import { FlowViewPin } from './FlowViewPin.js'

export class FlowViewCanvas extends HTMLElement {
  constructor() {
    super()

    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          --fv-shadow-color: rgba(0, 0, 0, 0.17);
          --fv-pin-size: ${this.pinSize}px;

          display: block;
          overflow: hidden;
          background-color: var(--fv-canvas-background-color, #fefefe);
          box-shadow: 1px 1px 7px 1px var(--fv-shadow-color);
          width: 100%;
          height: 100%;
          position: relative;
        }

        :host([hidden]) {
          display: none;
        }
      </style>

      <svg></svg>

      <slot></slot>
      `

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
  }

  get pinSize () {
    return 10
  }

  generateId (prefix = 'fv') {
    const randomString =  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)

    const id = `${prefix}:${randomString}`

    if (document.getElementById(id)) {
      return this.generateId()
    } else {
      return id
    }
  }
}
