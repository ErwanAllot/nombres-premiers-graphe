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



