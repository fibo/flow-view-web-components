export function findCanvasOf (item) {
  const { parentNode } = item

  if (parentNode && parentNode.tagName === 'FV-CANVAS') {
    return parentNode
  }
}

export function findNodeOfPin (pin) {
  const { parentNode } = pin

  if (parentNode && parentNode.tagName === 'DIV' && (
    ['inputs', 'outputs'].includes(parentNode.slot)
  )) {
    const grandParentNode = parentNode.parentNode

    if (grandParentNode.tagName === 'FV-NODE') {
      return grandParentNode
    }
  }
}

export function isInput (pin) {
  const { parentNode } = pin

  if (parentNode && parentNode.tagName === 'DIV') {
    return parentNode.slot === 'inputs'
  }

  return false
}

export function isOutput (pin) {
  const { parentNode } = pin

  if (parentNode && parentNode.tagName === 'DIV') {
    return parentNode.slot === 'outputs'
  }

  return false
}

export function centerOfPin (pin) {
  const node = findNodeOfPin(pin)

  const pinSize = sizeOfPin(pin)
  const halfPinSize = Math.round(pinSize / 2)

  if (node) {
    const x = Number(node.getAttribute('x'))
    const y = Number(node.getAttribute('y'))
    const width = Number(node.getAttribute('width'))

    const nodeBorderWidth = 1

    if (isInput(pin)) {
      return {
        x: x + halfPinSize,
        y: y + halfPinSize,
      }
    }

    if (isOutput(pin)) {
      const height = Number(node.getAttribute('height'))

      return {
        y: y + height - halfPinSize - nodeBorderWidth,
        x: x + halfPinSize + nodeBorderWidth
      }
    }
  }
}

export function sizeOfPin (pin) {
  const node = findNodeOfPin(pin)

  if (node) {
    const canvas = findCanvasOf(node)

    if (canvas) {
      return canvas.pinSize
    }
  }

  return 10
}
