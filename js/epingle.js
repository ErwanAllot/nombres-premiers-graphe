// ==========================================
// MODULE ÉPINGLE : GÉOMÉTRIE & STRUCTURE
// ==========================================

/**
 * Crée un objet représentant une épingle sur la grille.
 * @param {number} valeur - Le nombre premier associé
 * @param {number} x - Coordonnée logique X
 * @param {number} y - Coordonnée logique Y
 * @param {number} orientation - Angle ou orientation de l'épingle
 */
function creerEpingle(valeur, x, y, orientation = 0) {
    return {
        valeur: valeur,
        x: x,
        y: y,
        orientation: orientation
    };
}

/**
 * Convertit des coordonnées logiques (mathématiques) en coordonnées pixel sur le canvas,
 * en prenant en compte le zoom (échelle) et le déplacement (décalage).
 */
function logiqueVersPixel(coordonneeLogique, echelle, decalage) {
    return coordonneeLogique * echelle + decalage;
}