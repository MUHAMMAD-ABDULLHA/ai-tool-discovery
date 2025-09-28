import React, { useState } from "react";
import useBookmarks from "../hooks/Bookmarks";

const Bookmarks = () => {
  const {
    bookmarks,
    loading,
    error,
    createCollection,
    addToolToCollection,
    removeToolFromCollection,
    deleteCollection,
  } = useBookmarks();

  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedToolId, setSelectedToolId] = useState(""); // Tool ID input
  const [selectedCollectionId, setSelectedCollectionId] = useState(""); // For add/remove

  // Handle create new collection
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName) return;
    await createCollection({ name: newCollectionName });
    setNewCollectionName("");
  };

  // Handle add tool
  const handleAddTool = async (e) => {
    e.preventDefault();
    if (!selectedCollectionId || !selectedToolId) return;
    await addToolToCollection({
      collectionId: selectedCollectionId,
      toolId: selectedToolId,
    });
    setSelectedToolId("");
  };

  // Handle remove tool
  const handleRemoveTool = async (collectionId, toolId) => {
    await removeToolFromCollection({ collectionId, toolId });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📌 Bookmarks & Collections</h1>

      {/* Loading & Error */}
      {loading && <p className="text-gray-500">Loading collections...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Collection */}
      <form
        onSubmit={handleCreateCollection}
        className="flex gap-2 mb-6 items-center"
      >
        <input
          type="text"
          placeholder="New collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          className="border rounded-md p-2 flex-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          + Create
        </button>
      </form>

      {/* Add Tool to Collection */}
      <form
        onSubmit={handleAddTool}
        className="flex gap-2 mb-6 items-center"
      >
        <select
          value={selectedCollectionId}
          onChange={(e) => setSelectedCollectionId(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">Select collection</option>
          {bookmarks.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tool ID"
          value={selectedToolId}
          onChange={(e) => setSelectedToolId(e.target.value)}
          className="border rounded-md p-2 flex-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
        >
          Add Tool
        </button>
      </form>

      {/* Collections List */}
      <div className="space-y-6">
        {bookmarks.length === 0 && (
          <p className="text-gray-500">No collections yet.</p>
        )}

        {bookmarks.map((collection) => (
          <div
            key={collection._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{collection.name}</h2>
              <button
                onClick={() => deleteCollection(collection._id)}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-400"
              >
                Delete
              </button>
            </div>

            {/* Tools inside collection */}
            <ul className="mt-3 space-y-2">
              {collection.tools && collection.tools.length > 0 ? (
                collection.tools.map((tool) => (
                  <li
                    key={tool._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>{tool.name || `Tool ID: ${tool._id}`}</span>
                    <button
                      onClick={() =>
                        handleRemoveTool(collection._id, tool._id)
                      }
                      className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No tools added.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
