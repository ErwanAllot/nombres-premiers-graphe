// ==========================================
// SCRIPT.JS - CONTRÔLEUR PRINCIPAL
// ==========================================

// Données métiers du projet
let listeEpingles = [
    creerEpingle(3, 0, 0, 0),
    creerEpingle(5, 3, 2, 0)
];

// ==========================================
// BOUCLE DE RENDU
// ==========================================

function lancerBoucleRendu(ctx, canvas) {
    function rafraichir() {
        effacerCanvas(ctx, canvas);
        dessinerGrilleSecondaire(ctx, canvas, etatGrille);
        dessinerAxesPrincipaux(ctx, canvas, etatGrille);

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