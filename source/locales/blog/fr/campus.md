# Nos Gestes Climat adapté pour un campus

## Découvrez une version adaptée de _Nos Geste Climat_

### Ne pas réinventer la roue

C’est la vocation de Datagir que de développer des outils en _open source_ qui puissent être repris et diffusés au plus grand nombre. _[Nos Gestes Climat](https://nosgestesclimat.fr/)_ n’échappe pas à cette règle et a été construit en ce sens pour permettre à tous les acteurs qui le souhaitent de s’approprier le [code source](https://github.com/datagir/nosgestesclimat) et adapter l’outil à leur écosystème.

Dans le cadre de leur option-projet, les étudiants de Centrale Nantes se sont attelés à cette tâche et ont repris le simulateur pour en faire une version adaptée à leur campus et ainsi dresser le bilan carbone de l’établissement et des occupants. Une belle démonstration du potentiel de l’open source. Clément Auger, étudiant en Master 2 et membre de l’option-projet « Neutralité Carbone » nous raconte :

### Peux-tu te présenter ?

> Je suis Clément, étudiant en dernière année d’école d’ingénieur. J’ai intégré Centrale Marseille en 2017, avant de partir en césure début 2019. Pendant cette année, j’ai eu l’opportunité d’effectuer deux stages à l’étranger : le premier dans un laboratoire d’océanologie à Hobart en Tasmanie (Australie), le deuxième dans un bureau d’études spécialisé dans la certification de bâtiments durables à Kuala Lumpur (Malaisie). Je suis ensuite parti à Taïwan pour un semestre académique avant d’intégrer en septembre 2021 l’Ecole Centrale de Nantes dans l’option-projet « Neutralité Carbone ».

### Peux-tu nous parler de ton option-projet au sein de l’Ecole Centrale Nantes ?

> L’option « Neutralité Carbone » a été créée en 2019. C’est une option singulière par son mode de fonctionnement « projet ». Cette année, nous étions un groupe de 12 étudiants. L’intégralité de notre année jusqu’en mars était consacrée au projet et des cours spécialement sélectionnés en rapport avec le projet. Nous avons repris la suite du travail des étudiants de l’option de l’an dernier qui ont réalisé le bilan carbone 2018 détaillé de Centrale Nantes ([scopes 1, 2 et 3](https://www.bilans-ges.ademe.fr/fr/accueil/contenu/index/page/categorie/siGras/0)).
>
> Les objectifs généraux du groupe pour l’année 2020-2021 étaient les suivants :
>
> -   Réactualiser le Bilan Carbone 2018
> -   Développer des outils de calcul de [Bilan Carbone](https://www.bilans-ges.ademe.fr/fr/accueil/contenu/index/page/principes/siGras/0) par profil type en école d’ingénieur et des outils de visualisation de trajectoires bas carbone
> -   Sensibiliser les parties prenantes
>
> Dans ce cadre, nous avons travaillé sur une version « Campus » de _Nos Gestes Climat_, déclinaison dont l’objectif est de permettre aux usagers de l’école de simuler leur empreinte carbone dans le cadre de leurs activités professionnelles.

### Pourquoi avez-vous choisi de travailler sur _Nos Gestes Climat_ ?

> En premier lieu, on a été attirés par la clarté des informations autour du simulateur en lui-même, de la [documentation](https://datagir.gitbook.io/documentation/carbone/ateliers-developpeurs-nos-gestes-climat), des [webinaires associés](https://datagir.gitbook.io/documentation/carbone/webinaire-carbone).
>
> Avec du recul, je pense que _Nos Gestes Climat_ présente 3 avantages particulièrement importants :
>
> -   tout d’abord, c’est un outil qui s’inscrit dans une démarche open source. C’est un point fort d’autant plus que le point de départ est aujourd’hui une base solide. Pour un projet comme le nôtre, avec des deadlines courtes, c’était un gain de temps considérable car nous n’avons pas eu à créer un nouvel outil. Entrer dans la démarche du libre était aussi une volonté de notre part car nous voulions partager notre déclinaison pourqu’elle puisse être intégrée facilement dans d’autres écoles.
> -   la simplicité, l’ergonomie, les suggestions sont autant de caractéristiques et fonctionnalités qui rendent l’expérience utilisateur agréable. Proposer un simulateur affichant les questions les unes après les autres à l’écran nous paraissait également important pour gagner en clarté.
> -   le dernier point important est la finalité de la simulation en elle-même qui permet à l’utilisateur de visualiser l’impact carbone d’actions simples et efficaces sur sa propre estimation.

### Avez-vous rencontré des difficultés dans la prise en main et l’adaptation de _Nos Gestes Climat_ ? Si oui, lesquelles ?

> Cette année, le groupe-projet ne comportait pas de profil véritablement développeur. C’était une première difficulté. Néanmoins, cet obstacle est facilement contournable pour travailler sur [le modèle](https://github.com/datagir/nosgestesclimat) puisqu’il est codé via le langage « [publi.codes](https://publi.codes/) »; ce qui nous a permis d’adapter dès le départ des questions simples. Pour entrer dans le [code de l’interface](https://github.com/datagir/nosgestesclimat-site) du simulateur, c’était plus difficile. Nous nous sommes penchés dessus en octobre 2020 alors que la version en ligne était encore une version « bêta ». J’ai donc pris l’initiative de regarder le code de l’interface et j’ai pris le temps de me former au fur et à mesure du développement pour proposer une « vraie » déclinaison à l’échelle de l’école. Concernant la [base carbone](https://www.bilans-ges.ademe.fr/) et les méthodes de calcul, la prise en main était simple car nous étions déjà sensibilisés à l’indicateur carbone et formés grâce aux cours reçus dans le cadre de l’option.

### Quelle(s) amélioration(s) ou nouveauté(s) pensez-vous avoir apporté avec cette déclinaison ?

> Nous avons apporté notre approche académique et professionnelle au modèle du calcul du Bilan Carbone. Notre périmètre d’évaluation étant plus restreint, nous avons proposé une adaptation rendant la simulation plus précise et concise. La solution apportée pour différencier les différents profils d’usagers d’une université est innovante. La démarche complète est détaillée dans un [article scientifique](https://www.mdpi.com/2071-1050/13/8/4315) publié en avril 2021. Cet article présente le simulateur national et l’approche mise en place pour adapter le simulateur au contexte universitaire.

![Article MDPI](https://datagir.ademe.fr/static/6b424c336d6f128b7f14a6db4d2de2b2/4971b/big_cover-sustainability-v13-i8.png)

### Les retombées au sein de Centrale Nantes ont-elles été bonnes ? Y a-t-il eu beaucoup de simulations ? Et donc quel a été l’impact (prise de conscience, actions, etc.)

> La première interaction avec les usagers de Centrale Nantes a eu lieu lors des phases de tests et par l’intermédiaire d’un panel de testeurs représentatifs des profils de l’école. L’accueil était enthousiaste et les ateliers de groupes étaient riches et sources d’importantes améliorations.
>
> Nous sommes actuellement en phase de finalisation. Nous n’avons pas de chiffres précis sur l’utilisation du simulateur. Il est encore peu connu au sein des usagers de l’école. Aujourd’hui, le simulateur est un support d’animation pour certains cours et évènements à Centrale Nantes. L’objectif est d’accentuer les démarches favorisant le déploiement de l’application. La rentrée en septembre 2021 présente un fort enjeu et pourrait être un vrai tremplin pour le simulateur.

### Quelles sont les futures étapes pour l’option-projet ? Et pour le simulateur ? Quelle(s) amélioration(s) aimeriez-vous apporter à votre déclinaison ?

> En ce qui concerne l’option-projet « Neutralité Carbone », le format d’option en tant que tel ne sera pas reconduit en 2021–2022 mais les actions en faveur de la transition écologique de l’école sont plus que jamais présentes dans les cours d’options classiques. Un évènement de clôture de l’option regroupant de nombreux acteurs de _Nos Gestes Climat_ est [disponible ici](https://webtv.ec-nantes.fr/conferences-3/option-nco2-conf-cloture-2021).
>
> Concernant le simulateur « Campus », nous avons en tête de nombreuses perspectives d’amélioration ! La première est le déploiement d’une version anglaise du simulateur pour intégrer tous les étudiants dans la démarche « Neutralité Carbone » de l’école.
>
> Nous avons également mis en place une première fonctionnalité de sauvegarde des résultats des simulations. Le but sera de continuer à développer ce volet pour permettre d’exploiter _Nos Gestes Climat_ comme une source de collecte de données parfois difficiles à recueillir, notamment les habitudes de transport ou encore alimentaires.
>
> Il est aussi envisagé de partager une documentation à destination d’autres écoles et universités afin que la déclinaison « Campus » soit adaptée et personnalisée facilement au sein d’autres organisations.

Pour découvrir la version adaptée de _Nos Gestes Climat_ au campus de Centrale Nantes : [https://ngc-ecn.netlify.app/](https://ngc-ecn.netlify.app/)

Dépôt du code source du modèle : [https://github.com/SustainabilityCN/nosgestesclimat-model-ECN](https://github.com/SustainabilityCN/nosgestesclimat-model-ECN)

Dépôt du code source de l’interface du simulateur : [https://github.com/SustainabilityCN/nosgestesclimat-site-ECN](https://github.com/SustainabilityCN/nosgestesclimat-site-ECN)
