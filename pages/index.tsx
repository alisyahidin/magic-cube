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
      const steps = [...new Array(random(15, 30))].map((_, index) => ({ ...faces[random(0, faces.length)], index }))
      randomStep.current = steps
      setCurrentStep(steps[0])
    }
  }

  useEffect(() => {
    if (currentStep) {
      rubik.current.rotate(currentStep.face as keyof RubikRotation, currentStep.inversed)
        .then(() => {
          const nextStep = randomStep.current.find(step => step.index === currentStep.index + 1)
          if (isScrambling) setCurrentStep(nextStep)
          if (!Boolean(nextStep)) setIsScrambling(false)
        })
    }
  }, [rubik.current, randomStep.current, currentStep, isScrambling, setIsScrambling, setCurrentStep])

  const progress = currentStep?.index
    ? Math.ceil(((currentStep?.index + 1) / randomStep.current.length) * 100)
    : 0

  return (<>
    <Head>
      <title>Magic Cube - Rubik 3x3</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="description" content="3D rubik cube 3x3" />
      <meta property="og:title" content="Magic Cube - Rubik 3x3" />
      <meta property="og:description" content="3D rubik cube 3x3" />
      <meta property="og:url" content="http://magic-cube.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://magic-cube.vercel.app/thumbnail.png" />
      <meta property="og:image:alt" content="Magic Cube - Rubik 3x3" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <link rel="canonical" href="http://magic-cube.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@alisyahidin_" />
      <meta name="twitter:site" content="@alisyahidin_" />
      <meta name="twitter:title" content="Magic Cube - Rubik 3x3" />
      <meta name="twitter:description" content="3D rubik cube 3x3" />
      <meta name="twitter:image" content="https://magic-cube.vercel.app/thumbnail.png" />
    </Head>
    <div className={`${styles['button-action']} container justify-between items-center px-4 top-8 h-14`}>
      <div className="flex items-center">
        <button onClick={scramble} className="btn md:btn-sm btn-secondary w-28">{isScrambling ? 'Stop' : 'Scramble'}</button>
        {isScrambling && <svg className="ml-4 stroke-secondary" height="30" width="30">
          <circle style={{ transition: 'stroke-dashoffset 300ms linear' }} strokeDasharray={100} strokeDashoffset={Math.ceil(100 - ((progress / 100) * 82))} cx="15" cy="15" r="13" strokeWidth="2" fillOpacity="0" />
        </svg>}
      </div>
      <div data-theme="dark" className="form-control">
        <input disabled={isScrambling} type="checkbox" onChange={e => setWithLabel(e.target.checked)} checked={withLabel} className="toggle toggle-secondary toggle-lg md:toggle-md" />
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
