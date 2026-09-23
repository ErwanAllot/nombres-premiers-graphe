// ==========================================
// MODULE RENDU : ÉPINGLE & GÉOMÉTRIE
// ==========================================

function obtenirCouleursEpingle(couleurType) {
    if (couleurType === 'rouge') {
        return { corps: '#FF4500', tete: '#8B0000', queue: '#FF7F50' };
    } else if (couleurType === 'vert') {
        return { corps: '#32CD32', tete: '#006400', queue: '#98FB98' };
    } else {
        return { corps: '#8A2BE2', tete: '#4B0082', queue: '#BA55D3' };
    }
}

function dessinerQueue(ctx, taille, nbQueue, couleurQueue) {
    ctx.fillStyle = couleurQueue;
    for (let i = 0; i < nbQueue; i++) {
        ctx.fillRect((-2.5 - i) * taille, -0.5 * taille, taille, taille);
    }
}

function dessinerAppendices(ctx, taille, nbQueue) {
    const tailleAppendice = taille * 0.3;
    const extremiteQueueX = (-2.0 - (nbQueue - 1)) * taille; 

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
}

function dessinerCorps(ctx, taille, couleurCorps) {
    ctx.fillStyle = couleurCorps;
    ctx.fillRect(-1.5 * taille, -0.5 * taille, taille, taille);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(-1.5 * taille, -0.5 * taille, taille, taille);
}

function dessinerTete(ctx, taille, couleurTete) {
    ctx.beginPath();
    ctx.arc(0, 0, taille * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = couleurTete;
    ctx.fill();
    ctx.stroke();
}

function dessinerTexte(ctx, epingle, pixelX, pixelY, echelle) {
    if (echelle <= 15) return;

    const angleRad = (epingle.orientation * Math.PI) / 180;
    const pixelCorpsX = pixelX - Math.cos(angleRad) * echelle;
    const pixelCorpsY = pixelY - Math.sin(angleRad) * echelle;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${Math.max(10, echelle * 0.4)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(epingle.valeur, pixelCorpsX, pixelCorpsY);
}

/**
 * Fonction principale : assemble tous les morceaux de l'épingle.
 */
export function dessinerEpingle(ctx, epingle, etatGrille) {
    const echelle = etatGrille.echelle;
    const pixelX = epingle.x * echelle + etatGrille.decalageX;
    const pixelY = epingle.y * echelle + etatGrille.decalageY;
    const nbQueue = epingle.longueurQueue || 1;
    const couleurs = obtenirCouleursEpingle(epingle.couleurType);

    ctx.save();
    ctx.translate(pixelX, pixelY);
    ctx.rotate((epingle.orientation * Math.PI) / 180);

    // Ordre de dessin (du fond vers l'avant)
    dessinerQueue(ctx, echelle, nbQueue, couleurs.queue);
    dessinerAppendices(ctx, echelle, nbQueue);
    dessinerCorps(ctx, echelle, couleurs.corps);
    dessinerTete(ctx, echelle, couleurs.tete);

    ctx.restore();

    // Le texte s'affiche par-dessus le canvas global
    dessinerTexte(ctx, epingle, pixelX, pixelY, echelle);
}