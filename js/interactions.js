// ==========================================
// MODULE INTERACTIONS : ÉTAT, TAILLE & SOURIS
// ==========================================

const etatGrille = {
    echelle: 50,
    decalageX: 0,
    decalageY: 0,
    estEnTrainDeGlisser: false,
    derniereSourisX: 0,
    derniereSourisY: 0
};

let canvas, ctx;

function initialiserCanvasEtInteractions() {
    canvas = document.getElementById('grilleCanvas');
    ctx = canvas.getContext('2d');
    
    redimensionnerCanvas();
    centrerOrigineInitial();
    configurerEcouteursEvenements();

    return { canvas, ctx };
}

function redimensionnerCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function centrerOrigineInitial() {
    etatGrille.decalageX = canvas.width / 2;
    etatGrille.decalageY = canvas.height / 2;
}

function configurerEcouteursEvenements() {
    window.addEventListener('resize', redimensionnerCanvas);

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            etatGrille.estEnTrainDeGlisser = true;
            etatGrille.derniereSourisX = e.clientX;
            etatGrille.derniereSourisY = e.clientY;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!etatGrille.estEnTrainDeGlisser) return;
        
        const deltaX = e.clientX - etatGrille.derniereSourisX;
        const deltaY = e.clientY - etatGrille.derniereSourisY;

        etatGrille.decalageX += deltaX;
        etatGrille.decalageY += deltaY;

        etatGrille.derniereSourisX = e.clientX;
        etatGrille.derniereSourisY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        etatGrille.estEnTrainDeGlisser = false;
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