// ==========================================
// MODULE MODÈLE : CHEMIN & JOINT J
// ==========================================

/**
 * Calcule le Joint J et les données du chemin entre deux épingles parentes.
 * @param {Object} parentPetit - L'épingle du plus petit parent (ex: 3)
 * @param {Object} parentGrand - L'épingle du plus grand parent (ex: 5)
 * @returns {Object} Les coordonnées des points de départ, d'arrivée (J) et les métadonnées
 */
function calculerCheminEtJoint(parentPetit, parentGrand) {
    // 1. On récupère dynamiquement les vraies ancres de chaque parent 
    // en tenant compte de leur longueur de queue respective !
    const ancresPetit = obtenirAncresDisponibles(parentPetit);
    const ancresGrand = obtenirAncresDisponibles(parentGrand);

    // 2. On teste toutes les combinaisons pour trouver la plus proche (distance de Manhattan)
    let meilleurePaire = null;
    let distanceMin = Infinity;

    for (let ap of ancresPetit) {
        for (let ag of ancresGrand) {
            const dist = Math.abs(ap.x - ag.x) + Math.abs(ap.y - ag.y);
            if (dist < distanceMin) {
                distanceMin = dist;
                meilleurePaire = { pPetit: ap, pGrand: ag };
            }
        }
    }

    // 3. On calcule le Joint J au milieu de cette paire optimale
    const jX = (meilleurePaire.pPetit.x + meilleurePaire.pGrand.x) / 2;
    const jY = (meilleurePaire.pPetit.y + meilleurePaire.pGrand.y) / 2;
    const pointJ = { x: jX, y: jY };

    // 4. On retourne les segments orthogonaux
    const segments = [
        { debut: meilleurePaire.pPetit, fin: pointJ, couleur: 'jaune' },
        { debut: pointJ, fin: meilleurePaire.pGrand, couleur: 'bleu' }
    ];

    return {
        departPetit: meilleurePaire.pPetit,
        departGrand: meilleurePaire.pGrand,
        jointJ: pointJ,
        segments: segments
    };
}