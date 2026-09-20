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
etape("Test unique du chemin (3, 7)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 3, 7);
});

// ÉTAPE 6 : Épingle 11
etape("Génération de l'épingle 11 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 11, -4, 3, 'rouge');
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
    nouvelleEpingle(epingles, 13, 4, 4, 'rouge');
});

// ÉTAPE 10 : Allongement 5 et 7
etape("Allongement des queues de 5 et 7", (epingles) => {
    allongerQueues(epingles, 5, 7);
});



// ÉTAPE 11 : Chemin (5, 13)
etape("Test unique du Chemin (5, 13)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 5, 13);
});

//ÉTAPE 12 : Épingle 17
etape("Génération de l'épingle 17 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 17, 5, 3, 'rouge');
});

// ÉTAPE 10 : Allongement 5 et 13
etape("Allongement des queues de 5 et 13", (epingles) => {
    allongerQueues(epingles, 5, 13);
});



// ÉTAPE 11 : Chemin (7, 11)
etape("Chemin (7, 11)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 7, 11);
});

//ÉTAPE 12 : Épingle 19
etape("Épingle 19 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 19, -6, 5, 'rouge');
});

// ÉTAPE 13 : Allongement 7 et 11
etape("Allongement 7 et 11", (epingles) => {
    allongerQueues(epingles, 7, 11);
});



// ÉTAPE 14 : Chemin (5, 17)
etape("Chemin (5, 17)", (epingles, chemins) => {
    ajouterCheminEntre(epingles, chemins, 5, 17);
});

//ÉTAPE 15 : Épingle 23
etape("Épingle 23 (Rouge)", (epingles) => {
    nouvelleEpingle(epingles, 23, 7, 1, 'rouge');
});

//ÉTAPE 16 : Allongement 5 et 17
etape("Allongement 5 et 17", (epingles) => {
    allongerQueues(epingles, 5, 17);
});



// ======================EN ATTENTE===============================___________________________________________

// const insererLigne = (epingles, indexLigne) => {
//     console.log("-> Appel de insererLigne sur index :", indexLigne); // <--- Ajoute ça
//     const cible = Number(indexLigne);
//     epingles.forEach(p => {
//         const currentY = Number(p.y);
//         // Utilise '>=' si tu veux que l'épingle sur la ligne descende, 
//         // ou '>' si tu veux qu'elle reste fixe.
//         if (currentY >= cible) {
//             p.y = currentY + 1; // Forcé en nombre, fini la concaténation foireuse !
//         }
//     });
// };



// etape("Insertion d'une ligne en y=2", (epingles, chemins, options) => {
//     // 1. On décale les épingles
//     console.log("1. Épingles avant insertion :", JSON.stringify(epingles));
    
//     insererLigne(epingles, -10);
    
//     console.log("2. Épingles après insertion :", JSON.stringify(epingles));
    
//     // 2. On recalcule les chemins
//     chemins.forEach((c, index) => {
//         console.log(`Chemin [${index}] brut :`, c);
        
//         const pPetit = ep(epingles, c.parentPetitId);
//         const pGrand = ep(epingles, c.parentGrandId);

//         console.log(`-> Trouvé pPetit (${c.parentPetitId}) :`, pPetit);
//         console.log(`-> Trouvé pGrand (${c.parentGrandId}) :`, pGrand);

//         if (!pPetit || !pGrand) {
//             console.warn(`⚠️ ALerte : Chemin [${index}] abandonné car parents introuvables !`);
//             return;
//         }


//         const nouveauChemin = calculerCheminEtJoint(pPetit, pGrand);

//         console.log(`Ancien chemin [${index}] segments :`, c.segments);
//         console.log(`Nouveau chemin [${index}] segments :`, nouveauChemin.segments);
        
//         c.departPetit = nouveauChemin.departPetit;
//         c.departGrand = nouveauChemin.departGrand;
//         c.pointPivotQ = nouveauChemin.pointPivotQ;
//         c.jointJ = nouveauChemin.jointJ;
//         c.segments = nouveauChemin.segments;
//     });

//     // 3. ON ACTIVE LE RENDU VISUEL DE LA LIGNE
//     options.ligneInseree = -10;
// });

// ======================EN ATTENTE===============================---------------------------------------------------------