import { useState } from 'react';
import type { Playbook } from '../lib/playbook';

interface Props {
  playbook: Playbook;
}

export default function PlaybookView({ playbook }: Props) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  function toggleAction(key: string) {
    setExpandedAction(expandedAction === key ? null : key);
  }

  function exportMarkdown() {
    let md = `# GTM Playbook\n\n`;
    md += `**Positioning:** ${playbook.positioning}\n\n`;
    md += `**Target Audience:** ${playbook.target_audience.primary}\n`;
    md += `**Channels:** ${playbook.target_audience.channels.join(', ')}\n\n`;

    md += `## Competitors\n\n`;
    for (const c of playbook.competitors) {
      md += `- **${c.name}** (${c.pricing}) — ${c.gap}\n`;
    }

    md += `\n## Pricing Suggestion\n\n`;
    md += `${playbook.pricing_suggestion.reasoning}\n\n`;
    for (const t of playbook.pricing_suggestion.tiers) {
      md += `- **${t.name}**: ${t.price} — ${t.features}\n`;
    }

    for (const week of playbook.weeks) {
      md += `\n## Week ${week.week}: ${week.theme}\n\n`;
      for (const action of week.actions) {
        md += `### Day ${action.day}: ${action.action}\n`;
        md += `- Channel: ${action.channel}\n`;
        if (action.tips) md += `- Tips: ${action.tips}\n`;
        if (action.template) md += `\n\`\`\`\n${action.template}\n\`\`\`\n`;
        md += '\n';
      }
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gtm-playbook.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">Your 30-Day GTM Playbook</h2>
            <p className="text-amber-700 font-medium">{playbook.positioning}</p>
          </div>
          <button
            onClick={exportMarkdown}
            className="shrink-0 text-sm font-medium border border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Export .md
          </button>
        </div>

        {/* Target audience */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <p className="text-sm text-stone-500 mb-1">Target audience</p>
          <p className="text-sm text-stone-800">{playbook.target_audience.primary}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {playbook.target_audience.channels.map((ch) => (
              <span key={ch} className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-mono">
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Competitors */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="font-semibold text-stone-900 mb-4">Competitor Landscape</h3>
        <div className="space-y-3">
          {playbook.competitors.map((c) => (
            <div key={c.name} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 bg-stone-300 rounded-full mt-1.5 shrink-0" />
              <div>
                <span className="font-medium text-stone-800">{c.name}</span>
                <span className="text-stone-400 mx-2">·</span>
                <span className="text-stone-500">{c.pricing}</span>
                <p className="text-stone-500 mt-0.5">{c.gap}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing suggestion */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="font-semibold text-stone-900 mb-2">Pricing Suggestion</h3>
        <p className="text-sm text-stone-600 mb-4">{playbook.pricing_suggestion.reasoning}</p>
        <div className="flex flex-wrap gap-3">
          {playbook.pricing_suggestion.tiers.map((t) => (
            <div key={t.name} className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
              <p className="font-medium text-stone-800 text-sm">{t.name} — {t.price}</p>
              <p className="text-xs text-stone-500 mt-1">{t.features}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly plan */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {/* Week tabs */}
        <div className="flex border-b border-stone-200">
          {playbook.weeks.map((week, i) => (
            <button
              key={week.week}
              onClick={() => setActiveWeek(i)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeWeek === i
                  ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-600'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              Week {week.week}
            </button>
          ))}
        </div>

        {/* Active week content */}
        {playbook.weeks[activeWeek] && (
          <div className="p-6">
            <h3 className="font-semibold text-stone-900 mb-1">
              Week {playbook.weeks[activeWeek].week}: {playbook.weeks[activeWeek].theme}
            </h3>
            <div className="mt-4 space-y-3">
              {playbook.weeks[activeWeek].actions.map((action) => {
                const key = `${activeWeek}-${action.day}`;
                const isExpanded = expandedAction === key;
                return (
                  <div key={key} className="border border-stone-200 rounded-lg">
                    <button
                      onClick={() => toggleAction(key)}
                      className="w-full flex items-start gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
                    >
                      <span className="shrink-0 w-7 h-7 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center justify-center mt-0.5">
                        {action.day}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800">{action.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">{action.channel}</span>
                          {action.template && (
                            <span className="text-xs text-amber-600">has template</span>
                          )}
                        </div>
                      </div>
                      <svg className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-stone-100">
                        {action.tips && (
                          <p className="text-sm text-stone-600 mt-3 mb-3">{action.tips}</p>
                        )}
                        {action.template && (
                          <div className="relative">
                            <pre className="bg-stone-900 text-stone-100 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                              {action.template}
                            </pre>
                            <button
                              onClick={() => navigator.clipboard.writeText(action.template!)}
                              className="absolute top-2 right-2 text-xs text-stone-400 hover:text-white bg-stone-800 px-2 py-1 rounded transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
