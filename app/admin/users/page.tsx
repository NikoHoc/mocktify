export default function AdminUsers() {
  // Mock data - in a real implementation, this would come from your database
  const users = [
    { id: 1, email: 'user1@example.com', role: 'admin', created_at: '2025-05-15T10:00:00Z', last_sign_in: '2025-06-22T08:30:00Z' },
    { id: 2, email: 'user2@example.com', role: 'user', created_at: '2025-05-20T14:30:00Z', last_sign_in: '2025-06-20T16:45:00Z' },
    { id: 3, email: 'user3@example.com', role: 'user', created_at: '2025-06-01T09:15:00Z', last_sign_in: '2025-06-18T11:20:00Z' },
    { id: 4, email: 'user4@example.com', role: 'user', created_at: '2025-06-10T16:45:00Z', last_sign_in: '2025-06-15T14:10:00Z' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full max-w-md bg-gray-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Sign In
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        👤
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-gray-800 text-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(user.last_sign_in).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <a href="#" className="text-green-500 hover:text-green-400 mr-4">Edit</a>
                  <a href="#" className="text-red-500 hover:text-red-400">Disable</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}