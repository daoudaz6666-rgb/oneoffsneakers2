# ONE OFF SNEAKERS — Site de vente de chaussures

Site 100 % JavaScript (aucune installation, aucun serveur obligatoire).

## Ouvrir le site
- **Boutique** : double-cliquez sur `index.html`
- **Espace propriétaire** : `admin.html` (lien « Espace propriétaire » en bas de la boutique)
  - Mot de passe : communiqué séparément au propriétaire → à changer dans **Paramètres** dès la première connexion

Conseil : dans VS Code, l'extension **Live Server** (clic droit > « Open with Live Server ») donne le meilleur résultat.

## Structure
| Fichier | Rôle |
|---|---|
| `index.html`, `js/app.js`, `css/style.css` | Boutique (accueil, catalogue filtrable, marques, fiche produit 5 vues, panier, recherche) |
| `admin.html`, `js/admin.js`, `css/admin.css` | Espace propriétaire |
| `js/data.js` | Catalogue publié (chaussures, marques, paramètres) |
| `js/store.js` | Enregistrement partagé boutique ↔ admin (IndexedDB) |
| `js/shoe-art.js` | Illustrations de secours (5 vues) tant qu'aucune photo n'est importée |

## Gérer les chaussures
1. Admin → **Chaussures** → ✎ sur un modèle (ou « + Nouvelle chaussure »)
2. Importez les **5 photos** : face, profil, dessus, arrière, semelle (glisser-déposer accepté, compression automatique)
3. Modifiez prix, ancien prix (promo), description, pointures, coloris, stock
4. **Enregistrer** → la boutique ouverte dans le même navigateur se met à jour instantanément

## Mettre en ligne pour tous les clients
Les modifications de l'admin sont stockées dans **le navigateur du propriétaire**.
Pour les publier : Admin → **Sauvegarde & publication** → **Exporter data.js**, puis remplacez `js/data.js`
sur l'hébergement (Netlify, GitHub Pages, hébergeur classique…).

Pour une mise à jour en ligne *automatique* sans réupload, il faudra brancher une base de données
(ex. Firebase / Supabase) — `js/store.js` est le seul fichier à adapter.

## Commandes
Le panier envoie la commande sur **WhatsApp** : renseignez le numéro dans Admin → Paramètres.
