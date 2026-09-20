// ==========================================
// SCRIPT.JS - CONTRÔLEUR PRINCIPAL (Version Propre)
// ==========================================

// --- INITIALISATION DU SCÉNARIO ---
let listeEpinglesInitiales = [
    creerEpingle(3, -2, 0, 'violet'),
    creerEpingle(5, 2, 0, 'violet')
];

// ÉTAPE 1 : État de départ pur
window.historiqueApp.enregistrerEtape("État de départ (3 et 5)", [...listeEpinglesInitiales], []);

// ÉTAPE 2 : Premier chemin entre 3 et 5
etape("Tracé du premier chemin vers J", (epingles, chemins) => {
    const p3 = epingles.find(e => e.valeur === 3);
    const p5 = epingles.find(e => e.valeur === 5);
    chemins.push(calculerCheminEtJoint(p3, p5));
});

// ÉTAPE 3 : Génération de l'épingle 7
etape("Génération de l'épingle 7 (Rouge)", (epingles) => {
    epingles.push(creerEpingle(7, 0, 2, 'rouge'));
});

// ÉTAPE 4 : Allongement des queues de 3 et 5
etape("Allongement des queues de 3 et 5", (epingles) => {
    epingles.find(e => e.valeur === 3).longueurQueue += 1;
    // const p3 = epingles.find(e => e.valeur === 3);
    const p5 = epingles.find(e => e.valeur === 5);
    // if (p3) p3.longueurQueue += 1;
    if (p5) p5.longueurQueue += 1;
});

// ÉTAPE 5 : Création du chemin (3, 7)
etape("Test unique du chemin (3, 7)", (epingles, chemins) => {
    const p3 = epingles.find(e => e.valeur === 3);
    const p7 = epingles.find(e => e.valeur === 7);
    chemins.push(calculerCheminEtJoint(p3, p7));
});

// ÉTAPE 6 : Génération de l'épingle 11
etape("Génération de l'épingle 11 (Rouge)", (epingles) => {
    epingles.push(creerEpingle(11, -5, 3, 'rouge'));
});

// ÉTAPE 7 : Allongement des queues de 3 et 7
etape("Allongement des queues de 3 et 7", (epingles) => {
    const p3 = epingles.find(e => e.valeur === 3);
    const p7 = epingles.find(e => e.valeur === 7);
    if (p3) p3.longueurQueue += 1;
    if (p7) p7.longueurQueue += 1;
});

// ÉTAPE 8 : Création du chemin (5, 7)
etape("Test unique du chemin (5, 7)", (epingles, chemins) => {
    const p5 = epingles.find(e => e.valeur === 5);
    const p7 = epingles.find(e => e.valeur === 7);
    chemins.push(calculerCheminEtJoint(p5, p7));
});

// ÉTAPE 9 : Génération de l'épingle 13
etape("Génération de l'épingle 13 (Rouge)", (epingles) => {
    epingles.push(creerEpingle(13, 4, 5, 'rouge'));
});

// ÉTAPE 10 : Allongement des queues de 5 et 7
etape("Allongement des queues de 5 et 7", (epingles) => {
    const p5 = epingles.find(e => e.valeur === 5);
    const p7 = epingles.find(e => e.valeur === 7);
    if (p5) p5.longueurQueue += 1;
    if (p7) p7.longueurQueue += 1;
});



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


