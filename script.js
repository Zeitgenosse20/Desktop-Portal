// Dynamische Begrüßung + Uhrzeit (mit Sekunden)
function updateGreeting() {
    const greetingElement = document.querySelector("#greeting");
    const timeElement = document.querySelector("#Time");

    const now = new Date();
    const hour = now.getHours();

    let greeting;
    if (hour >= 5 && hour < 11) {
        greeting = "Guten Morgen ☀️";
    } else if (hour >= 11 && hour < 17) {
        greeting = "Guten Tag 🌤️";
    } else if (hour >= 17 && hour < 22) {
        greeting = "Guten Abend 🌙";
    } else {
        greeting = "Gute Nacht 🌌";
    }

    // Zeit formatieren mit Sekunden
    const timeString = now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    greetingElement.textContent = greeting;
    timeElement.textContent = timeString;
}

// Beim Laden einmal ausführen
updateGreeting();

// Jede Sekunde aktualisieren
setInterval(updateGreeting, 1000);


// Notizen automatisch speichern
const notesArea = document.querySelector("#notes textarea");

// Beim Laden gespeicherte Notiz einsetzen
notesArea.value = localStorage.getItem("userNotes") || "";

// Speichern bei jeder Eingabe (automatisch)
notesArea.addEventListener("input", () => {
    localStorage.setItem("userNotes", notesArea.value);
});


// Farbtool
const colorPicker = document.querySelector("#colorPicker");
const colorInput = document.querySelector("#colorInput");
const colorButton = document.querySelector("#colorButton");
const colorPreview = document.querySelector("#colorPreview");

// Vorschau aktualisieren
function updateColor(color) {
    colorPreview.style.background = color;
    colorInput.value = color; // HEX-Feld aktualisieren
}

// Klick auf Button oder Enter
colorButton.addEventListener("click", () => {
    updateColor(colorInput.value);
});

// Enter-Taste
colorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        updateColor(colorInput.value);
    }
});

// Color-Picker steuert auch das Feld
colorPicker.addEventListener("input", (e) => {
    updateColor(e.target.value);
});


// Enter-Taste im Farbtool nutzen
colorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();       // verhindert, dass die Seite neu lädt
        colorButton.click();      // löst den gleichen Effekt wie der Button aus
    }
});


// Wikipedia-Suche mit Sprachumschaltung
const wikiForm = document.querySelector("#wikiForm");
const wikiLang = document.querySelector("#wikiLang");
const wikiSearch = document.querySelector("#wikiSearch");

wikiForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Standard-Aktion verhindern
    const lang = wikiLang.value;
    const query = encodeURIComponent(wikiSearch.value.trim());
    if (query) {
        const url = `https://${lang}.wikipedia.org/wiki/Special:Search?search=${query}`;
        window.open(url, "_blank");
    } else {
        alert("Bitte Suchbegriff eingeben!");
    }
});

// Farbpalette
const paletteInput = document.querySelector("#paletteInput");
const paletteAdd = document.querySelector("#paletteAdd");
const paletteExport = document.querySelector("#paletteExport");
const paletteClear = document.querySelector("#paletteClear");
const paletteList = document.querySelector("#paletteList");

// Palette aus LocalStorage laden oder neu starten
let palette = JSON.parse(localStorage.getItem("userPalette")) || [];
renderPalette();

// Farbe hinzufügen
paletteAdd.addEventListener("click", () => {
    const color = paletteInput.value.trim();
    const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(color);

    if (isHex) {
        palette.push(color);
        localStorage.setItem("userPalette", JSON.stringify(palette));
        renderPalette();
        paletteInput.value = "";
    } else {
        alert("Bitte gültigen HEX-Code eingeben (z. B. #ff0000)");
    }
});

// Enter-Taste wie Button
paletteInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        paletteAdd.click();
    }
});

// Palette rendern
function renderPalette() {
    paletteList.innerHTML = "";
    palette.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "paletteItem";
        div.style.background = c;
        div.setAttribute("data-color", c); // Tooltip mit HEX-Code

        // Delete Button
        const delBtn = document.createElement("button");
        delBtn.textContent = "×";
        delBtn.addEventListener("click", () => {
            palette.splice(index, 1);
            localStorage.setItem("userPalette", JSON.stringify(palette));
            renderPalette();
        });

        div.appendChild(delBtn);
        paletteList.appendChild(div);
    });
}


// Export (1): Universelles .hex-Format + Kopie als .txt
const paletteExportText = document.querySelector("#paletteExportText");

paletteExportText.addEventListener("click", () => {
    if (palette.length === 0) {
        alert("Keine Farben in der Palette zum Exportieren!");
        return;
    }

    const hexContent = palette.join("\n");
    const blob = new Blob([hexContent], { type: "text/plain" });
    const today = new Date().toISOString().split("T")[0];

    // Datei 1: .hex
    const linkHex = document.createElement("a");
    linkHex.href = URL.createObjectURL(blob);
    linkHex.download = `palette-${today}.hex`;
    linkHex.click();

    // Datei 2: .txt (für iPad)
    const linkTxt = document.createElement("a");
    linkTxt.href = URL.createObjectURL(blob);
    linkTxt.download = `palette-${today}.txt`;
    linkTxt.click();
});

// Alles löschen
paletteClear.addEventListener("click", () => {
    if (confirm("Willst du wirklich die gesamte Palette löschen?")) {
        palette = [];
        localStorage.removeItem("userPalette");
        renderPalette();
    }
});
