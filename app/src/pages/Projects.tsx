import { FolderIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Organize your whiteboards into projects for better collaboration.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create your first project
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Project folders and organization</li>
            <li>• Whiteboard grouping</li>
            <li>• Project-based permissions</li>
            <li>• Project templates</li>
            <li>• Team project sharing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
