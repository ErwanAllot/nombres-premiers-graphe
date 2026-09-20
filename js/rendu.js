// ==========================================
// MODULE RENDU : DESSIN DU CANVAS (GRILLE & AXES)
// ==========================================

function effacerCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dessinerGrilleSecondaire(ctx, canvas, etatGrille) {
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

function dessinerAxesPrincipaux(ctx, canvas, etatGrille) {
    ctx.lineWidth = 2;

    // Axe Y (abscisse 0)
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(etatGrille.decalageX, 0);
    ctx.lineTo(etatGrille.decalageX, canvas.height);
    ctx.stroke();

    // Axe X (ordonnée 0)
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, etatGrille.decalageY);
    ctx.lineTo(canvas.width, etatGrille.decalageY);
    ctx.stroke();
}


// ==========================================
// MODULE RENDU : DESSIN DES ÉPINGLES
// ==========================================

function dessinerEpingle(ctx, epingle, etatGrille) {
    // Conversion des coordonnées logiques en pixels sur le canvas
    const pixelX = epingle.x * etatGrille.echelle + etatGrille.decalageX;
    const pixelY = epingle.y * etatGrille.echelle + etatGrille.decalageY;

    const rayon = Math.max(4, etatGrille.echelle * 0.35); // Le rayon s'adapte au zoom

    // Cercle de l'épingle
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, rayon, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffcc00'; // Couleur dorée/jaune pour les épingles
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Affichage de la valeur (le nombre premier) au centre de l'épingle
    if (etatGrille.echelle > 20) { // On n'affiche le texte que si le zoom est suffisant
        ctx.fillStyle = '#0b0b0e';
        ctx.font = `${Math.max(10, etatGrille.echelle * 0.3)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(epingle.valeur, pixelX, pixelY);
    }
}