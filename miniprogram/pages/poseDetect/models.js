import * as tf from '@tensorflow/tfjs-core'

import * as posenet from '@tensorflow-models/posenet'

import { getFrameSliceOptions } from '../../utils/util'

import { drawKeypoints, drawSkeleton } from './util'

import { POSENET_URL } from '../../env'

export class Classifier {

  // 图像显示尺寸结构体 { width: Number, height: Number }
  displaySize

  // 神经网络模型
  poseNet

  // ready
  ready

  constructor(displaySize) {
    this.displaySize = {
      width: displaySize.width,
      height: displaySize.height
    }
    this.ready = false
  }
  //加载posenet模型
  load() { 
    return new Promise((resolve, reject) => {
      posenet
        .load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: 193,
          multiplier: 0.5,
          modelUrl: POSENET_URL
        })
        .then(model => {
          this.poseNet = model
          this.ready = true //准备就绪
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  isReady() {
    return this.ready
  }

  detectSinglePose(frame) {
    return new Promise((resolve, reject) => {
      const video = tf.tidy(() => {  //执行函数并防止内存泄漏
        // const temp = tf.tensor(new Uint8Array(frame.data), [frame.height, frame.width, 4])
        const imgData = {
          data: new Uint8Array(frame.data),
          width: frame.width,
          height: frame.height
        }
        const temp = tf.browser.fromPixels(imgData, 4)
        const sliceOptions = getFrameSliceOptions(frame.width, frame.height, this.displaySize.width, this.displaySize.height)
        return temp.slice(sliceOptions.start, sliceOptions.size).resizeBilinear([this.displaySize.height, this.displaySize.width])
      })
      // since images are being fed from a webcam
      const flipHorizontal = false
      this.poseNet.estimateSinglePose(video, { flipHorizontal }).then(pose => {
        video.dispose()
        resolve(pose)   //载入pose
      }).catch(err => {
        reject(err)
      })
    })
  }

  drawSinglePose(ctx, pose) {
    if (!ctx && !pose) {
      return
    }

    const minPoseConfidence = 0.3
    const minPartConfidence = 0.3
    //pose.keypoints代表身体关键点位置
    if (pose.score >= minPoseConfidence) {
      drawKeypoints(pose.keypoints, minPartConfidence, ctx)
      drawSkeleton(pose.keypoints, minPartConfidence, ctx)
    }

    ctx.draw()
    return pose
  }

  dispose() {
    this.poseNet.dispose()
  }
}