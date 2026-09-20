function dessinerEpingle(ctx, epingle, etatGrille) {
    const echelle = etatGrille.echelle;
    
    const pixelX = epingle.x * echelle + etatGrille.decalageX;
    const pixelY = epingle.y * echelle + etatGrille.decalageY;

    ctx.save();
    
    ctx.translate(pixelX, pixelY);
    ctx.rotate((epingle.orientation * Math.PI) / 180);

    let couleurCorps, couleurTete, couleurQueue;

    if (epingle.couleurType === 'rouge') {
        couleurCorps = '#FF4500';  
        couleurTete = '#8B0000';   
        couleurQueue = '#FF7F50';  
    } else if (epingle.couleurType === 'vert') {
        couleurCorps = '#32CD32';  
        couleurTete = '#006400';   
        couleurQueue = '#98FB98';  
    } else {
        couleurCorps = '#8A2BE2';  
        couleurTete = '#4B0082';   
        couleurQueue = '#BA55D3';  
    }

    const taille = echelle;
    const nbQueue = epingle.longueurQueue || 1; // 1 par défaut

    // A. LA QUEUE EXTENSIBLE (boucle selon le nombre de segments de queue)
    ctx.fillStyle = couleurQueue;
    for (let i = 0; i < nbQueue; i++) {
        // Chaque segment s'allonge d'une unité supplémentaire vers la gauche (ex: -1.5, -2.5, etc.)
        ctx.fillRect((-1.5 - i) * taille, -0.5 * taille, taille, taille);
    }

    // B. LES PETITS APPENDICES CARRÉS (placés tout au bout de la queue, au dernier niveau)
    const tailleAppendice = taille * 0.3;
    const extremiteQueueX = (-1.0 - (nbQueue - 1)) * taille; // Position X du bout de la queue

    ctx.fillRect(
        extremiteQueueX - (tailleAppendice / 2), 
        -1.0 * taille - (tailleAppendice / 2), 
        tailleAppendice, 
        tailleAppendice
    );
    ctx.fillRect(
        extremiteQueueX - (tailleAppendice / 2), 
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