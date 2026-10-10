document.addEventListener('DOMContentLoaded', () => {
    const listView = document.getElementById('articles-list-view');
    const detailView = document.getElementById('article-detail-view');
    const grid = document.getElementById('articles-grid');
    const markdownContent = document.getElementById('markdown-content');

    // Parse URL parameters (e.g., articles.html?slug=ldv-strategy)
    const urlParams = new URLSearchParams(window.location.search);
    const activeSlug = urlParams.get('slug');

    if (activeSlug) {
        // Show detail view and fetch the specific .md file
        listView.style.display = 'none';
        detailView.style.display = 'block';
        fetchAndRenderMarkdown(activeSlug);
    } else {
        // Show index list view
        listView.style.display = 'block';
        detailView.style.display = 'none';
        fetchArticleIndex();
    }

    function fetchArticleIndex() {
        fetch('articles/index.json')
            .then(res => res.json())
            .then(articles => renderArticleGrid(articles))
            .catch(err => {
                console.error('Failed to load article index:', err);
                grid.innerHTML = '<p class="error-text">⚠️ Unable to load article manifest.</p>';
            });
    }

    function renderArticleGrid(articles) {
        grid.innerHTML = '';
        articles.forEach(art => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            
            const tags = art.tags ? art.tags.map(t => `<span class="badge-tag">${t}</span>`).join(' ') : '';
            
            card.innerHTML = `
                <div style="margin-bottom: 8px;">${tags}</div>
                <h2>${art.title}</h2>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">${art.date}</p>
                <p>${art.summary}</p>
                <a href="articles.html?slug=${art.slug}" class="btn-verify-action" style="display: inline-block; margin-top: 16px;">
                    Read Article ➔
                </a>
            `;
            grid.appendChild(card);
        });
    }

    function fetchAndRenderMarkdown(slug) {
        markdownContent.innerHTML = '<p class="text-muted">Loading article content...</p>';
        
        fetch(`articles/${slug}.md`)
            .then(res => {
                if (!res.ok) throw new Error('Article file not found');
                return res.text();
            })
            .then(mdText => {
                // Parse markdown to HTML using marked.js
                markdownContent.innerHTML = marked.parse(mdText);
            })
            .catch(err => {
                markdownContent.innerHTML = `
                    <h2>404 - Article Not Found</h2>
                    <p>The requested document <code>${slug}.md</code> could not be located in the articles folder.</p>
                `;
            });
    }
});