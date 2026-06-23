# Intégration Twitch — Bits/Cheers → site & alertes OBS

Deux fonctionnalités :

1. **Dons Bits/Cheers Twitch → compteur du site** (via webhook EventSub `channel.cheer`)
2. **Alerte à l'écran** quand un don est fait sur le site (overlay OBS)

---

## 1. Overlay d'alertes OBS (site → écran) — aucun identifiant requis

Dans OBS : **Sources → + → Source navigateur**, puis URL :

```
https://pdshumanity.com/overlay/alertes
```

- Largeur 1920 × Hauteur 1080, fond transparent (géré par la page).
- À chaque don enregistré sur le site (Stripe **ou** Twitch), une alerte animée « 💙 X a donné Y € » apparaît ~7,5 s.
- La page écoute Firestore en temps réel : rien d'autre à configurer.

---

## 2. Dons Bits/Cheers → site (Twitch EventSub)

### a) Créer une application Twitch
1. https://dev.twitch.tv/console/apps → **Register Your Application**
2. OAuth Redirect URL : `https://pdshumanity.com` (peu importe, non utilisé par le webhook)
3. Note le **Client ID** et génère un **Client Secret**.

### b) Variables d'environnement (Netlify → Site settings → Environment variables)

| Variable | Valeur |
|---|---|
| `NUXT_TWITCH_EVENTSUB_SECRET` | un secret aléatoire (10–100 caractères) que tu choisis |
| `NUXT_BITS_TO_EUR` | valeur d'un bit en € (défaut `0.01`) |

> Le webhook reçoit les events à l'URL : `https://pdshumanity.com/api/twitch/eventsub`

### c) Autoriser le scope `bits:read` (une fois)
Le broadcaster (la chaîne PDS) doit autoriser l'app avec le scope `bits:read`.
Le plus simple : **Twitch CLI** (https://dev.twitch.tv/docs/cli/) :

```bash
twitch configure              # entre Client ID + Secret
twitch token -u -s 'bits:read'   # connexion du compte de la chaîne → génère un user token
```

### d) Créer l'abonnement EventSub `channel.cheer`
Récupère l'ID de la chaîne :
```bash
twitch api get users -q login=NOM_DE_LA_CHAINE       # -> "id"
```
Puis crée l'abonnement (transport = webhook) :
```bash
twitch event subscribe channel.cheer \
  -F https://pdshumanity.com/api/twitch/eventsub \
  -s VOTRE_NUXT_TWITCH_EVENTSUB_SECRET \
  -t webhook \
  -v 1 \
  -b BROADCASTER_USER_ID
```

Twitch envoie d'abord une requête de **vérification** (le webhook répond automatiquement au challenge), puis les Cheers en temps réel.

### e) Conversion
Chaque Cheer crée un don sur le site : `montant = bits × NUXT_BITS_TO_EUR`.
Les dons Twitch apparaissent dans le compteur, le mur « Merci », et déclenchent l'alerte OBS — avec un champ `source: 'twitch'`.

---

## Sécurité
- Le webhook **vérifie la signature HMAC** de Twitch (rejet si invalide) et **dé-doublonne** par identifiant de message.
- Les dons sont écrits côté serveur (Admin SDK) ; aucune écriture cliente possible sur `donations`.

## Tester en local
```bash
twitch event trigger cheer -F http://localhost:3000/api/twitch/eventsub -s VOTRE_SECRET
```
