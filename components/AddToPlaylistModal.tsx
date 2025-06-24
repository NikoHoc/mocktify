import React from "react";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: { id: string; name: string }[];
  onAdd: (playlistId: string) => void;
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  playlists,
  onAdd,
}: AddToPlaylistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#C8D9E6] bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#F5EFEB]/80 border border-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add to Playlist</h2>
        <ul className="space-y-2">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button
                onClick={() => onAdd(playlist.id)}
                className="w-full text-left px-4 py-2 rounded bg-white hover:bg-blue-100 border border-gray-300"
              >
                {playlist.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
