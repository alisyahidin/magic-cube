import { Vector3 } from "three"

export type RubikRotation = {
  F: { axis: THREE.Vector3 },
  B: { axis: THREE.Vector3 },
  U: { axis: THREE.Vector3 },
  D: { axis: THREE.Vector3 },
  R: { axis: THREE.Vector3 },
  L: { axis: THREE.Vector3 },
  M: { axis: THREE.Vector3 },
  // S: { axis: THREE.Vector3 },
  // E: { axis: THREE.Vector3 },
}

export default class CubeEntity {
  static angles = {
    CLOCKWISE: 90,
    COUNTERCLOCKWISE: -90
  }

  static axis = {
    X: new Vector3(1, 0, 0),
    Y: new Vector3(0, 1, 0),
    Z: new Vector3(0, 0, 1)
  }

  static rotation: RubikRotation = {
    F: { axis: CubeEntity.axis.Z },
    B: { axis: CubeEntity.axis.Z },
    U: { axis: CubeEntity.axis.Y },
    D: { axis: CubeEntity.axis.Y },
    R: { axis: CubeEntity.axis.X },
    L: { axis: CubeEntity.axis.X },
    M: { axis: CubeEntity.axis.X },
    // S: { axis: CubeEntity.axis.Z },
    // E: { axis: CubeEntity.axis.Y },
  }
}