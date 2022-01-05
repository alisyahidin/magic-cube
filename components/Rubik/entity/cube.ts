import { Vector3 } from "three"
import rotate from "../state/rotate"

export type RubikRotation = {
  F: { axis: THREE.Vector3 },
  B: { axis: THREE.Vector3 },
  U: { axis: THREE.Vector3 },
  D: { axis: THREE.Vector3 },
  R: { axis: THREE.Vector3 },
  L: { axis: THREE.Vector3 },
  // M: { axis: THREE.Vector3 },
  // S: { axis: THREE.Vector3 },
  // E: { axis: THREE.Vector3 },
}

export default class Cube {
  size: number

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
    F: { axis: Cube.axis.Z },
    B: { axis: Cube.axis.Z },
    U: { axis: Cube.axis.Y },
    D: { axis: Cube.axis.Y },
    R: { axis: Cube.axis.X },
    L: { axis: Cube.axis.X },
    // M: { axis: Cube.axis.Y },
    // S: { axis: Cube.axis.X },
    // E: { axis: Cube.axis.Z },
  }

  static rotate = rotate

  constructor(size: number) {
    this.size = size
  }
}