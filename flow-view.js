import { FlowViewCanvas } from './FlowViewCanvas.js'
import { FlowViewNode } from './FlowViewNode.js'
import { FlowViewPin } from './FlowViewPin.js'

const elementDefinitions = [
  {
    tagName: 'fv-canvas',
    elementClass: FlowViewCanvas
  },
  {
    tagName: 'fv-node',
    elementClass: FlowViewNode
  },
  {
    tagName: 'fv-pin',
    elementClass: FlowViewPin
  }
]

elementDefinitions.forEach(({ tagName, elementClass }) => {
  if (customElements.get(tagName)) {
    console.error(`Custom element already defined: ${tagName}`)
  } else {
    customElements.define(tagName, elementClass)
  }
})
