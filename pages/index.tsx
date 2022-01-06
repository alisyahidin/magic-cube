import { Html, OrbitControls, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Suspense, useEffect, useRef, useState } from 'react'
import Rubik, { RubikRef } from '../components/Rubik'
import type { RubikRotation } from '../components/Rubik/entity/cube'
import { fwdRing } from '../components/Rubik/state/rotate'
import styles from '../styles/rubik.module.css'

const Loader = () => {
  const { progress } = useProgress()
  return <Html center>
    <progress value={progress} />
  </Html>
}

const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

const Home: NextPage = () => {
  const rubik = useRef<RubikRef>(null!)
  const [withLabel, setWithLabel] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [scrumbleStep, setScrumbleStep] = useState<Array<keyof RubikRotation>>([])

  const scramble = () => {
    if (isScrambling) {
      setScrumbleStep([])
      setIsScrambling(false)
      return
    }
    setIsScrambling(true)
    setScrumbleStep([...new Array(random(10, 30))].map(() => fwdRing[random(0, fwdRing.length)] as keyof RubikRotation))
  }

  useEffect(() => {
    const run = async () => {
      for (let i = 0; i < scrumbleStep.length; i++) {
        if (isScrambling) await rubik.current.rotate(scrumbleStep[i])
      }
      setScrumbleStep([])
      setIsScrambling(false)
    }
    if (scrumbleStep.length > 0) run()
  }, [scrumbleStep, isScrambling, rubik.current])

  return (<>
    <Head>
      <title>Magic Cube - Rubik</title>
    </Head>
    <div className={`${styles['button-action']} container justify-between items-center px-4 top-8 h-14`}>
      <div>
        <button onClick={scramble} className="btn md:btn-sm btn-secondary">{isScrambling ? 'Stop' : 'Scramble'}</button>
      </div>
      <div data-theme="dark" className="form-control">
        <label className="cursor-pointer label" >
          <span className="label-text mr-2">Show Label</span>
          <input type="checkbox" onChange={e => setWithLabel(e.target.checked)} checked={withLabel} className="toggle toggle-secondary toggle-lg md:toggle-md" />
        </label>
      </div >
    </div >
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
