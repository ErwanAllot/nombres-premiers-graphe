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

    // Sécurité anti-boucle infinie (max 1000 itérations par direction)
    let securite = 0;

    // Étape 1 : Avancer en X vers la cible
    while (x !== ancreCible.x && securite < 1000) {
        securite++;
        let pasX = (ancreCible.x > x) ? 1 : -1;
        let prochaineCase = { x: x + pasX, y: y };

        if (obstaclesSet.has(`${prochaineCase.x},${prochaineCase.y}`)) {
            // Obstacle ! On fait un pas de côté en Y ET on force l'avancée en X
            let pasY = (ancreCible.y >= y) ? 1 : -1;
            let caseDeSecours = { x: x, y: y + pasY };
            
            if (!obstaclesSet.has(`${caseDeSecours.x},${caseDeSecours.y}`)) {
                y += pasY;
                chemin.push({ x, y });
            }
            // On avance quand même en X pour ne pas bloquer la boucle
            x += pasX;
            chemin.push({ x, y });
        } else {
            x += pasX;
            chemin.push({ x, y });
        }
    }

    securite = 0;

    // Étape 2 : Avancer en Y vers la cible
    while (y !== ancreCible.y && securite < 1000) {
        securite++;
        let pasY = (ancreCible.y > y) ? 1 : -1;
        let prochaineCase = { x: x, y: y + pasY };

        if (obstaclesSet.has(`${prochaineCase.x},${prochaineCase.y}`)) {
            let pasX = (ancreCible.x >= x) ? 1 : -1;
            let caseDeSecours = { x: x + pasX, y: y };

            if (!obstaclesSet.has(`${caseDeSecours.x},${caseDeSecours.y}`)) {
                x += pasX;
                chemin.push({ x, y });
            }
            y += pasY;
            chemin.push({ x, y });
        } else {
            y += pasY;
            chemin.push({ x, y });
        }
    }

    return chemin;
}



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