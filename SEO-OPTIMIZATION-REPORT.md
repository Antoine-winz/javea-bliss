# Rapport SEO — passage en mode vente

**Date** : 13.11.2026
**Projet** : Jávea Bliss — appartement à vendre à Jávea (Xàbia), Alicante

Ce document remplace le rapport d'août 2025, qui décrivait le SEO de la période
location (composants `OptimizedSEOStrategy`, balisage `LodgingBusiness`, SEO
promotionnel dynamique). Il est dans l'historique git.

## Constat de départ (Search Console, 13.11.2026)

| Mesure | Valeur |
|---|---|
| Pages indexées | 11 |
| dont pages de vente | **1** (`/en/for-sale`) |
| dont anciennes URL de location | 10 |
| Pages non indexées | 36 |
| Impressions (3 mois) | 429 |
| Clics (3 mois) | 13 |
| Position moyenne | 17,2 |

Les requêtes qui amenaient des impressions étaient des requêtes de restaurants
(« la bambula javea » : 57 impressions, « chabada javea », « restaurantes javea »),
servies par les anciennes pages `/recommendations`. Une seule requête d'achat
apparaissait : « apartamentos en la playa con terraza en jávea », 3 impressions.

## Cause

Les anciennes URL de location répondaient **302 (temporaire)**. Google comprend
« reviens plus tard, l'ancienne adresse reste la bonne » : il garde les pages de
location dans son index et n'indexe pas les pages de vente, qui lui semblent être
une version provisoire. D'où 10 pages de location indexées contre 1 page de vente.

## Corrections appliquées

1. **301 au lieu de 302** pour toutes les anciennes URL de location
   (`server/site-access.ts`). C'est le changement décisif : Google retire les
   anciennes adresses et transfère leur ancienneté vers la page de vente.
   La racine `/` reste en 302 : sa réponse dépend de la langue du visiteur.
2. **Racine `/` lisible par les robots** (`server/index.ts`). Elle renvoyait le
   mot « OK » (sonde de santé du déploiement) à tout client n'envoyant pas
   `Accept: text/html`, donc à la plupart des robots. Les robots de recherche et
   d'IA reçoivent maintenant un 301 vers `/en/for-sale`.
3. **`www.javeabliss.com` ne répond plus « OK »**. La sonde passait avant la
   redirection `www` → domaine canonique, ce qui créait un second nom de domaine
   servant une page vide. Les 5 erreurs 404 de Search Console sont toutes des
   adresses `www` de l'ancien site.
4. **Anciens liens `?lang=xx` rattrapés** : `/?lang=es` mène à `/es/for-sale`.
5. **SEO de location retiré du code** (`shared/seo.ts`) : titres et descriptions
   de location, neuf pages guides anglaises, balisage `LodgingBusiness`.
6. **`client/index.html`** : canonical, `og:url` et hreflang pointent vers
   `/xx/for-sale` au lieu de `/` et `/xx/`.
7. **`server/rental-content/`** supprimé (ancien sitemap et résumé IA de location,
   avec les tarifs « €130 - €210 per night »).
8. **`sitemap.xml`** : `lastmod` au 13.11.2026, pour demander un nouveau passage.

## Ce qui était déjà correct

- Les 6 pages de vente contiennent tout leur texte dans le HTML, avant JavaScript :
  ChatGPT, Claude et les autres robots les lisent sans exécuter de script.
- `robots.txt` autorise explicitement GPTBot, OAI-SearchBot, ChatGPT-User,
  ClaudeBot, Claude-SearchBot, Claude-User, Googlebot, bingbot et Google-Extended.
- `llms.txt` décrit le bien à la vente.
- Données structurées `Apartment` + `RealEstateListing` avec `businessFunction: Sell`.
- Un seul `<h1>` par page, hreflang réciproques avec `x-default`, pages privées
  en `noindex`.

## À surveiller dans Search Console

- **Pages indexées** : les 6 pages de vente doivent monter, les 10 anciennes
  disparaître. Compter 2 à 6 semaines.
- **« Page avec redirection »** : doit passer de 11 à environ 20, puis se stabiliser.
- **Rapport « Vacation rental »** (menu Améliorations) : doit disparaître quand
  Google aura recrawlé, puisque le balisage `LodgingBusiness` n'est plus servi.
- **Requêtes** : les requêtes de restaurants vont s'éteindre. C'est voulu : elles
  n'amenaient aucun acheteur et aucun clic.

## Limite connue

Le prix ne figure pas sur les pages. Ni Google ni les assistants IA ne peuvent le
citer, et la page ne peut pas ressortir dans une recherche filtrée par budget.
C'est une décision du propriétaire, pas un défaut technique.
