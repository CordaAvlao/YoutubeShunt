// Instances disponibles
const INSTANCES = {
    invidious: [
        { name: 'yewtu.be', url: 'https://yewtu.be' },
        { name: 'vid.puffyan.us', url: 'https://vid.puffyan.us' },
        { name: 'invidious.snopyta.org', url: 'https://invidious.snopyta.org' },
        { name: 'inv.nadeko.net', url: 'https://inv.nadeko.net' },
        { name: 'invidious.privacydev.net', url: 'https://invidious.privacydev.net' }
    ],
    piped: [
        { name: 'piped.video', url: 'https://piped.video' },
        { name: 'piped.kavin.rocks', url: 'https://piped.kavin.rocks' },
        { name: 'piped.privacydev.net', url: 'https://piped.privacydev.net' },
        { name: 'piped.mha.fi', url: 'https://piped.mha.fi' },
        { name: 'piped.syncpundit.io', url: 'https://piped.syncpundit.io' }
    ]
};

// Éléments DOM
const serviceSelect = document.getElementById('service');
const instanceSelect = document.getElementById('instance');
const customInstance = document.getElementById('custom-instance');
const saveBtn = document.getElementById('save-btn');
const statusDiv = document.getElementById('status');

// Mettre à jour la liste des instances selon le service
function updateInstanceList(service) {
    instanceSelect.innerHTML = '';

    INSTANCES[service].forEach(inst => {
        const option = document.createElement('option');
        option.value = inst.url;
        option.textContent = inst.name;
        instanceSelect.appendChild(option);
    });
}

// Afficher le statut
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status show ' + type;

    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 2000);
}

// Charger les paramètres sauvegardés
async function loadSettings() {
    try {
        const result = await browser.storage.local.get(['service', 'instance', 'customInstance']);

        if (result.service) {
            serviceSelect.value = result.service;
            updateInstanceList(result.service);
        }

        if (result.instance) {
            instanceSelect.value = result.instance;
        }

        if (result.customInstance) {
            customInstance.value = result.customInstance;
        }
    } catch (e) {
        console.error('Erreur chargement paramètres:', e);
    }
}

// Sauvegarder les paramètres
async function saveSettings() {
    try {
        const settings = {
            service: serviceSelect.value,
            instance: customInstance.value.trim() || instanceSelect.value,
            customInstance: customInstance.value.trim()
        };

        await browser.storage.local.set(settings);
        showStatus('✓ Paramètres sauvegardés !', 'success');
    } catch (e) {
        console.error('Erreur sauvegarde:', e);
        showStatus('✗ Erreur de sauvegarde', 'error');
    }
}

// Événements
serviceSelect.addEventListener('change', () => {
    updateInstanceList(serviceSelect.value);
});

saveBtn.addEventListener('click', saveSettings);

// Initialisation
updateInstanceList('invidious');
loadSettings();
