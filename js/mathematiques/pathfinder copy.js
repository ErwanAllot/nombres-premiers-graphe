/**
 * Calcule un chemin orthogonal (type L ou escalier) entre deux ancres.
 * Pour l'instant, gère un tracé direct propre. Le Set d'obstacles servira
 * à stocker les cases occupées pour les futurs contours.
 */
export function calculerCheminOrthogonal(ancreSource, ancreCible, obstaclesSet = new Set()) {
    let chemin = [];
    
    // Position de départ
    let xCourant = ancreSource.x;
    let yCourant = ancreSource.y;
    
    chemin.push({ x: xCourant, y: yCourant });

    // 1. Déplacement horizontal vers la cible
    while (xCourant !== ancreCible.x) {
        xCourant += (ancreCible.x > xCourant) ? 1 : -1;
        chemin.push({ x: xCourant, y: yCourant });
    }

    // 2. Déplacement vertical vers la cible
    while (yCourant !== ancreCible.y) {
        yCourant += (ancreCible.y > yCourant) ? 1 : -1;
        chemin.push({ x: xCourant, y: yCourant });
    }

    return chemin;
}

/**
 * Exemple de structure pour enregistrer les cases occupées 
 * par les épingles et chemins existants (la grille d'occupation).
 */
export function marquerObstaclesSurGrille(epingles, chemins) {
    let grilleOccupee = new Set();

    // On marque les positions des épingles
    epingles.forEach(ep => {
        grilleOccupee.add(`${ep.x},${ep.y}`);
    });

    // On marque les segments de chemins existants
    chemins.forEach(ch => {
        ch.segments.forEach(seg => {
            grilleOccupee.add(`${seg.x},${seg.y}`);
        });
    });

    return grilleOccupee;
}