// ==========================================
// MODULE MODÈLE : CHEMIN & JOINT J
// ==========================================

/**
 * Calcule les ancres disponibles au bout de la queue de l'épingle (horizontal ou vertical).
 */
function obtenirAncresDisponibles(epingle) {
    const longueurQueue = epingle.longueurQueue || 1;
    const distanceTotal = 1 + longueurQueue;
    const orient = epingle.orientation !== undefined ? epingle.orientation : 0;

    // Cas Horizontal
    if (orient === 0 || orient === 180) {
        const dirX = (orient === 0) ? -1 : 1;
        const xAncre = epingle.x + (dirX * distanceTotal);
        return [
            { x: xAncre, y: epingle.y + 1, cote: 'senestre' }, // par exemple
            { x: xAncre, y: epingle.y - 1, cote: 'dextre' }    // par exemple
        ];
    } 
    // Cas Vertical
    else {
        const dirY = (orient === 90) ? -1 : 1;
        const yAncre = epingle.y + (dirY * distanceTotal);
        return [
            { x: epingle.x - 1, y: yAncre, cote: 'senestre' },
            { x: epingle.x + 1, y: yAncre, cote: 'dextre' }
        ];
    }
}

/**
 * Trouve la paire d'ancres la plus proche entre deux épingles (Distance de Manhattan).
 */
function trouverMeilleurePaireAncres(ancresPetit, ancresGrand) {
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
    return meilleurePaire;
}

/**
 * Calcule le point pivot Q du chemin orthogonal en "L".
 */
function calculerPointPivotQ(p1, p2) {
    if (p1.x === p2.x || p1.y === p2.y) {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        return {
            x: (p1.x < p2.x) ? Math.floor(midX) : Math.ceil(midX),
            y: (p1.y < p2.y) ? Math.floor(midY) : Math.ceil(midY)
        };
    } else {
        const q1 = { x: p1.x, y: p2.y };
        const q2 = { x: p2.x, y: p1.y };

        const distQ1 = (q1.x * q1.x) + (q1.y * q1.y);
        const distQ2 = (q2.x * q2.x) + (q2.y * q2.y);

        return (distQ1 > distQ2) ? q1 : q2;
    }
}

/**
 * Génère les segments du chemin (évite les segments nuls).
 */
function creerSegments(p1, p2, pointQ) {
    const segments = [];
    if (p1.x !== pointQ.x || p1.y !== pointQ.y) {
        segments.push({ debut: p1, fin: pointQ, couleur: 'jaune' });
    }
    if (pointQ.x !== p2.x || pointQ.y !== p2.y) {
        segments.push({ debut: pointQ, fin: p2, couleur: 'bleu' });
    }
    return segments;
}

/**
 * Fonction principale : Calcule le Joint J et les données du chemin entre deux épingles parentes.
 */
function calculerCheminEtJoint(parentPetit, parentGrand) {
    // 1. Récupération des ancres
    const ancresPetit = obtenirAncresDisponibles(parentPetit);
    const ancresGrand = obtenirAncresDisponibles(parentGrand);

    // 2. Sélection de la paire la plus proche
    const meilleurePaire = trouverMeilleurePaireAncres(ancresPetit, ancresGrand);
    const p1 = meilleurePaire.pPetit; 
    const p2 = meilleurePaire.pGrand; 

    // 3. Calcul du pivot Q
    const pointQ = calculerPointPivotQ(p1, p2);

    // 4. Définition des segments
    const segments = creerSegments(p1, p2, pointQ);

    // 5. Calcul du Joint J (milieu exact entre p1 et p2)
    const pointJ = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };

    return {
        parentPetitId: parentPetit.valeur,
        parentGrandId: parentGrand.valeur,

        // On fige l'état d'ancrage exact au moment de la création :
        ancrePetitCote: p1.cote,
        longueurQueuePetitOrigine: parentPetit.longueurQueue,
        
        ancreGrandCote: p2.cote,
        longueurQueueGrandOrigine: parentGrand.longueurQueue,

        departPetit: p1,
        departGrand: p2,
        pointPivotQ: pointQ,
        jointJ: pointJ,
        segments: segments
    };
}