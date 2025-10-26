import React, { useRef, useState } from 'react'

interface WhiteboardEmbedProps {
  sceneId?: string
  onSceneChange?: (sceneData: any) => void
  readOnly?: boolean
}

const WhiteboardEmbed: React.FC<WhiteboardEmbedProps> = ({ 
  sceneId: _sceneId, 
  onSceneChange: _onSceneChange, 
  readOnly: _readOnly = false 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('WhiteboardEmbed: Component rendering, isLoading:', isLoading, 'error:', error)

  const handleIframeLoad = () => {
    console.log('WhiteboardEmbed: Iframe loaded successfully')
    setIsLoading(false)
  }

  const handleIframeError = () => {
    console.error('WhiteboardEmbed: Iframe failed to load')
    setError('Failed to load Excalidraw')
    setIsLoading(false)
  }

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
    <div className="w-full h-full bg-white relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading whiteboard...</p>
            <p className="text-gray-400 text-xs mt-2">Connecting to Excalidraw...</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src="http://localhost:8080"
        className="w-full h-full border-0"
        style={{ minHeight: '600px' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="Excalidraw Whiteboard"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}

export default WhiteboardEmbed
