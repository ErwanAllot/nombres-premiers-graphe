// --- RACCOURCIS MÉTIER POUR LE SCÉNARIO ---
const ep = (epingles, val) => epingles.find(e => e.valeur === val);

const ajouterCheminEntre = (epingles, chemins, v1, v2) => {
    chemins.push(calculerCheminEtJoint(ep(epingles, v1), ep(epingles, v2)));
};


const rallongerDeuxQueues = (epingles) => {
    const etatPrecedent = window.historiqueApp.obtenirEtatActuel();
    if (!etatPrecedent) return;

    let idPetit = 0;
    let idGrand = 0;

    if (etatPrecedent.chemins && etatPrecedent.chemins.length > 0) {
        const dernierChemin = etatPrecedent.chemins[etatPrecedent.chemins.length - 1];
        idPetit = dernierChemin.parentPetitId;
        idGrand = dernierChemin.parentGrandId;
    }

    allongerQueues(epingles, idPetit, idGrand);
};
const allongerQueues = (epingles, ...valeurs) => {
    valeurs.forEach(v => {
        const p = ep(epingles, v);
        if (p) p.longueurQueue += 1;
    });
};



const genererEpingleSuivante = (epingles) => {
    const etatPrecedent = window.historiqueApp.obtenirEtatActuel();
    if (!etatPrecedent) return;

    let x = 0;
    let y = 0;
    let idPetit = 0;
    let idGrand = 0;

    if (etatPrecedent.chemins && etatPrecedent.chemins.length > 0) {
        const dernierChemin = etatPrecedent.chemins[etatPrecedent.chemins.length - 1];
        x = dernierChemin.pointPivotQ.x;
        y = dernierChemin.pointPivotQ.y;
        idPetit = dernierChemin.parentPetitId;
        idGrand = dernierChemin.parentGrandId;
    }

    const valPremier = etatPrecedent.nombrePremier;
    const polarite = idGrand + idPetit - valPremier;
    const color = (polarite === -1) ? 'vert' : 'rouge';

    nouvelleEpingle(epingles, valPremier, x, y, color);
};
const nouvelleEpingle = (epingles, val, x, y, couleur = 'rouge') => {
    epingles.push(creerEpingle(val, x, y, couleur));
};



// --- LES OUTILS ---

// 1. Outil pour insérer une ligne et décaler les épingles situées en dessous
const insererLigne = (epingles, indexLigne) => {
    const cible = Number(indexLigne);
    epingles.forEach(p => {
        const currentY = Number(p.y);
        if (currentY >= cible) {
            p.y = currentY + 1;
        }
    });
};

// 2. Outil pour recalculer tous les chemins de la grille d'un coup
const recalculerTousLesChemins = (epingles, chemins) => {
    chemins.forEach((c) => {
        const pPetit = ep(epingles, c.parentPetitId);
        const pGrand = ep(epingles, c.parentGrandId);

        if (!pPetit || !pGrand) return; // Sécurité si un parent manque

        const nouveauChemin = calculerCheminEtJoint(pPetit, pGrand);
        
        // On met à jour le chemin existant avec les nouvelles coordonnées
        c.departPetit = nouveauChemin.departPetit;
        c.departGrand = nouveauChemin.departGrand;
        c.pointPivotQ = nouveauChemin.pointPivotQ;
        c.jointJ = nouveauChemin.jointJ;
        c.segments = nouveauChemin.segments;
    });
};


// const recalculerCheminFidele = (chemin, epingles) => {
//     const pPetit = ep(epingles, chemin.parentPetitId);
//     const pGrand = ep(epingles, chemin.parentGrandId);
//     if (!pPetit || !pGrand) {
//         console.warn("⚠️ Parents introuvables pour le chemin :", chemin);
//         return null;
//     }

//     console.log(`--- Recalcul pour chemin (parents ${chemin.parentPetitId} et ${chemin.parentGrandId}) ---`);
//     console.log(`Ancre attendue -> Petit ID: ${chemin.ancrePetitId}, Grand ID: ${chemin.ancreGrandId}`);
//     // 1. On récupère toutes les ancres actuelles des parents (avec leurs nouvelles positions / longueurs de queue)
//     const ancresPetit = sbtenirAncresDisponibles(pPetit);
//     const ancresGrand = sbtenirAncresDisponibles(pGrand);

//     // 2. On cherche précisément l'ancre qui a le même ID qu'au premier jour !
//     const p1 = ancresPetit.find(a => a.id === chemin.ancrePetitId) || ancresPetit[0];
//     const p2 = ancresGrand.find(a => a.id === chemin.ancreGrandId) || ancresGrand[0];

//     // 3. On recalcule le pivot Q et les segments avec ces ancres fixes
//     const pointQ = calculerPointPivotQ(p1, p2);
//     const segments = creerSegments(p1, p2, pointQ);
//     const pointJ = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

//     return {
//         ...chemin, // Conserve les ID et les ancres stockées
//         departPetit: p1,
//         departGrand: p2,
//         pointPivotQ: pointQ,
//         jointJ: pointJ,
//         segments: segments
//     };
// };

const recalculerCheminFidele = (chemin, epingles) => {
    const pPetit = ep(epingles, chemin.parentPetitId);
    const pGrand = ep(epingles, chemin.parentGrandId);
    if (!pPetit || !pGrand) {
        console.warn("⚠️ Parents introuvables pour le chemin :", chemin);
        return null;
    }

    console.log(`--- Recalcul fidèle pour chemin (parents ${chemin.parentPetitId} et ${chemin.parentGrandId}) ---`);
    console.log(`Côté attendu -> Petit: ${chemin.ancrePetitCote}, Grand: ${chemin.ancreGrandCote}`);

    // Astuce magique : pour recalculer l'ancre à son emplacement d'origine malgré les allongements de queue,
    // on simule temporairement la longueur qu'avait la queue le jour de la création du chemin !
    
    const longueurActuellePetit = pPetit.longueurQueue;
    pPetit.longueurQueue = chemin.longueurQueuePetitOrigine;
    const ancresPetitOrigine = sbtenirAncresDisponibles(pPetit);
    pPetit.longueurQueue = longueurActuellePetit; // On remet la longueur actuelle

    const longueurActuelleGrand = pGrand.longueurQueue;
    pGrand.longueurQueue = chemin.longueurQueueGrandOrigine;
    const ancresGrandOrigine = sbtenirAncresDisponibles(pGrand);
    pGrand.longueurQueue = longueurActuelleGrand; // On remet la longueur actuelle

    // On cherche l'ancre par son côté ('dextre' ou 'senestre')
    const p1 = ancresPetitOrigine.find(a => a.cote === chemin.ancrePetitCote) || ancresPetitOrigine[0];
    const p2 = ancresGrandOrigine.find(a => a.cote === chemin.ancreGrandCote) || ancresGrandOrigine[0];

    // ⚠️ IMPORTANT : Maintenant que l'ancre a ses coordonnées d'origine, 
    // si des lignes ont été insérées entre-temps, il faut appliquer le même décalage de 'y' 
    // pour que l'ancre descende avec son épingle !
    // (Tu peux ajuster cette partie selon la façon dont 'insererLigne' a déplacé les 'y')

    // On recalcule le pivot Q et les segments
    const pointQ = calculerPointPivotQ(p1, p2);
    const segments = creerSegments(p1, p2, pointQ);
    const pointJ = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    return {
        ...chemin,
        departPetit: p1,
        departGrand: p2,
        pointPivotQ: pointQ,
        jointJ: pointJ,
        segments: segments
    };
};


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



// --- LE SCÉNARIO (Ultra court et lisible) ---

// etape("Insertion d'une ligne en y=2", (epingles, chemins, options) => {
//     const indexCible = 2; // Mets la vraie valeur ici (ex: 2 au lieu de -10)

//     // 1. On décale les épingles
//     insererLigne(epingles, indexCible);
    
//     // 2. On recalcule tous les chemins proprement
//     recalculerTousLesChemins(epingles, chemins);
    
//     // 3. On active le rendu visuel
//     options.ligneInseree = indexCible;
// });

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



