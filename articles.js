document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    fetch('articles/index.json')
        .then(res => res.json())
        .then(articles => renderArticleGrid(articles))
        .catch(err => {
            console.error('Failed to load article index:', err);
            grid.innerHTML = '<p class="error-text">⚠️ Unable to load article manifest.</p>';
        });

    function renderArticleGrid(articles) {
        grid.innerHTML = '';
        articles.forEach(art => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            
            const tags = art.tags 
                ? art.tags.map(t => `<span class="badge-tag">#${t}</span>`).join(' ') 
                : '';
            
            card.innerHTML = `
                <div style="margin-bottom: 8px;">${tags}</div>
                <h2>${art.title}</h2>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                    📅 ${art.date} • ⏱️ ${art.reading_time || '5 min'}
                </div>
                <p>${art.summary}</p>
                <a href="articles/${art.slug}.html" class="btn-verify-action" style="display: inline-block; margin-top: 16px;">
                    Read Article ➔
                </a>
            `;
            grid.appendChild(card);
        });
    }
});