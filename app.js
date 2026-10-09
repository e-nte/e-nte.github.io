const SF_API_URL = 'https://sf-arch-and-dev-ed.develop.my.site.com/services/apexrest/portfolio/projects'; 

document.addEventListener('DOMContentLoaded', () => {
    initSPARouter();
    initThemeManager();
    //fetchSalesforceProjects();
});

/* --- 1. AGNOSTIC SALESFORCE DATA LAYER --- */
function fetchSalesforceProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '<div class="sf-loader">Querying Salesforce Data Tier...</div>';

    fetch(SF_API_URL, { headers: { 'Accept': 'application/json' } })
    .then(res => res.json())
    .then(data => renderProjects(data))
    .catch(err => {
        console.error('SF Gateway Error:', err);
        grid.innerHTML = `<p class="error-text">⚠️ Failed to establish secure REST handshake with Salesforce.</p>`;
    });
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = ''; 

    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'card project-card';
        const tagsHtml = proj.tags.map(t => `<span class="tag tag-green">${t}</span>`).join('');

        // Use Payload_Algorithm__c (algorithmData) first since Long Text Area preserves <script> tags
        const widgetPayload = proj.algorithmData || proj.rawHtml || '';

        card.innerHTML = `
            <div class="card-header">
                <h3>${proj.name}</h3>
                <span class="badge dev-tier">Live REST API</span>
            </div>
            <p class="project-summary">${proj.summary}</p>
            
            <div class="dynamic-canvas">
                ${widgetPayload}
            </div>

            <div class="tech-stack">${tagsHtml}</div>
        `;
        
        grid.appendChild(card);
        
        // Execute the script block extracted from Long Text Area
        executeInjectedScripts(card);
    });
}

function executeInjectedScripts(containerElement) {
    // Find any script tags that came over in the rawHtml payload
    const scripts = containerElement.querySelectorAll('script');
    
    scripts.forEach(oldScript => {
        // To force execution, we must create a brand new script element
        const newScript = document.createElement('script');
        
        // Copy the code from the Salesforce payload into the new executable tag
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        
        // Replace the dead script with the live one (executes immediately)
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// document.addEventListener('DOMContentLoaded', () => {
//     initSPARouter();
//     //initThemeToggle();
//     initThemeManager();
// });

let isSfDataLoaded = false; // Flag to prevent duplicate API fetches

function initSPARouter() {
    const topNavLinks = document.querySelectorAll('.navbar nav .nav-link');
    const sections = document.querySelectorAll('.view-section');

    // 1. The Master View-Switcher Engine
    const navigateTo = (targetId) => {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        // A. Turn on the correct viewport section
        sections.forEach(s => s.classList.remove('active'));
        targetSection.classList.add('active');

        // B. Synchronize the Top Navbar's glowing active indicator
        topNavLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });


            // LAZY LOAD: Fetch Salesforce data ONLY when entering Dynamic Features
            if (targetId === 'dynamic-features' && !isSfDataLoaded) {
                fetchSalesforceProjects();
                isSfDataLoaded = true; // Mark as fetched
            }

        // C. Write the state silently to the browser's Back/Forward timeline
        window.history.pushState(null, null, `#${targetId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 2. Universal Click Interceptor (Catches Navbar AND Homepage CTA buttons)
    document.body.addEventListener('click', (e) => {
        // Look up the DOM tree from the click point to find an anchor tag or data-target
        const trigger = e.target.closest('[data-target], a[href^="#"]');
        
        if (trigger) {
            const isAnchor = trigger.tagName === 'A';
            const href = isAnchor ? trigger.getAttribute('href') : '';
            
            // Ignore dummy '#' links or off-site links
            if (href === '#' || (isAnchor && !href.startsWith('#'))) return;

            e.preventDefault();
            
            // Derive the ID whether they used data-target="projects" OR href="#projects"
            const targetId = trigger.getAttribute('data-target') || href.replace('#', '');
            navigateTo(targetId);
        }
    });

    // Badge jump listener (prevents SPA router page reset)
    document.addEventListener('click', (e) => {
        const badgeItem = e.target.closest('.badge-item[data-jump]');
        if (!badgeItem) return;

        // Prevent SPA router from treating this as a section switch
        e.preventDefault();
        e.stopPropagation();

        const targetId = badgeItem.getAttribute('data-jump');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Trigger flash highlight pulse
            targetElement.classList.remove('highlight-pulse');
            void targetElement.offsetWidth; // Force CSS reflow
            targetElement.classList.add('highlight-pulse');
        }
    });

    // 3. Catch Page Refreshes / Direct URL deep-links (e.g. user lands on domain.com/#certs)
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        navigateTo(initialHash);
    }

    // 4. Catch the user hitting the Browser's physical "Back" and "Forward" arrows
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash);
    });

    //**//migrate to multipage
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') || 
                       window.location.pathname === '';

    // Delegate menu navigation clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-target]');
        if (!link) return;

        // If on external page (insights.html) and clicking SPA anchor, allow standard link navigation
        if (!isHomePage) return;

        const targetSection = link.getAttribute('data-target');
        if (targetSection) {
            e.preventDefault();
            navigateToSection(targetSection);
        }
    });

    // Handle initial hash load when returning to index.html (e.g. index.html#certs)
    if (isHomePage) {
        const initialHash = window.location.hash.replace('#', '') || 'home';
        navigateToSection(initialHash);
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

function initThemeManager() {
    const settingsBtn = document.getElementById('theme-settings-btn');
    const panel = document.getElementById('theme-panel');
    const autoToggle = document.getElementById('theme-auto');
    const slider = document.getElementById('theme-slider');
    const iconDisplay = document.getElementById('theme-icon-display');

    // 0 = Dark, 1 = Dawn, 2 = Light, 3 = Dusk
    const themeClasses = ['', 'theme-dawn', 'light-theme', 'theme-dusk'];
    const themeIcons = ['🌙', '🌅', '☀️', '🌆'];

    // --- Panel Toggle Logic ---
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !settingsBtn.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    // --- Theme Engine Logic ---
    const applyTheme = (index) => {
        // Clear all theme classes first
        document.body.classList.remove('theme-dawn', 'light-theme', 'theme-dusk');
        
        // Apply new class if not the default Dark (index 0)
        if (themeClasses[index]) {
            document.body.classList.add(themeClasses[index]);
        }
        
        // Update UI
        iconDisplay.textContent = themeIcons[index];
        slider.value = index;
        settingsBtn.textContent = '⚙️'; // Keeps the gear static
    };

    const getAutoThemeIndex = () => {
        const hour = new Date().getHours();
        if (hour >= 20 || hour < 6) return 0; // Dark (8pm - 6am)
        if (hour >= 6 && hour < 10) return 1; // Dawn (6am - 10am)
        if (hour >= 10 && hour < 16) return 2; // Light (10am - 4pm)
        return 3;                             // Dusk (4pm - 8pm)
    };

    // --- Initialization & Storage ---
    const isAuto = localStorage.getItem('theme-auto') === 'true';
    const savedIndex = parseInt(localStorage.getItem('theme-index')) || 0;

    autoToggle.checked = isAuto;
    
    if (isAuto) {
        applyTheme(getAutoThemeIndex());
    } else {
        applyTheme(savedIndex);
    }

    // --- Event Listeners ---
    slider.addEventListener('input', (e) => {
        // Manual slider interaction breaks auto mode
        autoToggle.checked = false;
        localStorage.setItem('theme-auto', 'false');
        
        const index = parseInt(e.target.value);
        applyTheme(index);
        localStorage.setItem('theme-index', index);
    });

    autoToggle.addEventListener('change', (e) => {
        const autoEnabled = e.target.checked;
        localStorage.setItem('theme-auto', autoEnabled);
        
        if (autoEnabled) {
            const index = getAutoThemeIndex();
            applyTheme(index);
            localStorage.setItem('theme-index', index);
        }
    });

    // --- Polling for Auto Mode ---
    // Checks every 5 minutes if the user leaves the tab open
    setInterval(() => {
        if (autoToggle.checked) {
            const index = getAutoThemeIndex();
            if (parseInt(slider.value) !== index) {
                applyTheme(index);
                localStorage.setItem('theme-index', index);
            }
        }
    }, 300000); 
}

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.spa-section');
    const navItems = document.querySelectorAll('.nav-item');

    sections.forEach(sec => sec.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    const activeNavItem = document.querySelector(`.nav-item[data-target="${sectionId}"]`);

    if (activeSection) activeSection.classList.add('active');
    if (activeNavItem) activeNavItem.classList.add('active');

    history.pushState(null, '', `#${sectionId}`);
}
