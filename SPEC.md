# Architectural Specification: Headless Portfolio Frontend
**Last Updated:** October 7, 2026

## 1. System Overview
This repository contains the client-side single-page application (SPA) for a decoupled, headless portfolio site. It acts as an agnostic rendering engine that interfaces asynchronously with a remote REST endpoint to stream dynamic content, component layouts, and interactive widgets.

## 2. Infrastructure & Hosting
*   **Frontend Client:** Hosted on GitHub Pages (Global CDN).
*   **Communication Protocol:** Direct Client-to-Server asynchronous REST requests (Fetch API).
*   **Cross-Origin Policy:** Requires remote server-side CORS whitelisting for the GitHub Pages domain to bypass the browser's Same-Origin Policy (SOP).

## 3. Remote API Contract
The client application consumes an unauthenticated REST endpoint to retrieve portfolio data and dynamic widget definitions.

*   **Endpoint Path:** `/services/apexrest/portfolio/projects`
*   **HTTP Method:** `GET`
*   **Required Request Headers:**
    *   `Accept: application/json`
*   **Expected JSON Response Payload:**
    ```json
    [
      {
        "id": "a00XXXXXXXXXXXXXXXXXXX",
        "name": "Project Title String",
        "summary": "High-level description of the project.",
        "tags": ["Tag1", "Tag2", "Tag3"],
        "rawHtml": "<div class=\"widget\">...</div><script>...</script>"
      }
    ]
    ```

## 4. The Frontend Engine (SPA)
*   **Tech Stack:** 100% Vanilla HTML5, CSS3, and ES6 JavaScript. Zero external dependencies or build frameworks.
*   **Routing:** Pre-loaded DOM-manipulation routing. Navigation toggles CSS visibility classes to deliver sub-second, seamless view transitions without full page reloads.
*   **Widget Execution Engine:** Functions as a dynamic compiler. Upon receiving raw HTML templates and embedded scripts from the remote payload, it injects the elements into the DOM and evaluates script blocks safely inside Immediately Invoked Function Expressions (IIFEs) to isolate execution context.

## 5. Current Implementations
*   **XSS Sanitization Simulator:** The inaugural dynamic component demonstrating decoupled script execution by evaluating and sanitizing untrusted inputs against injected regex rules and entity maps in real time.