// ==========================================
// SCRIPT.JS - CONTRÔLEUR PRINCIPAL
// ==========================================

let listeEpinglesInitiales = [
    creerEpingle(3, -2, 0, 'violet'),
    creerEpingle(5, 2, 0, 'violet')
];

let listeCheminsInitiaux = [];
let listeEpinglesCompletes = [...listeEpinglesInitiales];

// ÉTAPE 0 : État de départ pur (uniquement les épingles 3 et 5)
window.historiqueApp.enregistrerEtape("État de départ (3 et 5)", [...listeEpinglesInitiales], []);

// ÉTAPE 1 : Premier chemin entre 3 et 5
const premierChemin = calculerCheminEtJoint(listeEpinglesInitiales[0], listeEpinglesInitiales[1]);
listeCheminsInitiaux.push(premierChemin);
window.historiqueApp.enregistrerEtape("Tracé du premier chemin vers J", [...listeEpinglesInitiales], [...listeCheminsInitiaux]);

// ÉTAPE 2 : Génération de l'épingle 7
const epingle7 = creerEpingle(7, 0, -2, 'rouge');
listeEpinglesCompletes.push(epingle7);
window.historiqueApp.enregistrerEtape("Génération de l'épingle 7 (Rouge)", [...listeEpinglesCompletes], [...listeCheminsInitiaux]);


// ==========================================
// GESTION DE L'INTERFACE ET DE L'HISTORIQUE
// ==========================================

function mettreAJourUI() {
    const indicateur = document.getElementById('indicateur-etape');
    if (indicateur && window.historiqueApp) {
        const total = window.historiqueApp.etapes.length;
        const actuel = window.historiqueApp.indexActuel + 1;
        indicateur.textContent = `Étape : ${actuel} / ${total}`;
    }
}

function naviguerHistorique(direction) {
    if (direction === 'precedent') {
        window.historiqueApp.etapePrecedente();
    } else if (direction === 'suivant') {
        window.historiqueApp.etapeSuivante();
    }
    mettreAJourUI();
}


// ==========================================
// BOUCLE DE RENDU
// ==========================================

function lancerBoucleRendu(ctx, canvas) {
    function rafraichir() {
        effacerCanvas(ctx, canvas);
        dessinerGrilleSecondaire(ctx, canvas, etatGrille);
        dessinerAxesPrincipaux(ctx, canvas, etatGrille);

        // Récupération de l'état actif depuis l'historique global
        const etatActuel = window.historiqueApp.obtenirEtatActuel();

        if (etatActuel) {
            // Dessiner les chemins de l'étape active
            for (let chemin of etatActuel.chemins) {
                dessinerChemin(ctx, chemin, etatGrille);
            }

            // Dessiner les épingles de l'étape active
            for (let epingle of etatActuel.epingles) {
                dessinerEpingle(ctx, epingle, etatGrille);
            }
        }
        
        requestAnimationFrame(rafraichir);
    }
    requestAnimationFrame(rafraichir);
}


// ==========================================
// POINT D'ENTRÉE (DOM CHARGÉ)
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation du canvas et de la souris
    const references = initialiserCanvasEtInteractions();

    // 2. Branchement des boutons de l'interface HTML
    const btnPrecedent = document.getElementById('btn-precedent');
    const btnSuivant = document.getElementById('btn-suivant');

    if (btnPrecedent) {
        btnPrecedent.addEventListener('click', () => naviguerHistorique('precedent'));
    }
    if (btnSuivant) {
        btnSuivant.addEventListener('click', () => naviguerHistorique('suivant'));
    }

    // 3. Branchement des flèches du clavier
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            naviguerHistorique('precedent');
        } else if (e.key === 'ArrowRight') {
            naviguerHistorique('suivant');
        }
    });

    // 4. Initialisation visuelle de l'indicateur d'étape
    mettreAJourUI();

    // 5. Lancement de la boucle de rendu
    lancerBoucleRendu(references.ctx, references.canvas);
});