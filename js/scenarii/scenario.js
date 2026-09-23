import { obtenirAncresDisponibles, creerEpingle } from '@/modeles/epingle.js';
import { calculerPointS, calculerCheminEtJoint, creerSegments, calculerPointPivotQ } from '@/modeles/chemin.js';
import { marquerObstaclesSurGrille } from '../mathematiques/pathfinder.js';
// import { calculerPointS } from '@/modeles/chemin.js'; // ou './pathfinder.js' selon où tu l'as mis
// --- RACCOURCIS MÉTIER POUR LE SCÉNARIO ---
const ep = (epingles, val) => epingles.find(e => e.valeur === val);
import { calculerCheminOrthogonal } from '@/mathematiques/pathfinder.js'; // Ajuste le chemin relatif si besoin (ex: '../mathematiques/pathfinder.js')


// export function ajouterCheminEntre(epingles, chemins, valeurSource, valeurCible) {
//     const parentPetit = ep(epingles, Math.min(valeurSource, valeurCible));
//     const parentGrand = ep(epingles, Math.max(valeurSource, valeurCible));

//     const obstaclesActuels = marquerObstaclesSurGrille(epingles, chemins);
    
//     // 🔍 AJOUTE CE LOG POUR VOIR CE QUE LE PATHFINDER VOIT COMME OBSTACLES
//     console.log("Obstacles détectés pour le chemin entre", valeurSource, "et", valeurCible, ":", obstaclesActuels);

//     const nouveauChemin = calculerCheminEtJoint(parentPetit, parentGrand, obstaclesActuels);
//     chemins.push(nouveauChemin);
// }



// export function ajouterCheminEntre(epingles, chemins, valeurSource, valeurCible, options = {}) {
//     const parentPetit = ep(epingles, Math.min(valeurSource, valeurCible));
//     const parentGrand = ep(epingles, Math.max(valeurSource, valeurCible));

//     const obstaclesActuels = marquerObstaclesSurGrille(epingles, chemins);
    
//     // 1. On calcule le chemin principal (jaune + rose Q->Z) et son point M
//     const nouveauChemin = calculerCheminEtJoint(parentPetit, parentGrand, obstaclesActuels);

//     // 2. Si une distance (nombre premier) est fournie, on calcule automatiquement le chemin vert vers S depuis M !
//     if (options.nombrePremier && nouveauChemin.pointM) {
//         const pointS = calculerPointS(nouveauChemin.pointM, options.nombrePremier, obstaclesActuels);
//         const pointsCheminMS = calculerCheminOrthogonal(nouveauChemin.pointM, pointS, obstaclesActuels);

//         const segmentsVerts = [];
//         for (let i = 0; i < pointsCheminMS.length - 1; i++) {
//             segmentsVerts.push({
//                 debut: pointsCheminMS[i],
//                 fin: pointsCheminMS[i+1],
//                 couleur: 'vert'
//             });
//         }

//         // On injecte les segments verts et le point S dans l'objet chemin
//         nouveauChemin.segments.push(...segmentsVerts);
//         nouveauChemin.pointS = pointS;
//     }

//     chemins.push(nouveauChemin);
// }

// export function calculerCheminEscalier(pointM, pointS, obstaclesSet = new Set()) {
//     let points = [{ x: pointM.x, y: pointM.y }];
//     let cx = pointM.x;
//     let cy = pointM.y;

//     const targetX = pointS.x;
//     const targetY = pointS.y;

//     const stepX = targetX > cx ? 1 : (targetX < cx ? -1 : 0);
//     const stepY = targetY > cy ? 1 : (targetY < cy ? -1 : 0);

//     let moveX = true; // Alternance : commence par X, puis Y, puis X...

//     while (cx !== targetX || cy !== targetY) {
//         let advanced = false;

//         if (moveX && cx !== targetX) {
//             let nextX = cx + stepX;
//             // On vérifie si la case est libre
//             if (!obstaclesSet.has(`${nextX},${cy}`) || nextX === targetX) {
//                 cx = nextX;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//             moveX = false; // On bascule sur Y pour le prochain tour
//         } else if (!moveX && cy !== targetY) {
//             let nextY = cy + stepY;
//             // On vérifie si la case est libre
//             if (!obstaclesSet.has(`${cx},${nextY}`) || nextY === targetY) {
//                 cy = nextY;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//             moveX = true; // On bascule sur X pour le prochain tour
//         } else {
//             // Si la direction prioritaire est bloquée, on essaie l'autre
//             if (cx !== targetX) {
//                 cx += stepX;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             } else if (cy !== targetY) {
//                 cy += stepY;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//         }

//         if (!advanced) break; // Sécurité anti-boucle infinie
//     }

//     return points;
// }

// export function calculerCheminEscalier(pointM, pointS, obstaclesSet = new Set()) {
//     let points = [{ x: pointM.x, y: pointM.y }];
//     let cx = pointM.x;
//     let cy = pointM.y;

//     const targetX = pointS.x;
//     const targetY = pointS.y;

//     const stepX = targetX > cx ? 1 : (targetX < cx ? -1 : 0);
//     const stepY = targetY > cy ? 1 : (targetY < cy ? -1 : 0);

//     let moveX = true;

//     // Pour le tout premier mouvement, si M est aligné horizontalement ou verticalement 
//     // avec le début du tracé, on force l'axe perpendiculaire pour ne pas mordre.
//     // (Par exemple, si on peut bouger en Y en premier, on commence par Y).
//     if (Math.abs(targetY - cy) > 0 && Math.abs(targetX - cx) > 0) {
//         // On regarde si on peut alterner intelligemment
//         moveX = Math.abs(targetX - cx) >= Math.abs(targetY - cy);
//     }

//     let iterations = 0;
//     const maxIterations = 100; // Sécurité anti-boucle infinie

//     while ((cx !== targetX || cy !== targetY) && iterations < maxIterations) {
//         iterations++;
//         let advanced = false;

//         if (moveX && cx !== targetX) {
//             let nextX = cx + stepX;
//             // On vérifie si la case est libre (et on évite de s'empaler sur le point M lui-même de manière redondante)
//             if (!obstaclesSet.has(`${nextX},${cy}`) || nextX === targetX) {
//                 cx = nextX;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//             moveX = false; 
//         } else if (!moveX && cy !== targetY) {
//             let nextY = cy + stepY;
//             if (!obstaclesSet.has(`${cx},${nextY}`) || nextY === targetY) {
//                 cy = nextY;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//             moveX = true; 
//         } else {
//             // Plan de secours si une direction est bloquée
//             if (cx !== targetX) {
//                 cx += stepX;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//                 moveX = false;
//             } else if (cy !== targetY) {
//                 cy += stepY;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//                 moveX = true;
//             }
//         }

//         if (!advanced) {
//             // Si vraiment bloqué, on force un pas orthogonal pour se dégager
//             if (cx !== targetX) {
//                 cx += stepX;
//                 points.push({ x: cx, y: cy });
//             } else if (cy !== targetY) {
//                 cy += stepY;
//                 points.push({ x: cx, y: cy });
//             } else {
//                 break;
//             }
//         }
//     }

//     return points;
// }

// export function calculerCheminEscalier(pointM, pointS, obstaclesSet = new Set()) {
//     let points = [{ x: pointM.x, y: pointM.y }];
//     let cx = pointM.x;
//     let cy = pointM.y;

//     const targetX = pointS.x;
//     const targetY = pointS.y;

//     const stepX = targetX > cx ? 1 : (targetX < cx ? -1 : 0);
//     const stepY = targetY > cy ? 1 : (targetY < cy ? -1 : 0);

//     // --- FORCER LE DÉPART EN SOUHAIT ---
//     // Si M est sur un segment, on regarde par où aller en premier.
//     // Pour éviter de mordre, on force le premier mouvement sur l'axe Y 
//     // (ou X selon le besoin) pour quitter immédiatement la ligne d'origine.
//     let moveX = false; // On commence par Y pour casser l'alignement horizontal (ou inversement)
    
//     // Si la distance en X est plus grande et qu'on veut alterner, 
//     // on s'assure que le premier pas ne va pas dans la direction du segment parent.
//     if (Math.abs(targetX - cx) > Math.abs(targetY - cy)) {
//         moveX = false; // Commence par vertical si le parent était horizontal
//     } else {
//         moveX = true;  // Commence par horizontal si le parent était vertical
//     }

//     let iterations = 0;
//     const maxIterations = 100;

//     while ((cx !== targetX || cy !== targetY) && iterations < maxIterations) {
//         iterations++;
//         let advanced = false;

//         if (moveX && cx !== targetX) {
//             let nextX = cx + stepX;
//             if (!obstaclesSet.has(`${nextX},${cy}`) || nextX === targetX) {
//                 cx = nextX;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//             moveX = false; 
//         } else if (!moveX && cy !== targetY) {
//             let nextY = cy + stepY;
//             if (!obstaclesSet.has(`${cx},${nextY}`) || nextY === targetY) {
//                 cy = nextY;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//             }
//             moveX = true; 
//         } else {
//             // Plan de secours si une direction est bloquée
//             if (cx !== targetX) {
//                 cx += stepX;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//                 moveX = false;
//             } else if (cy !== targetY) {
//                 cy += stepY;
//                 points.push({ x: cx, y: cy });
//                 advanced = true;
//                 moveX = true;
//             }
//         }

//         if (!advanced) {
//             if (cx !== targetX) {
//                 cx += stepX;
//                 points.push({ x: cx, y: cy });
//             } else if (cy !== targetY) {
//                 cy += stepY;
//                 points.push({ x: cx, y: cy });
//             } else {
//                 break;
//             }
//         }
//     }

//     return points;
// }

export function calculerCheminEscalier(pointM, pointS, obstaclesSet = new Set()) {
    let points = [{ x: pointM.x, y: pointM.y }];
    let cx = pointM.x;
    let cy = pointM.y;

    const targetX = pointS.x;
    const targetY = pointS.y;

    const stepX = targetX > cx ? 1 : (targetX < cx ? -1 : 0);
    const stepY = targetY > cy ? 1 : (targetY < cy ? -1 : 0);

    let moveX = Math.abs(targetX - cx) <= Math.abs(targetY - cy);

    let iterations = 0;
    const maxIterations = 100;

    while ((cx !== targetX || cy !== targetY) && iterations < maxIterations) {
        iterations++;
        let advanced = false;

        // Si on est à 1 pas de la cible sur l'un des axes, on force la fin directe pour éviter les doublons
        if (cx === targetX && cy !== targetY) {
            cy = targetY;
            points.push({ x: cx, y: cy });
            break;
        }
        if (cy === targetY && cx !== targetX) {
            cx = targetX;
            points.push({ x: cx, y: cy });
            break;
        }

        if (moveX && cx !== targetX) {
            let nextX = cx + stepX;
            if (!obstaclesSet.has(`${nextX},${cy}`) || nextX === targetX) {
                cx = nextX;
                points.push({ x: cx, y: cy });
                advanced = true;
            }
            moveX = false; 
        } else if (!moveX && cy !== targetY) {
            let nextY = cy + stepY;
            if (!obstaclesSet.has(`${cx},${nextY}`) || nextY === targetY) {
                cy = nextY;
                points.push({ x: cx, y: cy });
                advanced = true;
            }
            moveX = true; 
        } else {
            if (cx !== targetX) {
                cx += stepX;
                points.push({ x: cx, y: cy });
                advanced = true;
                moveX = false;
            } else if (cy !== targetY) {
                cy += stepY;
                points.push({ x: cx, y: cy });
                advanced = true;
                moveX = true;
            }
        }

        if (!advanced) {
            if (cx !== targetX) {
                cx += stepX;
                points.push({ x: cx, y: cy });
            } else if (cy !== targetY) {
                cy += stepY;
                points.push({ x: cx, y: cy });
            } else {
                break;
            }
        }
    }

    return points;
}


export function ajouterCheminEntre(epingles, chemins, valeurSource, valeurCible, options = {}) {
    const parentPetit = ep(epingles, Math.min(valeurSource, valeurCible));
    const parentGrand = ep(epingles, Math.max(valeurSource, valeurCible));

    const obstaclesActuels = marquerObstaclesSurGrille(epingles, chemins);
    
    const nouveauChemin = calculerCheminEtJoint(parentPetit, parentGrand, obstaclesActuels);

    // --- LOGS DE DÉBUG ---
    console.log("Options reçues :", options);
    console.log("Point M calculé :", nouveauChemin.pointM);

    if (options.nombrePremier && nouveauChemin.pointM) {
        console.log("-> Condition remplie pour le chemin vert !");
        const pointS = calculerPointS(nouveauChemin.pointM, options.nombrePremier, obstaclesActuels);
        console.log("Point S calculé :", pointS);

        // const pointsCheminMS = calculerCheminOrthogonal(nouveauChemin.pointM, pointS, obstaclesActuels);
        // Au lieu de ça :
// const pointsCheminMS = calculerCheminOrthogonal(nouveauChemin.pointM, pointS, obstaclesActuels);

// Tu mets ça :
const pointsCheminMS = calculerCheminEscalier(nouveauChemin.pointM, pointS, obstaclesActuels);
        console.log("Points du chemin M->S :", pointsCheminMS);

        const segmentsVerts = [];
        for (let i = 0; i < pointsCheminMS.length - 1; i++) {
            segmentsVerts.push({
                debut: pointsCheminMS[i],
                fin: pointsCheminMS[i+1],
                couleur: 'vert'
            });
        }

        nouveauChemin.segments.push(...segmentsVerts);
        nouveauChemin.pointS = pointS;
    } else {
        console.log("⚠️ Condition non remplie : pas de chemin vert généré (soit pas de nombrePremier, soit pas de pointM).");
    }

    chemins.push(nouveauChemin);
}

export const rallongerDeuxQueues = (epingles) => {
    const etatPrecedent = window.historiqueApp.obtenirEtatActuel();
    if (!etatPrecedent) return;

    let idPetit = 0;
    let idGrand = 0;

    if (etatPrecedent.chemins && etatPrecedent.chemins.length > 0) {
        const dernierChemin = etatPrecedent.chemins[etatPrecedent.chemins.length - 1];
        idPetit = dernierChemin.parentPetitId;
        idGrand = dernierChemin.parentGrandId;
    }

    allongerQueues(epingles, idPetit, idGrand);
};
export const allongerQueues = (epingles, ...valeurs) => {
    valeurs.forEach(v => {
        const p = ep(epingles, v);
        if (p) p.longueurQueue += 1;
    });
};



export const genererEpingleSuivante = (epingles) => {
    const etatPrecedent = window.historiqueApp.obtenirEtatActuel();
    if (!etatPrecedent) return;

    let x = 0;
    let y = 0;
    let idPetit = 0;
    let idGrand = 0;

    if (etatPrecedent.chemins && etatPrecedent.chemins.length > 0) {
        const dernierChemin = etatPrecedent.chemins[etatPrecedent.chemins.length - 1];
        
        // --- C'EST ICI QU'ON CHANGE Q PAR Z ---
        x = dernierChemin.pointZ.x;
        y = dernierChemin.pointZ.y;
        
        idPetit = dernierChemin.parentPetitId;
        idGrand = dernierChemin.parentGrandId;
    }

    const valPremier = etatPrecedent.nombrePremier;
    const polarite = idGrand + idPetit - valPremier;
    const color = (polarite === -1) ? 'vert' : 'rouge';

    nouvelleEpingle(epingles, valPremier, x, y, color);
};
const nouvelleEpingle = (epingles, val, x, y, couleur = 'rouge') => {
    epingles.push(creerEpingle(val, x, y, couleur));
};


// --- LES OUTILS ---

// 1. Outil pour insérer une ligne et décaler les épingles situées en dessous
export const insererLigne = (epingles, indexLigne) => {
    const cible = Number(indexLigne);
    epingles.forEach(p => {
        const currentY = Number(p.y);
        if (currentY >= cible) {
            p.y = currentY + 1;
        }
    });
};

// 2. Outil pour recalculer tous les chemins de la grille d'un coup
export const recalculerTousLesChemins = (epingles, chemins) => {
    chemins.forEach((c) => {
        const pPetit = ep(epingles, c.parentPetitId);
        const pGrand = ep(epingles, c.parentGrandId);

        if (!pPetit || !pGrand) return; // Sécurité si un parent manque

        const nouveauChemin = calculerCheminEtJoint(pPetit, pGrand);
        
        // On met à jour le chemin existant avec les nouvelles coordonnées
        c.departPetit = nouveauChemin.departPetit;
        c.departGrand = nouveauChemin.departGrand;
        c.pointPivotQ = nouveauChemin.pointPivotQ;
        c.jointJ = nouveauChemin.jointJ;
        c.segments = nouveauChemin.segments;
    });
};


export const recalculerCheminFidele = (chemin, epingles) => {
    const pPetit = ep(epingles, chemin.parentPetitId);
    const pGrand = ep(epingles, chemin.parentGrandId);
    if (!pPetit || !pGrand) {
        console.warn("⚠️ Parents introuvables pour le chemin :", chemin);
        return null;
    }

    console.log(`--- Recalcul fidèle pour chemin (parents ${chemin.parentPetitId} et ${chemin.parentGrandId}) ---`);
    console.log(`Côté attendu -> Petit: ${chemin.ancrePetitCote}, Grand: ${chemin.ancreGrandCote}`);

    // Astuce magique : pour recalculer l'ancre à son emplacement d'origine malgré les allongements de queue,
    // on simule temporairement la longueur qu'avait la queue le jour de la création du chemin !
    
    const longueurActuellePetit = pPetit.longueurQueue;
    pPetit.longueurQueue = chemin.longueurQueuePetitOrigine;
    const ancresPetitOrigine = obtenirAncresDisponibles(pPetit);
    pPetit.longueurQueue = longueurActuellePetit; // On remet la longueur actuelle

    const longueurActuelleGrand = pGrand.longueurQueue;
    pGrand.longueurQueue = chemin.longueurQueueGrandOrigine;
    const ancresGrandOrigine = obtenirAncresDisponibles(pGrand);
    pGrand.longueurQueue = longueurActuelleGrand; // On remet la longueur actuelle

    // On cherche l'ancre par son côté ('dextre' ou 'senestre')
    const p1 = ancresPetitOrigine.find(a => a.cote === chemin.ancrePetitCote) || ancresPetitOrigine[0];
    const p2 = ancresGrandOrigine.find(a => a.cote === chemin.ancreGrandCote) || ancresGrandOrigine[0];

    // ⚠️ IMPORTANT : Maintenant que l'ancre a ses coordonnées d'origine, 
    // si des lignes ont été insérées entre-temps, il faut appliquer le même décalage de 'y' 
    // pour que l'ancre descende avec son épingle !
    // (Tu peux ajuster cette partie selon la façon dont 'insererLigne' a déplacé les 'y')

    // On recalcule le pivot Q et les segments
    const pointQ = calculerPointPivotQ(p1, p2);
    const segments = creerSegments(p1, p2, pointQ);
    const pointJ = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    return {
        ...chemin,
        departPetit: p1,
        departGrand: p2,
        pointPivotQ: pointQ,
        jointJ: pointJ,
        segments: segments
    };
};
