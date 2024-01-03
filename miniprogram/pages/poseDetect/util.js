import * as posenet from '@tensorflow-models/posenet'

const color = 'aqua'
const boundingBoxColor = 'red'
const lineWidth = 2

function toTuple({ y, x }) {
  return [y, x]
}

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath()   //创造路径
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color 
  ctx.fill()       //进行填充
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath()
  ctx.moveTo(ax * scale, ay * scale)
  ctx.lineTo(bx * scale, by * scale)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  ctx.stroke() //画线
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
// tslint:disable-next-line:no-any
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints =
    posenet.getAdjacentKeyPoints(keypoints, minConfidence) //连接需要连接的点

  // tslint:disable-next-line:no-any
  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
      scale, ctx)
      //console.log(keypoints[0].position.x)
  })
}

/**
 * Draw pose keypoints onto a canvas
 */
// tslint:disable-next-line:no-any
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i]
    //console.log(keypoints.length);
    if (keypoint.score < minConfidence) {
      continue
    }

    const { y, x } = keypoint.position
    drawPoint(ctx, y * scale, x * scale, 5, color)
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
// tslint:disable-next-line:no-any
export function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints)

  ctx.rect(
    boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY)

  ctx.strokeStyle = boundingBoxColor
  ctx.stroke()
}