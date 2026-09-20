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
    // Si longueurQueue = 1, l'ancre est à 1 unité du corps.
    // Si longueurQueue = 2, l'ancre recule d'1 unité supplémentaire, etc.
    const distanceDuCorps = epingle.longueurQueue;
    
    // On gère le sens selon que l'épingle est à gauche (X négatif) ou à droite (X positif)
    const direction = epingle.x <= 0 ? -1 : 1; 

    // Position X de l'appendice au bout de la queue
    const xAncre = epingle.x + (direction * distanceDuCorps);

    return [
        { x: xAncre, y: epingle.y + 1 }, // Ancre du haut
        { x: xAncre, y: epingle.y - 1 }  // Ancre du bas
    ];
}

