// ==========================================
// SCRIPT.JS - CONTRÔLEUR PRINCIPAL
// ==========================================

let listeEpingles = [
    creerEpingle(3, -2, 0, 'violet'),
    creerEpingle(5, 2, 0, 'violet')
];

let listeChemins = [];
let listeEpinglesCompletes = [...listeEpingles];

// ÉTAPE 1 : Premier chemin entre 3 et 5
const premierChemin = calculerCheminEtJoint(listeEpingles[0], listeEpingles[1]);
listeChemins.push(premierChemin);
historiqueApp.enregistrerEtape("État initial (3 et 5) + Chemin vers J", listeEpinglesCompletes, listeChemins);

// ÉTAPE 2 : Génération de l'épingle 7 (Rouge, car solution à -1)
// J est la tête, donc le corps se positionne pour que la tête tombe exactement sur le point J.
const corps7X = 0;
const corps7Y = -2; // Position du corps pour que la tête soit sur J(0, -1) avec une orientation à 90°

const epingle7 = creerEpingle(7, corps7X, corps7Y, 'rouge');
listeEpinglesCompletes.push(epingle7);

historiqueApp.enregistrerEtape("Génération de l'épingle 7 (Rouge)", listeEpinglesCompletes, listeChemins);


// ==========================================
// BOUCLE DE RENDU
// ==========================================

function lancerBoucleRendu(ctx, canvas) {
    function rafraichir() {
        effacerCanvas(ctx, canvas);
        dessinerGrilleSecondaire(ctx, canvas, etatGrille);
        dessinerAxesPrincipaux(ctx, canvas, etatGrille);

        for (let chemin of listeChemins) {
            dessinerChemin(ctx, chemin, etatGrille);
        }

        for (let epingle of listeEpinglesCompletes) {
            dessinerEpingle(ctx, epingle, etatGrille);
        }
        
        requestAnimationFrame(rafraichir);
    }
    requestAnimationFrame(rafraichir);
}

// ==========================================
// POINT D'ENTRÉE
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    const references = initialiserCanvasEtInteractions();
    lancerBoucleRendu(references.ctx, references.canvas);
});