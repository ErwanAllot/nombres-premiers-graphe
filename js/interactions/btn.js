document.getElementById('btn-debut').addEventListener('click', () => {
    const etat = window.historiqueApp.allerAuDebut();
    if (etat) {
        chargerEtatDansCanvas(etat); // Remplace par ta fonction d'affichage de l'état
        mettreAJourInterfaceHistorique(); // Met à jour le texte de l'indicateur et l'état des boutons
    }
});

document.getElementById('btn-fin').addEventListener('click', () => {
    const etat = window.historiqueApp.allerALaFin();
    if (etat) {
        chargerEtatDansCanvas(etat);
        mettreAJourInterfaceHistorique();
    }
});