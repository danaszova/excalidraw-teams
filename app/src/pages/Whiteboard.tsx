import { useParams } from 'react-router-dom'

export default function Whiteboard() {
  const { id } = useParams()
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Whiteboard {id ? `#${id}` : 'Editor'}
            </h2>
            <p className="text-gray-600 mb-4">
              Excalidraw integration will be embedded here
            </p>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
              <p className="text-sm text-gray-500">
                This will contain the embedded Excalidraw whiteboard component
                <br />
                Connected to existing collaboration services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
