/**
 * Calcule un chemin orthogonal (type L ou escalier) entre deux ancres.
 * Pour l'instant, gère un tracé direct propre. Le Set d'obstacles servira
 * à stocker les cases occupées pour les futurs contours.
 */
/**
 * Calcule un chemin orthogonal en évitant les obstacles.
 * obstaclesSet : un Set de chaînes "x,y" représentant les cases interdites.
 */
export function calculerCheminOrthogonal(ancreSource, ancreCible, obstaclesSet = new Set()) {
    let chemin = [];
    let x = ancreSource.x;
    let y = ancreSource.y;
    
    chemin.push({ x, y });

    // Étape 1 : Avancer en X vers la cible, mais en contournant si bloqué
    while (x !== ancreCible.x) {
        let pasX = (ancreCible.x > x) ? 1 : -1;
        let prochaineCase = { x: x + pasX, y: y };

        if (obstaclesSet.has(`${prochaineCase.x},${prochaineCase.y}`)) {
            // Obstacle en X ! On essaie de faire un pas de côté en Y pour l'éviter
            let pasY = (ancreCible.y >= y) ? 1 : -1;
            let caseDeSecours = { x: x, y: y + pasY };
            
            if (!obstaclesSet.has(`${caseDeSecours.x},${caseDeSecours.y}`)) {
                y += pasY;
                chemin.push({ x, y });
            } else {
                // Si c'est bloqué partout, on avance quand même pour l'instant
                x += pasX;
                chemin.push({ x, y });
            }
        } else {
            x += pasX;
            chemin.push({ x, y });
        }
    }

    // Étape 2 : Avancer en Y vers la cible, avec la même prudence
    while (y !== ancreCible.y) {
        let pasY = (ancreCible.y > y) ? 1 : -1;
        let prochaineCase = { x: x, y: y + pasY };

        if (obstaclesSet.has(`${prochaineCase.x},${prochaineCase.y}`)) {
            let pasX = (ancreCible.x >= x) ? 1 : -1;
            let caseDeSecours = { x: x + pasX, y: y };

            if (!obstaclesSet.has(`${caseDeSecours.x},${caseDeSecours.y}`)) {
                x += pasX;
                chemin.push({ x, y });
            } else {
                y += pasY;
                chemin.push({ x, y });
            }
        } else {
            y += pasY;
            chemin.push({ x, y });
        }
    }

    return chemin;
}

/**
 * Exemple de structure pour enregistrer les cases occupées 
 * par les épingles et chemins existants (la grille d'occupation).
 */
// export function marquerObstaclesSurGrille(epingles, chemins) {
//     let grilleOccupee = new Set();

//     // On marque les positions des épingles
//     epingles.forEach(ep => {
//         grilleOccupee.add(`${ep.x},${ep.y}`);
//     });

//     // On marque les segments de chemins existants
//     chemins.forEach(ch => {
//         ch.segments.forEach(seg => {
//             grilleOccupee.add(`${seg.x},${seg.y}`);
//         });
//     });

//     return grilleOccupee;
// }


/**
 * Remplit la grille d'occupation avec les épingles et TOUS les points des chemins existants.
 */
export function marquerObstaclesSurGrille(epingles, chemins) {
    let grilleOccupee = new Set();

    // 1. On marque les positions des épingles
    if (epingles) {
        epingles.forEach(ep => {
            if (ep && ep.x !== undefined && ep.y !== undefined) {
                grilleOccupee.add(`${ep.x},${ep.y}`);
            }
        });
    }

    // 2. On marque les segments des chemins existants (point par point)
    if (chemins) {
        chemins.forEach(ch => {
            if (ch.segments) {
                ch.segments.forEach(seg => {
                    if (seg.debut && seg.fin) {
                        // On trace le segment case par case pour bloquer toute la ligne
                        let x = seg.debut.x;
                        let y = seg.debut.y;
                        grilleOccupee.add(`${x},${y}`);

                        while (x !== seg.fin.x || y !== seg.fin.y) {
                            if (x !== seg.fin.x) {
                                x += (seg.fin.x > x) ? 1 : -1;
                            } else if (y !== seg.fin.y) {
                                y += (seg.fin.y > y) ? 1 : -1;
                            }
                            grilleOccupee.add(`${x},${y}`);
                        }
                    }
                });
            }
        });
    }

    return grilleOccupee;
}