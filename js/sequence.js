

// ==========================================
// SCÉNARIO - LISTE DES ÉTAPES (Ultra-court)
// ==========================================

// --- ÉTAT INITIAL ---
let listeEpinglesInitiales = [
    creerEpingle(3, -1, 0, 'violet'),
    creerEpingle(5, 1, 0, 'violet')
];

// ÉTAPE 1 : État de départ pur
window.historiqueApp.enregistrerEtape("État de départ (3 et 5)", [...listeEpinglesInitiales], []);

// ÉTAPE 2 : Premier chemin
etape("Tracé du premier chemin vers J", (epingles, chemins, options) => {
    ajouterCheminEntre(epingles, chemins, 3, 5);
    options.nombrePremier = 7;
});
// ÉTAPE 3 : Épingle 7
etape("Génération de l'épingle 7", (epingles) => {
    genererEpingleSuivante(epingles);
});
// ÉTAPE 4 : Allongement 3 et 5
etape("Allongement des queues de 3 et 5", (epingles) => {
    rallongerDeuxQueues(epingles);
});










// ÉTAPE 5 : Chemin (3, 7)
etape("Test unique du chemin (3, 7)", (epingles, chemins, options) => {
    ajouterCheminEntre(epingles, chemins, 3, 7);
    options.nombrePremier = 11;
});
// ÉTAPE 6 : Épingle 11
etape("Génération de l'épingle 11 (Rouge)", (epingles) => {
    genererEpingleSuivante(epingles);
});
// ÉTAPE 7 : Allongement 3 et 7
etape("Allongement des queues de 3 et 7", (epingles) => {
    rallongerDeuxQueues(epingles);
});

// ÉTAPE 8 : Chemin (5, 7)
etape("Test unique du chemin (5, 7)", (epingles, chemins, options) => {
    ajouterCheminEntre(epingles, chemins, 5, 7);
    options.nombrePremier = 13;
});
// ÉTAPE 9 : Épingle 13
etape("Génération de l'épingle 13 (Rouge)", (epingles) => {
    genererEpingleSuivante(epingles);
});
// ÉTAPE 10 : Allongement 5 et 7
etape("Allongement des queues de 5 et 7", (epingles) => {
    rallongerDeuxQueues(epingles);
});

// ÉTAPE 11 : Chemin (5, 13)
etape("Test unique du Chemin (5, 13)", (epingles, chemins, options) => {
    ajouterCheminEntre(epingles, chemins, 5, 13);
    options.nombrePremier = 17;
});
//ÉTAPE 12 : Épingle 17
etape("Génération de l'épingle 17 (Rouge)", (epingles) => {
    genererEpingleSuivante(epingles);
});
// ÉTAPE 13 : Allongement 5 et 13
etape("Allongement des queues de 5 et 13", (epingles) => {
    rallongerDeuxQueues(epingles);
});


// ÉTAPE 14 : Chemin (7, 11)
etape("Chemin (7, 11)", (epingles, chemins, options) => {
    ajouterCheminEntre(epingles, chemins, 7, 11);
    options.nombrePremier = 19;
});


//ÉTAPE 15 : Épingle 19
etape("Épingle 19 (Rouge)", (epingles) => {
    genererEpingleSuivante(epingles);
});
// ÉTAPE 16 : Allongement 7 et 11
etape("Allongement 7 et 11", (epingles) => {
    rallongerDeuxQueues(epingles);
});


etape("Insertion d'une ligne en y=2", (epingles, chemins, options) => {
    const indexCible = 1;

    // 1. On décale les épingles (en gardant celles sur la ligne fixes si tu utilises strict '>')
    insererLigne(epingles, indexCible);
    
    // 2. On recalcule fidèlement CHAQUE chemin du tableau
    chemins.forEach((c, index) => {
        const cheminMisAJour = recalculerCheminFidele(c, epingles);
        if (cheminMisAJour) {
            chemins[index] = cheminMisAJour; // On remplace par le chemin mis à jour
        }
    });
    
    // 3. On active le rendu visuel
    options.ligneInseree = indexCible;

    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
});


// ÉTAPE 17 : Chemin (5, 17)
etape("Chemin (5, 17)", (epingles, chemins, options) => {
    ajouterCheminEntre(epingles, chemins, 5, 17);
    options.nombrePremier = 23;
});
//ÉTAPE 18 : Épingle 23
etape("Épingle 23 (Rouge)", (epingles) => {
    genererEpingleSuivante(epingles);
});
//ÉTAPE 19 : Allongement 5 et 17
etape("Allongement 5 et 17", (epingles) => {
    rallongerDeuxQueues(epingles);
});

