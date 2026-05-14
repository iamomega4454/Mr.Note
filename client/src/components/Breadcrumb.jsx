export default function Breadcrumb({ items, onNavigate }) {
  return (
    <div className="glass-card glass-panel flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3 text-sm text-white/70">
      {items.map((item, index) => (
        <button
          key={`${item.id ?? "root"}-${index}`}
          type="button"
          onClick={() => onNavigate(item.id)}
          className="transition hover:text-white"
        >
          {item.name}
          {index < items.length - 1 ? <span className="ml-2 text-white/25">/</span> : null}
        </button>
      ))}
    </div>
  );
}

