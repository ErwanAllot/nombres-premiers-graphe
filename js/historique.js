// ==========================================
// MODULE HISTORIQUE & NAVIGATION D'ÉTAPES
// ==========================================

window.historiqueApp = {
    etapes: [],
    indexActuel: -1,

    enregistrerEtape(description, epingles, chemins) {
        const etatSnapshot = {
            description: description,
            epingles: JSON.parse(JSON.stringify(epingles)),
            chemins: JSON.parse(JSON.stringify(chemins))
        };

        if (this.indexActuel < this.etapes.length - 1) {
            this.etapes = this.etapes.slice(0, this.indexActuel + 1);
        }

        this.etapes.push(etatSnapshot);
        this.indexActuel = this.etapes.length - 1;
        
        console.log(`[Historique] Étape ${this.indexActuel + 1}/${this.etapes.length} : ${description}`);
    },

    etapePrecedente() {
        if (this.indexActuel > 0) {
            this.indexActuel--;
            console.log(`[Historique] Retour à l'étape : ${this.etapes[this.indexActuel].description}`);
            return this.etapes[this.indexActuel];
        }
        return null;
    },

    etapeSuivante() {
        if (this.indexActuel < this.etapes.length - 1) {
            this.indexActuel++;
            console.log(`[Historique] Avancée à l'étape : ${this.etapes[this.indexActuel].description}`);
            return this.etapes[this.indexActuel];
        }
        return null;
    },

    obtenirEtatActuel() {
        if (this.indexActuel >= 0 && this.indexActuel < this.etapes.length) {
            return this.etapes[this.indexActuel];
        }
        return null;
    }
};