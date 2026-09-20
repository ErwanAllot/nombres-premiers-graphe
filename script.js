// ==========================================
// CONTRÔLEUR DE BASE : GRILLE, ZOOM & PAN
// ==========================================

const etatGrille = {
    echelle: 50,      // Taille d'une unité en pixels
    decalageX: 0,     // Position de l'origine X sur le canvas
    decalageY: 0,     // Position de l'origine Y sur le canvas
    estEnTrainDeGlisser: false,
    derniereSourisX: 0,
    derniereSourisY: 0
};

let canvas, ctx;

// Lancement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    initialiserApplication();
});

function initialiserApplication() {
    canvas = document.getElementById('grilleCanvas');
    ctx = canvas.getContext('2d');
    
    redimensionnerCanvas();
    centrerOrigineInitial();
    configurerEcouteursEvenements();
    lancerBoucleRendu();
}

function redimensionnerCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function centrerOrigineInitial() {
    // Place l'origine (0,0) au centre exact de l'écran au démarrage
    etatGrille.decalageX = canvas.width / 2;
    etatGrille.decalageY = canvas.height / 2;
}

// ==========================================
// GESTION DES INTERACTIONS (SOURIS)
// ==========================================

function configurerEcouteursEvenements() {
    window.addEventListener('resize', redimensionnerCanvas);

    // Début du déplacement (Pan) avec le clic gauche
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            etatGrille.estEnTrainDeGlisser = true;
            etatGrille.derniereSourisX = e.clientX;
            etatGrille.derniereSourisY = e.clientY;
        }
    });

    // Mouvement de la souris pour déplacer la grille
    window.addEventListener('mousemove', (e) => {
        if (!etatGrille.estEnTrainDeGlisser) return;
        
        const deltaX = e.clientX - etatGrille.derniereSourisX;
        const deltaY = e.clientY - etatGrille.derniereSourisY;

        etatGrille.decalageX += deltaX;
        etatGrille.decalageY += deltaY;

        etatGrille.derniereSourisX = e.clientX;
        etatGrille.derniereSourisY = e.clientY;
    });

    // Fin du déplacement
    window.addEventListener('mouseup', () => {
        etatGrille.estEnTrainDeGlisser = false;
    });

    // Zoom à la molette centré sur le curseur
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const facteurZoom = 1.15;
        const ancienneEchelle = etatGrille.echelle;

        if (e.deltaY < 0) {
            etatGrille.echelle *= facteurZoom;
        } else {
            etatGrille.echelle /= facteurZoom;
        }

        // Limites de zoom pour éviter les bugs d'affichage extrêmes
        etatGrille.echelle = Math.max(10, Math.min(300, etatGrille.echelle));

        // Ajustement du décalage pour zoomer vers la souris
        const rect = canvas.getBoundingClientRect();
        const sourisX = e.clientX - rect.left;
        const sourisY = e.clientY - rect.top;

        etatGrille.decalageX = sourisX - (sourisX - etatGrille.decalageX) * (etatGrille.echelle / ancienneEchelle);
        etatGrille.decalageY = sourisY - (sourisY - etatGrille.decalageY) * (etatGrille.echelle / ancienneEchelle);
    }, { passive: false });
}

// ==========================================
// MOTEUR GRAPHIQUE (RENDU)
// ==========================================

function lancerBoucleRendu() {
    function rafraichir() {
        effacerCanvas();
        dessinerGrilleSecondaire();
        dessinerAxesPrincipaux();
        
        requestAnimationFrame(rafraichir);
    }
    requestAnimationFrame(rafraichir);
}

function effacerCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dessinerGrilleSecondaire() {
    ctx.strokeStyle = '#181820';
    ctx.lineWidth = 1;

    const pas = etatGrille.echelle;
    const debutX = etatGrille.decalageX % pas;
    const debutY = etatGrille.decalageY % pas;

    // Lignes verticales
    for (let x = debutX; x < canvas.width; x += pas) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Lignes horizontales
    for (let y = debutY; y < canvas.height; y += pas) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function dessinerAxesPrincipaux() {
    ctx.lineWidth = 2;

    // Axe Y (abscisse 0)
    ctx.strokeStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.moveTo(etatGrille.decalageX, 0);
    ctx.lineTo(etatGrille.decalageX, canvas.height);
    ctx.stroke();

    // Axe X (ordonnée 0)
    ctx.strokeStyle = '#4da6ff';
    ctx.beginPath();
    ctx.moveTo(0, etatGrille.decalageY);
    ctx.lineTo(canvas.width, etatGrille.decalageY);
    ctx.stroke();
}