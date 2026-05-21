import { FolderOpen, FileStack } from "lucide-react";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";

export default function FileGrid({
  folders,
  files,
  activeFileId,
  handlers,
}) {
  return (
    <div className="space-y-10">
      {/* Folders Section */}
      <section className="animate-fade-in">
        <div className="mb-5 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-chalk-yellow/20 to-chalk-orange/20 shadow-glow">
              <FolderOpen size={20} className="text-chalk-yellow" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">Folders</h2>
              <p className="text-sm text-text-secondary">
                {folders.length === 0 ? "No folders yet" : `${folders.length} folder${folders.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {folders.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 animate-slide-up">
            {folders.map((folder, index) => (
              <div
                key={folder._id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <FolderCard
                  folder={folder}
                  onOpen={handlers.openFolder}
                  onRename={handlers.openRenameFolder}
                  onDelete={handlers.deleteFolder}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl border-2 border-dashed border-blackboard-border bg-blackboard-secondary/30 px-8 py-12 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-yellow/10 to-chalk-orange/10">
              <FolderOpen size={32} className="text-chalk-yellow/50" />
            </div>
            <p className="mb-2 font-medium text-text-primary">No folders here</p>
            <p className="text-sm text-text-secondary">Create a folder to organize your files</p>
          </div>
        )}
      </section>

      {/* Files Section */}
      <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="mb-5 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-chalk-blue/20 to-chalk-purple/20 shadow-glow-blue">
              <FileStack size={20} className="text-chalk-blue" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">Files</h2>
              <p className="text-sm text-text-secondary">
                {files.length === 0 ? "No files yet" : `${files.length} file${files.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 animate-slide-up">
            {files.map((file, index) => (
              <div
                key={file._id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <FileCard
                  file={file}
                  isActive={activeFileId === file._id}
                  onRename={handlers.openRenameFile}
                  onDelete={handlers.deleteFile}
                  onDownload={handlers.downloadFile}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl border-2 border-dashed border-blackboard-border bg-blackboard-secondary/30 px-8 py-12 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-blue/10 to-chalk-purple/10">
              <FileStack size={32} className="text-chalk-blue/50" />
            </div>
            <p className="mb-2 font-medium text-text-primary">No files here</p>
            <p className="text-sm text-text-secondary">Upload files to this location</p>
          </div>
        )}
      </section>
    </div>
  );
}