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

> Si vous désirez une amélioration de l'intégration, vous pouvez naturellement nous en faire une proposition ici (une Pull Request), ou [motiver votre demande](https://github.com/datagir/nosgestesclimat-site/issues/new) si vous n'êtes pas familier techniquement avec notre plateforme.

Voici une page HTML complète de démo :

-   ce que ça rend [ici](https://nosgestesclimat.fr/demo-iframe.html)
-   le code HTML [ici](https://github.com/datagir/nosgestesclimat-site/blob/master/dist/demo-iframe.html)

### Récupérer les données de simulation

En ajoutant simplement le paramètre `data-share-data=true` au script HTML, un message sera affiché à l'utilisateur lorsqu'il arrive sur [l'écran de fin de simulation](https://nosgestesclimat.fr/fin?details=a2.87t2.59l2.19s1.11d0.64n8.22) pour lui demander s'il veut bien partager ses données de fin de simulation (seule l'empreinte des grandes catégories de consommation sera partagée : alimentation, transport etc.) au site qui héberge l'iframe.

Et de votre côté, comment récupérer les données ? Voici [un exemple](https://codesandbox.io/s/angry-rhodes-hu8ct?file=/src/ngc.js:251-267) d'utilisation de cette fonctionnalité. Il vous faudra forcément coder (un peu).

⚠️ Attention ! Bien que nous vous offrions cette possibilité, la responsabilité du traitement de données est entièrement de votre côté. Conformément à la loi RGPD, vous devez informer l'utilisateur a priori de l'utilisation qui sera faite de ses données.

## C) Utiliser le nouveau mode "enquête"

Pour les besoins d'une enquête, nous avons construit un nouveau parcours utilisateur. Contrairement au mode "sondage" disponible à l'URL nosgestesclimat.fr/groupe, le mode "enquête" permet de collecter les résultats des tests Nos Gestes Climat d'une cohorte d'individus sans que ces individus ne puissent voir le résultat des autres. 

Il permet donc une meilleure neutralité de la captation des résultats, mais au prix d'une perte totale d'intéractivité de l'expérience, la force du mode groupe. 

Concrètement : 
- sur votre site, abc.xyz, vous créez une session pour un utilisateur. Vous l'identifiez, couramment via l'inscription par email. Si vous avez déjà un compte utilisateur, c'est tout bon. Pour chaque utilisateur, vous devez disposer d'un identifiant unique, long (donc sécurisé) et secret (seuls vous et l'utilisateur le connaissent). C'est typiquement quelque chose qu'on appelle l'[UUID](https://fr.wikipedia.org/wiki/Universally_unique_identifier). Nous l'appellerons [UUID].
- vous informez l'utilisateur des aspects vie privée de cette enquête. Notamment, que nosgestesclimat.fr lui fera passer le test, et sockera ses données, et vous y donnera accès, CF notre page https://nosgestesclimat.fr/vie-privée
- vous générez un lien vers nosgestesclimat.fr/enquête/[UUID]. L'utilisateur y accède. Il fait son test, dans un mode de simulation qui diffèrent légèrement du mode public de Nos Gestes Climat. Par exemple, le bouton "Retour" n'est pas disponible : une réponse donnée est une réponse donnée. 
- toutes les 5 secondes, les informations saisies par l'utilisateur sont sockées dans notre base de données, identifiées et publiquement accessibles pour toute personne ayant l'UUID. C'est à l'adresse https://nosgestesclimat.osc-fr1.scalingo.io/simulation/[UUID] que ces données sont accessibles. Par exemple, https://nosgestesclimat.osc-fr1.scalingo.io/simulation/123 (un utilisateur factice à l'id **bien trop simple donc non sécurisé**). 
- seuls vous, qui détenez la liste des UUID pertinents, pourrez aller récupérer les données de vos utilisateurs. Vous êtes en autonomie là-dessus. 
- vous êtes responsables de récupérer les données utilisateur rapidement. Nous nous donnons le droit d'effacer cette base de donnée de façon mensuelle. C'est un mode à considérer comme une enquête, pas comme un compte utilisateur permanent
- si vous avez des questions, n'hésitez pas à nous les poser sur ce dépôt github dans la partie issues : nous pourrons clarifier des points et améliorer certains problèmes éventuels. 
