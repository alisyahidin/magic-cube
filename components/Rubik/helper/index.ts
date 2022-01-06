import { Object3D, Quaternion } from 'three'
import { RubikRotation } from '../entity/cube'
import state from '../state'

// -------------- rotate box
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
    .filter(position => position.includes(face))
    .map(key => state[key as keyof typeof state])

  return objects.filter(cube => rotationPieces.includes(cube.name))
}