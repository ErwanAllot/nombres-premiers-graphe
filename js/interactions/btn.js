// document.getElementById('btn-debut').addEventListener('click', () => {
//     const etat = window.historiqueApp.allerAuDebut();
//     if (etat) {
//         chargerEtatDansCanvas(etat); // Remplace par ta fonction d'affichage de l'état
//         mettreAJourInterfaceHistorique(); // Met à jour le texte de l'indicateur et l'état des boutons
//     }
// });

// document.getElementById('btn-fin').addEventListener('click', () => {
//     const etat = window.historiqueApp.allerALaFin();
//     if (etat) {
//         chargerEtatDansCanvas(etat);
//         mettreAJourInterfaceHistorique();
//     }
// });

// Dans js/interactions/btn.js
export const initialiserBoutons = (chargerEtatCallback, mettreAJourUICallback) => {
    const btnDebut = document.getElementById('btn-debut');
    if (btnDebut) {
        btnDebut.addEventListener('click', () => {
            const etat = window.historiqueApp.allerAuDebut();
            if (etat) {
                chargerEtatCallback(etat);
                mettreAJourUICallback();
            }
        });
    }

    const btnFin = document.getElementById('btn-fin');
    if (btnFin) {
        btnFin.addEventListener('click', () => {
            const etat = window.historiqueApp.allerALaFin();
            if (etat) {
                chargerEtatCallback(etat);
                mettreAJourUICallback();
            }
        });
    }
    // (Tu pourras y rajouter tes autres boutons 'btn-precedent', 'btn-suivant' de la même manière)
};