// https://github.com/rqbazan/react-three-fiber-101/blob/master/src/components/cube/helpers.ts
import { Object3D, Quaternion } from 'three'
import { RubikRotation } from '../entity/cube'
import state from '../state'

export function rotateAroundWorldAxis(
  object: THREE.Object3D,
  axisVector: THREE.Vector3,
  radians: number
) {
  const quaternion = new Quaternion()

  quaternion.setFromAxisAngle(axisVector, radians)

  object.quaternion.multiplyQuaternions(quaternion, object.quaternion)
  object.position.sub(axisVector)
  object.position.applyQuaternion(quaternion)
  object.position.add(axisVector)
}

export function getBoxes(objects: Object3D[], face: keyof RubikRotation, except = false): Object3D[] {
  const rotationPieces = Object.keys(state)
    .filter(position => {
      if (face === 'M') {
        return !position.includes('L') && !position.includes('R')
      } else {
        return position.includes(face)
      }
    })
    .map(key => state[key as keyof typeof state])

  return objects.filter(cube => rotationPieces.includes(cube.name))
}