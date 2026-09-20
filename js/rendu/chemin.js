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




function dessinerChemin(ctx, chemin, etatGrille) {
    const echelle = etatGrille.echelle;
    const decalageX = etatGrille.decalageX;
    const decalageY = etatGrille.decalageY;

    // 1. Tracé des segments du chemin en "L"
    if (chemin.segments && chemin.segments.length > 0) {
        chemin.segments.forEach(seg => {
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

    // 2. Affichage graphique du point pivot Q (en rouge)
// Affichage graphique du point pivot Q
    if (chemin.pointPivotQ) {
        const pxQ_X = chemin.pointPivotQ.x * echelle + decalageX;
        const pxQ_Y = chemin.pointPivotQ.y * echelle + decalageY;
        
        // On logue pour savoir quel chemin dessine ce point Q et où il est
        if (chemin.parentPetitId === 3 && chemin.parentGrandId === 7) {
            console.log("POINT Q POUR (3,7) AFFICHÉ À :", chemin.pointPivotQ);
        }
        
        dessinerPoint(ctx, pxQ_X, pxQ_Y, 4, '#FF4444');

    }

    // 3. Affichage graphique du point J d'origine (en blanc)
    if (chemin.jointJ) {
        const pxJX = chemin.jointJ.x * echelle + decalageX;
        const pxJY = chemin.jointJ.y * echelle + decalageY;
        // dessinerPoint(ctx, pxJX, pxJY, Math.max(3, echelle * 0.15), '#FFFFFF');
    }
}