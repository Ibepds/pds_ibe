# Dons par carte (Stripe) — mise en place

## Parcours
1. `/donate` : le donateur saisit son **e-mail** → redirigé vers **Stripe Checkout**.
2. Sur Stripe, il **choisit le montant** (montant libre, min 1 €) et paie.
3. Retour sur `/don/merci` : le paiement est **vérifié côté serveur**, puis on propose
   de laisser un **pseudo + message** (ou rester anonyme, sans message).
4. Validation → le don est **enregistré** (serveur, après vérification du paiement)
   et l'utilisateur revient à l'accueil.
5. Une **notification temps réel** apparaît en haut à droite **pour tous les visiteurs**
   connectés (« X a fait un don de Y € » + message éventuel).

## Sécurité
- La clé secrète Stripe n'est utilisée que côté **serveur** (routes `server/api`).
- Le don n'est écrit en base **qu'après vérification** que la session Stripe est `paid`
  (impossible de falsifier un don). Écriture via **Firebase Admin** (contourne les règles
  client, donc `donations` reste en écriture interdite côté client).
- Idempotence : un seul don par session Stripe (`sessionId` stocké sur le document).

## Variables d'environnement (fichier `.env`)
```
NUXT_STRIPE_SECRET_KEY=sk_live_xxx          # ou sk_test_xxx en test
NUXT_FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}   # JSON sur une ligne
```

### Obtenir la clé Stripe
Dashboard Stripe → **Développeurs → Clés API** → copier la **clé secrète**.
Commencez avec la clé **test** (`sk_test_…`) et la carte de test `4242 4242 4242 4242`.

### Obtenir le compte de service Firebase
Console Firebase → **Paramètres du projet → Comptes de service** →
**Générer une nouvelle clé privée** → un fichier JSON est téléchargé.
Mettez son contenu (sur une seule ligne) dans `NUXT_FIREBASE_SERVICE_ACCOUNT`.

## ⚠️ Hébergement
Cette fonctionnalité nécessite un **serveur Node / serverless** (les routes `server/api`
de Nuxt). Hébergeurs compatibles : Vercel, Netlify, Cloud Run, Node自hébergé…
Un hébergement **100% statique** ne peut pas exécuter le paiement (clé secrète).

## Test rapide
1. Renseignez les 2 variables d'env (clé test + compte de service).
2. `npm run dev` → `/donate` → e-mail → payer avec `4242 4242 4242 4242` (date future, CVC quelconque).
3. Laissez un message → retour accueil → la notification doit apparaître.
