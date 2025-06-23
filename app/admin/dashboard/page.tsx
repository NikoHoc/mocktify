export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold">120</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Songs</p>
          <p className="text-2xl font-bold">456</p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-gray-400 text-sm">Total Reviews</p>
          <p className="text-2xl font-bold">789</p>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-800 pb-4">
            <p>New review posted for "Song Title"</p>
            <p className="text-sm text-gray-400">2 hours ago</p>
          </div>
          
          <div className="border-b border-gray-800 pb-4">
            <p>New user registered: user@example.com</p>
            <p className="text-sm text-gray-400">5 hours ago</p>
          </div>
          
          <div className="pb-4">
            <p>New playlist created: "Summer Vibes"</p>
            <p className="text-sm text-gray-400">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}