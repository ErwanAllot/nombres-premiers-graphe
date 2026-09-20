// ==========================================
// MODULE RENDU : DESSIN DES ÉPINGLES
// ==========================================

function dessinerEpingle(ctx, epingle, etatGrille) {
    const echelle = etatGrille.echelle;
    
    const pixelX = epingle.x * echelle + etatGrille.decalageX;
    const pixelY = epingle.y * echelle + etatGrille.decalageY;

    ctx.save();
    
    ctx.translate(pixelX, pixelY);
    ctx.rotate((epingle.orientation * Math.PI) / 180);

    // Définition des palettes selon le type de l'épingle
    let couleurCorps, couleurTete, couleurQueue;

    if (epingle.couleurType === 'rouge') {
        couleurCorps = '#FF4500';  // Rouge vif
        couleurTete = '#8B0000';   // Rouge foncé
        couleurQueue = '#FF7F50';  // Corail / rouge clair
    } else if (epingle.couleurType === 'vert') {
        couleurCorps = '#32CD32';  // Vert
        couleurTete = '#006400';   // Vert foncé
        couleurQueue = '#98FB98';  // Vert clair
    } else {
        // Violet par défaut (initiales 3 et 5)
        couleurCorps = '#8A2BE2';  
        couleurTete = '#4B0082';   
        couleurQueue = '#BA55D3';  
    }

    const taille = echelle;

    // A. LA QUEUE
    ctx.fillStyle = couleurQueue;
    ctx.fillRect(-1.5 * taille, -0.5 * taille, taille, taille);

    // B. LES PETITS APPENDICES CARRÉS (sur les intersections à y = -1 et y = 1)
    const tailleAppendice = taille * 0.3;
    
    ctx.fillRect(
        -1.0 * taille - (tailleAppendice / 2), 
        -1.0 * taille - (tailleAppendice / 2), 
        tailleAppendice, 
        tailleAppendice
    );
    ctx.fillRect(
        -1.0 * taille - (tailleAppendice / 2), 
        1.0 * taille - (tailleAppendice / 2), 
        tailleAppendice, 
        tailleAppendice
    );

    // C. LE CORPS
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

    ctx.restore();

    // AFFICHAGE DU TEXTE (toujours droit)
    if (echelle > 15) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.max(10, echelle * 0.4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(epingle.valeur, pixelX, pixelY);
    }
}