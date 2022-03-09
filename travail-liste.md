voiture:
type: liste

# [{}, {}...] plutôt que {}

voiture . consommation:
question: Quelle conso ?
unité: l/100km

voiture . km:
question: Combien de km faits avec cette voiture ?
unité: km

voiture . km nets:
formule: km / voyageurs

voiture . voyageurs:
unité: personnes
question: Combien de voyageurs en moyenne pour ce trajet ?

type liste:
description: |
Le type liste pourrait simplement être décidé par le client de publicodes dans sa façon de
renseigner les données dans la situation.

    voiture:
      - consommation: 8 l/100km
        km: 400 km
        voyageurs: 4
      - consommation: 6 l/100km
        km: 600 km
        voyageurs: 2

    En voyant cette situation, publicodes comprendrait tout seul qu'on a décidé d'en faire une liste.

    En conséquence, toutes les variables d'un modèle pourraient être transformées à volonté en liste.

    La question finalement se résume non pas à la définition d'une liste, mais à son utilisation.

    transport = voiture + train

    Et c'est à ce moment là qu'on doit savoir de quelle voiture on parle.

    Si voiture est une liste, par défaut on pourrait simplement utiliser liste-de-voitures[0].

    transport = km voiture total + train

    transport . km voiture total = Somme(voiture . km nets)

    Donc somme serait un nouveau mécanisme.

    Deux problèmes :
      - si la variable qui somme un attribut des voitures est rattachée à voiture, problème de poule et d'oeuf.

      Mais on peut l'attacher à `transport`, ou même à `voitures`.


    Il faut décider ce que donne engine.evaluate(voiture . km nets) par défaut : on prend voitures[0].km nets ?
    On définit ça par paramètres de publicodes "par défaut, prend le premier élément d'une liste". On pourrait aussi
    par défaut utiliser la moyenne des valeurs. Ou encore la somme des valeurs. Donc ça fonctionnerait
    en fonction du type de la variable : si c'est une liste de possibilités, la seule solution serait
    soit une erreur, soit la première.

    Si on se dit que le mieux est de sortir une erreur quand on appelle `voiture . km nets`, alors autant
    spécifier dans le code que voiture est un type liste, comme ça c'est clair.

    Une autre solution serait de laisser voiture tel quel, mais de définir dans le modèle une
    variable :

    voitures:
      liste: voiture

    Parlons pratique. On publie un modèle de calcul de km en voiture.

    L'utilisateur 1 de ce modèle décide qu'il n'y a qu'une voiture possible.
    L'utilisateur 2 lui veut dans son questionnaire permettre de renseigner plusieurs voitures.

    Est-ce qu'on rend la syntaxe liste assez flexible pour permettre les deux usages, ou est-ce qu'on
    force l'un des deux usages ?
