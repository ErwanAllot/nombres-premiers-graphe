import { obtenirAncresDisponibles } from '@/modeles/epingle.js';
import { calculerCheminOrthogonal, marquerObstaclesSurGrille } from '../mathematiques/pathfinder.js';

// 1. Tu rassembles toutes les épingles et chemins déjà existants dans ton application
// const tousLesEpingles = [epingle3, epingle5]; // etc.
// const tousLescheminsExistants = [chemin3_5];  // le chemin déjà tracé

// 2. Tu génères la carte des obstacles
// const obstacles = marquerObstaclesSurGrille(tousLesEpingles, tousLescheminsExistants);

// // 3. Tu calcules le nouveau chemin en lui interdisant de marcher sur les obstacles
// const pointsChemin3_7 = calculerCheminOrthogonal(ancre3, ancre7, obstacles);

// ==========================================
// MODULE MODÈLE : CHEMIN & JOINT J
// ==========================================

/**
 * Trouve la paire d'ancres la plus proche entre deux épingles (Distance de Manhattan).
 */
export function trouverMeilleurePaireAncres(ancresPetit, ancresGrand) {
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
export function calculerPointPivotQ(p1, p2) {
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


export function calculerPointZ(p1, p2, pointQ, parentPetit, parentGrand) {
    // 1. Centre exact entre les têtes des deux épingles parentes
    const centerX = (parentPetit.x + parentGrand.x) / 2;
    const centerY = (parentPetit.y + parentGrand.y) / 2;

    // 2. Vecteur qui va du centre des parents vers Q (la bonne direction extérieure)
    const dirX = pointQ.x - centerX;
    const dirY = pointQ.y - centerY;

    // 3. On positionne Z en prolongeant ce vecteur au-delà de Q
    return {
        x: Math.round(pointQ.x + dirX),
        y: Math.round(pointQ.y + dirY)
    };
}



/**
 * Génère les segments du chemin (évite les segments nuls).
 */
export function creerSegments(p1, p2, pointQ) {
    const segments = [];
    if (p1.x !== pointQ.x || p1.y !== pointQ.y) {
        segments.push({ debut: p1, fin: pointQ, couleur: 'jaune' });
    }
    if (pointQ.x !== p2.x || pointQ.y !== p2.y) {
        segments.push({ debut: pointQ, fin: p2, couleur: 'bleu' });
    }
    return segments;
}


// Tu ajoutes obstaclesSet = new Set() en paramètre
export function calculerCheminEtJoint(parentPetit, parentGrand, obstaclesSet = new Set()) {
    // 1. Récupération des ancres
    const ancresPetit = obtenirAncresDisponibles(parentPetit);
    const ancresGrand = obtenirAncresDisponibles(parentGrand);

    // 2. Sélection de la paire la plus proche
    const meilleurePaire = trouverMeilleurePaireAncres(ancresPetit, ancresGrand);
    const p1 = meilleurePaire.pPetit; 
    const p2 = meilleurePaire.pGrand; 

    const pointQ = calculerPointPivotQ(p1, p2);
    const pointZ = calculerPointZ(p1, p2, pointQ, parentPetit, parentGrand);

    // 3. ON PASSE LES OBSTACLES AU PATHFINDER ICI 👇
    const pointsChemin = calculerCheminOrthogonal(p1, p2, obstaclesSet);
    
    const segments = [];
    for (let i = 0; i < pointsChemin.length - 1; i++) {
        segments.push({
            debut: pointsChemin[i],
            fin: pointsChemin[i+1],
            couleur: 'jaune'
        });
    }
    segments.push({ debut: pointQ, fin: pointZ, couleur: 'rose' });

    const pointJ = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };

    return {
        parentPetitId: parentPetit.valeur,
        parentGrandId: parentGrand.valeur,
        departPetit: p1,
        departGrand: p2,
        pointPivotQ: pointQ,
        pointZ: pointZ,
        jointJ: pointJ,
        segments: segments
    };
}

