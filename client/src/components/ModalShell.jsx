import { X } from "lucide-react";

export default function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card glass-panel w-full max-w-md rounded-3xl p-7 text-text-primary shadow-soft-lg animate-scale-in">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading text-2xl font-bold text-text-primary">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-blackboard-border bg-blackboard-secondary/50 text-text-secondary transition-all hover:border-chalk-pink/40 hover:bg-chalk-pink/10 hover:text-chalk-pink hover:shadow-glow-pink"
            title="Close"
          >
            <X size={18} className="transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Content */}
        <div className="animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
}