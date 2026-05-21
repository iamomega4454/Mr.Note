import { useState } from "react";
import { FolderPlus } from "lucide-react";
import ModalShell from "./ModalShell";

export default function CreateFolderModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  return (
    <ModalShell title="Add Folder" subtitle="Create a new folder in the current location." onClose={onClose}>
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const value = name.trim();
          if (!value) {
            setError("Enter a folder name");
            return;
          }
          setError("");
          onSubmit(value);
        }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-yellow/20 to-chalk-orange/20 shadow-glow">
            <FolderPlus size={32} className="text-chalk-yellow" />
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <label htmlFor="folder-name" className="block text-sm font-medium text-text-secondary">
            Folder name
          </label>
          <input
            id="folder-name"
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="e.g., Work Documents"
            className="w-full rounded-2xl border border-blackboard-border bg-blackboard-secondary/50 px-4 py-3.5 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-chalk-yellow/50 focus:bg-blackboard-card focus:shadow-glow"
          />
          {error && (
            <p className="flex items-center gap-2 text-sm text-chalk-pink">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-chalk-pink"></span>
              {error}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="liquid-button group w-full rounded-2xl px-5 py-3.5 font-medium text-text-primary transition-all hover:text-chalk-yellow hover:shadow-glow"
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