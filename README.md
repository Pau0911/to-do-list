 To-do-list
- Esta aplicación permite agregar una lista de tareas , eliminar, editar y asociarles categorías, así como también permite, crear, editar, eliminar categorías.

- Herramientas y versiones
	- node v18.20.2
	- angular 18
	- ionic 7.2.0
- Para correr la aplicación se debe tener instalado ionic
	- npm install -g @ionic/cli
- También es necesario tener cordova
	- npm install -g cordova
- Antes de ejecutar el proyecto es necesario escribir el comando:
	- npm install
- Para ejecutar la aplicación se escribe el siguiente comando:
	- ng serve (http://localhost:4200/tasks)
	-
- Para compilar y ejecutar la aplicación en emuladores de IOS y Android se siguen la siguientes instrucciones:
	- Compilar la aplicación con el comando:
		- ionic build --prod
	- Validar que la app soporta las plataformas con:
		- cordova platform ls (Permite listar las plataformas que soporta)
	- En caso de que no tenga las plataformas agregadas se agregan con los siguientes comandos:
		- ionic cordova platform add android 
		  ionic cordova platform add ios  
		- Los anteriores comandos harán que se agregue una carpeta al proyecto llamada "plantfoms"
	- Una vez agregadas las plataformas se debe validar para el caso de Android  tener instalado el JDK, gradle y el SDK Manager y para IOS cocoapods, Xcode y un simulador.
		- Luego se ejecutan los comandos:
		  cordova run android  
		  cordova run ios