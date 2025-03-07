# Présentation

Cette template permet à quiconque de prendre une structure propre et organisée pour commencer le développement d'un nouveau bot.

## Comment utiliser cette template

1. Cloner ce repository ou appuyez sur "Use this template"
2. Installez les dépendances avec `npm install`
3. Créez un fichier `.env` à la racine de votre projet avec les informations suivantes:

```.env
#.env
TOKEN=//le_token_de_votre_bot_discord//
CLIENT_ID=//uuid_de_votre_client_discord//
```

4. Lancez le build du bot avec `npm run build` / `npx tsc` --watch pour le lancer en mode démon
5. Lancez le bot avec `npm run start`

### Précisions

Lors du build avec la commande `npm run build`, il est executé :

- npm run format
- npm run lint
- npm run test

Il vous est aussi possible de générer une documentation côté developpeur avec `npm run doc`

## Structure

Voici la structure du projet :

```
dist/ --> Fichiers typescripts compilés
src/ --> Fichiers sources
    handlers/ --> Gestionnaires d'événements
    slashCommands/ --> Commandes slash
    events/ --> Événements Discord
    utils/ --> Fonctions utilitaires
    index.ts --> Fichier principal (launcher)
    types.d.ts --> Définitions de types typescript
test/ --> Tests unitaires des fichiers sources
docs/ --> Documentation auto-généré
.env --> Variables d'environnements
.gitignore --> Fichiers ignorés par Git
.prettierignore --> Fichiers ignorés par Prettier
.prettierrc --> Fichiers de configurations Prettier
eslint.config.mjs --> Fichiers de configurations EsLint
package.json --> Fichier de configurations npm
tsconfig.json --> Fichier de configurations TypeScript
README.md --> Fichier de présentation
```

## Technologies utilisées

- [Discord.js](https://discord.js.org/#/) - La librairie pour interagir avec l'API Discord
- [Node.js](https://nodejs.org/en/) - L'environnement d'exécution JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Une surcouche de javascript, langage de programmation utilisé
- [dotenv](https://www.npmjs.com/package/dotenv) - Pour gérer les variables d'environnement
- [typeDoc](https://typedoc.org/) - Pour générer la documentation du code
- [Prettier](https://prettier.io/) - Pour formater proprement l'ensemble du code
- [EsLint](https://eslint.org/) - Pour analyser et assurer la qualité du code
- [Jest](https://jestjs.io/) - Pour pratiquer des tests unitaires

## Contribution

Les contributions au code seront analysées, n'hésitez pas à faire des pull requests (vers dev) si vous avez la moindre suggestion ou fix de bugs.

## License

Ce projet est sous la licence MIT License - regardez le fichier [LICENSE](LICENSE) pour plus de détails.
