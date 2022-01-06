import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useProgress, Html } from '@react-three/drei'
import Head from 'next/head'
import Rubik from '../components/Rubik'
import { Suspense } from 'react'

const Loader = () => {
  const { progress } = useProgress()
  return <Html center>
    <progress value={progress} />
  </Html>
}

const Home: NextPage = () => {
  return (<>
    <Head>
      <title>Magic Cube - Rubik</title>
    </Head>
    <div className="h-full bg-gradient-radial from-gray-600 to-gray-900">
      <Canvas camera={{ position: [-2, 3, 3] }} style={{ height: '100vh' }}>
        <OrbitControls enablePan={false} zoomSpeed={0.3} maxDistance={17} minDistance={14} />
        <ambientLight />
        <pointLight color={0xFFF} position={[10, 10, 10]} />
        <Suspense fallback={<Loader />}>
          <Rubik />
        </Suspense>
      </Canvas>
    </div>
  </>)
}

export default Home
