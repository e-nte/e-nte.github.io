document.addEventListener('DOMContentLoaded', () => {
    initSPARouter();
    initThemeToggle();
});

function initSPARouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            // 1. Swap navigation menu visual focus points
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 2. Clear out viewports and swap visibility indexes
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // 3. Keep tracking state mapped in browser session timelines
            window.history.pushState(null, null, `#${targetId}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Check for deep links on direct application initialization
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) {
        const activeLink = document.querySelector(`.nav-link[data-target="${currentHash}"]`);
        if (activeLink) activeLink.click();
    }
}

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // 1. Render system states based on persistent storage variables
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.textContent = '☀️';
    }

    // 2. Listen for change parameters to trigger paint modifications
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        let theme = 'dark';
        if (document.body.classList.contains('light-theme')) {
            theme = 'light';
            themeToggleBtn.textContent = '☀️';
        } else {
            themeToggleBtn.textContent = '🌙';
        }
        
        localStorage.setItem('theme', theme);
    });
}