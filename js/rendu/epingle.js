// ==========================================
// MODULE RENDU : DESSIN DES ÉPINGLES
// ==========================================

function dessinerEpingle(ctx, epingle, etatGrille) {
    const echelle = etatGrille.echelle;
    
    // Position du corps de l'épingle en pixels (coordonnées globales)
    const pixelX = epingle.x * echelle + etatGrille.decalageX;
    const pixelY = epingle.y * echelle + etatGrille.decalageY;

    // --- 1. PARTIE ROTATIVE (Géométrie de l'épingle) ---
    ctx.save();
    
    ctx.translate(pixelX, pixelY);
    ctx.rotate((epingle.orientation * Math.PI) / 180);

    // Définition des couleurs (Palette Violet)
    const couleurCorps = '#8A2BE2';   // Violet normal
    const couleurTete = '#4B0082';    // Violet foncé
    const couleurQueue = '#BA55D3';   // Violet clair

    const taille = echelle; // Une unité de grille

    // A. LA QUEUE (carré centralisé à -1 en X relatif)
    ctx.fillStyle = couleurQueue;
    ctx.fillRect(-1.5 * taille, -0.5 * taille, taille, taille);

    // B. LES PETITS APPENDICES CARRÉS (centrés sur les intersections de grille à y = -1 et y = 1)
    const tailleAppendice = taille * 0.3; // Petit carré d'ancrage
    
    // Appendice haut (intersection de grille à x = -1, y = -1)
    ctx.fillRect(
        -1.0 * taille - (tailleAppendice / 2), 
        -1.0 * taille - (tailleAppendice / 2), 
        tailleAppendice, 
        tailleAppendice
    );

    // Appendice bas (intersection de grille à x = -1, y = 1)
    ctx.fillRect(
        -1.0 * taille - (tailleAppendice / 2), 
        1.0 * taille - (tailleAppendice / 2), 
        tailleAppendice, 
        tailleAppendice
    );

    // C. LE CORPS (carré central en 0,0)
    ctx.fillStyle = couleurCorps;
    ctx.fillRect(-0.5 * taille, -0.5 * taille, taille, taille);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(-0.5 * taille, -0.5 * taille, taille, taille);

    // D. LA TÊTE (rond à +1 en X relatif)
    ctx.beginPath();
    ctx.arc(1 * taille, 0, taille * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = couleurTete;
    ctx.fill();
    ctx.stroke();

    ctx.restore(); // Fin de la rotation

    // --- 2. AFFICHAGE DU TEXTE (En coordonnées globales, jamais inversé) ---
    if (echelle > 15) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.max(10, echelle * 0.4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(epingle.valeur, pixelX, pixelY);
    }
}