# VINYLLA APP STORE - Capstone Project

# Steps

1. Creazione del boilerplate con Create React App
2. Creato il Repository Git
3. Lista dei Dischi (cartella frontend)
   - creato un array dei prodotti
   - aggiunta immagine di copertina
   - renderizzati i prodotti
   - applicato uno stile ai prodotti (per ora solo in CSS)
4. Aggiunto meccanismo di routing
   - npm i react-router-dom
   - creata una rotta per la pagina Home
   - creata una rotta per la pagina dei prodotti
5. Creato un Server in Node.JS (cartella backend)
   - eseguito npm init nella cartella del backend
   - modificato il package.json set type in "module"
   - aggiunto .js alle imports
   - installato express con npm install express
   - creato file entry point server.js
   - aggiunto un comando di start in backend/server.js
   - importato express
   - aggiunto file data.js contenente i dati di prodotti di prova
   - creata rotta per /api/vinyls
   - restituiti i dati dei prodotti al frontend
6. Fetch dei Prodotti dal Backend
   - impostato proxy nel file package.json per collegare il frontend al backend
   - installato axios con npm install axios
   - implementati useState e useEffect hooks nella pagina Home
7. Gestito lo State con il Reducer Hook
   - definita funzione reducer nella pagina Home
   - installato "use-reducer-logger"
   - aggiornati i dati provenienti dal server
   - acquisito lo State grazie a useReducer al posto di useState
8. Aggiunto React Bootstrap
   - npm install react-bootstrap bootstrap
   - aggiornato file App.js
   - aggiunta sezione footer
9. Creati componenti per il singolo prodotto e per il rating
   - creato componente Product
   - creato componente Rating
   - implementato il componente Rating nel componente Product
10. Creata una pagina di dettaglio per un singolo prodotto

- fetch del prodotto dal backend
- create 3 colonne per la copertina, le informazioni sul disco e l'eventuale possibilità di aggiugere al carrello, solo se il prodotto è disponibile in magazzino

11. Creati componenti per Caricamento e Messaggio all'utente

- creato componente Loading
- uso del componente Spinner di React Bootstrap
- creato componente Message
- creato file errors.js in cui è definita la funzione getError

12. Implementato un Carrello per l'applicazione nella Navbar. Alla pressione del pulsante 'Aggiungi al Carrello' la Navbar mostra un Badge con la quantità del prodotto aggiunta che si incrementa automaticamente

- creato un Context in React per salvare i prodotti nel carrello in uno stato globale che poi sarà usato dagli altri componenti dell'applicazione
- definita un nuovo reducer
- creato uno Store Provider
- implementato un handler che alla pressione del bottone incrementa la quantità presente nel carrello

13. Migliorata la funzione di aggiunta prodotto al carrello

- controllo se il prodotto è già stato aggiunto al carrello
- controllo se quel prodotto è disponibile in magazzino

14. Creata una pagina per il Carrello

- create 2 colonne
- visualizzata la lista dei prodotti
- creata colonna per le azioni possibili per i prodotti nel carrello

15. Aggiornata la pagina del Carrello

- creato handler per incremento/decremento quantità del prodotto
- creato handler per la cancellazione del prodotto
- salvati i prodotti nel carrello nel localStorage
- creato handler per il Checkout
- implementato 'Aggiungi al Carrello' nella Home page
