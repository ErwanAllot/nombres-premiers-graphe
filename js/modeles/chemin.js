// ==========================================
// MODULE MODÈLE : CHEMIN & JOINT J
// ==========================================

/**
 * Calcule le Joint J et les données du chemin entre deux épingles parentes.
 * @param {Object} parentPetit - L'épingle du plus petit parent (ex: 3)
 * @param {Object} parentGrand - L'épingle du plus grand parent (ex: 5)
 * @returns {Object} Les coordonnées des points de départ, d'arrivée (J) et les métadonnées
 */
// ==========================================
// MODULE GÉOMÉTRIQUE : CHEMIN ORTHOGONAL & JOINT J
// ==========================================

function obtenirAncresDisponibles(epingle) {
    const distanceDuCorps = epingle.longueurQueue || 1;
    const direction = epingle.x <= 0 ? -1 : 1; 
    const xAncre = epingle.x + (direction * distanceDuCorps);

    return [
        { x: xAncre, y: epingle.y + 1, id: 'haut' },
        { x: xAncre, y: epingle.y - 1, id: 'bas' }
    ];
}

function calculerCheminEtJoint(parentPetit, parentGrand) {
    // 1. Récupération des ancres disponibles
console.log("=== CALCUL DE CHEMIN ===");
    console.log("Parent 1 (valeur):", parentPetit.valeur, "aux coordonnées:", { x: parentPetit.x, y: parentPetit.y }, "avec queue:", parentPetit.longueurQueue);
    console.log("Parent 2 (valeur):", parentGrand.valeur, "aux coordonnées:", { x: parentGrand.x, y: parentGrand.y }, "avec queue:", parentGrand.longueurQueue);

    // 1. Récupération des ancres disponibles
    const ancresPetit = obtenirAncresDisponibles(parentPetit);
    const ancresGrand = obtenirAncresDisponibles(parentGrand);

    console.log("Ancres du parent", parentPetit.valeur, ":", ancresPetit);
    console.log("Ancres du parent", parentGrand.valeur, ":", ancresGrand);

    // 2. Sélection de la paire la plus proche (Distance de Manhattan)
    let meilleurePaire = null;
    let distanceMinimale = Infinity;

    for (let appPetit of ancresPetit) {
        for (let appGrand of ancresGrand) {
            const dist = Math.abs(appPetit.x - appGrand.x) + Math.abs(appPetit.y - appGrand.y);
            if (dist < distanceMinimale) {
                distanceMinimale = dist;
                meilleurePaire = { pPetit: appPetit, pGrand: appGrand };
            }
        }
    }

    const p1 = meilleurePaire.pPetit; // x1, y1
    const p2 = meilleurePaire.pGrand; // x2, y2

    // 3. Application de la règle pour le point pivot Q du chemin orthogonal
    let xq, yq;

    // Si les deux ancres sont sur le même axe (même X ou même Y)
    if (p1.x === p2.x || p1.y === p2.y) {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        // Arrondi en direction de p1 si on tombe sur un .5
        xq = (p1.x < p2.x) ? Math.floor(midX) : Math.ceil(midX);
        yq = (p1.y < p2.y) ? Math.floor(midY) : Math.ceil(midY);

    } else {
        // Règle classique des valeurs absolues pour les cas croisés
        // xq = Math.abs(p1.x) > Math.abs(p2.x) ? p1.x : p2.x;
        // yq = Math.abs(p1.y) > Math.abs(p2.y) ? p1.y : p2.y;

        // Règle croisée : on prend le X de p1 et le Y de p2 (ou l'inverse selon le sens voulu)
        // xq = p1.x;
        // yq = p2.y;

        // Règle croisée : on prend le X de p2 et le Y de p1 pour placer Q à (7, 1)
        // xq = p2.x;
        // yq = p1.y;

        // Règle des cas croisés basée sur l'expansion maximale (plus grande aire / distance au centre)
        const q1 = { x: p1.x, y: p2.y };
        const q2 = { x: p2.x, y:p1.y }; // ou l'inverse selon ton test

        // // On calcule par exemple la distance au centre (0,0) ou l'aire rectangulaire engendrée
        // const aire1 = Math.abs(q1.x * q1.y);
        // const aire2 = Math.abs(q2.x * q2.y);

        // if (aire1 > aire2) {
        //     xq = q1.x;
        //     yq = q1.y;
        // } else {
        //     xq = q2.x;
        //     yq = q1.y; // Attention à bien garder le bon appariement x/y du coin choisi
        // }
        const distQ1 = (q1.x * q1.x) + (q1.y * q1.y);
        const distQ2 = (q2.x * q2.x) + (q2.y * q2.y);

        if (distQ1 > distQ2) {
            xq = q1.x; yq = q1.y;
        } else {
            xq = q2.x; yq = q2.y;
        }
    }
    
    const pointQ = { x: xq, y: yq };

    // 4. Définition des segments orthogonaux (L : de p1 -> Q -> p2)
    // On évite les segments nuls si p1 ou p2 est déjà sur le pivot Q
    const segments = [];
    if (p1.x !== pointQ.x || p1.y !== pointQ.y) {
        segments.push({ debut: p1, fin: pointQ, couleur: 'jaune' });
    }
    if (pointQ.x !== p2.x || pointQ.y !== p2.y) {
        segments.push({ debut: pointQ, fin: p2, couleur: 'bleu' });
    }

    // 5. Calcul du Joint J (par exemple au milieu du chemin global ou sur le pivot)
    // Ici, on le place au milieu exact entre p1 et p2 pour l'instant, ou sur Q selon ton design
    const jX = (p1.x + p2.x) / 2;
    const jY = (p1.y + p2.y) / 2;
    const pointJ = { x: jX, y: jY };

    return {
        parentPetitId: parentPetit.valeur,
        parentGrandId: parentGrand.valeur,
        departPetit: p1,
        departGrand: p2,
        pointPivotQ: pointQ,
        jointJ: pointJ,
        segments: segments
    };
}