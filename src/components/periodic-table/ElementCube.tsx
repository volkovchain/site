'use client'

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box } from '@react-three/drei'
import { Mesh } from 'three'
import type { PeriodicElement } from '@/types'

interface ElementCubeProps {
  element: PeriodicElement
  position: [number, number, number]
  onClick: () => void
  isMobile?: boolean
}

export function ElementCube({ element, position, onClick }: ElementCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Animate rotation and hover effects
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.002
      
      // Hover animation
      if (hovered) {
        meshRef.current.scale.setScalar(1.1)
        meshRef.current.position.y = position[1] + 0.2
      } else {
        meshRef.current.scale.setScalar(1)
        meshRef.current.position.y = position[1]
      }
    }
  })

  const handleClick = (event: any) => {
    event.stopPropagation()
    onClick()
  }

  return (
    <group position={position}>
      {/* Main cube */}
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={element.color}
          metalness={0.3}
          roughness={0.4}
          emissive={hovered ? element.color : '#000000'}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </Box>

      {/* Element symbol */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {element.symbol}
      </Text>

      {/* Atomic number */}
      <Text
        position={[-0.35, 0.35, 0.51]}
        fontSize={0.15}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-regular.woff"
      >
        {element.atomicNumber}
      </Text>

      {/* Element name (visible on hover) */}
      {hovered && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
        >
          {element.name}
        </Text>
      )}
    </group>
  )
}