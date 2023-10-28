# VINYLLA APP STORE - Capstone Project

# Steps

1. Creazione del boilerplate con Create React App
2. Creato il Repository Git
3. Lista dei Dischi (cartella frontend)
   1. creato un array dei prodotti
   2. aggiunta immagine di copertina
   3. renderizzati i prodotti
   4. applicato uno stile ai prodotti (per ora solo in CSS)
4. Aggiunto meccanismo di routing
   1. npm i react-router-dom
   2. creata una rotta per la pagina Home
   3. creata una rotta per la pagina dei prodotti
5. Creato un Server in Node.JS (cartella backend)
   1. eseguito npm init nella cartella del backend
   2. modificato il package.json set type in "module"
   3. aggiunto .js alle imports
   4. installato express con npm install express
   5. creato file entry point server.js
   6. aggiunto un comando di start in backend/server.js
   7. importato express
   8. aggiunto file data.js contenente i dati di prodotti di prova
   9. creata rotta per /api/vinyls
   10. restituiti i dati dei prodotti al frontend
6. Fetch dei Prodotti dal Backend
   1. impostato proxy nel file package.json per collegare il frontend al backend
   2. installato axios con npm install axios
   3. implementati useState e useEffect hooks nella pagina Home
