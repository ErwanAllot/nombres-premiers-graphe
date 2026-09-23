const fs = require('fs');
const path = require('path');

function explorerDossier(dir, prefix = '') {
    const fichiers = fs.readdirSync(dir, { withFileTypes: true });

    fichiers.forEach((f, index) => {
        const estDernier = index === fichiers.length - 1;
        const connecteur = estDernier ? '└── ' : '├── ';
        const cheminComplet = path.join(dir, f.name);

        if (f.isDirectory() && f.name !== 'node_modules' && f.name !== '.git') {
            console.log(prefix + connecteur + '📂 ' + f.name);
            explorerDossier(cheminComplet, prefix + (estDernier ? '    ' : '│   '));
        } else if (f.isFile() && f.name.endsWith('.js')) {
            console.log(prefix + connecteur + '📄 ' + f.name);

            // Lecture du fichier pour trouver les fonctions
            const contenu = fs.readFileSync(cheminComplet, 'utf8');
            
            // Regex pour choper les "function nom()" et "const nom = (...) =>"
            const regexFonctions = /(?:function\s+([a-zA-Z0-9_$]+))|(?:(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>)/g;
            
            let match;
            const fonctions = [];
            while ((match = regexFonctions.exec(contenu)) !== null) {
                const nom = match[1] || match[2];
                if (nom && !fonctions.includes(nom)) fonctions.push(nom);
            }

            // Affichage des fonctions trouvées sous le fichier
            fonctions.forEach((fonc, fIndex) => {
                const dernierFonc = fIndex === fonctions.length - 1;
                const sousConnecteur = dernierFonc ? '    └── ⚙️ ' : '    ├── ⚙️ ';
                console.log(prefix + (estDernier ? '    ' : '│   ') + sousConnecteur + fonc);
            });
        }
    });
}

console.log("📂 Arborescence et Fonctions du Projet :");
explorerDossier('./');