// ==========================================
// GEOMETRIE.JS - Gestion des queues et appendices
// ==========================================

function etendreQueueParent(parent, directionX = -1) {
    // Logique d'extension de la queue du parent
    // Par exemple, si 3 est en (-2,0) et s'étend vers la gauche (directionX = -1) :
    const nouveaucarreX = parent.x + (2 * directionX); // Ex: -2 + (-2) = -4
    const nouveaucarreY = parent.y;

    // Création du nouveau carré de queue et de ses 2 petits appendices
    // (À adapter selon la structure exacte de tes objets épingles/segments)
    const elementsAjoutes = {
        carreQueue: { x: nouveaucarreX, y: nouveaucarreY },
        appendices: [
            { x: nouveaucarreX, y: nouveaucarreY + 1 },
            { x: nouveaucarreX, y: nouveaucarreY - 1 }
        ]
    };

    return elementsAjoutes;
}


function obtenirAncresDisponibles(epingle) {
    const distanceDuCorps = epingle.longueuQueue || epingle.longueurQueue; // Sécurité orthographe
    const ancres = [];

    // Si l'épingle est orientée horizontalement (0 ou 180 degrés)
    if (epingle.orientation === 0 || epingle.orientation === 180) {
        const directionX = epingle.orientation === 0 ? -1 : 1;
        const xAncre = epingle.x + (directionX * distanceDuCorps);
        
        ancres.push(
            { x: xAncre, y: epingle.y + 1 }, // Ancre du haut
            { x: xAncre, y: epingle.y - 1 }  // Ancre du bas
        );
    } 
    // Si l'épingle est orientée verticalement (90 ou 270 degrés)
    else {
        const directionY = epingle.orientation === 90 ? -1 : 1;
        const yAncre = epingle.y + (directionY * distanceDuCorps);
        
        ancres.push(
            { x: epingle.x - 1, y: yAncre }, // Ancre de gauche
            { x: epingle.x + 1, y: yAncre }  // Ancre de droite
        );
    }

    return ancres;
}
