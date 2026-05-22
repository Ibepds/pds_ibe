# Ibé PDS — Événement caritatif

Site web Nuxt 3 pour l'événement caritatif organisé par **Ibé PDS**. Interface publique sombre et énergique, back-office admin via Firebase.

## Stack

- Nuxt 3 + TypeScript + Tailwind CSS
- Firebase Auth, Firestore, Storage
- Pas de backend Node dédié

## Démarrage rapide

```bash
cd ibe-pds
npm install
cp .env.example .env
# Renseigner les clés Firebase dans .env
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Copier `.env.example` vers `.env` :

```
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
```

Sans configuration Firebase, le site fonctionne en **mode démo** avec des données mock.

## Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activer **Authentication** (Email/Password)
3. Créer une base **Firestore** et un bucket **Storage**
4. Déployer les règles :
   - `firestore.rules` → Firestore Rules
   - `storage.rules` → Storage Rules
5. Récupérer la config Web SDK et remplir `.env`

### Créer le premier administrateur

Les écritures Firestore sont réservées aux utilisateurs présents dans la collection `admins`.

1. Dans Firebase Console → **Authentication** → ajouter un utilisateur (email + mot de passe)
2. Copier l'**UID** de cet utilisateur
3. Dans **Firestore** → créer manuellement le document :
   - Collection : `admins`
   - Document ID : `{UID de l'utilisateur}`
   - Champs suggérés : `email` (string), `createdAt` (timestamp)
4. Se connecter sur `/admin/login` avec cet email/mot de passe

> La règle `admins` interdit toute écriture via le client (`allow write: if false`). Seul un ajout manuel (Console ou Admin SDK) est possible.

### Données initiales recommandées

| Collection    | Document ID | Description        |
|---------------|-------------|--------------------|
| `event`       | `main`      | Infos événement    |
| `association` | `main`      | Association        |

Les autres collections (`participants`, `schedule`, `donations`, `faq`) se gèrent depuis l'admin.

## Pages

### Public

- `/` — Accueil
- `/participants` — Liste filtrable
- `/planning` — Planning par jour
- `/association` — Association
- `/donate` — Faire un don
- `/faq` — FAQ

### Admin (authentification requise)

- `/admin/login`
- `/admin` — Dashboard
- `/admin/event` — Événement & compteur
- `/admin/participants` — CRUD participants
- `/admin/planning` — CRUD planning
- `/admin/association` — Édition association
- `/admin/faq` — CRUD FAQ

## Structure des fichiers clés

```
plugins/firebase.client.ts
composables/useFirebase.ts
composables/useAuth.ts
composables/useFirestoreCollection.ts
composables/useEvent.ts
composables/useAdminFirestore.ts
middleware/admin.ts
firestore.rules
storage.rules
utils/mockData.ts
components/          # Composants publics
components/admin/    # Composants admin
pages/               # Pages publiques
pages/admin/         # Pages admin
```

## Build production

```bash
npm run build
npm run preview
```

## Licence

Projet privé — Ibé PDS.
