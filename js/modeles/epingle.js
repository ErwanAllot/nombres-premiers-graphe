/**
 * Crée un objet représentant une épingle complète.
 * @param {number} valeur - Le nombre premier (ex: 3, 5, 7)
 * @param {number} x - Coordonnée logique X du corps
 * @param {number} y - Coordonnée logique Y du corps
 * @param {string} couleurType - 'violet', 'rouge' ou 'vert'
 */
export function creerEpingle(valeur, x, y, couleurType = 'violet', longueurQueue = 1) {
    const orientation = calculerOrientation(x, y);

    return {
        valeur: valeur,
        x: x,
        y: y,
        orientation: orientation,
        couleurType: couleurType,
        longueurQueue: longueurQueue // Permet de gérer l'extension de la queue
    };
}

// ==========================================
// MODULE MODÈLE : ÉPINGLE & GÉOMÉTRIE
// ==========================================

function calculerOrientation(x, y) {
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX > absY) {
        return x < 0 ? 0 : 180;
    } else {
        return y < 0 ? 90 : 270;
    }
}


/**
 * Calcule les ancres disponibles au bout de la queue de l'épingle (horizontal ou vertical).
 */
export function obtenirAncresDisponibles(epingle) {
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