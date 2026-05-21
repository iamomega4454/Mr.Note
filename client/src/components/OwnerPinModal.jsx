import { useState } from "react";
import { Lock, Shield } from "lucide-react";
import ModalShell from "./ModalShell";

export default function OwnerPinModal({ title, subtitle, confirmLabel, onClose, onSubmit }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <ModalShell title={title} subtitle={subtitle} onClose={onClose}>
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!/^\d{6}$/.test(pin)) {
            setError("Enter a 6-digit security pin");
            return;
          }
          try {
            setError("");
            setIsSubmitting(true);
            await onSubmit(pin);
          } catch (submitError) {
            setError(submitError?.response?.data?.message || submitError?.message || "Action failed");
            setIsSubmitting(false);
          }
        }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-purple/20 to-chalk-pink/20 shadow-glow-purple">
              <Shield size={28} className="text-chalk-purple" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-chalk-yellow/30 to-chalk-orange/30 shadow-glow">
              <Lock size={14} className="text-chalk-yellow" />
            </div>
          </div>
        </div>

        {/* PIN Input */}
        <div className="space-y-2">
          <label htmlFor="pin-input" className="block text-sm font-medium text-text-secondary">
            Security PIN
          </label>
          <input
            id="pin-input"
            autoFocus
            value={pin}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, "").slice(0, 6);
              setPin(value);
              if (error) setError("");
            }}
            inputMode="numeric"
            maxLength={6}
            type="password"
            placeholder="Enter 6-digit PIN"
            className="w-full rounded-2xl border border-blackboard-border bg-blackboard-secondary/50 px-4 py-3.5 text-center text-lg font-mono tracking-widest text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-chalk-purple/50 focus:bg-blackboard-card focus:shadow-glow-purple"
          />
          
          {/* PIN indicator dots */}
          <div className="flex justify-center gap-2 pt-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${
                  i < pin.length
                    ? "bg-chalk-purple shadow-glow-purple scale-110"
                    : "bg-blackboard-border"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-chalk-pink animate-slide-down">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-chalk-pink"></span>
              {error}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || pin.length !== 6}
          className="liquid-button group w-full rounded-2xl px-5 py-3.5 font-medium text-text-primary transition-all hover:text-chalk-purple hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-text-primary disabled:hover:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-primary border-t-transparent"></span>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {confirmLabel}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          )}
        </button>

        {/* Security note */}
        <p className="text-center text-xs text-text-secondary/70">
          🔒 Your PIN is encrypted and never stored
        </p>
      </form>
    </ModalShell>
  );
}