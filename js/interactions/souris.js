// ==========================================
// MODULE INTERACTIONS : ÉTAT, TAILLE & SOURIS
// ==========================================

export const etatGrille = {
    echelle: 50,
    decalageX: 0,
    decalageY: 0,
    estEnTrainDeGlisser: false,
    derniereSourisX: 0,
    derniereSourisY: 0
};

let canvas, ctx;

export function initialiserCanvasEtInteractions() {
    canvas = document.getElementById('grilleCanvas');
    ctx = canvas.getContext('2d');
    
    redimensionnerCanvas();
    centrerOrigineInitial();
    configurerEcouteursEvenements();

    return { canvas, ctx };
}

export function redimensionnerCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function centrerOrigineInitial() {
    etatGrille.decalageX = canvas.width / 2;
    etatGrille.decalageY = canvas.height / 2;
}

export function convertirPixelsVersGrille(pixelX, pixelY, etat) {
    const x = (pixelX - etat.decalageX) / etat.echelle;
    const y = (pixelY - etat.decalageY) / etat.echelle; // Direct (le bas devient positif)
    return { x, y };
}



export function configurerEcouteursEvenements() {
    window.addEventListener('resize', redimensionnerCanvas);

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            etatGrille.estEnTrainDeGlisser = true;
            etatGrille.derniereSourisX = e.clientX;
            etatGrille.derniereSourisY = e.clientY;
        }
    });

    window.addEventListener('mousemove', (e) => {
        // Gestion du déplacement (pan) si on clique-glisse
        if (etatGrille.estEnTrainDeGlisser) {
            const deltaX = e.clientX - etatGrille.derniereSourisX;
            const deltaY = e.clientY - etatGrille.derniereSourisY;

            etatGrille.decalageX += deltaX;
            etatGrille.decalageY += deltaY;

            etatGrille.derniereSourisX = e.clientX;
            etatGrille.derniereSourisY = e.clientY;
        }

        // --- MISE À JOUR DES COORDONNÉES DE LA SOURIS ---
        const divCoord = document.getElementById('coord-souris');
        if (divCoord) {
            const rect = canvas.getBoundingClientRect();
            const pixelX = e.clientX - rect.left;
            const pixelY = e.clientY - rect.top;

            const coordsLogiques = convertirPixelsVersGrille(pixelX, pixelY, etatGrille);
            divCoord.textContent = `X: ${coordsLogiques.x.toFixed(1)} | Y: ${coordsLogiques.y.toFixed(1)}`;
        }
    });

    window.addEventListener('mouseup', () => {
        etatGrille.estEnTrainDeGlisser = false;
    });

    canvas.addEventListener('mouseleave', () => {
        const divCoord = document.getElementById('coord-souris');
        if (divCoord) {
            divCoord.textContent = `X: - | Y: -`;
        }
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const facteurZoom = 1.15;
        const ancienneEchelle = etatGrille.echelle;

        if (e.deltaY < 0) {
            etatGrille.echelle *= facteurZoom;
        } else {
            etatGrille.echelle /= facteurZoom;
        }

        etatGrille.echelle = Math.max(10, Math.min(300, etatGrille.echelle));

        const rect = canvas.getBoundingClientRect();
        const sourisX = e.clientX - rect.left;
        const sourisY = e.clientY - rect.top;

        etatGrille.decalageX = sourisX - (sourisX - etatGrille.decalageX) * (etatGrille.echelle / ancienneEchelle);
        etatGrille.decalageY = sourisY - (sourisY - etatGrille.decalageY) * (etatGrille.echelle / ancienneEchelle);
    }, { passive: false });
}



