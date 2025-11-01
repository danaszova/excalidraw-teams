import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'
import WhiteboardEmbed from '@/components/WhiteboardEmbed/WhiteboardEmbed'
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function Whiteboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [whiteboardData, setWhiteboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load whiteboard data from API
  useEffect(() => {
    const loadWhiteboard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (id) {
          // Load existing whiteboard - allow access without authentication for shared whiteboards
          const headers: HeadersInit = {}
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
          headers['Content-Type'] = 'application/json'

          const response = await fetch(`http://localhost:3001/api/whiteboards/${id}`, {
            headers
          })

          if (!response.ok) {
            if (response.status === 403) {
              setError('You do not have permission to access this whiteboard')
              return
            }
            if (response.status === 404) {
              // Whiteboard doesn't exist, redirect to dashboard if logged in
              if (user) {
                navigate('/dashboard')
              } else {
                setError('Whiteboard not found')
              }
              return
            }
            throw new Error('Failed to load whiteboard')
          }

          const data = await response.json()
          setWhiteboardData(data)
        } else {
          // Create new whiteboard - requires authentication
          if (!user || !token) {
            navigate('/login')
            return
          }

          const response = await fetch('http://localhost:3001/api/whiteboards', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: 'Untitled Whiteboard',
              scene_data: null
            })
          })

          if (!response.ok) {
            throw new Error('Failed to create whiteboard')
          }

          const data = await response.json()
          setWhiteboardData(data)
          // Redirect to the new whiteboard URL
          navigate(`/whiteboard/${data.id}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error loading whiteboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadWhiteboard()
  }, [id, user, token, navigate])

  const handleSceneChange = async (sceneData: any) => {
    if (whiteboardData?.id && user?.id) {
      try {
        await fetch(`http://localhost:3001/api/whiteboards/${whiteboardData.id}/scene`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            scene_data: sceneData
          })
        })
      } catch (err) {
        console.error('Error saving scene:', err)
      }
    }
  }

  const getShareUrl = () => {
    if (!whiteboardData?.id) return ''
    return `${window.location.origin}/whiteboard/${whiteboardData.id}`
  }

  const getExcalidrawRoomUrl = () => {
    if (!whiteboardData?.scene_id) return ''
    // Excalidraw room format: room=sceneId,key
    return `http://localhost:8080/#room=${whiteboardData.scene_id},${whiteboardData.scene_id}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading whiteboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {whiteboardData?.title || 'Untitled Whiteboard'}
            </h1>
            <p className="text-sm text-gray-500">
              Whiteboard #{whiteboardData?.id}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {whiteboardData?.is_public ? 'Public' : 'Private'}
            </span>
            <button 
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Whiteboard</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share this link with others to collaborate:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getShareUrl()}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <ClipboardIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800 font-medium mb-2">
                🚀 Start Collaboration Session
              </p>
              <p className="text-sm text-yellow-700 mb-2">
                To enable real-time collaboration with other users, share this link:
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getExcalidrawRoomUrl()}
                  readOnly
                  className="flex-1 px-3 py-2 border border-yellow-300 rounded text-sm bg-yellow-50"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(getExcalidrawRoomUrl())}
                  className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  <ClipboardIcon className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>App Link:</strong> Anyone with this link can view and edit this whiteboard in real-time.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50">
        <WhiteboardEmbed 
          sceneId={whiteboardData?.scene_id}
          onSceneChange={handleSceneChange}
          readOnly={false}
        />
      </div>
    </div>
  )
}
