// ==========================================
// MODULE HISTORIQUE & ÉTAPES
// ==========================================

const historiqueApp = {
    etapes: [],
    indexActuel: -1,

    // Enregistrer une étape (état des épingles + chemins)
    enregistrerEtape(description, epingles, chemins) {
        const etatSnapshot = {
            description: description,
            epingles: JSON.parse(JSON.stringify(epingles)), // Copie profonde
            chemins: JSON.parse(JSON.stringify(chemins))
        };

        // Si on était revenu en arrière, on coupe le futur alternatif
        if (this.indexActuel < this.etapes.length - 1) {
            this.etapes = this.etapes.slice(0, this.indexActuel + 1);
        }

        this.etapes.push(etatSnapshot);
        this.indexActuel = this.etapes.length - 1;
        console.log(`[Historique] Étape enregistrée : ${description}`);
    }
};