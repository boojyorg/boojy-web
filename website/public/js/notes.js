(async function () {
    const el = document.getElementById('notes-version');
    if (!el) return;
    try {
        const res = await fetch('https://api.github.com/repos/boojyorg/boojy-notes/tags?per_page=1');
        if (!res.ok) return;
        const tags = await res.json();
        if (tags.length === 0) return;

        const tag = tags[0];
        const commitRes = await fetch(tag.commit.url);
        if (!commitRes.ok) {
            el.textContent = tag.name + ' Beta';
            return;
        }
        const commit = await commitRes.json();
        const date = new Date(commit.commit.committer.date);
        const formatted = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        el.textContent = tag.name + ' Beta \u00B7 ' + formatted;
    } catch (e) {
        // Silently keep fallback text
    }
})();
