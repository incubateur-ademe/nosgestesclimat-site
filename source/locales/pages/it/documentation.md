# Contestualizzare un'indagine

## Qual è lo scopo?

La contestualizzazione di un sondaggio consente di salvare informazioni
aggiuntive rispetto alla simulazione classica: a ogni rispondente
vengono poste alcune domande prima di accedere al proprio test.

In questo modo, un'organizzazione può inviare un unico link al sondaggio
e ricevere informazioni che differenziano gli utenti (domande che non
sono legate al test Our Climate Action: ad esempio, la loro età, il loro
lavoro, ecc. o un sottogruppo).

Per il momento gli elementi di contesto sono disponibili nel CSV
scaricato (non è possibile filtrare sulla schermata di visualizzazione).

> ⚠️ Le domande non devono identificare gli utenti! Non chiederemo
> l'identità delle persone e nemmeno il loro indirizzo e-mail! È inoltre
> importante ricordare che le risposte sono accessibili a tutti coloro
> che hanno il link al sondaggio, quindi assicuratevi di rispettare le
> regole del RGPD.

![Exemple contexte](/images/exemple-contexte.png)

## Come faccio ad aggiungere questa funzione alla mia indagine?

I "contesti" del sondaggio sono pubblicati tramite il server Our Climate
Action, nella cartella
[/contexts-survey](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage).

Le domande sono scritte nel linguaggio
[publicodes](https://publi.codes/) in formato "yaml".

**Abbiamo scelto di mantenere il controllo dei contesti d'indagine
pubblicati, quindi il team Nosgestesclimat svolge il ruolo di amministratore e
vi aiuta a creare il vostro contesto e a pubblicarlo per la vostra
indagine.**

Un
[modello](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte.yaml)
consente di scrivere il proprio modulo contestuale. È anche possibile
utilizzare la [sandbox Publicodes](https://vu.fr/szYP). Non esitate a
contattarci con una prima bozza per contestualizzare il vostro
sondaggio! Si noti che il **nome del file creato deve essere diverso dal
nome dell'indagine** (si veda il punto successivo).

## E dal punto di vista tecnico?

Le regole del sondaggio vengono caricate dal server quando l'utente
accede a un sondaggio con un contesto. Per evitare di rendere pubblici
tutti gli URL delle indagini con il contesto, il nome del file di
contesto è diverso dal nome dell'indagine. Il nome del file viene
assegnato direttamente dall'amministrazione del database. Solo le
indagini con un contesto collegato hanno domande aggiuntive, mentre per
le altre indagini non cambia nulla.
