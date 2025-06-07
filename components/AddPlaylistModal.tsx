import React, { useState } from "react";

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playlist: { name: string; user_id: string }) => void;
}

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") return;
    // Placeholder for user_id, to be replaced with actual user id fetching logic
    const user_id = "current-user-id-placeholder";
    onCreate({ name, user_id });
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Playlist</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="playlistName">
            Playlist Name
          </label>
          <input
            id="playlistName"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setName("");
                onClose();
              }}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaylistModal;
