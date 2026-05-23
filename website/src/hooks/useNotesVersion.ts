import { useEffect, useState } from 'react';

export function useNotesVersion(fallback = 'v0.1.3 Beta · 12 March 2026') {
  const [versionText, setVersionText] = useState(fallback);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('https://api.github.com/repos/boojyorg/boojy-notes/tags?per_page=1');
        if (!res.ok || cancelled) return;

        const tags = (await res.json()) as Array<{ name: string; commit: { url: string } }>;
        if (tags.length === 0 || cancelled) return;

        const tag = tags[0];
        const commitRes = await fetch(tag.commit.url);
        if (!commitRes.ok) {
          if (!cancelled) setVersionText(`${tag.name} Beta`);
          return;
        }

        const commit = (await commitRes.json()) as {
          commit: { committer: { date: string } };
        };
        const date = new Date(commit.commit.committer.date);
        const formatted = date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        if (!cancelled) setVersionText(`${tag.name} Beta · ${formatted}`);
      } catch {
        // keep fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fallback]);

  return versionText;
}
