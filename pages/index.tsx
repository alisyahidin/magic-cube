import { Html, OrbitControls, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Suspense, useEffect, useRef, useState } from 'react'
import Rubik, { RubikRef } from '../components/Rubik'
import type { RubikRotation } from '../components/Rubik/entity/cube'
import styles from '../styles/rubik.module.css'

const Loader = () => {
  const { progress } = useProgress()
  return <Html center>
    <progress value={progress} />
  </Html>
}

const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

type Face = { face: string, inversed: boolean }

const faces: Face[] = ['U', 'F', 'L', 'D', 'B', 'R']
  .flatMap(face => [{ face, inversed: false }, { face, inversed: true }])

const Home: NextPage = () => {
  const rubik = useRef<RubikRef>(null!)
  const randomStep = useRef<Array<Face & { index: number }>>([])

  const [withLabel, setWithLabel] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [currentStep, setCurrentStep] = useState<Face & { index: number } | undefined>(undefined)

  const scramble = () => {
    if (isScrambling) {
      setCurrentStep(undefined)
      randomStep.current = []
      setIsScrambling(false)
      return
    } else {
      setIsScrambling(true)
      const steps = [...new Array(random(10, 30))].map((_, index) => ({ ...faces[random(0, faces.length)], index }))
      randomStep.current = steps
      setCurrentStep(steps[0])
    }
  }

  useEffect(() => {
    if (currentStep) {
      rubik.current.rotate(currentStep.face as keyof RubikRotation, currentStep.inversed)
        .then(() => {
          if (isScrambling) setCurrentStep(randomStep.current.find(step => step.index === currentStep.index + 1))
        })
    }
  }, [rubik.current, randomStep.current, currentStep, isScrambling, setCurrentStep])

  return (<>
    <Head>
      <title>Magic Cube - Rubik</title>
    </Head>
    <div className={`${styles['button-action']} container justify-between items-center px-4 top-8 h-14`}>
      <div className="flex items-center">
        <button onClick={scramble} className="btn md:btn-sm btn-secondary w-28">{isScrambling ? 'Stop' : 'Scramble'}</button>
      </div>
      <div data-theme="dark" className="form-control">
        <input type="checkbox" onChange={e => setWithLabel(e.target.checked)} checked={withLabel} className="toggle toggle-secondary toggle-lg md:toggle-md" />
      </div>
    </div>
    <div className="h-screen bg-gradient-radial from-gray-600 to-gray-900">
      <Canvas camera={{ position: [-2, 2, 3] }} style={{ height: '90%' }}>
        <OrbitControls enablePan={false} zoomSpeed={0.3} maxDistance={16} minDistance={12} />
        <ambientLight />
        <pointLight color={0xFFF} position={[10, 10, 10]} />
        <Suspense fallback={<Loader />}>
          <Rubik ref={rubik} withFaceLabel={withLabel} />
        </Suspense>
      </Canvas>
    </div>
    <div className={styles['button-action--bottom']}>
      <div>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('U')} className="btn md:btn-sm btn-secondary">U</button>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('U', true)} className="btn md:btn-sm btn-secondary">U&apos;</button>
      </div>
      <div>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('F')} className="btn md:btn-sm btn-secondary">F</button>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('F', true)} className="btn md:btn-sm btn-secondary">F&apos;</button>
      </div>
      <div>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('L')} className="btn md:btn-sm btn-secondary">L</button>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('L', true)} className="btn md:btn-sm btn-secondary">L&apos;</button>
      </div>
      <div>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('D')} className="btn md:btn-sm btn-secondary">D</button>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('D', true)} className="btn md:btn-sm btn-secondary">D&apos;</button>
      </div>
      <div>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('B')} className="btn md:btn-sm btn-secondary">B</button>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('B', true)} className="btn md:btn-sm btn-secondary">B&apos;</button>
      </div>
      <div>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('R')} className="btn md:btn-sm btn-secondary">R</button>
        <button disabled={isScrambling} onClick={() => rubik.current.rotate('R', true)} className="btn md:btn-sm btn-secondary">R&apos;</button>
      </div>
    </div>
  </>)
}

export default Home
