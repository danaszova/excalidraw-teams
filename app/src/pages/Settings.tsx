import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/lib/auth-store'

export default function Settings() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="input-field mt-1"
                  defaultValue={user?.name || ''}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="input-field mt-1"
                  defaultValue={user?.email || ''}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <button className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="input-field mt-1"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  className="input-field mt-1"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  className="input-field mt-1"
                  placeholder="Confirm new password"
                />
              </div>
              <div>
                <button className="btn-primary">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="text-center">
              <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Settings Features</h3>
              <p className="mt-1 text-sm text-gray-500">Additional settings coming soon</p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Notification preferences</li>
              <li>• Theme customization</li>
              <li>• Privacy settings</li>
              <li>• Integration settings</li>
              <li>• Account management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
