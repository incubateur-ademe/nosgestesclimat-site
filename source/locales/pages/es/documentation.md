# Contextualizar una encuesta

#¿Para qué?

Contextualizar una encuesta permite guardar información adicional
a la simulación clásica: a cada encuestado se le hacen unas preguntas antes de
preguntas antes de acceder a su prueba.

Así, una organización puede enviar un único enlace de encuesta y recibir
información que diferencia a los usuarios (preguntas que no están relacionadas con la
relacionados con la prueba de Nuestra Acción por el Clima: por ejemplo, su edad, ocupación, etc., o una
un subgrupo).

Por el momento, los elementos contextuales están disponibles en el CSV descargado
(no es posible filtrar en la pantalla de visualización).

&gt; ¡Las preguntas no deben permitir la identificación de los usuarios! En
&gt; ¡No pedirás la identidad de las personas ni siquiera su dirección de correo electrónico! También hay que recordar que las respuestas son &gt; accesibles a todos los usuarios.
&gt; También es importante recordar que las respuestas son accesibles para todas las personas
También debe recordar que las respuestas son accesibles a todas las personas &gt; que tengan el enlace a la encuesta, por lo que debe tener cuidado de respetar la
&gt; Normas del RGPD.

Ejemplo de contexto](/images/example-context.png)

## ¿Cómo puedo añadir esta funcionalidad a mi encuesta?

Los "contextos" de la encuesta se publican a través del servidor de Our Climate Action, en el
la carpeta
[/contextos de la encuesta](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage).

Las preguntas están escritas en [publicodes](https://publi.codes/)
en formato 'yaml'.

**Hemos optado por mantener el control de los contextos de las encuestas publicadas.
el equipo de Datagir desempeña el papel de administrador y le ayuda a crear y publicar su contexto de encuesta.
para crear su contexto y publicarlo para su encuesta.

A
[plantilla](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte.yaml)
le permite escribir su propio formulario de contexto. También puede
la [caja de arena de publicodes](https://vu.fr/szYP). No dude en
póngase en contacto con nosotros con un primer borrador para contextualizar su encuesta
Tenga en cuenta que **el nombre del archivo creado debe ser diferente del nombre previsto
para la encuesta** (véase el punto siguiente).

## ¿Y desde el punto de vista técnico?

Las reglas de sondeo se cargan desde el servidor en el momento en que el usuario accede a un sondeo con un contexto.
el usuario accede a una encuesta con un contexto. Para evitar
público, el nombre del archivo de contexto es diferente del nombre del sondeo.
El archivo de contexto es diferente del nombre de la encuesta. El nombre del archivo se asigna a través de
la administración de la base de datos directamente. Sólo las encuestas que tienen
sólo las encuestas que tienen un contexto adjunto tienen preguntas adicionales, nada cambia para
Nada cambia para las otras encuestas.
