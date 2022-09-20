# Contestualizzare un'indagine

## Per cosa?

La contestualizzazione di un sondaggio consente di salvare ulteriori informazioni
alla simulazione classica: ad ogni intervistato vengono poste alcune domande prima di
domande prima di accedere al test.

In questo modo, un'organizzazione può inviare un singolo link di indagine e ricevere
informazioni che differenziano gli utenti (domande che non sono legate alla
relativi al test "La nostra azione per il clima": ad esempio, l'età, l'occupazione, ecc.
un sottogruppo).

Per il momento, gli elementi contestuali sono disponibili nel CSV scaricato
(non è possibile filtrare sullo schermo di visualizzazione).

&gt; Le domande non devono permettere di identificare gli utenti! Su
&gt; Non chiederete l'identità delle persone e nemmeno il loro indirizzo e-mail! Va inoltre ricordato che le risposte sono &gt; accessibili a tutti gli utenti.
&gt; È anche importante ricordare che le risposte sono accessibili a tutte le persone.
Si deve anche ricordare che le risposte sono accessibili a tutte le persone &gt; che hanno il link al sondaggio, quindi si deve fare attenzione a rispettare il diritto alla privacy.
&gt; Regole RGPD.

Contesto di esempio](/images/example-context.png)

## Come faccio ad aggiungere questa funzionalità alla mia indagine?

I "contesti" dell'indagine sono pubblicati sul server di Our Climate Action, nella sezione "Il nostro clima".
la cartella
[/contesti d'indagine](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage).

Le domande sono scritte nel formato [publicodes](https://publi.codes/).
in formato "yaml".

**Abbiamo scelto di mantenere il controllo dei contesti del sondaggio pubblicato.
il team di Datagir svolge il ruolo di amministratore e vi aiuta a creare e pubblicare il contesto dell'indagine.
per creare il contesto e pubblicarlo per l'indagine.

A
[template](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte.yaml)
consente di scrivere il proprio modulo contestuale. È inoltre possibile
il [publicodes sandbox] (https://vu.fr/szYP). Non esitate a
contattateci con una prima bozza per contestualizzare la vostra indagine!
Attenzione, **il nome del file creato deve essere diverso da quello del nome previsto
per il sondaggio** (vedi punto successivo).

## E dal punto di vista tecnico?

Le regole del sondaggio vengono caricate dal server nel momento in cui l'utente accede a un sondaggio con un contesto.
l'utente accede a un sondaggio con un contesto. Per evitare
pubblico, il nome del file di contesto è diverso dal nome del sondaggio.
Il file di contesto è diverso dal nome dell'indagine. Il nome del file viene assegnato tramite
l'amministrazione del database direttamente. Solo le indagini che hanno
solo le indagini che hanno un contesto allegato hanno domande aggiuntive, non cambia nulla per
Non cambia nulla per gli altri sondaggi.
