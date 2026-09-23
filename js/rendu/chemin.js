// ==========================================
// MODULE RENDU : TRACÉ DES CHEMINS, DE Q ET DE J
// ==========================================

export function dessinerPoint(ctx, px, py, rayon, couleur) {
    ctx.beginPath();
    ctx.arc(px, py, rayon, 0, 2 * Math.PI);
    ctx.fillStyle = couleur;
    ctx.fill();
    ctx.strokeStyle = '#0B0B0E';
    ctx.lineWidth = 1;
    ctx.stroke();
}

export function dessinerSegments(ctx, segments, echelle, decalageX, decalageY) {
    if (!segments || segments.length === 0) return;

    segments.forEach(seg => {
        const pxDebutX = seg.debut.x * echelle + decalageX;
        const pxDebutY = seg.debut.y * echelle + decalageY;
        const pxFinX = seg.fin.x * echelle + decalageX;
        const pxFinY = seg.fin.y * echelle + decalageY;

        ctx.beginPath();
        ctx.moveTo(pxDebutX, pxDebutY);
        ctx.lineTo(pxFinX, pxFinY);

        // --- GESTION DES COULEURS DE TRACÉ ---
if (seg.couleur === 'jaune') {
            ctx.strokeStyle = '#FFCC00';
        } else if (seg.couleur === 'rose') {
            ctx.strokeStyle = '#FF69B4'; // Rose vif
        } else if (seg.couleur === 'vert') {
            ctx.strokeStyle = '#00ff0d'; // Vert
        } else {
            ctx.strokeStyle = '#00BFFF'; // Bleu par défaut
        }

        ctx.lineWidth = Math.max(2, echelle * 0.1);
        ctx.stroke();
    });
}

export function dessinerPointPivotQ(ctx, pointPivotQ, echelle, decalageX, decalageY) {
    if (!pointPivotQ) return;
    const pxQ_X = pointPivotQ.x * echelle + decalageX;
    const pxQ_Y = pointPivotQ.y * echelle + decalageY;
    dessinerPoint(ctx, pxQ_X, pxQ_Y, 4, '#FF4444'); // Q en rouge
}

export function dessinerPointZ(ctx, pointZ, echelle, decalageX, decalageY) {
    if (!pointZ) return;
    const pxZ_X = pointZ.x * echelle + decalageX;
    const pxZ_Y = pointZ.y * echelle + decalageY;
    dessinerPoint(ctx, pxZ_X, pxZ_Y, 5, '#FF69B4'); // Z en rose
}

export function dessinerJointJ(ctx, jointJ, echelle, decalageX, decalageY) {
    if (!jointJ) return;
    const pxJX = jointJ.x * echelle + decalageX;
    const pxJY = jointJ.y * echelle + decalageY;
    // dessinerPoint(ctx, pxJX, pxJY, Math.max(3, echelle * 0.15), '#FFFFFF');
}

export function dessinerPointM(ctx, pointM, echelle, decalageX, decalageY) {
    if (!pointM) return;
    const pxM_X = pointM.x * echelle + decalageX;
    const pxM_Y = pointM.y * echelle + decalageY;
    dessinerPoint(ctx, pxM_X, pxM_Y, 4, '#FFA500'); // M en orange
}


export function dessinerPointS(ctx, pointM, echelle, decalageX, decalageY) {
    if (!pointM) return;
    const pxM_X = pointM.x * echelle + decalageX;
    const pxM_Y = pointM.y * echelle + decalageY;
    dessinerPoint(ctx, pxM_X, pxM_Y, 4, '#00ff0d'); 
}



/**
 * Fonction principale : orchestre le rendu du chemin, de Q, de Z et de J.
 */
export function dessinerChemin(ctx, chemin, etatGrille) {
    const { echelle, decalageX, decalageY } = etatGrille;

    // 1. Tracé des segments du chemin (jaune, bleu, rose)
    dessinerSegments(ctx, chemin.segments, echelle, decalageX, decalageY);

    // 2. Affichage graphique du point pivot Q (en rouge)
    dessinerPointPivotQ(ctx, chemin.pointPivotQ, echelle, decalageX, decalageY);

    // 3. Affichage graphique du point Z (bout du segment rose)
    dessinerPointZ(ctx, chemin.pointZ, echelle, decalageX, decalageY);

    // 4. Affichage graphique du point J (en blanc, si activé)
    dessinerJointJ(ctx, chemin.jointJ, echelle, decalageX, decalageY);

    dessinerPointM(ctx, chemin.pointM, echelle, decalageX, decalageY); // <-- Appel du rendu pour M

    dessinerPointS(ctx, chemin.pointS, echelle, decalageX, decalageY);
}