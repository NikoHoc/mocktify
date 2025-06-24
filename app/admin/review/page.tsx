export default function AdminReviews() {
  // Mock data - in a real implementation, this would come from your database
  const reviewsByTrack = [
    {
      trackId: 1,
      trackName: "Bohemian Rhapsody",
      artist: "Queen",
      reviews: [
        { id: 101, content: "A timeless classic! The composition is brilliant.", user: "user1@example.com", date: "2025-06-15T14:30:00Z" },
        { id: 102, content: "The transitions between different musical styles are so smooth.", user: "user2@example.com", date: "2025-06-10T09:45:00Z" },
      ]
    },
    {
      trackId: 2,
      trackName: "Imagine",
      artist: "John Lennon",
      reviews: [
        { id: 103, content: "Such a peaceful and meaningful song.", user: "user3@example.com", date: "2025-06-18T16:20:00Z" },
      ]
    },
    {
      trackId: 3,
      trackName: "Billie Jean",
      artist: "Michael Jackson",
      reviews: [
        { id: 104, content: "That bassline is instantly recognizable!", user: "user4@example.com", date: "2025-06-20T11:15:00Z" },
        { id: 105, content: "One of the best pop songs ever created.", user: "user1@example.com", date: "2025-06-05T13:40:00Z" },
        { id: 106, content: "The production quality was ahead of its time.", user: "user2@example.com", date: "2025-05-28T10:30:00Z" },
      ]
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Review Management</h1>
      
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search reviews..."
          className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <select className="bg-gray-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">All Songs</option>
          <option value="1">Bohemian Rhapsody</option>
          <option value="2">Imagine</option>
          <option value="3">Billie Jean</option>
        </select>
      </div>
      
      <div className="space-y-8">
        {reviewsByTrack.map(track => (
          <div key={track.trackId} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-800">
              <h2 className="text-lg font-medium">{track.trackName}</h2>
              <p className="text-sm text-gray-400">{track.artist}</p>
            </div>
            
            <div className="divide-y divide-gray-800">
              {track.reviews.map(review => (
                <div key={review.id} className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="font-medium text-white">
                        {review.user}
                      </div>
                      <span className="mx-2">•</span>
                      <div>
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <button className="text-red-500 hover:text-red-400">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">{review.content}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}