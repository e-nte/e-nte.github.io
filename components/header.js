function renderSiteHeader() {
    const headerContainer = document.getElementById('site-header');
    if (!headerContainer) return;

    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';

    headerContainer.innerHTML = `
        <div class="logo">Engineered::SF</div>
        <nav>
            <a href="${isHomePage ? '#home' : 'index.html#home'}" class="nav-link ${isHomePage ? 'active' : ''}" data-target="home">Home & Experience</a>
            <a href="${isHomePage ? '#projects' : 'index.html#projects'}" class="nav-link" data-target="projects">Dynamic Features</a>
            <a href="${isHomePage ? '#certs' : 'index.html#certs'}" class="nav-link" data-target="certs">14x Credentials</a>
            <a href="insights.html" class="nav-link ${!isHomePage ? 'active' : ''}">Insights</a>
            <a href="articles.html" class="nav-link ${!isHomePage ? 'active' : ''}">Articles</a>
            <a href="https://www.linkedin.com/in/evangelos-nt/" target="_blank" class="linkedin-link" rel="noopener noreferrer">LinkedIn ↗</a>
            
            <div class="theme-menu-wrapper">
                <button id="theme-settings-btn" class="theme-btn" aria-label="Theme Settings">⚙️</button>
            
                <div id="theme-panel" class="theme-panel">
                    <div class="theme-panel-header">Environment Settings</div>
                    
                    <div class="auto-toggle-row">
                        <span>Auto-Sync Theme</span>
                        <label class="custom-toggle" aria-label="Toggle Auto Theme">
                            <input type="checkbox" id="theme-auto">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="slider-row">
                        <span id="theme-icon-display" class="theme-indicator">🌙</span>
                        <input type="range" id="theme-slider" min="0" max="3" step="1" value="0">
                    </div>
                </div>
            </div>
        </nav>
    `;
}

// Render synchronously before app.js runs
renderSiteHeader();