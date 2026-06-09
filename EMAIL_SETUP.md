# Notifications e-mail du formulaire de contact

Le formulaire de contact enregistre chaque message dans Firestore (`contacts`,
consultable dans l'admin) **et** dépose un document dans la collection `mail`.
L'extension Firebase **Trigger Email from Firestore** détecte ce document et
envoie un e-mail à **alizee.grosjean@pdsrecords.com**.

## 1. Prérequis : un compte SMTP (SendGrid recommandé)

### Configurer SendGrid

1. Créez un compte sur https://sendgrid.com (gratuit : 100 e-mails/jour).
2. **Authentifiez l'expéditeur** (obligatoire) — Settings → *Sender Authentication* :
   - **Single Sender** (rapide) : vérifiez une adresse (ex. `noreply@pdsrecords.com`)
     via le lien reçu par e-mail.
   - **Domain Authentication** (recommandé) : ajoutez les CNAME fournis au DNS de
     `pdsrecords.com` ; toute adresse `@pdsrecords.com` devient alors expéditrice.
3. **Créez une clé API** — Settings → *API Keys* → *Create API Key* → permission
   **Mail Send**. Copiez la clé `SG.xxxxx` (affichée une seule fois).

Identifiants SMTP SendGrid à utiliser ensuite :

| Champ | Valeur |
|---|---|
| Hôte | `smtp.sendgrid.net` |
| Port | `465` |
| Identifiant | `apikey` (mot littéral) |
| Mot de passe | votre clé API `SG.xxxxx` |

## 2. Installer l'extension (méthode simple : console Firebase)

1. Ouvrez la console Firebase → **Extensions** → **Explorer le catalogue**.
2. Cherchez **« Trigger Email from Firestore »** (éditeur : Firebase) → **Installer**.
3. Renseignez les paramètres (valeurs SendGrid) :
   | Paramètre | Valeur |
   |---|---|
   | Cloud Functions location | `europe-west1` |
   | SMTP connection URI | `smtps://apikey@smtp.sendgrid.net:465` |
   | SMTP password | *(votre clé API SendGrid `SG.xxxxx` — saisie en secret)* |
   | Email documents collection | `mail` |
   | Default FROM address | `PDS Humanity <noreply@pdsrecords.com>` *(expéditeur vérifié)* |
   | Default REPLY-TO address | `alizee.grosjean@pdsrecords.com` |

   ⚠️ Le **FROM** doit correspondre exactement à l'expéditeur vérifié dans
   SendGrid, sinon erreur `The from address does not match a verified Sender Identity`.
4. Validez l'installation (quelques minutes).

## 3. (Alternative) Installer via la CLI

```bash
firebase ext:install firebase/firestore-send-email --project=VOTRE_PROJET
```

La CLI génère `extensions/firestore-send-email.env`. Un modèle est fourni dans
`extensions/firestore-send-email.env.example` — copiez-le et complétez-le, puis :

```bash
firebase deploy --only extensions
```

## 4. Déployer les règles Firestore

Les règles autorisent la création publique dans `mail` **uniquement** vers
l'adresse de l'équipe (anti-spam) :

```bash
firebase deploy --only firestore:rules
```

## 5. Tester

1. Allez sur la page **/contact** du site et envoyez un message de test.
2. Vérifiez la réception sur **alizee.grosjean@pdsrecords.com**.
3. En cas de problème, ouvrez le document créé dans la collection `mail` :
   l'extension y ajoute un champ `delivery` avec l'état d'envoi et l'erreur
   éventuelle. Consultez aussi les logs de l'extension dans la console.

## Notes

- Si l'extension n'est pas installée, le site continue de fonctionner : le
  message reste enregistré dans `contacts` et visible dans l'admin (l'échec
  d'écriture e-mail est silencieux côté visiteur).
- Pour changer l'adresse destinataire, modifiez `TEAM_EMAIL` dans
  `pages/contact.vue` **et** l'adresse autorisée dans `firestore.rules`
  (règle `match /mail/...`).
