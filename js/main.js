// ==========================================
// IMPORTS (Les dépendances du module principal)
// ==========================================
import { effacerCanvas, dessinerGrilleSecondaire, dessinerAxesPrincipaux, dessinerLigneInseree } from './rendu/grille.js';
import { dessinerChemin } from './rendu/chemin.js';
import { dessinerEpingle } from './rendu/epingle.js';
import { etatGrille, initialiserCanvasEtInteractions } from './interactions/souris.js';



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

        // Récupération de l'état actif depuis l'historique global
        const etatActuel = window.historiqueApp.obtenirEtatActuel();

        // 1. FOND : Afficher la ligne/colonne insérée de l'étape (si elle existe)
        if (etatActuel) {
            if (etatActuel.ligneInseree !== undefined) {
                dessinerLigneInseree(ctx, canvas, etatGrille, etatActuel.ligneInseree);
            }
            if (etatActuel.colonneInseree !== undefined) {
                dessinerColonneInseree(ctx, canvas, etatGrille, etatActuel.colonneInseree);
            }
        }

        // 2. Grille et axes par-dessus le fond coloré
        dessinerGrilleSecondaire(ctx, canvas, etatGrille);
        dessinerAxesPrincipaux(ctx, canvas, etatGrille);

        if (etatActuel) {
            // 3. Dessiner les chemins de l'étape active
            for (let chemin of etatActuel.chemins) {
                dessinerChemin(ctx, chemin, etatGrille);
            }

            // 4. Dessiner les épingles de l'étape active (tout en haut)
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


