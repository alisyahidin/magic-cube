import { Text } from "@react-three/drei"
import { GroupProps, useFrame } from "@react-three/fiber"
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Euler, MathUtils } from 'three'
import Cube from "../Cube"
import CubeEntity, { RubikRotation } from "./entity/cube"
import Move from "./entity/move"
import { getBoxes, rotateAroundWorldAxis } from "./helper"
import rotatePieces from './state/rotate'

export type RubikProps = {
  size?: number
} & GroupProps

export type RubikRef = {
  rotate: (rotation: keyof RubikRotation, inversed?: boolean, stepAngle?: number) => Promise<void>,
  showLabel: (value: boolean) => void
}

const defaultStepAngle: number = 6

const Rubik = forwardRef<RubikRef, RubikProps>(({ size = 3, ...props }, ref) => {
  const rubik = useRef<THREE.Mesh>(null!)
  const moveRef = useRef<Move>()
  const shiftKeyPressed = useRef<boolean>(false)
  const [showLabel, setShowLabel] = useState(false)

  const rotateBoxes = (face: keyof RubikRotation, targetAngle: number) => {
    const boxes = getBoxes(rubik.current.children, face)
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

  useImperativeHandle(ref, () => ({ rotate, showLabel: (value: boolean) => setShowLabel(value) }))

  useEffect(() => {
    const listenToKeyboard = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (key === 'SHIFT') shiftKeyPressed.current = true
      if (Object.keys(CubeEntity.rotation).includes(key)) rotate(key as keyof RubikRotation, shiftKeyPressed.current)
    }

    window.addEventListener('keydown', listenToKeyboard)
    window.addEventListener('keyup', e => {
      if (e.key === 'Shift') shiftKeyPressed.current = false
    })
    return () => {
      window.removeEventListener('keydown', listenToKeyboard)
      window.removeEventListener('keyup', e => {
        if (e.key === 'Shift') shiftKeyPressed.current = false
      })
    }
  }, [rotate])

  useFrame(() => { if (moveRef.current) moveRef.current.run() })

  const offset = (-size / 2) + 0.5 - 1
  const opacity = showLabel ? 1 : 0
  return <group {...props}>
    <Text fillOpacity={opacity} outlineOpacity={opacity} position={[0, 0, 4.5]} outlineColor={0x000} outlineWidth={0.025} fontSize={1.3}>
      Front
    </Text>
    <Text fillOpacity={opacity} outlineOpacity={opacity} position={[0, 0, -4.5]} rotation={new Euler(0, Math.PI, 0)} outlineColor={0x000} outlineWidth={0.025} fontSize={1.3}>
      Back
    </Text>
    <Text fillOpacity={opacity} outlineOpacity={opacity} position={[0, 4.5, 0]} rotation={new Euler(-Math.PI / 2, 0, 0)} outlineColor={0x000} outlineWidth={0.025} fontSize={1.3}>
      Up
    </Text>
    <Text fillOpacity={opacity} outlineOpacity={opacity} position={[0, -4.5, 0]} rotation={new Euler(Math.PI / 2, 0, 0)} outlineColor={0x000} outlineWidth={0.025} fontSize={1.3}>
      Down
    </Text>
    <Text fillOpacity={opacity} outlineOpacity={opacity} position={[4.5, 0, 0]} rotation={new Euler(0, Math.PI / 2, 0)} outlineColor={0x000} outlineWidth={0.025} fontSize={1.3}>
      Right
    </Text>
    <Text fillOpacity={opacity} outlineOpacity={opacity} position={[-4.5, 0, 0]} rotation={new Euler(0, -Math.PI / 2, 0)} outlineColor={0x000} outlineWidth={0.025} fontSize={1.3}>
      Left
    </Text>
    <group ref={rubik}>
      {[...Array(size)].map((_, x) =>
        [...Array(size)].map((_, y) =>
          [...Array(size)].map((_, z) => (
            <Cube
              name={`${x}-${y}-${z}`}
              key={`${x}-${y}-${z}`}
              position={[(x + (x * 1) + offset), (y + (y * 1) + offset), (z + (z * 1) + offset)]}
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
    </group >
  </group>
})

Rubik.displayName = 'Rubik'
export default Rubik