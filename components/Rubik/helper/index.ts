import { Quaternion } from 'three'

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