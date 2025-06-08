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
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Add to Playlist</h2>
        <ul className="space-y-2">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button
                onClick={() => onAdd(playlist.id)}
                className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
              >
                {playlist.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
