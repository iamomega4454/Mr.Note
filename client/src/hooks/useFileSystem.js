import { useFileSystemStore } from "../context/FileSystemContext";

export default function useFileSystem() {
  return useFileSystemStore();
}

