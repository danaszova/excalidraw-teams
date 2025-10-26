import React, { useEffect, useRef, useState } from 'react'

interface WhiteboardEmbedProps {
  sceneId?: string
 onSceneChange?: (sceneData: any) => void
  readOnly?: boolean
}

declare global {
  interface Window {
    Excalidraw: any
  }
}

const WhiteboardEmbed: React.FC<WhiteboardEmbedProps> = ({ 
  sceneId, 
  onSceneChange, 
  readOnly = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const excalidrawRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExcalidraw = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load Excalidraw script dynamically
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@excalidraw/excalidraw@0.12.0/dist/excalidraw.production.min.js'
        script.async = true
        
        script.onload = async () => {
          try {
            // Wait a bit for the global to be available
            await new Promise(resolve => setTimeout(resolve, 500))
            
            if (window.Excalidraw) {
              // Create Excalidraw component
              const Excalidraw = window.Excalidraw.default || window.Excalidraw
              
              if (containerRef.current && !excalidrawRef.current) {
                // Initialize Excalidraw
                const excalidrawAPI = Excalidraw(containerRef.current, {
                  initialData: {
                    appState: {
                      viewModeEnabled: readOnly,
                      zenModeEnabled: false,
                      gridSize: 20,
                      theme: 'light',
                    }
                  }
                })
                
                excalidrawRef.current = excalidrawAPI
                
                // Set up scene change listener
                if (onSceneChange) {
                  const handleSceneChange = () => {
                    if (excalidrawAPI) {
                      const sceneData = excalidrawAPI.getSceneElements()
                      if (sceneData) {
                        onSceneChange(sceneData)
                      }
                    }
                  }
                  
                  // Debounced scene change handler
                  let timeoutId: number
                  const debouncedSceneChange = () => {
                    clearTimeout(timeoutId)
                    timeoutId = setTimeout(handleSceneChange, 100) // 1 second debounce
                  }
                  
                  // Listen for element changes
                  excalidrawAPI.on('change', debouncedSceneChange)
                }
              }
            } else {
              setError('Failed to load Excalidraw')
            }
          } catch (err) {
            setError('Error initializing Excalidraw')
            console.error('Excalidraw initialization error:', err)
          } finally {
            setIsLoading(false)
          }
        }
        
        script.onerror = () => {
          setError('Failed to load Excalidraw script')
          setIsLoading(false)
        }
        
        document.head.appendChild(script)
        
        // Cleanup
        return () => {
          if (excalidrawRef.current) {
            excalidrawRef.current.destroy()
            excalidrawRef.current = null
          }
          document.head.removeChild(script)
        }
      } catch (err) {
        setError('Error loading Excalidraw')
        setIsLoading(false)
        console.error('Excalidraw load error:', err)
      }
    }

    loadExcalidraw()
 }, [onSceneChange, readOnly])

  // Load scene data if provided
  useEffect(() => {
    if (excalidrawRef.current && sceneId) {
      // In a real implementation, you would fetch the scene data from your API
      // For now, we'll just clear and set up a new scene
      excalidrawRef.current.resetScene()
    }
  }, [sceneId])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Whiteboard</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading whiteboard...</span>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`w-full h-full ${isLoading ? 'hidden' : 'block'}`}
        style={{ height: '100%', minHeight: '600px' }}
      />
    </div>
  )
}

export default WhiteboardEmbed
