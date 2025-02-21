# Gestion de Prospects et Entreprises

Cette application permet de gérer des prospects, des entreprises, des tâches, des emails, des appels et des meetings.
Le projet a été réécrit pour utiliser :

- **Supabase** comme base de données (PostgreSQL) via le SDK [@supabase/supabase-js](https://github.com/supabase/supabase-js)
- **Netlify** pour héberger le front-end (React) et les API (fonctions Netlify)

## Architecture

Le projet est organisé en deux grandes parties :

- **Client** : une application React (située dans le dossier `client`) qui interagit avec les API via des appels `fetch` utilisant la fonction utilitaire `apiRequest`.
- **API (fonctions Netlify)** : un ensemble de fonctions (dans `netlify/functions`) qui gèrent les opérations CRUD sur les tables Supabase. Chaque fichier correspond à une ressource (prospects, entreprises, taches, email_history, call_history, meetings).

## Structure du projet

/mon-projet
  ├─ README.md
  ├─ package.json
  ├─ /client
  │ ├─ index.html
  │ └─ /src
  │ ├─ App.jsx # Composant principal React
  │ └─ api.js # Fonction utilitaire pour les appels API
  └─ /netlify
       └─ /functions
            ├─ supabaseClient.js # Initialisation du client Supabase
            ├─ prospects.js # Endpoints pour la gestion des prospects
            ├─ entreprises.js # Endpoints pour la gestion des entreprises
            ├─ taches.js # Endpoints pour la gestion des tâches
            ├─ email_history.js # Endpoints pour l'historique des emails
            ├─ call_history.js # Endpoints pour l'historique des appels
            └─ meetings.js # Endpoints pour l'historique des meetings


## Mise en œuvre

### Configuration de Supabase

1. Créez un projet sur [Supabase](https://supabase.io) et créez les tables nécessaires.
   Par exemple, pour la table `prospects` vous pouvez utiliser une commande SQL similaire à :

   ```sql
   CREATE TABLE prospects (
     prospect_id SERIAL PRIMARY KEY,
     nom TEXT NOT NULL,
     prenom TEXT NOT NULL,
     entreprise_id INTEGER,
     email TEXT UNIQUE NOT NULL,
     telephone TEXT,
     fonction TEXT,
     notes TEXT,
     date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. Répétez pour chacune des tables : `entreprises`, `taches`, `email_history`, `call_history` et `meetings`.
Voici des exemples détaillés de commandes SQL pour créer chacune des tables dans Supabase (PostgreSQL). Ces scripts présument que vous avez déjà créé la table prospects (comme dans l'exemple précédent) et que vous souhaitez établir des relations via des clés étrangères. N'oubliez pas d'ajuster selon vos besoins (par exemple utiliser GENERATED ALWAYS AS IDENTITY au lieu de SERIAL si vous préférez la syntaxe plus moderne).

Table entreprises
La table entreprises stocke les informations relatives aux entreprises. Chaque entreprise possède un identifiant unique et des informations telles que le nom, le secteur, la taille, l'adresse, etc.

sql
Copy SQL
CREATE TABLE entreprises (
  entreprise_id SERIAL PRIMARY KEY,
  nom_entreprise TEXT NOT NULL,
  secteur_activite TEXT,
  taille_entreprise TEXT,
  adresse TEXT,
  site_web TEXT,
  strategie_entreprise TEXT,
  notes TEXT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Table taches
La table taches concerne les tâches associées à un prospect. Elle inclut des informations telles que le libellé de la tâche, son statut (par exemple "À faire", "En cours", "Terminé"), la date objectif, etc. La clé étrangère prospect_id permet d'associer une tâche à un prospect existant. L'utilisation de ON DELETE CASCADE permet de supprimer automatiquement toutes les tâches liées si un prospect est supprimé.

sql
Copy SQL
CREATE TABLE taches (
  tache_id SERIAL PRIMARY KEY,
  prospect_id INTEGER,
  libelle TEXT NOT NULL,
  status TEXT,  -- Vous pouvez également définir un type ENUM pour limiter les valeurs possibles.
  date_objectif DATE,
  notes TEXT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prospect
    FOREIGN KEY (prospect_id)
    REFERENCES prospects (prospect_id)
    ON DELETE CASCADE
);
Table email_history
Cette table enregistre l'historique des emails envoyés ou reçus pour chaque prospect. Les colonnes incluent l'identifiant de l'email, la date d'envoi, l'expéditeur, le destinataire, le sujet et le contenu du message. La clé étrangère prospect_id relie chaque email à un prospect.

sql
Copy SQL
CREATE TABLE email_history (
  email_id SERIAL PRIMARY KEY,
  prospect_id INTEGER,
  date_email TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expediteur TEXT,
  destinataire TEXT,
  sujet TEXT,
  corps TEXT,
  CONSTRAINT fk_prospect_email
    FOREIGN KEY (prospect_id)
    REFERENCES prospects (prospect_id)
    ON DELETE CASCADE
);
Table call_history
La table call_history est dédiée à l'historique des appels téléphoniques. On y retrouve un identifiant d'appel, la date de l'appel, ainsi qu'un champ pour noter des informations complémentaires. Comme pour les autres tables, la clé étrangère prospect_id assure la cohérence avec la table des prospects.

sql
Copy SQL
CREATE TABLE call_history (
  appel_id SERIAL PRIMARY KEY,
  prospect_id INTEGER,
  date_appel TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  CONSTRAINT fk_prospect_call
    FOREIGN KEY (prospect_id)
    REFERENCES prospects (prospect_id)
    ON DELETE CASCADE
);
Table meetings
Enfin, la table meetings enregistre les réunions liées aux prospects. On y trouve un identifiant de réunion, la date de la réunion, la liste des participants (sous forme de chaîne de caractères ou en utilisant un type JSON selon vos besoins), ainsi qu’un champ pour les notes.

sql
Copy SQL
CREATE TABLE meetings (
  meeting_id SERIAL PRIMARY KEY,
  prospect_id INTEGER,
  date_meeting TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  participants TEXT,
  notes TEXT,
  CONSTRAINT fk_prospect_meeting
    FOREIGN KEY (prospect_id)
    REFERENCES prospects (prospect_id)
    ON DELETE CASCADE
);
Remarques complémentaires
Intégrité référentielle :
Chaque table qui possède une colonne prospect_id définit une contrainte de clé étrangère vers la table prospects. L'option ON DELETE CASCADE est utilisée pour garantir que si un prospect est supprimé, toutes les entrées associées dans ces tables le seront également.
Types de colonnes et Valeurs par défaut :
Les colonnes d'identifiant utilisent le type SERIAL pour une génération automatique. Les colonnes temporelles (date_creation, date_mise_a_jour, etc.) utilisent la valeur par défaut CURRENT_TIMESTAMP.
Évolutivité :
Si vous décidez ultérieurement d'introduire des types plus structurés (par exemple, un ENUM pour le statut des tâches ou utiliser des colonnes JSON pour stocker des informations complexes), ces définitions peuvent être modifiées pour améliorer la robustesse de votre base de données.
Cette approche vous permet d'avoir une base de données cohérente et bien structurée, prête à être utilisée avec Supabase pour votre application de gestion de prospects et entreprises.

### Configuration de Netlify

1. Déployez le dossier `client` comme site statique sur Netlify.
2. Placez le dossier `netlify/functions` à la racine (ou configurez le dossier de fonctions dans les paramètres Netlify).
3. Définissez dans les variables d’environnement Netlify les clés suivantes :

   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Installation

1. Clonez le dépôt, puis lancez :

   ```bash
   npm install
   ```

2. Pour le développement local, utilisez [Netlify CLI](https://docs.netlify.com/cli/get-started/) :

   ```bash
  netlify dev 
   ```

Cela lancera simultanément l’application front-end et les fonctions Netlify.
