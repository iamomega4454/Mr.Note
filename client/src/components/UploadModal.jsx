import { useState } from "react";
import { UploadCloud, File } from "lucide-react";
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
        className="space-y-5"
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
        {/* Dropzone */}
        <label
          className={`dropzone glass-card block cursor-pointer rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all ${
            dragging
              ? "is-dragging border-chalk-yellow/50 bg-chalk-yellow/5"
              : "border-blackboard-border hover:border-chalk-yellow/30 hover:bg-blackboard-card/50"
          }`}
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
          
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-blue/20 to-chalk-purple/20 shadow-glow-blue transition-all">
            {file ? (
              <File size={28} className="text-chalk-blue" />
            ) : (
              <UploadCloud size={28} className="text-chalk-blue" />
            )}
          </div>
          
          <p className="mb-2 font-medium text-text-primary">
            {file ? file.name : "Drag a file here or click to browse"}
          </p>
          <p className="text-sm text-text-secondary">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Up to 100MB"}
          </p>
        </label>

        {/* Optional custom name input */}
        <div className="space-y-2">
          <label htmlFor="custom-name" className="block text-sm font-medium text-text-secondary">
            Custom file name (optional)
          </label>
          <input
            id="custom-name"
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder="Leave empty to use original name"
            className="w-full rounded-2xl border border-blackboard-border bg-blackboard-secondary/50 px-4 py-3.5 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-chalk-blue/50 focus:bg-blackboard-card focus:shadow-glow-blue"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!file}
          className="liquid-button group w-full rounded-2xl px-5 py-3.5 font-medium text-text-primary transition-all hover:text-chalk-blue hover:shadow-glow-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-text-primary disabled:hover:shadow-none"
        >
          <span className="flex items-center justify-center gap-2">
            Continue
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>
      </form>
    </ModalShell>
  );
}