# Notifications e-mail du formulaire de contact

Le formulaire de contact enregistre chaque message dans Firestore (`contacts`,
consultable dans l'admin) **et** dépose un document dans la collection `mail`.
L'extension Firebase **Trigger Email from Firestore** détecte ce document et
envoie un e-mail à **alizee.grosjean@pdsrecords.com**.

## 1. Prérequis : un compte SMTP

Il faut un fournisseur capable d'envoyer des e-mails en SMTP, par exemple :

- **Google Workspace / Gmail** (`smtp.gmail.com:465`) — créer un *mot de passe
  d'application* si la double authentification est active.
- **OVH** (`ssl0.ovh.net:465`)
- **SendGrid / Mailgun / Brevo** (SMTP dédié, recommandé pour la délivrabilité)

Notez : l'hôte SMTP, le port, l'identifiant et le mot de passe.

## 2. Installer l'extension (méthode simple : console Firebase)

1. Ouvrez la console Firebase → **Extensions** → **Explorer le catalogue**.
2. Cherchez **« Trigger Email from Firestore »** (éditeur : Firebase) → **Installer**.
3. Renseignez les paramètres :
   | Paramètre | Valeur |
   |---|---|
   | Cloud Functions location | la région de votre projet (ex. `europe-west1`) |
   | SMTP connection URI | `smtps://IDENTIFIANT@smtp.host.com:465` |
   | SMTP password | *(votre mot de passe SMTP — saisi en secret)* |
   | Email documents collection | `mail` |
   | Default FROM address | `PDS Humanity <noreply@pdsrecords.com>` |
   | Default REPLY-TO address | `alizee.grosjean@pdsrecords.com` |
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
