// ==========================================
// ASSISTANT DE SCÉNARIO (Générique)
// ==========================================
function etape(nom, callback) {
    // 1. Récupération et clonage propre de l'état actuel
    let etat = window.historiqueApp.obtenirEtatActuel();
    let epingles = JSON.parse(JSON.stringify(etat.epingles));
    let chemins = JSON.parse(JSON.stringify(etat.chemins));

    // 2. On exécute les modifications spécifiques à l'étape via une fonction fléchée
    callback(epingles, chemins);

    // 3. Enregistrement automatique dans l'historique
    window.historiqueApp.enregistrerEtape(nom, epingles, chemins);
}


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

    // --- NOUVEAUTÉS POUR DÉBUT ET FIN ---
    allerAuDebut() {
        if (this.etapes.length > 0 && this.indexActuel > 0) {
            this.indexActuel = 0;
            console.log(`[Historique] Retour au début : ${this.etapes[this.indexActuel].description}`);
            return this.etapes[this.indexActuel];
        }
        return null;
    },

    allerALaFin() {
        if (this.etapes.length > 0 && this.indexActuel < this.etapes.length - 1) {
            this.indexActuel = this.etapes.length - 1;
            console.log(`[Historique] Saut à la fin : ${this.etapes[this.indexActuel].description}`);
            return this.etapes[this.indexActuel];
        }
        return null;
    },
    // -------------------------------------

    obtenirEtatActuel() {
        if (this.indexActuel >= 0 && this.indexActuel < this.etapes.length) {
            return this.etapes[this.indexActuel];
        }
        return null;
    }
};