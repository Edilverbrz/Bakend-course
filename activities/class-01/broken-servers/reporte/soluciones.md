# Reporte de falla/Comportamiento/solucion 

#### fault-1.js ####

# hipotesis/comportaminedo observado:
En fault-1.js. se quedaba esperando la respuesta al momento de solicitar la ruta de "/health"

# Causa encontrada / Evidencia:
if (request.url === '/health') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return;
  }
En el bloque de la lineas de la 17 a la 21. faltaba la liena "response.end"

# Modificaciones realizadas / Resulyados obtenidos:
se le agregro la linea "response.end('OK');" para que al momento de buscar la ruta del health diera el mensaje y no quedara cargando.

#### fault-2.js ####

# Comportamiento: 
La pagina daba error al momento de colocar la ruta /health. daba error 404.

# Hipotesis inicial:
La hipotesis inicial que tenia era que habia algun error de ruta ya que se colocaba la direcion y redirigia a la misma solicitada 

# Evidencia revisada: 
Se reviso el bloque de codigo del /health y se encomtro un error de sistaxis en la liena 17.

# Causante:
Un error de sistaxis en la palabra /health. estab escrito "/helth" esos hacia que el codigo no encontrara la url correcta.

# Modificaciones:
if (request.url === '/health')  // se modifico la ruta de /health para que devuelva 200 OK en lugar de 404 Not found. 

# Resultado: 
el esprado. La pagina mando a la direccion correcta.

# Explicacion:
El porgramador tuvo un error de sitaxis y no se dio cuneta que escribio la la direccion de la url /health.

### fault-3.js ###

# Comportamiiento:
la pagina tiene error de puesto.
Error: listen EADDRINUSE: address already in use :::3001
    at Server.setupListenHandle [as _listen2] (node:net:2008:16)
    at listenInCluster (node:net:2065:12)
    at Server.listen (node:net:2170:7)
    at Object.<anonymous> (C:\Users\Usuario\Downloads\broken-servers\broken-servers\fault-3.js:40:8)
    at Module._compile (node:internal/modules/cjs/loader:1830:14)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:1355:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:2044:8)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  code: 'EADDRINUSE',
  errno: -4091,
  syscall: 'listen',
  address: '::',
  port: 3001
}

Node.js v24.15.0

# Hiportesis:
al pricipio del codigo se puede ver claramente el error del puerto el cual el puerto colocado es 3001 y el puerto en el que se esta trabajndo es 3000.

# Evidencia/modificaciones:
const PORT = 3001; // se modifo el puerto de 3001 a 3000 para que el navegador pueda conectarse al servidor en http://localhost:3000.

# Causante: 
otro error de sistaxis en el porgramador asignado para la tarea al colocar el puerto 3001 cuando se esta trabajando en el puerto 3000.

# Resultado:
el enlace correcto de los puertos.

# Explicacion:
el codigo tenia errror de puerto al haber en la linea de server.listen el puerto 3000 y en la liena 3 colocar "consta PORT = 3001" creo un error de coneccion entre ambos puertos. 


### fault-4.js ###

# Comportamiento observado: 
al momento de dirigirse al url de api/info no reconocia al fomato de pakage JSON. 

# Hipotesis inicial:
Problemas de sistaxis en las url. ya que se pensaba que habia mezcla de direcciones 

# Evidecia.
los tres bloque de direcciones de "/" "/health" "api/info" a primera vista se veian escrito de buena manera. 

# Causante/Modificaciones.
 if (request.url === '/api/info') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({
      name: 'support-server',
      version: '1.0.0',
      routes: ['/', '/health', '/api/info']
    }));  // el metodo nativo JSON.stringify() convierte un objeto JavaScript en una cadena JSON, que es el formato correcto para enviar datos JSON en la respuesta HTTP.
    return;
  }
Corrección en la ruta /api/info:
Se ajustó la respuesta para entregar un formato JSON válido. Se utilizó el método nativo JSON.stringify() para serializar el objeto de JavaScript a una cadena de texto JSON y se definió el encabezado Content-Type: application/json.

# Resultados: 
El resultado fue el esperado. la direccion url de "api/info" reconocion correctamente el metodo nativo JSON.stringify.

# Explicacion: 
al agregaler el metodo nativo de JSON.stringify y redactar bien el bloque JSON se puedo solucionar y hacer que la paguina reconociera el formato Json correctamente. 

### fault-5.js ###

# Comportamiento: 
al colocar url como api/info o /health. mandan a la mima direccion de "/". 

# Hipotesis: 
Problemas con la direccion url. 

# Evidencia / Causante 
la evidencia demostro que mi hipotesis esta errada. el porblema provenia de un problema al asignarle signo igual (=), que asigna un valor, en lugar de la comparación estricta (===).
if (request.url="/") 

# Modifiacion:
if (request.url ==="/") // se cambio el valor "=" por "===" para que sea una comparacion estricta.

# Resultados / explicacion:
al asignarle la comparacion estricta (===) impidiendo que el operador = asignara '/' a todas las peticiones y desbloqueando la evaluación de las demás rutas.
 

 ### fault-6 ###

 # Comportamiento: 
 El servidor no inicia y el proceso de Node.js se cierra de forma inmediata justo después de ejecutar el archivo.

 # Hipotesis:
 Ocurre una excepción no capturada (ReferenceError) durante la inicialización del servidor debido al uso de una variable no declarada.

 # Evidencia: 
 Al examinar el código se observan las siguientes líneas:
En la línea 5 se declara la constante: const PORT = 3000;
En la línea 35 se intenta arrancar el servidor usando: server.listen(SERVER_PORT, ...)
Al ejecutar el script, Node.js lanza el error ReferenceError: SERVER_PORT is not defined y detiene la ejecución inmediatamente.

# Causa: 
Existe una discrepancia en el nombre de la variable del puerto. Se definió la constante PORT, pero al invocar el método server.listen() se pasó SERVER_PORT, la cual no existe en el scope del script.

# Modificacion:
Se corrige la variable pasada a server.listen() reemplazando SERVER_PORT por PORT.

# Resultados: 
El proceso de Node.js ya no se cierra. El servidor HTTP se inicia exitosamente en el puerto 3000 y permanece escuchando y respondiendo peticiones entrantes en las rutas definidas.

# Explicacion: 
El problema se debía a un error tipográfico en el nombre de la variable que especifica el puerto. En JavaScript, intentar acceder a una variable que nunca fue declarada provoca que el entorno lance un error grave y termine el proceso de inmediato. Al reemplazar SERVER_PORT por la variable correcta PORT, Node.js logra vincular el servidor al puerto 3000 y mantiene el bucle de eventos (event loop) activo para procesar las solicitudes HTTP.

