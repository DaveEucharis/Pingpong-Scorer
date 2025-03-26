type T = (changeServe?: (firstServe?: boolean) => void) => void

export const dragListener: T = changeServe => {
  const body = document.body
  if (!changeServe) {
    body.ontouchstart = null
    body.ontouchmove = null
    return
  }

  let initialX = 0
  let currentX = 0

  body.ontouchstart = e => {
    initialX = e.changedTouches[0].clientX

    body.ontouchmove = e => {
      currentX = e.changedTouches[0].clientX

      const targetX = initialX + 150
      if (currentX > targetX) {
        body.ontouchmove = null
        changeServe(true)
      }
    }
  }
}
