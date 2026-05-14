import { useState } from "react";
import { UploadCloud } from "lucide-react";
import ModalShell from "./ModalShell";

export default function UploadModal({ folderId, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [customName, setCustomName] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFiles = (items) => {
    const selected = items?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  return (
    <ModalShell title="Add File" subtitle="Choose one file to upload. A 6-digit security pin is required." onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!file) {
            return;
          }
          const formData = new FormData();
          formData.append("file", file);
          if (customName.trim()) {
            formData.append("name", customName.trim());
          }
          if (folderId) {
            formData.append("folderId", folderId);
          }
          onSubmit(formData);
        }}
      >
        <label
          className={`dropzone glass-card block cursor-pointer rounded-3xl border border-dashed border-white/15 px-5 py-8 text-center transition ${dragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
        >
          <input type="file" className="hidden" onChange={(event) => handleFiles(event.target.files)} />
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-300/10 text-blue-100">
            <UploadCloud size={24} />
          </div>
          <p className="font-medium text-white">{file ? file.name : "Drag a file here or click to browse"}</p>
          <p className="mt-2 text-sm text-white/50">Up to 100MB.</p>
        </label>

        <input
          value={customName}
          onChange={(event) => setCustomName(event.target.value)}
          placeholder="Optional file name"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-300/40 focus:bg-white/10"
        />

        <button type="submit" className="liquid-button w-full rounded-2xl px-4 py-3 font-medium text-white">
          Continue
        </button>
      </form>
    </ModalShell>
  );
}
