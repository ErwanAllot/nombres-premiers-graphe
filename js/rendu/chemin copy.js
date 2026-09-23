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

// export function dessinerSegments(ctx, segments, echelle, decalageX, decalageY) {
//     if (!segments || segments.length === 0) return;

//     segments.forEach(seg => {
//         const pxDebutX = seg.debut.x * echelle + decalageX;
//         const pxDebutY = seg.debut.y * echelle + decalageY;
//         const pxFinX = seg.fin.x * echelle + decalageX;
//         const pxFinY = seg.fin.y * echelle + decalageY;

//         ctx.beginPath();
//         ctx.moveTo(pxDebutX, pxDebutY);
//         ctx.lineTo(pxFinX, pxFinY);
//         ctx.strokeStyle = seg.couleur === 'jaune' ? '#FFCC00' : '#00BFFF';
//         ctx.lineWidth = Math.max(2, echelle * 0.1);
//         ctx.stroke();
//     });
// }


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

        // --- GESTION DES COULEURS ---
        if (seg.couleur === 'jaune') {
            ctx.strokeStyle = '#FFCC00';
        } else if (seg.couleur === 'rose') {
            ctx.strokeStyle = '#FF69B4'; // Un beau rose vif
        } else {
            ctx.strokeStyle = '#00BFFF'; // Bleu par défaut
        }

        ctx.lineWidth = Math.max(2, echelle * 0.1);
        ctx.stroke();
    });
}

/**
 * Calcule un point Z prolongeant Q vers l'extérieur
 */
export function calculerPointZ(p1, p2, pointQ) {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const dirX = pointQ.x - midX;
    const dirY = pointQ.y - midY;

    return {
        x: pointQ.x + dirX,
        y: pointQ.y + dirY
    };
}

// export function dessinerPointPivotQ(ctx, pointPivotQ, parentPetitId, parentGrandId, echelle, decalageX, decalageY) {
//     if (!pointPivotQ) return;

//     const pxQ_X = pointPivotQ.x * echelle + decalageX;
//     const pxQ_Y = pointPivotQ.y * echelle + decalageY;
        
//     dessinerPoint(ctx, pxQ_X, pxQ_Y, 4, '#FF4444');
// }


// 1. On garde l'affichage normal de ton pivot Q (en rouge par exemple)
export function dessinerPointPivotQ(ctx, pointPivotQ, echelle, decalageX, decalageY) {
    if (!pointPivotQ) return;
    const pxQ_X = pointPivotQ.x * echelle + decalageX;
    const pxQ_Y = pointPivotQ.y * echelle + decalageY;
    dessinerPoint(ctx, pxQ_X, pxQ_Y, 4, '#FF4444'); // Q en rouge
}

// 2. On crée un affichage spécifique pour le point Z au bout du segment rose (qui accueillera le 7)
export function dessinerPointZ(ctx, pointZ, echelle, decalageX, decalageY) {
    if (!pointZ) return;
    const pxZ_X = pointZ.x * echelle + decalageX;
    const pxZ_Y = pointZ.y * echelle + decalageY;
    dessinerPoint(ctx, pxZ_X, pxZ_Y, 5, '#FF69B4'); // Z en rose (ou future épingle 7)
}



export function dessinerJointJ(ctx, jointJ, echelle, decalageX, decalageY) {
    if (!jointJ) return;

    const pxJX = jointJ.x * echelle + decalageX;
    const pxJY = jointJ.y * echelle + decalageY;
    // dessinerPoint(ctx, pxJX, pxJY, Math.max(3, echelle * 0.15), '#FFFFFF');
}

/**
 * Fonction principale : orchestre le rendu du chemin, de Q et de J.
 */
// export function dessinerChemin(ctx, chemin, etatGrille) {
//     const { echelle, decalageX, decalageY } = etatGrille;

//     // 1. Tracé des segments du chemin en "L"
//     dessinerSegments(ctx, chemin.segments, echelle, decalageX, decalageY);

//     // 2. Affichage graphique du point pivot Q (en rouge)
//     dessinerPointPivotQ(
//         ctx, 
//         chemin.pointPivotQ, 
//         chemin.parentPetitId, 
//         chemin.parentGrandId, 
//         echelle, 
//         decalageX, 
//         decalageY
//     );

//     // 3. Affichage graphique du point J d'origine (en blanc, actuellement commenté)
//     dessinerJointJ(ctx, chemin.jointJ, echelle, decalageX, decalageY);
// }

export function dessinerChemin(ctx, chemin, etatGrille) {
    const { echelle, decalageX, decalageY } = etatGrille;

    // 1. Tracé des segments (jaune, bleu, et le rose Q -> Z)
    dessinerSegments(ctx, chemin.segments, echelle, decalageX, decalageY);

    // 2. Affichage du pivot Q
    dessinerPointPivotQ(ctx, chemin.pointPivotQ, echelle, decalageX, decalageY);

    // 3. Affichage du point Z (le bout du rose, futur emplacement de 7)
    dessinerPointZ(ctx, chemin.pointZ, echelle, decalageX, decalageY);
}