import { create } from "zustand";
import api from "../utils/api";

export const useFileSystemStore = create((set, get) => ({
  currentFolder: null,
  breadcrumb: [{ id: null, name: "Root" }],
  folders: [],
  files: [],
  tree: [],
  recentFiles: [],
  loading: false,
  error: "",
  activeFileId: null,
  setActiveFile(fileId) {
    set({ activeFileId: fileId });
  },
  async fetchContents(folderId = null) {
    set({ loading: true, error: "" });
    try {
      const { data } = folderId
        ? await api.get(`/folders/${folderId}/contents`)
        : await api.get("/folders");

      set({
        currentFolder: data.currentFolder,
        breadcrumb: data.breadcrumb,
        folders: data.folders,
        files: data.files,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to load vault", loading: false });
    }
  },
  async fetchTree() {
    try {
      const { data } = await api.get("/folders/tree");
      set({ tree: data.folders || [] });
    } catch (_error) {
      set({ tree: [] });
    }
  },
  async fetchRecentFiles() {
    try {
      const { data } = await api.get("/files/recent");
      set({ recentFiles: data.files || [] });
    } catch (_error) {
      set({ recentFiles: [] });
    }
  },
  async createFolder(name, pin) {
    await api.post(
      "/folders",
      { name, parentId: get().currentFolder?._id || null },
      { headers: { "x-owner-pin": pin } },
    );
    await Promise.all([get().fetchContents(get().currentFolder?._id || null), get().fetchTree()]);
  },
  async renameFolder(id, name, pin) {
    await api.put(`/folders/${id}/rename`, { name }, { headers: { "x-owner-pin": pin } });
    await Promise.all([get().fetchContents(get().currentFolder?._id || null), get().fetchTree()]);
  },
  async renameFile(id, name, pin) {
    await api.put(`/files/${id}/rename`, { name }, { headers: { "x-owner-pin": pin } });
    await Promise.all([get().fetchContents(get().currentFolder?._id || null), get().fetchRecentFiles()]);
  },
  async deleteFolder(id, pin) {
    await api.delete(`/folders/${id}`, { headers: { "x-owner-pin": pin } });
    await Promise.all([get().fetchContents(get().currentFolder?._id || null), get().fetchTree()]);
  },
  async deleteFile(id, pin) {
    await api.delete(`/files/${id}`, { headers: { "x-owner-pin": pin } });
    await Promise.all([get().fetchContents(get().currentFolder?._id || null), get().fetchRecentFiles()]);
  },
  async uploadFile(formData, pin) {
    await api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data", "x-owner-pin": pin },
    });
    await Promise.all([get().fetchContents(get().currentFolder?._id || null), get().fetchRecentFiles()]);
  },
}));
