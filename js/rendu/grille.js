// ==========================================
// MODULE RENDU : DESSIN DU CANVAS (GRILLE & AXES)
// ==========================================

export function effacerCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function dessinerGrilleSecondaire(ctx, canvas, etatGrille) {
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

export function dessinerAxesPrincipaux(ctx, canvas, etatGrille) {
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




export function dessinerInsertionGrille(ctx, canvas, etatGrille) {
    const echelle = etatGrille.echelle;

    // Si une ligne logique est marquée pour l'insertion (ex: etatGrille.ligneInseree = 2)
    if (etatGrille.ligneInseree !== undefined) {
        const py = etatGrille.ligneInseree * echelle + etatGrille.decalageY;
        
        ctx.fillStyle = '#4a1525'; // Un rouge bordeaux discret et sombre
        // On remplit toute la largeur du canvas à cette hauteur logique
        ctx.fillRect(0, py, canvas.width, echelle);
    }

    // Si une colonne logique est marquée pour l'insertion (ex: etatGrille.colonneInseree = 1)
    if (etatGrille.colonneInseree !== undefined) {
        const px = etatGrille.colonneInseree * echelle + etatGrille.decalageX;
        
        ctx.fillStyle = '#4a1525';
        // On remplit toute la hauteur du canvas sur cette largeur logique
        ctx.fillRect(px, 0, echelle, canvas.height);
    }
}

export function dessinerLigneInseree(ctx, canvas, etatGrille, yLogique) {
    const py = yLogique * etatGrille.echelle + etatGrille.decalageY;
    ctx.fillStyle = '#4a1525'; // Rouge bordeaux discret
    ctx.fillRect(0, py, canvas.width, etatGrille.echelle);
}

export function dessinerColonneInseree(ctx, canvas, etatGrille, xLogique) {
    const px = xLogique * etatGrille.echelle + etatGrille.decalageX;
    ctx.fillStyle = '#4a1525';
    ctx.fillRect(px, 0, etatGrille.echelle, canvas.height);
}