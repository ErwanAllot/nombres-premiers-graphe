// ==========================================
// MODULE RENDU : TRACÉ DES CHEMINS, DE Q ET DE J
// ==========================================

function dessinerPoint(ctx, px, py, rayon, couleur) {
    ctx.beginPath();
    ctx.arc(px, py, rayon, 0, 2 * Math.PI);
    ctx.fillStyle = couleur;
    ctx.fill();
    ctx.strokeStyle = '#0B0B0E';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function dessinerSegments(ctx, segments, echelle, decalageX, decalageY) {
    if (!segments || segments.length === 0) return;

    segments.forEach(seg => {
        const pxDebutX = seg.debut.x * echelle + decalageX;
        const pxDebutY = seg.debut.y * echelle + decalageY;
        const pxFinX = seg.fin.x * echelle + decalageX;
        const pxFinY = seg.fin.y * echelle + decalageY;

        ctx.beginPath();
        ctx.moveTo(pxDebutX, pxDebutY);
        ctx.lineTo(pxFinX, pxFinY);
        ctx.strokeStyle = seg.couleur === 'jaune' ? '#FFCC00' : '#00BFFF';
        ctx.lineWidth = Math.max(2, echelle * 0.1);
        ctx.stroke();
    });
}

function dessinerPointPivotQ(ctx, pointPivotQ, parentPetitId, parentGrandId, echelle, decalageX, decalageY) {
    if (!pointPivotQ) return;

    const pxQ_X = pointPivotQ.x * echelle + decalageX;
    const pxQ_Y = pointPivotQ.y * echelle + decalageY;
        
    dessinerPoint(ctx, pxQ_X, pxQ_Y, 4, '#FF4444');
}

function dessinerJointJ(ctx, jointJ, echelle, decalageX, decalageY) {
    if (!jointJ) return;

    const pxJX = jointJ.x * echelle + decalageX;
    const pxJY = jointJ.y * echelle + decalageY;
    // dessinerPoint(ctx, pxJX, pxJY, Math.max(3, echelle * 0.15), '#FFFFFF');
}

/**
 * Fonction principale : orchestre le rendu du chemin, de Q et de J.
 */
function dessinerChemin(ctx, chemin, etatGrille) {
    const { echelle, decalageX, decalageY } = etatGrille;

    // 1. Tracé des segments du chemin en "L"
    dessinerSegments(ctx, chemin.segments, echelle, decalageX, decalageY);

    // 2. Affichage graphique du point pivot Q (en rouge)
    dessinerPointPivotQ(
        ctx, 
        chemin.pointPivotQ, 
        chemin.parentPetitId, 
        chemin.parentGrandId, 
        echelle, 
        decalageX, 
        decalageY
    );

    // 3. Affichage graphique du point J d'origine (en blanc, actuellement commenté)
    dessinerJointJ(ctx, chemin.jointJ, echelle, decalageX, decalageY);
}