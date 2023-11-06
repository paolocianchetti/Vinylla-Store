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

16. Implementato Form di Login

- creato un form per il login
- aggiunti campi per email e password
- aggiunto un bottone di login

17. Implementato MongoDB Database

- creato un mongodb atlas database
- installato mongoose con npm install mongoose
- stabilita connessione al mongodb database nel file server.js

18. Inseriti prodotti di prova nel MongoDB Database

- creato uno Schema per i dischi in vinile
- creata rotta per inserire nuovi dischi
- creata rotta per prelevare i dati dei dischi dal database
- usate queste rotte nel file server.js

19. Creati Utenti di prova

- creato uno schema per gli utenti
- inseriti utenti di prova nel database
- creata rotta per gli utenti

20. Creata API Backend per il Login degli utenti

- creata login api
- installato jsonwebtoken con npm i jsonwebtoken
- definita funzione per la creazione del Token

21. Completata schermata di Login utente

- il token viene salvato nel localStorage e nello Store
- mostrato il nome dell'utente che ha effettuato il login nella navbar con un menu a tendina

22. Implementata pagina per la spedizione del prodotto

- creato un form per input dei dati di spedizione
- i dati di spedizione vengono memorizzati nel localStorage
- dopo l'inserimento dei dati di spedizione l'utente viene indirizzato alla pagina per procedere al pagamento
- quando l'utente clicca sul bottone di Logout i prodotti presenti nel carrello e i dati di spedizione vengono cancellati, per consentire il login di un nuovo utente

23. Creato una nuova pagina per consentire la Registrazione di un nuovo utente

- creati form di input
- creato handler che risponde alla pressione del pulsante di registrazione
- creata rotta lato backend per la registrazione di un nuovo utente nel database remoto

24. Creata nuova pagina per la scelta del metodo di pagamento

- creato form di input
- creato handler per gestire la sottoscrizione del form

25. Creata pagina degli ordini

- vengono mostrati i dischi nel carrello, il metodo di pagamento prescelto e i dati per la spedizione

26. Implementata funzione per la conferma dell'ordine effettuato

- creata una rotta lato backend per la memorizzazione dell'ordine effettuato nel database remoto

27. Creata pagina per mostrare il dettaglio dell'ordine confermato dall'utente

- creata rotta lato backend per gestire la richiesta del dettaglio dell'ordine confermato, attraverso il suo id
- effettuata richiesta lato frontend
- mostrate le informazioni dell'ordine in due colonne

28. Implementazione pagamenti ordini con PayPal

- generato Client Id PayPal
- creata API backend per restituire il Client Id di PayPal
- installato react-paypal-js
- implementati { PayPalScriptProvider }, { usePayPalScriptReducer }
- implementato handler per gestire l'approvazione del pagamento da PayPal
- creata rotta lato backend per salvare l'ordine con i dati di pagamento ricevuti da PayPal nel database remoto

29. Implementata pagina per il riepilogo degli ordini effettuati dall'utente

- creata api lato backend che restituisce la lista degli ordini effettuati
- questa api viene poi usata lato frontend per soddisfare la richiesta

30. Implementata pagina del profilo dell'utente, che consente anche la modifica/aggiornamento dei dati dell'utente stesso

- le informazioni dell'utente che si è loggato vengono prese dallo Store e visualizzate nel form della pagina
- creata una rotta api lato backend per aggiornare i dati dell'utente nel database remoto

31. Pubblicata la web app su un account Heroku che già avevo attivato prima
