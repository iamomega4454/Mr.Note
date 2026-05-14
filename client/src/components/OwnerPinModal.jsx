import { useState } from "react";
import ModalShell from "./ModalShell";

export default function OwnerPinModal({ title, subtitle, confirmLabel, onClose, onSubmit }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  return (
    <ModalShell title={title} subtitle={subtitle} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!/^\d{6}$/.test(pin)) {
            setError("Enter a 6-digit security pin");
            return;
          }
          try {
            setError("");
            await onSubmit(pin);
          } catch (submitError) {
            setError(submitError?.response?.data?.message || submitError?.message || "Action failed");
          }
        }}
      >
        <input
          autoFocus
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
          type="password"
          placeholder="Enter 6 digit pin"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-300/40 focus:bg-white/10"
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="liquid-button w-full rounded-2xl px-4 py-3 font-medium text-white">
          {confirmLabel}
        </button>
      </form>
    </ModalShell>
  );
}
