export default function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
      <div className="glass-card glass-panel w-full max-w-md p-6 text-white">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-xl">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-white/55">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="liquid-button rounded-full px-3 py-1 text-sm text-white/80"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

