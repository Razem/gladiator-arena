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

export function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  const xDist = x1 - x2
  const yDist = y1 - y2
  return Math.sqrt(xDist * xDist + yDist * yDist)
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

  return calculateDistance(c.x, c.y, testX, testY) < c.radius
}

export function testCircleCircleCollision(c1: Circle, c2: Circle) {
  return calculateDistance(c1.x, c1.y, c2.x, c2.y) < (c1.radius + c2.radius)
}
