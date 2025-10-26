import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'
import WhiteboardEmbed from '@/components/WhiteboardEmbed/WhiteboardEmbed'

export default function Whiteboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [whiteboardData, setWhiteboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load whiteboard data from API
  useEffect(() => {
    const loadWhiteboard = async () => {
      if (!user || !token) {
        navigate('/login')
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        if (id) {
          // Load existing whiteboard
          const response = await fetch(`http://localhost:3001/api/whiteboards/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            if (response.status === 404) {
              // Whiteboard doesn't exist, redirect to dashboard
              navigate('/dashboard')
              return
            }
            throw new Error('Failed to load whiteboard')
          }

          const data = await response.json()
          setWhiteboardData(data)
        } else {
          // Create new whiteboard
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

    if (user && token) {
      loadWhiteboard()
    }
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
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
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
