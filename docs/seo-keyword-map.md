# Carte des mots-clés SEO — javeabliss.com (vente)

Mise à jour : 13.11.2026. Le site présente l'appartement **à vendre**. La location est en pause
(voir `docs/rental-access.md`). L'ancienne carte « location » (août 2026) reste dans l'historique
git, avant le commit `e7895e8`.

Les mots-clés réellement utilisés dans le code sont dans `shared/seo.ts` (`saleTitles`,
`saleDescriptions`, `saleKeywords`). Si vous changez un mot-clé, changez-le à cet endroit.

## Pages indexables (6)

Une page par langue, toutes avec la même adresse :
`/en/for-sale`, `/fr/for-sale`, `/es/for-sale`, `/de/for-sale`, `/nl/for-sale`, `/it/for-sale`.

Les autres pages (`/admin`, politique de confidentialité, brochures) sont en `noindex`.

## Règles communes

1. **« 250 m de la plage de l'Arenal »** : le détail qui distingue le bien. Garder les mètres exacts.
2. **Chiffres exacts** : 80 m², 2 chambres, 1 salle de bains, 1er étage avec ascenseur.
3. **Accents** : écrire « Jávea » sur la page, et mentionner « Xàbia » une fois. Les internautes
   tapent souvent « javea » sans accent.
4. **Vente entre particuliers** : c'est un besoin recherché. Utiliser les formules locales
   (« de particulier », « sans agence », « van de eigenaar », « von privat »).
5. **Prix** : le prix n'est pas écrit sur la page, seulement dans la brochure et sur Idealista.
   Les moteurs et assistants IA ne peuvent donc pas le citer. Décision à prendre par le propriétaire.

## Mots-clés par langue

| Langue | Principal | Secondaires (déjà dans le code) |
|---|---|---|
| EN | apartment for sale in Jávea | Arenal Beach apartment for sale · second home Costa Blanca · property for sale by owner Jávea |
| FR | appartement à vendre Jávea | appartement Arenal · résidence secondaire Costa Blanca · vente directe propriétaire Jávea |
| ES | apartamento en venta en Jávea | apartamento en el Arenal · segunda residencia Costa Blanca · venta directa propietario Jávea |
| DE | Wohnung kaufen Jávea | Wohnung kaufen Arenal-Strand · Zweitwohnsitz Costa Blanca · Wohnung von privat Jávea |
| NL | appartement te koop in Jávea | appartement Arenal-strand · tweede woning Costa Blanca · appartement te koop van eigenaar Jávea |
| IT | appartamento in vendita a Jávea | appartamento Arenal · seconda casa Costa Blanca · vendita diretta proprietario Jávea |

## Requêtes à surveiller (à vérifier dans Search Console)

- « appartement à vendre Jávea », « apartment for sale Jávea », « piso en venta Jávea »,
  « Wohnung kaufen Jávea » et leurs variantes avec « Arenal » et « Xàbia ».
- Les requêtes « vente directe / de particulier / van de eigenaar » par langue.

Ces mots-clés n'ont pas été mesurés avec un outil de volume. Ils restent à vérifier dans Search Console.

## Vérification technique

- `robots.txt` autorise Googlebot, Bing, ChatGPT (OAI-SearchBot, ChatGPT-User, GPTBot), Claude
  (ClaudeBot, Claude-SearchBot, Claude-User) et Google-Extended.
- `sitemap.xml` ne liste que les 6 pages de vente.
- `/` : les robots de recherche et d'IA sont redirigés en 301 vers `/en/for-sale`. Les navigateurs
  sont redirigés selon leur langue (302). La sonde de santé de déploiement reçoit toujours « OK ».
- Les anciennes adresses de location redirigent en **301** vers la page de vente de la même langue.
  C'est ce qui fait sortir les pages de location de l'index Google et entrer les pages de vente.
- Les anciens liens `?lang=xx` de l'ancien site mènent à la bonne langue.
