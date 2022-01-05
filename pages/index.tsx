import { FC, useRef, useState } from 'react'
import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MeshProps, useFrame } from '@react-three/fiber'
import Head from 'next/head'

const Box: FC<MeshProps> = props => {
  const mesh = useRef<THREE.Mesh>(null!)
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    mesh.current.rotation.x += 0.01
    mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => { event.stopPropagation(); setActive(prev => !prev) }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(prev => !prev) }}
      onPointerOut={(event) => { event.stopPropagation(); setHovered(prev => !prev) }}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Home: NextPage = () => {
  return (<>
    <Head>
      <title>Magic Cube - Rubik</title>
    </Head>
    <div className="h-full bg-gradient-radial from-gray-600 to-gray-900">
      <Canvas style={{ height: '100vh' }}>
        <OrbitControls enablePan={false} maxDistance={5} minDistance={3} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>
  </>)
}

export default Home
