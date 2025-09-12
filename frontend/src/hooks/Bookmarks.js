import { useEffect, useCallback } from "react";
import BookmarkStore from "../store/BookmarkStore";
import axios from "../api/axios";

const useBookmarks = () => {
  const {
    bookmarks,
    loading,
    error,
    setBookmarks,
    setLoading,
    setError,
  } = BookmarkStore();

  // 🔹 Fetch all user collections (GET /bookmarks) wrapped in useCallback
  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/bookmarks");
      setBookmarks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  }, [setBookmarks, setLoading, setError]);

  // 🔹 Create a new collection (POST /bookmarks)
  const createCollection = async (collectionData) => {
    try {
      const response = await axios.post("/bookmarks", collectionData);
      // Refresh bookmarks after creation
      fetchBookmarks();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create collection");
      throw err;
    }
  };

  // 🔹 Add a tool to collection (POST /bookmarks/add-tool)
  const addToolToCollection = async (data) => {
    try {
      const response = await axios.post("/bookmarks/add-tool", data);
      fetchBookmarks();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add tool");
      throw err;
    }
  };

  // 🔹 Remove a tool from collection (POST /bookmarks/remove-tool)
  const removeToolFromCollection = async (data) => {
    try {
      const response = await axios.post("/bookmarks/remove-tool", data);
      fetchBookmarks();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove tool");
      throw err;
    }
  };

  // 🔹 Delete collection (DELETE /bookmarks/:collectionId)
  const deleteCollection = async (collectionId) => {
    try {
      const response = await axios.delete(`/bookmarks/${collectionId}`);
      fetchBookmarks();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete collection");
      throw err;
    }
  };

  // ✅ Auto-fetch bookmarks when hook loads
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]); // dependency fixed

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    createCollection,
    addToolToCollection,
    removeToolFromCollection,
    deleteCollection,
  };
};

export default useBookmarks;
