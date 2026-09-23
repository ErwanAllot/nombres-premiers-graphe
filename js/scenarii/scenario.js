import { obtenirAncresDisponibles, creerEpingle } from '@/modeles/epingle.js';
import { calculerCheminEtJoint, creerSegments, calculerPointPivotQ } from '@/modeles/chemin.js';

// --- RACCOURCIS MÉTIER POUR LE SCÉNARIO ---
const ep = (epingles, val) => epingles.find(e => e.valeur === val);

export const ajouterCheminEntre = (epingles, chemins, v1, v2) => {
    chemins.push(calculerCheminEtJoint(ep(epingles, v1), ep(epingles, v2)));
};


export const rallongerDeuxQueues = (epingles) => {
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
export const allongerQueues = (epingles, ...valeurs) => {
    valeurs.forEach(v => {
        const p = ep(epingles, v);
        if (p) p.longueurQueue += 1;
    });
};



export const genererEpingleSuivante = (epingles) => {
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
export const insererLigne = (epingles, indexLigne) => {
    const cible = Number(indexLigne);
    epingles.forEach(p => {
        const currentY = Number(p.y);
        if (currentY >= cible) {
            p.y = currentY + 1;
        }
    });
};

// 2. Outil pour recalculer tous les chemins de la grille d'un coup
export const recalculerTousLesChemins = (epingles, chemins) => {
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


export const recalculerCheminFidele = (chemin, epingles) => {
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
    const ancresPetitOrigine = obtenirAncresDisponibles(pPetit);
    pPetit.longueurQueue = longueurActuellePetit; // On remet la longueur actuelle

    const longueurActuelleGrand = pGrand.longueurQueue;
    pGrand.longueurQueue = chemin.longueurQueueGrandOrigine;
    const ancresGrandOrigine = obtenirAncresDisponibles(pGrand);
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
