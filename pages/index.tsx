import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Head from 'next/head'
import Rubik from '../components/Rubik'

const Home: NextPage = () => {
  return (<>
    <Head>
      <title>Magic Cube - Rubik</title>
    </Head>
    <div className="h-full bg-gradient-radial from-gray-600 to-gray-900">
      <Canvas camera={{ position: [-2, 3, 3] }} style={{ height: '100vh' }}>
        <OrbitControls enablePan={false} zoomSpeed={0.3} maxDistance={12} minDistance={10} />
        <ambientLight />
        <pointLight color={0xFFF} position={[10, 10, 10]} />
        <Rubik />
      </Canvas>
    </div>
  </>)
}

export default Home
