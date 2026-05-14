import { useState } from "react";
import ModalShell from "./ModalShell";

export default function CreateFolderModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  return (
    <ModalShell title="Add Folder" subtitle="Create a folder in the current location." onClose={onClose}>
      <form
        className="space-y-4"
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
        <input
          autoFocus
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="Folder name"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-300/40 focus:bg-white/10"
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="liquid-button w-full rounded-2xl px-4 py-3 font-medium text-white">
          Continue
        </button>
      </form>
    </ModalShell>
  );
}
