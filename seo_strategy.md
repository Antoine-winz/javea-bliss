# Stratégie SEO — javeabliss.com (vente)

Mise à jour : 13.11.2026. Le site sert **uniquement à vendre** l'appartement.
La période de location est terminée. L'ancienne stratégie « location » est dans
l'historique git, avant le commit qui l'a retirée.

## Pages indexables (les seules)

`/en/for-sale`, `/fr/for-sale`, `/es/for-sale`, `/de/for-sale`, `/nl/for-sale`,
`/it/for-sale`. Une page par langue, même contenu, liées entre elles par hreflang.

## Hors périmètre

- `/admin`, les politiques de confidentialité, les brochures, les codes de
  vérification et les statistiques : tous en `noindex`.
- Les anciennes pages de location (accueils par langue, guides, recommandations,
  promotions, flyers) : redirigées en **301** vers la page de vente de la même langue.

## Public visé

- Acheteurs d'une résidence secondaire sur la Costa Blanca (UK, NL, BE, DE, CH, FR, IT, ES).
- Acheteurs qui cherchent une vente de particulier à particulier, sans agence.
- Agences immobilières qui cherchent un bien à présenter (collaboration sans exclusivité).

## Mots-clés principaux

Un par langue, au plus près de ce que les gens tapent. La liste complète, celle
réellement utilisée par le code, est dans `shared/seo.ts` (`saleKeywords`) et
commentée dans `docs/seo-keyword-map.md`.

- EN : apartment for sale in Jávea / Xàbia, Arenal Beach apartment for sale
- FR : appartement à vendre à Jávea, résidence secondaire Costa Blanca
- ES : apartamento en venta en Jávea, piso en venta en Xàbia
- DE : Wohnung kaufen Jávea, Zweitwohnsitz Costa Blanca
- NL : appartement te koop in Jávea, tweede woning Costa Blanca
- IT : appartamento in vendita a Jávea, seconda casa Costa Blanca

## Données structurées

`Apartment` + `RealEstateListing`, avec `businessFunction: Sell`. Les faits
déclarés : 80 m², 2 chambres, 1 salle de bains, 1er étage avec ascenseur, balcon,
climatisation, Jávea / Xàbia (Alicante, ES).

Le balisage `LodgingBusiness` a été retiré : il annonçait à Google un hébergement
de vacances. Il ne doit pas revenir tant que le bien est à vendre.

## Pas de prix sur la page

Le prix n'est écrit ni dans la page ni dans les données structurées : il est dans
la brochure et sur Idealista. Conséquence assumée : Google et les assistants IA ne
peuvent pas citer de prix, et la page ne peut pas apparaître dans les résultats
filtrés par prix. À rediscuter avec le propriétaire.

## Fichiers de découverte

`client/public/robots.txt`, `client/public/sitemap.xml` (6 URL),
`client/public/llms.txt`. Ils autorisent explicitement Google, Bing, ChatGPT
(GPTBot, OAI-SearchBot, ChatGPT-User) et Claude (ClaudeBot, Claude-SearchBot,
Claude-User).

## Vérification

`node scripts/seo-audit.mjs` sur un serveur local, et `npm test` pour les tests
de `shared/seo.ts` et `server/site-access.ts`.
