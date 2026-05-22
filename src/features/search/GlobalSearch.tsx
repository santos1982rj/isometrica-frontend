import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { globalSearchItems } from './search.data';

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return globalSearchItems.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div className="relative min-w-0 flex-1 xl:max-w-3xl">
      <label className="flex h-10 min-w-0 items-center gap-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 transition focus-within:border-[var(--accent-border)] focus-within:bg-[var(--surface)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar disciplinas, aulas ou ferramentas"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
        />
      </label>

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/15">
          <div className="max-h-80 overflow-y-auto p-1.5">
            {results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => {
                  navigate(result.path);
                  setQuery('');
                }}
                className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition hover:bg-[var(--surface-soft)]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{result.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{result.type}</p>
                </div>
                <span className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--text-soft)]">
                  Abrir
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
