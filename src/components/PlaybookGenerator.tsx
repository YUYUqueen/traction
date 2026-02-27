import { useState } from 'react';
import type { Playbook } from '../lib/playbook';
import PlaybookView from './PlaybookView';

export default function PlaybookGenerator() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbook, setPlaybook] = useState<Playbook | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDescription: description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Generation failed');
      }

      const data = await res.json();
      setPlaybook(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (playbook) {
    return (
      <div>
        <button
          onClick={() => { setPlaybook(null); setDescription(''); }}
          className="mb-6 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          &larr; Generate another playbook
        </button>
        <PlaybookView playbook={playbook} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-2">Describe your product</h2>
        <p className="text-sm text-stone-500 mb-6">
          What does it do? Who is it for? What problem does it solve? The more detail, the better your playbook.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. I built a Chrome extension that blocks AI-generated search results on Google. It's for developers and researchers who want clean search results. Free with a $5/mo pro tier for custom filters..."
          className="w-full h-40 px-4 py-3 border border-stone-200 rounded-lg text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-none"
          maxLength={2000}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-stone-400">{description.length}/2000</span>
          <button
            type="submit"
            disabled={!description.trim() || loading}
            className="bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              'Generate Playbook'
            )}
          </button>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}
      </div>
    </form>
  );
}
