// --- RACCOURCIS MÉTIER POUR LE SCÉNARIO ---
const ep = (epingles, val) => epingles.find(e => e.valeur === val);

const ajouterCheminEntre = (epingles, chemins, v1, v2) => {
    chemins.push(calculerCheminEtJoint(ep(epingles, v1), ep(epingles, v2)));
};

const allongerQueues = (epingles, ...valeurs) => {
    valeurs.forEach(v => {
        const p = ep(epingles, v);
        if (p) p.longueurQueue += 1;
    });
};

const nouvelleEpingle = (epingles, val, x, y, couleur = 'rouge') => {
    epingles.push(creerEpingle(val, x, y, couleur));
};


// ==========================================
// SCÉNARIO - LISTE DES ÉTAPES (Ultra-court)
// ==========================================

// --- ÉTAT INITIAL ---
let listeEpinglesInitiales = [
    creerEpingle(3, -2, 0, 'violet'),
    creerEpingle(5, 2, 0, 'violet')
];

// ÉTAPE 1 : État de départ pur
window.historiqueApp.enregistrerEtape("État de départ (3 et 5)", [...listeEpinglesInitiales], []);

// ÉTAPE 2 : Premier chemin
etape("Tracé du premier chemin vers J", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 3, 5);
});

// ÉTAPE 3 : Épingle 7
etape("Génération de l'épingle 7 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 7, 0, 2, 'rouge');
});

// ÉTAPE 4 : Allongement 3 et 5
etape("Allongement des queues de 3 et 5", (epingles) => {
    allongerQueues(epingles, 3, 5);
});

// ÉTAPE 5 : Chemin (3, 7)
etape("Test unique du chemin (3, 7)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 3, 7);
});

// ÉTAPE 6 : Épingle 11
etape("Génération de l'épingle 11 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 11, -5, 3, 'rouge');
});

// ÉTAPE 7 : Allongement 3 et 7
etape("Allongement des queues de 3 et 7", (epingles) => {
    allongerQueues(epingles, 3, 7);
});

// ÉTAPE 8 : Chemin (5, 7)
etape("Test unique du chemin (5, 7)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 5, 7);
});

// ÉTAPE 9 : Épingle 13
etape("Génération de l'épingle 13 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 13, 4, 5, 'rouge');
});

// ÉTAPE 10 : Allongement 5 et 7
etape("Allongement des queues de 5 et 7", (epingles) => {
    allongerQueues(epingles, 5, 7);
});



// ÉTAPE 11 : Chemin (5, 13)
etape("Test unique du Chemin (5, 13)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 5, 13);
});

//ÉTAPE 12 : Épingle 18
// etape("Génération de l'épingle 18 (Rouge)", (epingles) => {
//     nouvelleEpingle(epingles, 18, 6, 4, 'rouge');
// });

// ÉTAPE 10 : Allongement 5 et 13
// etape("Allongement des queues de 5 et 13", (epingles) => {
//     allongerQueues(epingles, 5, 13);
// });

