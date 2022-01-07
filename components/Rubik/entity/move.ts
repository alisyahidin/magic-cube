// https://github.com/rqbazan/react-three-fiber-101/blob/master/src/entities/move.ts
import noop from 'lodash.noop'
import Cube, { RubikRotation } from './cube'

export default class Move {
  rotation: keyof RubikRotation

  targetAngle: number

  currentAngle: number

  stepAngle: number

  complete = noop

  progress: (self: Move) => void = noop

  constructor(rotation: keyof RubikRotation, inversed: boolean, stepAngle: number) {
    this.rotation = rotation
    this.stepAngle = stepAngle
    this.currentAngle = 0
    this.targetAngle = inversed
      ? Cube.angles.COUNTERCLOCKWISE
      : Cube.angles.CLOCKWISE
  }

  onComplete(callback: () => void) {
    this.complete = callback
  }

  onProgress(callback: (self: Move) => void) {
    this.progress = callback
  }

  run() {
    if (this.currentAngle === this.targetAngle) {
      this.complete()
      return
    }

    const targetSign = Math.sign(this.targetAngle)
    this.currentAngle += this.stepAngle * targetSign

    if (Math.abs(this.currentAngle) > Math.abs(this.targetAngle)) {
      this.currentAngle = this.targetAngle
    }

    this.progress(this)
  }
}