import React, { useState } from "react";

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playlist: { name: string; description?: string; imageFile?: File; user_id: string }) => void;
}

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") return;
    // Placeholder for user_id, to be replaced with actual user id fetching logic
    const user_id = "current-user-id-placeholder";
    onCreate({ name, description, imageFile: imageFile || undefined, user_id });
    setName("");
    setDescription("");
    setImageFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#C8D9E6] bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#F5EFEB]/80 backdrop-blur-md shadow-2xl p-6 w-96 max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20">
        <h2 className="text-xl font-semibold mb-4 text-[#2F4156]">Add New Playlist</h2>
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
          <label className="block mb-2 font-medium text-gray-700" htmlFor="playlistDescription">
            Description
          </label>
          <textarea
            id="playlistDescription"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <label className="block mb-2 font-medium text-gray-700" htmlFor="playlistImage">
            Upload Image (optional)
          </label>
          <input
            id="playlistImage"
            type="file"
            accept="image/*"
            className="w-full mb-2 cursor-pointer border border-gray-400 rounded px-2 py-1 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              } else {
                setImageFile(null);
              }
            }}
          />
          {imageFile && (
            <div className="mb-4 flex items-center space-x-4">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Selected"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setName("");
                setDescription("");
                setImageFile(null);
                onClose();
              }}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#C8D9E6] hover:bg-[#567C8D] text-[#2F4156] hover:text-[#F5EFEB] cursor-pointer transition"
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
