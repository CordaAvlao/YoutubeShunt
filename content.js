// Content script - Injecte des icônes sur les vignettes vidéo YouTube

(function () {
    'use strict';

    console.log('[YouTubeShunt] Extension chargée');

    // Configuration par défaut
    let config = {
        service: 'invidious',
        instance: 'https://yewtu.be'
    };

    // Charger la configuration
    async function loadConfig() {
        try {
            const result = await browser.storage.local.get(['service', 'instance']);
            if (result.instance) {
                config.service = result.service || 'invidious';
                config.instance = result.instance;
            }
            console.log('[YouTubeShunt] Config:', config);
        } catch (e) {
            console.log('[YouTubeShunt] Utilisation config par défaut');
        }
    }

    // Écouter les changements de configuration
    browser.storage.onChanged.addListener((changes) => {
        if (changes.instance) {
            config.instance = changes.instance.newValue;
        }
        if (changes.service) {
            config.service = changes.service.newValue;
        }
    });

    // Créer un élément depuis une chaîne SVG de manière sécurisée
    function createSvgElement(svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        return doc.documentElement; // Retourne l'élément SVG
    }

    // Icône (œil stylisé)
    const shuntIconSVG = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  `;

    // Extraire l'ID vidéo depuis une URL
    function extractVideoId(url) {
        if (!url) return null;

        // Format: /watch?v=VIDEO_ID
        const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (watchMatch) return watchMatch[1];

        // Format: /shorts/VIDEO_ID
        const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
        if (shortsMatch) return shortsMatch[1];

        // Format: /embed/VIDEO_ID
        const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        if (embedMatch) return embedMatch[1];

        return null;
    }

    // Construire l'URL de redirection
    function buildRedirectUrl(videoId) {
        return `${config.instance}/watch?v=${videoId}`;
    }

    // Créer le bouton shunt sur les vignettes
    function createShuntButton(videoId) {
        const button = document.createElement('button');
        button.className = 'yt-shunt-btn';

        // Utilisation sécurisée de l'icône
        button.appendChild(createSvgElement(shuntIconSVG));

        button.title = `Ouvrir dans ${config.service === 'piped' ? 'Piped' : 'Invidious'}`;
        button.dataset.videoId = videoId;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const url = buildRedirectUrl(videoId);
            console.log('[YouTubeShunt] Ouverture:', url);
            window.open(url, '_blank');

            // Feedback visuel
            button.classList.add('clicked');
            setTimeout(() => button.classList.remove('clicked'), 500);
        });

        return button;
    }

    // Trouver tous les liens vidéo sur la page
    function findVideoLinks() {
        // Sélectionner tous les liens qui pointent vers des vidéos
        const allLinks = document.querySelectorAll('a[href*="/watch?v="], a[href*="/shorts/"]');
        const videoLinks = [];

        allLinks.forEach(link => {
            const videoId = extractVideoId(link.href);
            if (!videoId) return;

            // Chercher une image/thumbnail dans ce lien ou ses enfants
            const hasImg = link.querySelector('img, yt-image, ytd-thumbnail img');
            const hasThumbnail = link.id === 'thumbnail' ||
                link.closest('ytd-thumbnail') ||
                link.querySelector('ytd-thumbnail');

            // On veut les liens qui contiennent des images (vignettes)
            if (hasImg || hasThumbnail) {
                videoLinks.push({ link, videoId });
            }
        });

        return videoLinks;
    }

    // Injecter les boutons sur les vignettes
    function injectButtons() {
        const videoLinks = findVideoLinks();
        let injected = 0;

        videoLinks.forEach(({ link, videoId }) => {
            // Éviter les doublons
            if (link.dataset.shuntInjected === 'true') return;

            // Marquer comme traité
            link.dataset.shuntInjected = 'true';

            // S'assurer que le conteneur a position relative
            link.style.position = 'relative';
            link.style.display = 'block';

            // Créer et ajouter le bouton
            const button = createShuntButton(videoId);
            link.appendChild(button);
            injected++;
        });

        if (injected > 0) {
            console.log(`[YouTubeShunt] ${injected} boutons injectés (total: ${videoLinks.length} vidéos)`);
        }
    }

    // Observer pour le chargement dynamique (scroll infini)
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldInject = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Vérifier si le nœud ajouté contient des liens vidéo
                            if (node.querySelector &&
                                (node.querySelector('a[href*="/watch"]') ||
                                    node.querySelector('a[href*="/shorts/"]') ||
                                    node.matches?.('a[href*="/watch"]'))) {
                                shouldInject = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldInject) break;
            }

            if (shouldInject) {
                // Debounce pour éviter trop d'appels
                clearTimeout(window.shuntDebounce);
                window.shuntDebounce = setTimeout(injectButtons, 300);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Créer un bouton flottant sur la page de lecture vidéo
    function createFloatingButton() {
        // Seulement sur les pages de lecture
        if (!location.href.includes('/watch')) return;

        // Éviter les doublons
        if (document.getElementById('yt-shunt-floating')) return;

        const videoId = extractVideoId(location.href);
        if (!videoId) return;

        const button = document.createElement('button');
        button.id = 'yt-shunt-floating';
        button.className = 'yt-shunt-floating';

        // Utilisation sécurisée de l'icône et du texte
        button.appendChild(createSvgElement(shuntIconSVG));

        const span = document.createElement('span');
        span.textContent = 'Ouvrir sans pub';
        button.appendChild(span);

        button.title = `Ouvrir dans ${config.service === 'piped' ? 'Piped' : 'Invidious'}`;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const url = buildRedirectUrl(videoId);
            console.log('[YouTubeShunt] Ouverture depuis bouton flottant:', url);
            window.open(url, '_blank');
        });

        document.body.appendChild(button);
        console.log('[YouTubeShunt] Bouton flottant ajouté');
    }

    // Supprimer le bouton flottant
    function removeFloatingButton() {
        const btn = document.getElementById('yt-shunt-floating');
        if (btn) btn.remove();
    }

    // Initialisation
    async function init() {
        await loadConfig();

        console.log('[YouTubeShunt] Initialisation...');

        // Injection initiale (avec délai pour laisser YouTube charger)
        setTimeout(injectButtons, 1000);
        setTimeout(injectButtons, 2000);
        setTimeout(injectButtons, 4000);

        // Bouton flottant sur page vidéo
        setTimeout(createFloatingButton, 500);

        // Observer pour le contenu dynamique
        setupObserver();

        // Réinjecter après navigation SPA
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('[YouTubeShunt] Navigation détectée:', lastUrl);
                setTimeout(injectButtons, 500);
                setTimeout(injectButtons, 1500);

                // Gérer le bouton flottant
                removeFloatingButton();
                setTimeout(createFloatingButton, 500);
            }
        }, 500);
    }

    // Lancer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
