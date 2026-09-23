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



export function calculerPointS(pointM, distance, obstaclesSet = new Set()) {
    let Sx = pointM.x;
    let Sy = pointM.y;

    // CAS 1 : M est sur l'un des axes principaux (Mx = 0 ou My = 0)
    if (pointM.x === 0 || pointM.y === 0) {
        if (pointM.x === 0) {
            Sy += (pointM.y >= 0) ? distance : -distance;
        } else {
            Sx += (pointM.x >= 0) ? distance : -distance;
        }
        return { x: Sx, y: Sy };
    }

    // CAS 2 : M est décalé (Mx != 0 et My != 0)
    const d1 = Math.ceil(distance / 2);
    const d2 = Math.floor(distance / 2);

    const signX = (pointM.x > 0) ? 1 : -1;
    const signY = (pointM.y > 0) ? 1 : -1;

    // On teste les deux combinaisons possibles pour d1 et d2
    const optionsCandidates = [
        { x: pointM.x + (signX * d1), y: pointM.y + (signY * d2) },
        { x: pointM.x + (signX * d2), y: pointM.y + (signY * d1) }
    ];

    // On choisit celle qui ne tombe pas sur un obstacle existant, ou la première par défaut
    let meilleurS = optionsCandidates[0];
    for (let cand of optionsCandidates) {
        if (!obstaclesSet.has(`${cand.x},${cand.y}`)) {
            meilleurS = cand;
            break;
        }
    }

    return meilleurS;
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



    // 1. On récupère le milieu du chemin
const midIndex = Math.floor(pointsChemin.length / 2);
let pointM = { ...pointsChemin[midIndex] };

// 2. Si on a assez de points pour avoir un précédent (O) et un suivant (N)
if (midIndex > 0 && midIndex < pointsChemin.length - 1) {
    const pointO = pointsChemin[midIndex - 1];
    const pointN = pointsChemin[midIndex + 1];

    // Calcul des "hypoténuses" au carré (distance par rapport à l'origine 0,0)
    const hM = (pointM.x ** 2) + (pointM.y ** 2);
    const hO = (pointO.x ** 2) + (pointO.y ** 2);
    const hN = (pointN.x ** 2) + (pointN.y ** 2);

    // 3. Application de la condition
    if (hM <= hO && hM <= hN) {
        if (pointO.x != pointN.x && pointO.y != pointN.y) {
        // M est un creux local, on le redéfinit vers N ou O selon la plus grande distance
            pointM = (hN > hO) ? { ...pointN } : { ...pointO };
        }
    }
}

// 4. On s'assure de stocker ce point M avec sa couleur orange pour le rendu
pointM.couleur = 'orange';

    return {
        parentPetitId: parentPetit.valeur,
        parentGrandId: parentGrand.valeur,
        departPetit: p1,
        departGrand: p2,
        pointPivotQ: pointQ,
        pointZ: pointZ,
        jointJ: pointJ,
        pointM: pointM, // <-- Ton nouveau point milieu orange
        segments: segments
    };
}

