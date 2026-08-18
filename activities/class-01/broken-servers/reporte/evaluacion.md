# 01 Reconstruir el viaje

Estos ocho momentos están desordenados. Numéralos en la casilla según el orden en que realmente ocurren.

El usuario introduce una URL

El navegador crea una petición

La petición se dirige a un puerto

El proceso de Node.js recibe la petición

El programa inspecciona la URL

El programa decide qué respuesta producir

El servidor completa la respuesta

El navegador recibe y presenta el resultado

# 02 Ticket de salida

Cinco preguntas, respuesta breve y con tus propias palabras. Individual.

1¿Qué diferencia esencial existe entre frontend y backend?
  el from es la parte final de una proyecto. es la parte que ve y con la que interactua el cliente o usuario.

2¿Por qué el proceso de Node.js continúa activo después de ejecutar el archivo?
por nque los puertos se mantienen ativos aun asi se alla terminado el porceso.

3 Si el navegador queda esperando indefinidamente, ¿qué revisarías primero?
actualmente ya revisaria si el bloque de codigo de la url tiene la linea del mesaje final o respose.end.

4 Describe con tus propias palabras el recorrido de una petición.
el cliente escribe la peticions, luego el navegador empaqueta esa peticion para enviarla al puerto, node recibe la peticion y revisa la url de la peticion para luego el programa decide que respuesta enviar, el servidor se encarga de mandarla y el navegador recibe y muestra el resultado. 

5¿Qué evidencia usarías para saber si el problema está en el navegador o en el servidor?
en el navegador usaria la consula para saber si los paquetes estan saliendo correctamente mientras que en el servidor veria si esta activo si no se apaga y si mandas los GET. para luego proceder a revisar el codigo. 
