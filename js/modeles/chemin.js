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
    // Coordonnées de l'appendice inférieur/supérieur de la queue du parent petit (ex: x = -3, y = -1)
    // Dans notre disposition, la queue est à x - 1 par rapport au corps.
    // Pour 3 (corps en -2,0), la queue est à -3. Ses appendices sont à y = -1 et y = 1.
    const xQueuePetit = parentPetit.x - 1;
    const yAppendicePetit = parentPetit.y - 1; // On choisit l'appendice haut ou bas (-1)

    const xQueueGrand = parentGrand.x + 1; // Pour 5 (corps en 2,0 orienté 180°), la queue est à x = 3.
    const yAppendiceGrand = parentGrand.y - 1;

    const departPetit = { x: xQueuePetit, y: yAppendicePetit };
    const departGrand = { x: xQueueGrand, y: yAppendiceGrand };

    // Calcul du milieu (Joint J)
    const longueurX = Math.abs(departGrand.x - departPetit.x);
    
    // Milieu exact (ou pondéré si impair vers le plus petit parent)
    const jX = (departPetit.x + departGrand.x) / 2;
    const jY = (departPetit.y + departGrand.y) / 2;

    const pointJ = { x: jX, y: jY };

    return {
        parentPetitId: parentPetit.valeur,
        parentGrandId: parentGrand.valeur,
        departPetit: departPetit,
        departGrand: departGrand,
        jointJ: pointJ
    };
}