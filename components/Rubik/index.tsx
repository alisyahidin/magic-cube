import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react"
import { MathUtils } from 'three'
import Cube from "../Cube"
import CubeEntity, { RubikRotation } from "./entity/cube"
import Move from "./entity/move"
import { rotateAroundWorldAxis } from "./helper"
import state from './state'
import rotatePieces from './state/rotate'

export type RubikProps = {
  size?: number
  length?: number
}

export type RubikRef = {
  rotate: (rotation: keyof RubikRotation, inversed?: boolean, stepAngle?: number) => void
}

const defaultStepAngle: number = 6

const Rubik = forwardRef<RubikRef, RubikProps>(({ size = 3, length = 1 }, ref) => {
  const rubik = useRef<THREE.Mesh>(null!)
  const moveRef = useRef<Move>()

  const rotateBoxes = (face: keyof RubikRotation, targetAngle: number) => {
    const rotationPieces = Object.keys(state)
      .filter(position => position.includes(face))
      .map(key => state[key as keyof typeof state])

    const boxes = rubik.current.children.filter(cube => rotationPieces.includes(cube.name))

    for (let box of boxes) {
      rotateAroundWorldAxis(
        box,
        CubeEntity.rotation[face].axis,
        MathUtils.degToRad(-targetAngle)
      )
    }
  }

  const rotate = useCallback((face: keyof RubikRotation, inversed: boolean = false, stepAngle = defaultStepAngle): Promise<void> => {
    if (moveRef.current) return Promise.resolve()

    return new Promise<void>(resolve => {
      moveRef.current = new Move(face, ['B', 'L', 'D'].includes(face) ? !inversed : inversed, stepAngle)

      moveRef.current.onComplete(() => {
        rotatePieces(face, inversed)
        moveRef.current = undefined
        resolve()
      })

      moveRef.current.onProgress(move => {
        const targetSign = Math.sign(move.targetAngle)
        rotateBoxes(face, stepAngle * targetSign)
      })

    })
  }, [])

  useImperativeHandle(ref, () => ({ rotate }))

  useEffect(() => {
    const listenToKeyboard = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (Object.keys(CubeEntity.rotation).includes(key)) rotate(key as keyof RubikRotation)
    }

    window.addEventListener('keypress', listenToKeyboard)
    return () => window.removeEventListener('keypress', listenToKeyboard)
  }, [rotate])

  useFrame(() => { if (moveRef.current) moveRef.current.run() })

  const offset = (-size / 2) + 0.5 - 1

  return <group ref={rubik}>
    {[...Array(size)].map((_, x) =>
      [...Array(size)].map((_, y) =>
        [...Array(size)].map((_, z) => (
          <Cube
            name={`${x}-${y}-${z}`}
            key={`${x}-${y}-${z}`}
            position={[(x + (x * 1) + offset) * length, (y + (y * 1) + offset) * length, (z + (z * 1) + offset) * length]}
            faces={[
              x === size - 1 ? 'right' : null,
              x === 0 ? 'left' : null,
              y === size - 1 ? 'up' : null,
              y === 0 ? 'down' : null,
              z === size - 1 ? 'front' : null,
              z === 0 ? 'back' : null,
            ]}
          />
        ))
      )
    )}
  </group>
})

Rubik.displayName = 'Rubik'
export default Rubik