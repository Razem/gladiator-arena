export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
}

export class Circle {
  constructor(
    public x: number,
    public y: number,
    public radius: number
  ) {}
}

// Source: http://www.jeffreythompson.org/collision-detection/circle-rect.php
export function testCircleRectangleCollision(c: Circle, r: Rectangle) {
  let testX = c.x
  let testY = c.y
  if (c.x < r.x) {
    testX = r.x
  }
  else if (c.x > r.x + r.width) {
    testX = r.x + r.width
  }
  if (c.y < r.y){
    testY = r.y
  }
  else if (c.y > r.y + r.height) {
    testY = r.y + r.height
  }

  const distX = c.x - testX
  const distY = c.y - testY
  const distance = Math.sqrt(distX * distX + distY * distY)
  return distance < c.radius
}
