import { useState } from "react";
import { Pencil } from "lucide-react";
import ModalShell from "./ModalShell";

export default function RenameModal({ initialName, label, onClose, onSubmit }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  return (
    <ModalShell title={`Rename ${label}`} subtitle="Update the display name without changing the content." onClose={onClose}>
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const value = name.trim();
          if (!value) {
            setError(`Enter a ${label} name`);
            return;
          }
          setError("");
          onSubmit(value);
        }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-blue/20 to-chalk-purple/20 shadow-glow-blue">
            <Pencil size={28} className="text-chalk-blue" />
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <label htmlFor="rename-input" className="block text-sm font-medium text-text-secondary">
            New {label} name
          </label>
          <input
            id="rename-input"
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder={`Enter new ${label} name`}
            className="w-full rounded-2xl border border-blackboard-border bg-blackboard-secondary/50 px-4 py-3.5 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-chalk-blue/50 focus:bg-blackboard-card focus:shadow-glow-blue"
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
          className="liquid-button group w-full rounded-2xl px-5 py-3.5 font-medium text-text-primary transition-all hover:text-chalk-blue hover:shadow-glow-blue"
        >
          <span className="flex items-center justify-center gap-2">
            Save Changes
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>
      </form>
    </ModalShell>
  );
}