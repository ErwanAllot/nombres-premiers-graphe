// ==========================================
// MODULE RENDU : TRACÉ DES CHEMINS & DU JOINT J
// ==========================================

function dessinerChemin(ctx, chemin, etatGrille) {
    const echelle = etatGrille.echelle;
    const decalageX = etatGrille.decalageX;
    const decalageY = etatGrille.decalageY;

    // Conversion des coordonnées logiques en pixels
    const pxPetitX = chemin.departPetit.x * echelle + decalageX;
    const pxPetitY = chemin.departPetit.y * echelle + decalageY;

    const pxGrandX = chemin.departGrand.x * echelle + decalageX;
    const pxGrandY = chemin.departGrand.y * echelle + decalageY;

    const pxJX = chemin.jointJ.x * echelle + decalageX;
    const pxJY = chemin.jointJ.y * echelle + decalageY;

    ctx.lineWidth = Math.max(2, echelle * 0.1);

    // 1. Chemin du plus petit parent vers J (JAUNE)
    ctx.beginPath();
    ctx.moveTo(pxPetitX, pxPetitY);
    ctx.lineTo(pxJX, pxJY);
    ctx.strokeStyle = '#FFCC00'; // Jaune
    ctx.stroke();

    // 2. Chemin du plus grand parent vers J (BLEU)
    ctx.beginPath();
    ctx.moveTo(pxGrandX, pxGrandY);
    ctx.lineTo(pxJX, pxJY);
    ctx.strokeStyle = '#00BFFF'; // Bleu clair / cyan
    ctx.stroke();

    // 3. Représentation visuelle optionnelle du point J (discret ou tête de la nouvelle épingle)
    ctx.beginPath();
    ctx.arc(pxJX, pxJY, Math.max(3, echelle * 0.15), 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#0B0B0E';
    ctx.stroke();
}