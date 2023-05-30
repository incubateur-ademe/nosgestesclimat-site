# Contextualizar una encuesta

## ¿Cuál es el objetivo?

La contextualización de una encuesta permite guardar información
adicional a la simulación clásica: a cada encuestado se le hacen algunas
preguntas antes de acceder a su prueba.

Así, una organización puede enviar un único enlace de encuesta y recibir
información que diferencie a los usuarios (preguntas que no estén
relacionadas con la prueba de Nuestra Acción por el Clima: por ejemplo,
su edad, su trabajo, etc. o un subgrupo).

Por el momento, los elementos de contexto están disponibles en el CSV
descargado (no es posible filtrar en la pantalla de visualización).

> ⚠️ ¡Las preguntas no deben identificar a los usuarios! No pediremos la
> identidad de las personas, ni siquiera su dirección de correo
> electrónico También es importante recordar que las respuestas son
> accesibles para todos los que tengan el enlace a la encuesta, así que
> asegúrate de cumplir las normas del RGPD.

![Exemple contexte](/images/exemple-contexte.png)

## ¿Cómo puedo añadir esta función a mi encuesta?

Los "contextos" de la encuesta se publican a través del servidor de
Nuestra Acción por el Clima, en la carpeta
[/contextos-encuesta](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage).

Las preguntas están escritas en el lenguaje
[publicodes](https://publi.codes/) en formato 'yaml'.

**Hemos optado por mantener el control de los contextos de encuesta
publicados, por lo que el equipo de Nosgestesclimat desempeña el papel de
administrador y le ayuda a crear su contexto y publicarlo para su
encuesta.**

Una
[plantilla](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte.yaml)
le permite escribir su propio formulario de contexto. También puedes
utilizar el [sandbox de publicodes](https://vu.fr/szYP). No dude en
ponerse en contacto con nosotros con un primer borrador para
contextualizar su encuesta Tenga en cuenta que el **nombre del archivo
creado debe ser diferente del nombre de la encuesta** (véase el punto
siguiente).

## ¿Y desde el punto de vista técnico?

Las reglas de la encuesta se cargan desde el servidor cuando el usuario
accede a una encuesta con un contexto. Para evitar que todas las URL de
las encuestas con contexto sean públicas, el nombre del archivo de
contexto es diferente del nombre de la encuesta. El nombre del archivo
se asigna a través de la administración de la base de datos
directamente. Sólo las encuestas con un contexto adjunto tienen
preguntas adicionales, nada cambia para las demás encuestas.
