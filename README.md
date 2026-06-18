# e-nte.github.io
Personal Page

# Headless Salesforce Integration Portfolio

A high-performance, minimalist single-page portfolio designed to showcase enterprise-grade Salesforce architecture. 

Rather than copying and pasting a standard static resume, this workspace operates as a decoupled frontend application. It leverages **vanilla JavaScript** and a **custom public Apex REST API** to stream live project data and metadata directly from a Salesforce Developer Org data tier.

## 🚀 Key Architectural Highlights

*   **Decoupled Architecture:** Front-end assets (HTML5, CSS3, ES6+ JavaScript) are hosted entirely on a global static CDN (GitHub Pages), resulting in near-instantaneous page loads.
*   **Zero External Dependencies:** Built completely with vanilla web APIs, native fonts, and raw CSS variables to prevent bloated framework compilation or package vulnerabilities.
*   **Secure Public Gateway:** Back-end project parameters and certification models are securely queried via custom Apex code exposed through an unauthenticated guest user profile, adhering to strict Salesforce Organization-Wide Default (OWD) private settings.
*   **Stateful Design:** Includes a lightweight custom SPA script routing traffic smoothly without reloading the window, alongside a dark/light theme engine that retains state via browser `localStorage`.

## 📁 Repository Structure

```text
├── index.html        # Semantic layout and core profile pitch
├── style.css         # Saturated Desert Sunset design tokens and mode classes
├── app.js            # Background API fetching, SPA routing, and theme state management
└── README.md         # Documentation