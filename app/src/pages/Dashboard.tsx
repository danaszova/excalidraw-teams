import { PlusIcon, RectangleGroupIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

// Mock data for now - will be replaced with API calls
const mockWhiteboards = [
  {
    id: '1',
    title: 'Team Brainstorming Session',
    updatedAt: '2024-01-15T10:30:00Z',
    owner: 'John Doe'
  },
  {
    id: '2', 
    title: 'Product Roadmap Planning',
    updatedAt: '2024-01-14T15:45:00Z',
    owner: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Architecture Diagram',
    updatedAt: '2024-01-13T09:15:00Z',
    owner: 'Bob Johnson'
  }
]

export default function Dashboard() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          to="/whiteboard"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Whiteboard
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Whiteboards</h2>
        
        {mockWhiteboards.length === 0 ? (
          <div className="text-center py-8">
            <RectangleGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No whiteboards</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new whiteboard.</p>
            <div className="mt-6">
              <Link to="/whiteboard" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Whiteboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockWhiteboards.map((whiteboard) => (
              <Link
                key={whiteboard.id}
                to={`/whiteboard/${whiteboard.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {whiteboard.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      by {whiteboard.owner}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Updated {formatDate(whiteboard.updatedAt)}
                    </p>
                  </div>
                  <RectangleGroupIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Whiteboards</span>
              <span className="font-medium">{mockWhiteboards.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active Collaborators</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Projects</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">John updated "Team Brainstorming"</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Jane created new whiteboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Bob shared "Architecture Diagram"</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Getting Started</h3>
          <div className="space-y-3">
            <Link to="/whiteboard" className="block text-sm text-blue-600 hover:text-blue-500">
              → Create your first whiteboard
            </Link>
            <Link to="/team" className="block text-sm text-blue-600 hover:text-blue-500">
              → Invite team members
            </Link>
            <Link to="/projects" className="block text-sm text-blue-600 hover:text-blue-500">
              → Organize into projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
