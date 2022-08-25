# Contextualiser un sondage

## Pour quoi faire ?

La contextualisation d'un sondage permet de sauvegarder des informations supplémentaires à la simulation classique : chaque sondé se voit poser quelques questions avant d'accéder à son test.

Ainsi, une organisation peut envoyer un seul lien de sondage et receuillir des informations différenciant les utilisateurs (des questions qui ne sont pas liées au test Nos Gestes Climat : par exemple leur âge, leur métier, etc. ou bien un sous-groupe).

Pour le moment les éléments de contexte sont dispnibles dans le CSV téléchargé (pas de filtre possible sur l'écran de visualisation).

> ⚠️ Les questions ne doivent pas permettre d'identifier les utilisateurs ! On ne demandera pas l'identité des personnes ni même leur adresse mail ! Il faut également rappeler que les réponses sont accessibles à toutes les personnes disposant du lien du sondage, il faut donc veiller à bien respecter les règles de RGPD.

![Exemple contexte](/images/exemple-contexte.png)

## Comment ajouter cette fonctionnalité à mon sondage ?

Les "contextes" de sondage sont publiés via le serveur Nos Gestes Climat, dans le dossier [/contextes-sondage](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage).

Les questions sont écrites dans le langage [publicodes](https://publi.codes/) au format 'yaml'.

**Nous avons fait le choix de garder la main sur les contextes de sondage publiés, l'équipe Datagir joue donc un rôle d'administrateur et vous accompagne pour créer votre contexte et le publier pour votre sondage.**

Un [template](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte) vous permet d'écrire votre propre formulaire de contexte. Vous pouvez également vous aider du [bac à sable publicodes](https://vu.fr/szYP). N'hésitez pas à nous contacter avec une première ébauche pour contextualiser votre sondage ! Attention, **le nom du fichier créé doit être différent du nom du nom envisagé pour le sondage** (cf point suivant).

## Et d'un point de vue tech ?

Les règles de sondage sont chargées depuis le serveur au moment ou l'utilisateur accède à un sondage présentant un contexte. Afin d'éviter de rendre public tous les URLs de sondage avec contexte, le nom du fichier de contexte est différent du nom du sondage. Le nom du fichier est attribué via l'administration de la base de données directement. Seuls les sondages auxquels un contexte est rattaché proposent des questions supplémentaires, rien ne change pour les autres sondages.
