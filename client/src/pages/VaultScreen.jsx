import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    <main className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <Navbar
          onCreateFolder={() => setModal({ type: "create-folder" })}
          onUpload={() => setModal({ type: "upload" })}
          onSearchNavigate={handleSearchNavigate}
        />

        <div className="grid gap-6 xl:grid-cols-[310px_1fr]">
          <Sidebar
            folders={tree}
            currentFolderId={currentFolder?._id || null}
            onSelectRoot={() => goToFolder(null)}
            onSelectFolder={goToFolder}
          />

          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <Breadcrumb items={breadcrumb} onNavigate={goToFolder} />

                <div className="glass-card glass-panel rounded-[28px] p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/35">Current Folder</p>
                      <h2 className="font-heading text-3xl text-white">{currentFolder?.name || "Root"}</h2>
                      <p className="mt-1 text-white/45">
                        {loading
                          ? "Loading..."
                          : currentFolder
                            ? "Add subfolders and files here, then keep nesting as deep as you need."
                            : "Create folders at the root, or open one to add subfolders and files inside it."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ type: "create-folder" })}
                        className="liquid-button rounded-full px-4 py-2 text-sm text-white"
                      >
                        {createFolderLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ type: "upload" })}
                        className="liquid-button rounded-full px-4 py-2 text-sm text-white"
                      >
                        Add file
                      </button>
                    </div>
                    {error ? <p className="text-sm text-red-300">{error}</p> : null}
                  </div>
                </div>
              </div>

              <div className="glass-card glass-panel rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/35">Recent Files</p>
                <div className="mt-4 space-y-3">
                  {recentFiles.slice(0, 5).map((file) => (
                    <button
                      key={file._id}
                      type="button"
                      onClick={() => handleSearchNavigate({ type: "file", id: file._id, folderId: file.folder })}
                      className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-3 py-3 text-left transition hover:bg-white/8"
                    >
                      <span className="truncate text-sm text-white/80">{file.name}</span>
                      <span className="text-xs text-white/35">{new Date(file.createdAt).toLocaleDateString()}</span>
                    </button>
                  ))}
                  {!recentFiles.length ? <p className="text-sm text-white/45">No recent files.</p> : null}
                </div>
              </div>
            </div>

            <FileGrid
              folders={folders}
              files={files}
              activeFileId={activeFileId}
              handlers={handlers}
            />
          </section>
        </div>
      </div>

      {modal?.type === "create-folder" ? (
        <CreateFolderModal
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            setModal({ type: "pin-create-folder", item: { name } });
          }}
        />
      ) : null}

      {modal?.type === "rename-folder" ? (
        <RenameModal
          label="folder"
          initialName={modal.item.name}
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            setModal({ type: "pin-rename-folder", item: { id: modal.item._id, name } });
          }}
        />
      ) : null}

      {modal?.type === "rename-file" ? (
        <RenameModal
          label="file"
          initialName={modal.item.name}
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            setModal({ type: "pin-rename-file", item: { id: modal.item._id, name } });
          }}
        />
      ) : null}

      {modal?.type === "upload" ? (
        <UploadModal
          folderId={currentFolder?._id || null}
          onClose={() => setModal(null)}
          onSubmit={async (formData) => {
            setModal({ type: "pin-upload", item: { formData } });
          }}
        />
      ) : null}

      {modal?.type === "pin-create-folder" ? (
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
      ) : null}

      {modal?.type === "pin-upload" ? (
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
      ) : null}

      {modal?.type === "pin-rename-folder" ? (
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
      ) : null}

      {modal?.type === "pin-rename-file" ? (
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
      ) : null}

      {modal?.type === "delete-folder" ? (
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
      ) : null}

      {modal?.type === "delete-file" ? (
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
      ) : null}
    </main>
  );
}
