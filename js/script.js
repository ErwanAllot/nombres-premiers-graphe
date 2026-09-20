// ==========================================
// SCRIPT.JS - CONTRÔLEUR PRINCIPAL
// ==========================================

// Données métiers du projet (Épingles initiales 3 et 5)
let listeEpingles = [
    creerEpingle(3, -2, 0),
    creerEpingle(5, 2, 0)
];

// Calcul du premier chemin entre 3 et 5
const premierChemin = calculerCheminEtJoint(listeEpingles[0], listeEpingles[1]);

// Note : Le point J (premierChemin.jointJ) servira de tête pour la future épingle 7 (Rouge).

// ==========================================
// BOUCLE DE RENDU
// ==========================================

function lancerBoucleRendu(ctx, canvas) {
    function rafraichir() {
        effacerCanvas(ctx, canvas);
        dessinerGrilleSecondaire(ctx, canvas, etatGrille);
        dessinerAxesPrincipaux(ctx, canvas, etatGrille);

        // Dessiner le chemin (lignes jaune et bleue vers J)
        dessinerChemin(ctx, premierChemin, etatGrille);

        // Affichage des épingles de la liste
        for (let epingle of listeEpingles) {
            dessinerEpingle(ctx, epingle, etatGrille);
        }
        
        requestAnimationFrame(rafraichir);
    }
    requestAnimationFrame(rafraichir);
}

// ==========================================
// POINT D'ENTRÉE (TOUJOURS EN BAS)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // Initialisation du canvas et de la souris
    const references = initialiserCanvasEtInteractions();
    
    // Lancement de la boucle de rendu principale
    lancerBoucleRendu(references.ctx, references.canvas);
});