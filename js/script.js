// ==========================================
// SCRIPT.JS - CONTRÔLEUR PRINCIPAL
// ==========================================

let listeEpinglesInitiales = [
    creerEpingle(3, -2, 0, 'violet'),
    creerEpingle(5, 2, 0, 'violet')
];

let listeCheminsInitiaux = [];
let listeEpinglesCompletes = [...listeEpinglesInitiales];

// ÉTAPE 1 : État de départ pur (uniquement les épingles 3 et 5)
window.historiqueApp.enregistrerEtape("État de départ (3 et 5)", [...listeEpinglesInitiales], []);

// ÉTAPE 2 : Premier chemin entre 3 et 5
const premierChemin = calculerCheminEtJoint(listeEpinglesInitiales[0], listeEpinglesInitiales[1]);
listeCheminsInitiaux.push(premierChemin);
window.historiqueApp.enregistrerEtape("Tracé du premier chemin vers J", [...listeEpinglesInitiales], [...listeCheminsInitiaux]);

// ÉTAPE 3 : Génération de l'épingle 7
const epingle7 = creerEpingle(7, 0, 2, 'rouge');
listeEpinglesCompletes.push(epingle7);
window.historiqueApp.enregistrerEtape("Génération de l'épingle 7 (Rouge)", [...listeEpinglesCompletes], [...listeCheminsInitiaux]);


// ÉTAPE 4

// 1. On récupère l'état actuel de l'application (les épingles et les chemins)
let etatActuel = window.historiqueApp.obtenirEtatActuel();
let epinglesEtape = JSON.parse(JSON.stringify(etatActuel.epingles));
let cheminsEtape = JSON.parse(JSON.stringify(etatActuel.chemins));

// 2. On cherche les épingles 3 et 5 dans ce tableau pour rallonger leur queue
const epingle3 = epinglesEtape.find(e => e.valeur === 3);
const epingle5 = epinglesEtape.find(e => e.valeur === 5);

if (epingle3) epingle3.longueurQueue += 1; // Passe à 2
if (epingle5) epingle5.longueurQueue += 1; // Passe à 2

// 3. On enregistre cette étape d'allongement dans l'historique
window.historiqueApp.enregistrerEtape("Allongement des queues de 3 et 5", epinglesEtape, cheminsEtape);


// ÉTAPE 5

// ==========================================
// ÉTAPE : Création du chemin (3, 7) et de l'épingle 11
// ==========================================

// On réutilise les variables existantes sans les redéclarer avec 'let'
etatActuel = window.historiqueApp.obtenirEtatActuel();
epinglesEtape = JSON.parse(JSON.stringify(etatActuel.epingles));
cheminsEtape = JSON.parse(JSON.stringify(etatActuel.chemins));

if (epingle3 && epingle7) {
    // 2. On calcule le chemin et le joint J via notre moteur d'ancres
    const resultatChemin = calculerCheminEtJoint(epingle3, epingle7);
    
    // 3. On l'ajoute aux chemins SANS toucher aux épingles (pas de création de 11)
    cheminsEtape.push(resultatChemin);

    // 4. On enregistre l'étape juste pour voir le rendu du chemin
    window.historiqueApp.enregistrerEtape("Test unique du chemin (3, 7)", epinglesEtape, cheminsEtape);
}


// ÉTApe 6 : Génération de l'épingle 11

// On ajoute l'épingle 11
const epingle11 = creerEpingle(11, -5, 3, 'rouge');
epinglesEtape.push(epingle11);

// On enregistre en conservant TOUS les chemins précédents
window.historiqueApp.enregistrerEtape("Génération de l'épingle 11 (Rouge)", epinglesEtape, cheminsEtape);




// ==========================================
// ÉTAPE 7 : Allongement des queues de 3 et 7
// ==========================================

// On récupère l'état actuel pour cette étape
etatActuel = window.historiqueApp.obtenirEtatActuel();
epinglesEtape = JSON.parse(JSON.stringify(etatActuel.epingles));
cheminsEtape = JSON.parse(JSON.stringify(etatActuel.chemins));

// On cherche les épingles dans CETTE étape avec des noms uniques
const epingle3Actuelle = epinglesEtape.find(e => e.valeur === 3);
const epingle7Actuelle = epinglesEtape.find(e => e.valeur === 7);

if (epingle3Actuelle) epingle3Actuelle.longueurQueue += 1; 
if (epingle7Actuelle) epingle7Actuelle.longueurQueue += 1; 

// On enregistre proprement
window.historiqueApp.enregistrerEtape("Allongement des queues de 3 et 7", epinglesEtape, cheminsEtape);





// ==========================================
// ÉTAPE 8 : Création du chemin (5, 7)
// ==========================================

etatActuel = window.historiqueApp.obtenirEtatActuel();
epinglesEtape = JSON.parse(JSON.stringify(etatActuel.epingles));
cheminsEtape = JSON.parse(JSON.stringify(etatActuel.chemins));

// On va chercher les versions fraîches de cette étape (avec les queues allongées)
const epingle5Actuelle = epinglesEtape.find(e => e.valeur === 5);
const epingle7Actu = epinglesEtape.find(e => e.valeur === 7);

if (epingle5Actuelle && epingle7Actu) {
    // On calcule avec les bonnes épingles à jour
    const resultatChemin = calculerCheminEtJoint(epingle5Actuelle, epingle7Actu);
    
    cheminsEtape.push(resultatChemin);

    window.historiqueApp.enregistrerEtape("Test unique du chemin (5, 7)", epinglesEtape, cheminsEtape);
}





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


console.log("Liste des chemins :", chemins);