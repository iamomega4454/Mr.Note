import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import FileGrid from "../components/FileGrid";
import CreateFolderModal from "../components/CreateFolderModal";
import RenameModal from "../components/RenameModal";
import UploadModal from "../components/UploadModal";
import OwnerPinModal from "../components/OwnerPinModal";
import useFileSystem from "../hooks/useFileSystem";
import api from "../utils/api";

export default function VaultScreen() {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const {
    currentFolder,
    breadcrumb,
    folders,
    files,
    tree,
    recentFiles,
    loading,
    error,
    activeFileId,
    fetchContents,
    fetchTree,
    fetchRecentFiles,
    createFolder,
    renameFolder,
    renameFile,
    deleteFolder,
    deleteFile,
    uploadFile,
    setActiveFile,
  } = useFileSystem();

  const [modal, setModal] = useState(null);
  const isInsideFolder = Boolean(currentFolder);
  const createFolderLabel = isInsideFolder ? "Add subfolder" : "Add folder";

  useEffect(() => {
    if (folderId) {
      fetchContents(folderId);
    } else {
      fetchContents();
    }
    fetchTree();
    fetchRecentFiles();
  }, [folderId, fetchContents, fetchTree, fetchRecentFiles]);

  const goToFolder = (id) => {
    setActiveFile(null);
    navigate(id ? `/folders/${id}` : "/");
  };

  const handleSearchNavigate = (item) => {
    if (item.type === "folder") {
      goToFolder(item.id);
      return;
    }

    if (item.folderId) {
      navigate(`/folders/${item.folderId}`);
      setTimeout(() => setActiveFile(item.id), 250);
      return;
    }

    navigate("/");
    setTimeout(() => setActiveFile(item.id), 250);
  };

  const handlers = {
    openFolder: goToFolder,
    openRenameFolder: (folder) => setModal({ type: "rename-folder", item: folder }),
    openRenameFile: (file) => setModal({ type: "rename-file", item: file }),
    deleteFolder: async (id) => {
      setModal({ type: "delete-folder", item: { id } });
    },
    deleteFile: async (id) => {
      setModal({ type: "delete-file", item: { id } });
    },
    downloadFile: async (id) => {
      const response = await api.get(`/files/${id}/download`, { responseType: "blob" });
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    },
  };

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Navbar */}
        <Navbar
          onCreateFolder={() => setModal({ type: "create-folder" })}
          onUpload={() => setModal({ type: "upload" })}
          onSearchNavigate={handleSearchNavigate}
        />

        {/* Main content grid */}
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <Sidebar
            folders={tree}
            currentFolderId={currentFolder?._id || null}
            onSelectRoot={() => goToFolder(null)}
            onSelectFolder={goToFolder}
          />

          {/* Main content area */}
          <section className="space-y-6">
            {/* Top section with breadcrumb and info */}
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Current folder info */}
              <div className="space-y-4">
                <Breadcrumb items={breadcrumb} onNavigate={goToFolder} />

                <div className="glass-card glass-panel rounded-3xl p-6 shadow-soft animate-slide-up">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-yellow/20 to-chalk-orange/20 shadow-glow">
                          <Sparkles size={24} className="text-chalk-yellow" />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
                            Current Location
                          </p>
                          <h2 className="font-heading text-3xl font-bold text-text-primary">
                            {currentFolder?.name || "Root"}
                          </h2>
                        </div>
                      </div>
                      
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {loading
                          ? "Loading your vault..."
                          : currentFolder
                            ? "Add subfolders and files here, then keep nesting as deep as you need."
                            : "Create folders at the root, or open one to add subfolders and files inside it."}
                      </p>
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setModal({ type: "create-folder" })}
                        className="liquid-button group rounded-full px-5 py-2.5 text-sm font-medium text-text-primary hover:text-chalk-yellow transition-colors"
                      >
                        {createFolderLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ type: "upload" })}
                        className="liquid-button group rounded-full px-5 py-2.5 text-sm font-medium text-text-primary hover:text-chalk-blue transition-colors"
                      >
                        Add file
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-chalk-pink/30 bg-chalk-pink/10 px-4 py-3 text-sm text-chalk-pink animate-slide-down">
                      <span className="inline-block h-2 w-2 rounded-full bg-chalk-pink"></span>
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent files sidebar */}
              <div className="glass-card glass-panel rounded-3xl p-6 shadow-soft animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="mb-5 flex items-center gap-3 pb-4 border-b border-blackboard-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-chalk-green/20 to-chalk-blue/20 shadow-glow-green">
                    <Clock size={18} className="text-chalk-green" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
                      Recent Files
                    </p>
                    <p className="text-sm text-text-secondary/70">Last 5 uploads</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {recentFiles.slice(0, 5).map((file, index) => (
                    <button
                      key={file._id}
                      type="button"
                      onClick={() => handleSearchNavigate({ type: "file", id: file._id, folderId: file.folder })}
                      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent bg-blackboard-secondary/50 px-4 py-3 text-left transition-all hover:border-chalk-green/30 hover:bg-chalk-green/5 hover:shadow-glow-green animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="truncate text-sm font-medium text-text-primary group-hover:text-chalk-green transition-colors">
                        {file.name}
                      </span>
                      <span className="flex-shrink-0 text-xs text-text-secondary">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                  
                  {!recentFiles.length && (
                    <div className="rounded-2xl border border-dashed border-blackboard-border bg-blackboard-secondary/30 px-4 py-8 text-center">
                      <p className="text-sm text-text-secondary">No recent files</p>
                      <p className="mt-1 text-xs text-text-secondary/60">Upload files to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File grid */}
            <FileGrid
              folders={folders}
              files={files}
              activeFileId={activeFileId}
              handlers={handlers}
            />
          </section>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "create-folder" && (
        <CreateFolderModal
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            setModal({ type: "pin-create-folder", item: { name } });
          }}
        />
      )}

      {modal?.type === "rename-folder" && (
        <RenameModal
          label="folder"
          initialName={modal.item.name}
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            setModal({ type: "pin-rename-folder", item: { id: modal.item._id, name } });
          }}
        />
      )}

      {modal?.type === "rename-file" && (
        <RenameModal
          label="file"
          initialName={modal.item.name}
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            setModal({ type: "pin-rename-file", item: { id: modal.item._id, name } });
          }}
        />
      )}

      {modal?.type === "upload" && (
        <UploadModal
          folderId={currentFolder?._id || null}
          onClose={() => setModal(null)}
          onSubmit={async (formData) => {
            setModal({ type: "pin-upload", item: { formData } });
          }}
        />
      )}

      {modal?.type === "pin-create-folder" && (
        <OwnerPinModal
          title="Security Pin"
          subtitle="Enter the owner pin to create a folder."
          confirmLabel="Create folder"
          onClose={() => setModal(null)}
          onSubmit={async (pin) => {
            await createFolder(modal.item.name, pin);
            setModal(null);
          }}
        />
      )}

      {modal?.type === "pin-upload" && (
        <OwnerPinModal
          title="Security Pin"
          subtitle="Only the owner can upload files. Enter the 6-digit security pin."
          confirmLabel="Upload file"
          onClose={() => setModal(null)}
          onSubmit={async (pin) => {
            await uploadFile(modal.item.formData, pin);
            setModal(null);
          }}
        />
      )}

      {modal?.type === "pin-rename-folder" && (
        <OwnerPinModal
          title="Security Pin"
          subtitle="Enter the owner pin to rename this folder."
          confirmLabel="Rename folder"
          onClose={() => setModal(null)}
          onSubmit={async (pin) => {
            await renameFolder(modal.item.id, modal.item.name, pin);
            setModal(null);
          }}
        />
      )}

      {modal?.type === "pin-rename-file" && (
        <OwnerPinModal
          title="Security Pin"
          subtitle="Enter the owner pin to rename this file."
          confirmLabel="Rename file"
          onClose={() => setModal(null)}
          onSubmit={async (pin) => {
            await renameFile(modal.item.id, modal.item.name, pin);
            setModal(null);
          }}
        />
      )}

      {modal?.type === "delete-folder" && (
        <OwnerPinModal
          title="Delete Folder"
          subtitle="Enter the owner pin to delete this folder and its contents."
          confirmLabel="Delete folder"
          onClose={() => setModal(null)}
          onSubmit={async (pin) => {
            await deleteFolder(modal.item.id, pin);
            setModal(null);
          }}
        />
      )}

      {modal?.type === "delete-file" && (
        <OwnerPinModal
          title="Delete File"
          subtitle="Enter the owner pin to delete this file."
          confirmLabel="Delete file"
          onClose={() => setModal(null)}
          onSubmit={async (pin) => {
            await deleteFile(modal.item.id, pin);
            setModal(null);
          }}
        />
      )}
    </main>
  );
}