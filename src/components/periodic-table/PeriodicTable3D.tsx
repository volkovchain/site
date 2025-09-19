'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useAppStore } from '@/stores/useAppStore'
import { periodicElements } from '@/lib/periodicData'
import { ElementCube } from './ElementCube'
import { ElementDetailModal } from './ElementDetailModal'
import { TableControls } from './TableControls'

function PeriodicTableScene() {
  const { periodicTable, setSelectedElement } = useAppStore()
  const { searchQuery, filterCategory } = periodicTable
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter elements based on search and category
  const filteredElements = periodicElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || element.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Calculate grid position for elements - responsive layout
  const calculatePosition = (index: number): [number, number, number] => {
    const cols = isMobile ? Math.min(3, Math.ceil(Math.sqrt(filteredElements.length))) : Math.ceil(Math.sqrt(filteredElements.length))
    const spacing = isMobile ? 1.2 : 1.5
    const row = Math.floor(index / cols)
    const col = index % cols
    
    // Center the grid
    const startX = -(cols - 1) * spacing / 2
    const startZ = -(Math.ceil(filteredElements.length / cols) - 1) * spacing / 2
    
    return [startX + col * spacing, 0, startZ + row * spacing]
  }

  return (
    <>
      {filteredElements.map((element, index) => (
        <ElementCube
          key={element.symbol}
          element={element}
          position={calculatePosition(index)}
          onClick={() => setSelectedElement(element)}
          isMobile={isMobile}
        />
      ))}
      <Environment preset="city" />
    </>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

export function PeriodicTable3D() {
  const { periodicTable, setSelectedElement } = useAppStore()
  const { selectedElement } = periodicTable
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="w-full h-screen relative">
      {/* Controls */}
      <div className={`absolute ${isMobile ? 'top-2 left-2 right-2' : 'top-4 left-4'} z-10`}>
        <TableControls isMobile={isMobile} />
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ 
          position: isMobile ? [0, 6, 8] : [0, 8, 12], 
          fov: isMobile ? 70 : 60 
        }}
        className="bg-gradient-to-b from-dark to-black"
      >
        <Suspense fallback={null}>
          <PeriodicTableScene />
          <OrbitControls 
            enableZoom={true}
            enablePan={isMobile}
            enableRotate={true}
            maxDistance={isMobile ? 15 : 20}
            minDistance={isMobile ? 3 : 5}
            maxPolarAngle={Math.PI / 2}
            touches={{
              ONE: isMobile ? 2 : 0,  // Rotate on mobile
              TWO: isMobile ? 1 : 0   // Pan on mobile
            }}
          />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#6C5CE7" />
        </Suspense>
      </Canvas>

      {/* Element Detail Modal */}
      {selectedElement && (
        <ElementDetailModal
          element={selectedElement}
          open={!!selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* Mobile help text */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-sm p-3 rounded-lg text-center">
          Tap to rotate • Pinch to zoom • Tap element for details
        </div>
      )}

      {/* Loading overlay for initial load */}
      <Suspense fallback={<Loading />} />
    </div>
  )
}

// Default export for lazy loading
export default PeriodicTable3D