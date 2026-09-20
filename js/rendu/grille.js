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


