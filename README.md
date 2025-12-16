# 🎬 YouTube Shunt

[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/ncp/payment/NPGMPUL9N9TFQ)

**[English](#english) | [Français](#français)**

---

<a name="english"></a>
## 🇬🇧 English

**YouTube Shunt** is a lightweight Firefox extension that redirects YouTube videos to privacy-friendly alternatives like **Invidious** or **Piped**.

### ✨ Features
- **Privacy First**: Watch videos without Google tracking.
- **Smart Buttons**: Adds a redirect button directly on every video thumbnail (Home, Search, Sidebar, Shorts).
- **Floating Button**: Adds a "Watch without Ads" floating button on video pages (bypasses anti-adblock overlays).
- **Customizable**: Choose between Invidious or Piped, and select your preferred instance.
- **Open Source**: Verify the code, it's safe!

### 📥 Installation
1. Download the latest `.xpi` file from the [Releases](../../releases) section (or use the provided `YoutubeShunt-1.1.1.xpi`).
2. Open Firefox and go to `about:addons`.
3. Click the gear icon ⚙️ -> **Install Add-on From File...**
4. Select the `.xpi` file.

### ☕ Support
If you like this project, you can buy me a coffee!  
[**Donate via PayPal**](https://www.paypal.com/ncp/payment/NPGMPUL9N9TFQ)

---

<a name="français"></a>
## 🇫🇷 Français

**YouTube Shunt** est une extension Firefox légère qui redirige les vidéos YouTube vers des alternatives respectueuses de la vie privée comme **Invidious** ou **Piped**.

### ✨ Fonctionnalités
- **Vie Privée** : Regardez des vidéos sans le pistage de Google.
- **Boutons Intelligents** : Ajoute un bouton de redirection directement sur chaque vignette vidéo (Accueil, Recherche, Sidebar, Shorts).
- **Bouton Flottant** : Ajoute un bouton flottant "Ouvrir sans pub" sur les pages de lecture (passe au-dessus des bloqueurs anti-adblock).
- **Personnalisable** : Choisissez entre Invidious ou Piped, et sélectionnez votre instance préférée.
- **Open Source** : Vérifiez le code, c'est clean !

### 📥 Installation
1. Téléchargez le dernier fichier `.xpi` depuis les [Releases](../../releases) (ou utilisez le `YoutubeShunt-1.1.1.xpi` fourni).
2. Ouvrez Firefox et allez sur `about:addons`.
3. Cliquez sur la roue dentée ⚙️ -> **Installer un module depuis un fichier...**
4. Sélectionnez le fichier `.xpi`.

### ☕ Soutien
Si ce projet vous plaît, vous pouvez me soutenir !  
[**Faire un don via PayPal**](https://www.paypal.com/ncp/payment/NPGMPUL9N9TFQ)

---

## 🛠 For Developers / Pour les développeurs

### Build
To create the `.xpi` package:
```bash
zip -r youtube-shunt.xpi manifest.json content.js styles.css popup.html popup.js popup.css icons/
```

### Stack
- Vanilla JavaScript
- CSS3
- Firefox WebExtensions API

## 📄 License
MIT License
