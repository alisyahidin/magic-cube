import { Suspense, useRef, useState } from 'react'
import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Head from 'next/head'
import Rubik, { RubikRef } from '../components/Rubik'
import styles from '../styles/rubik.module.css'

const Loader = () => {
  const { progress } = useProgress()
  return <Html center>
    <progress value={progress} />
  </Html>
}

const Home: NextPage = () => {
  const rubik = useRef<RubikRef>(null!)
  const [withLabel, setWithLabel] = useState(false)

  return (<>
    <Head>
      <title>Magic Cube - Rubik</title>
    </Head>
    <div className={`${styles['button-action']} top-8 h-10`}>
      <h1></h1>
      <div data-theme="dark" className="form-control">
        <label className="cursor-pointer label" >
          <span className="label-text mr-2">Show Label</span>
          <input type="checkbox" onChange={e => setWithLabel(e.target.checked)} checked={withLabel} className="toggle toggle-secondary" />
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
    <div className={styles['button-action']}>
      <div>
        <button onClick={() => rubik.current.rotate('U')} className="btn btn-secondary">U</button>
        <button onClick={() => rubik.current.rotate('U', true)} className="btn btn-secondary">U&apos;</button>
      </div>
      <div>
        <button onClick={() => rubik.current.rotate('F')} className="btn btn-secondary">F</button>
        <button onClick={() => rubik.current.rotate('F', true)} className="btn btn-secondary">F&apos;</button>
      </div>
      <div>
        <button onClick={() => rubik.current.rotate('L')} className="btn btn-secondary">L</button>
        <button onClick={() => rubik.current.rotate('L', true)} className="btn btn-secondary">L&apos;</button>
      </div>
      <div>
        <button onClick={() => rubik.current.rotate('D')} className="btn btn-secondary">D</button>
        <button onClick={() => rubik.current.rotate('D', true)} className="btn btn-secondary">D&apos;</button>
      </div>
      <div>
        <button onClick={() => rubik.current.rotate('B')} className="btn btn-secondary">B</button>
        <button onClick={() => rubik.current.rotate('B', true)} className="btn btn-secondary">B&apos;</button>
      </div>
      <div>
        <button onClick={() => rubik.current.rotate('R')} className="btn btn-secondary">R</button>
        <button onClick={() => rubik.current.rotate('R', true)} className="btn btn-secondary">R&apos;</button>
      </div>
    </div>
  </>)
}

export default Home
