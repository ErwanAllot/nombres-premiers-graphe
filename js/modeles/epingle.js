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
 * Crée un objet représentant une épingle complète.
 * @param {number} valeur - Le nombre premier (ex: 3, 5, 7)
 * @param {number} x - Coordonnée logique X du corps
 * @param {number} y - Coordonnée logique Y du corps
 * @param {string} couleurType - 'violet', 'rouge' ou 'vert'
 */
function creerEpingle(valeur, x, y, couleurType = 'violet') {
    const orientation = calculerOrientation(x, y);

    return {
        valeur: valeur,
        x: x, // Position logique du corps
        y: y,
        orientation: orientation, // en degrés (0, 90, 180, 270)
        couleurType: couleurType
    };
}