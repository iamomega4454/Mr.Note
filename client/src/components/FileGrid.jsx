import FolderCard from "./FolderCard";
import FileCard from "./FileCard";

export default function FileGrid({
  folders,
  files,
  activeFileId,
  handlers,
}) {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl text-white">Folders</h2>
            <p className="text-sm text-white/45">Folders in this location.</p>
          </div>
        </div>

        {folders.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onOpen={handlers.openFolder}
                onRename={handlers.openRenameFolder}
                onDelete={handlers.deleteFolder}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[24px] border border-dashed border-white/10 px-6 py-10 text-center text-white/50">
            No folders here.
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl text-white">Files</h2>
            <p className="text-sm text-white/45">Files in this location.</p>
          </div>
        </div>

        {files.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                isActive={activeFileId === file._id}
                onRename={handlers.openRenameFile}
                onDelete={handlers.deleteFile}
                onDownload={handlers.downloadFile}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[24px] border border-dashed border-white/10 px-6 py-10 text-center text-white/50">
            No files here.
          </div>
        )}
      </section>
    </div>
  );
}
