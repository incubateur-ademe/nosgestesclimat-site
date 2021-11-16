# Comment personnaliser Nos Gestes Climat pour vos besoins

> En bref, deux possibilités s'offrent à vous :
>
> -   A) forker le code -> prévoir plusieurs semaines de temps de développement d'un développeur Web
> -   B) intégrer notre iframe personnalisé -> 15 minutes d'effort d'une personne qui touche au Web

## A) Forker

L'ensemble du code du projet est libre, sous licence MIT : vous êtes donc libres de le reprendre à votre guise, tant que vous mentionnez l'origine du projet.

Nous vous proposons de placer ce paragraphe sur la page d'accueil de votre site.

> Cette déclinaison s'appuie librement sur la version officielle de Nos Gestes Climat développée par [Datagir (ADEME)](datagir.ademe.fr) et l'[ABC](https://associationbilancarbone.fr).

⚠️ Attention ! Si vous décidez de forker notre code, vous devez enlever toute mention de la marque Nos Gestes Climat, ainsi que les formulaires de contact et de retour de bugs qui pointent vers nos domaines.

En effet, nosgestesclimat.fr est activement développé, nous ne pouvons nous permettre que les citoyens aient accès à plusieurs versions désynchronisées de l'outil, à la fois en termes de modèle d'empreinte climat que d'interface utilisateur.

**Sauf accord explicite, les logos ADEME, ABC, Datagir, Nos Gestes Climat, doivent être enlevés par vos soins de votre version du code.**

## B) Intégrer notre iframe personnalisé

L'énorme avantage de cette solution est de recevoir automatiquement les mises à jour de la plateforme, sans aucun effort. Cela permet donc de garder la marque NGC.

```html
<script
    id="nosgestesclimat"
    src="https://nosgestesclimat.fr/iframe.js"
></script>
```

L'inconvénient, c'est que vous ne pourrez pas facilement personnaliser le contenu de l'iframe.

Cela dit, si vous désirez afficher votre marque aux côtés du logo NGC, vous pouvez le faire en ajoutant quelques paramètres au script d'intégration.

Exemple ici avec une intégration "ADEME".

```html
<script
    id="nosgestesclimat"
    src="/iframe.js"
    data-integrator-action-url="https://ademe.fr"
    data-integrator-logo="https://www.ademe.fr/sites/default/files/logoademe2020_rvb.png"
    data-integrator-name="ADEME"
    data-integrator-action-text="Passer à l'action avec l'ADEME"
    data-integrator-youtube-video="https://www.youtube.com/watch?v=NfaeoCORuzk"
></script>
```

Le logo et le nom sont affichés en en-tête du simulateur aux côtés de NGC. Le reste est utilisé pour personnaliser la page de fin de simulation.

> Si vous désirez une amélioration de l'intégration, vous pouvez naturellement nous en faire une proposition ici (une Pull Request), ou [motiver votre demande](https://github.com/datagir/nosgestesclimat-site/issues/new) si vous n'êtes pas familier techniquement avec notre plateforme.

Voici une page HTML complète de démo :

-   ce que ça rend [ici](https://nosgestesclimat.fr/demo-iframe.html)
-   le code HTML [ici](https://github.com/datagir/nosgestesclimat-site/blob/master/dist/demo-iframe.html)

### Récupérer les données de simulation

En ajoutant simplement le paramètre `data-share-data=true` au script HTML, un message sera affiché à l'utilisateur pour lui demander s'il veut bien partager ses données de fin de simulation (seule l'empreintedes grandes catégories de consommation sera partagée : alimentation, transport etc.) au site qui héberge l'iframe.

Voici [un exemple](https://codesandbox.io/s/angry-rhodes-hu8ct?file=/src/ngc.js:251-267) d'utilisation de cette fonctionnalité.

⚠️ Attention ! Bien que nous vous offrions cette possibilité, la responsabilité du traitement de données est entièrement de votre côté. Conformément à la loi RGPD, vous devez informer l'utilisateur a priori de l'utilisation qui sera faite de ses données.
