import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Paolo',
      email: 'paolo.cianchetti@gmail.com',
      password: bcrypt.hashSync('music123456'),
      isAdmin: true,
    },
  ],
  vinyls: [
    {
      title: 'Midnights',
      artist: 'Taylor Swift',
      path: 'midnights-taylor-swift-album',
      cover: '/covers/midnights.jpg',
      genre: 'Pop',
      price: 40,
      countInStock: 6,
      rating: 4.5,
      numReviews: 0,
      description:
        'Questo disco è una collezione di brani scritti nel cuore della notte. Le strade che percorriamo e i demoni che affrontiamo viste nella prospettiva della cantante.',
    },
    {
      title: 'Fine Line',
      artist: 'Harry Styles',
      path: 'fineline-harrystyles-album',
      cover: '/covers/fineline.jpg',
      genre: 'Pop',
      price: 28.5,
      countInStock: 3,
      rating: 4,
      numReviews: 0,
      description:
        'Secondo album della band e raffinato cammino interiore su amore e relazioni.',
    },
    {
      title: 'Metallica',
      artist: 'Metallica',
      path: 'metallica-album',
      cover: '/covers/metallica.jpg',
      genre: 'Metal',
      price: 30,
      countInStock: 6,
      rating: 5.0,
      numReviews: 0,
      description: 'Il miglior album della band, secondo parte della critica.',
    },
    {
      title: 'Thriller',
      artist: 'Michael Jackson',
      path: 'thriller-mj-album',
      cover: '/covers/thriller.jpg',
      genre: 'Pop',
      price: 115.35,
      countInStock: 5,
      rating: 5.0,
      numReviews: 0,
      description:
        'Questo vinile contiene delle tracce che non erano state pubblicate originariamente nel 1982. Imperdibile.',
    },
    {
      title: 'Innuendo',
      artist: 'Queen',
      path: 'innuendo-queen-album',
      cover: '/covers/innuendo.jpg',
      genre: 'Rock',
      price: 33.2,
      countInStock: 5,
      rating: 4.5,
      numReviews: 0,
      description:
        'Ultimo album della band quando Freddie Mercury era ancora in vita.',
    },
    {
      title: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      path: 'darkside-pinkfloyd-album',
      cover: '/covers/darkside.jpg',
      genre: 'Rock',
      price: 32.45,
      countInStock: 6,
      rating: 5,
      numReviews: 0,
      description:
        'Considerato uno dei migliori album musicali di tutti i tempi. Versione rimasterizzata in vinile del 2011.',
    },

    {
      title: 'Legend',
      artist: 'Bob Marley',
      path: 'legend-bobmarley-album',
      cover: '/covers/legend.jpg',
      genre: 'Reggae',
      price: 29.99,
      countInStock: 8,
      rating: 4.5,
      numReviews: 0,
      description:
        'Bellissimo LP che raggruppa i brani di maggior successo del cantautore giamaicano.',
    },
    {
      title: 'Born in the USA',
      artist: 'Bruce Springsteen',
      path: 'borninusa-springsteen-album',
      cover: '/covers/borninusa.jpg',
      genre: 'Rock',
      price: 19.75,
      countInStock: 5,
      rating: 4,
      numReviews: 0,
      description:
        'Mitico vinile del 1982 che proiettò Bruce Springsteen nel firmamento internazionale del rock.',
    },
    {
      title: 'Eric Clapton',
      artist: 'Eric Clapton',
      path: 'eric-clapton-album',
      cover: '/covers/clapton.jpg',
      genre: 'Blues',
      price: 40.5,
      countInStock: 10,
      rating: 5,
      numReviews: 0,
      description: 'Il disco che ha reso Clapton il mito dei nostri giorni.',
    },
    {
      title: 'Vai mò',
      artist: 'Pino Daniele',
      path: 'vaimo-pinodaniele-album',
      cover: '/covers/vaimo.jpg',
      genre: 'Blues',
      price: 90,
      countInStock: 5,
      rating: 5,
      numReviews: 0,
      description: 'Uno dei vinili più interessanti di Pino Daniele.',
    },
    {
      title: 'Milestones',
      artist: 'Miles Davis',
      path: 'milestones-milesdavis-album',
      cover: '/covers/milestones.jpg',
      genre: 'Jazz',
      price: 22.35,
      countInStock: 2,
      rating: 4,
      numReviews: 0,
      description:
        'Il primo album in cui il possente stile di Davis emerge per affermarsi in seguito con successivi lavori.',
    },
    {
      title: 'Elvis is Back!',
      artist: 'Elvis Presley',
      path: 'elvisback-elvispresley-album',
      cover: '/covers/elvisback.jpg',
      genre: 'Blues',
      price: 25.34,
      countInStock: 3,
      rating: 4,
      numReviews: 0,
      description:
        'Dopo il servizio militare Elvis Presley ritorna sul palco dopo due anni di assenza.',
    },
    {
      title: 'The Blues Brothers',
      artist: 'The Blues Brothers',
      path: 'bluesbrothers-soundtrack-album',
      cover: '/covers/bluesbrothers.jpg',
      genre: 'Blues',
      price: 60,
      countInStock: 2,
      rating: 4,
      numReviews: 0,
      description:
        'La colonna sonora del film omonomo suonata dai protagonisti.',
    },
    {
      title: 'Blues in My Heart',
      artist: 'B.B. King',
      path: 'bluesinmyheart-bbking-album',
      cover: '/covers/bbking.jpg',
      genre: 'Blues',
      price: 23.5,
      countInStock: 2,
      rating: 3,
      numReviews: 0,
      description:
        'Un album strano e avvincente, ma da ascoltare assolutamente.',
    },
    {
      title: 'Moonlight',
      artist: 'Glen Miller',
      path: 'moonlight-glenmiller-album',
      cover: '/covers/moonlight.jpg',
      genre: 'Jazz',
      price: 28.5,
      countInStock: 6,
      rating: 4.5,
      numReviews: 0,
      description:
        'Doppio vinile con il meglio dello spirito di Glen Miller nei brani che lo hanno reso immortale.',
    },
    {
      title: 'Concerti',
      artist: 'Paolo Conte',
      path: 'concerti-paoloconte-album',
      cover: '/covers/concerti.jpg',
      genre: 'Jazz',
      price: 150,
      countInStock: 2,
      rating: 5,
      numReviews: 0,
      description:
        'Una preziosa raccolta di esibizioni dal vivo con alcuni dei migliori successi di Paolo Conte.',
    },
    {
      title: 'Pastel Blues',
      artist: 'Nina Simone',
      path: 'pastelblues-ninasimone-album',
      cover: '/covers/pastelblues.jpg',
      genre: 'Jazz',
      price: 30.89,
      countInStock: 4,
      rating: 4.5,
      numReviews: 0,
      description:
        'In questo disco interessante, Nina Simone esprime la sua splendida voce alla potenza ennesima.',
    },
    {
      title: 'The Final Frontier',
      artist: 'Iron Maiden',
      path: 'finafrontier-ironmaiden-album',
      cover: '/covers/finalfrontier.jpg',
      genre: 'Metal',
      price: 250,
      countInStock: 4,
      rating: 4,
      numReviews: 0,
      description:
        'Il ritorno degli Iron Maiden dopo una lunga pausa e un cambiamento di stile che non dispiace.',
    },
    {
      title: 'Back In Black',
      artist: 'AC/DC',
      path: 'backinblack-acdc-album',
      cover: '/covers/backinblack.jpg',
      genre: 'Metal',
      price: 22.5,
      countInStock: 3,
      rating: 5,
      numReviews: 0,
      description:
        'Settimo vinile del gruppo e disco di maggior successo di vendite assoluto, per la band.',
    },
    {
      title: 'Dua Lipa',
      artist: 'Dua Lipa',
      path: 'dualipa-dualipa-album',
      cover: '/covers/dualipa.jpg',
      genre: 'Pop',
      price: 32.39,
      countInStock: 5,
      rating: 4,
      numReviews: 0,
      description:
        'Album di esordio della cantante britannica, uscito nel 2017.',
    },
    {
      title: 'Macchina lavadischi',
      artist: 'HumminGuru',
      path: 'lavadischi-humminguru-accessori',
      cover: '/covers/lavadischi.jpg',
      genre: 'Accessori',
      price: 600,
      countInStock: 1,
      rating: 5,
      numReviews: 0,
      description:
        'Questa macchina utilizza gli ultrasuoni per pulire i vinili senza contatto diretto, rimuovendo la polvere senza arrecare danni.',
    },
    {
      title: 'Borsa per vinili',
      artist: 'Technics',
      path: 'backbag-technics-accessori',
      cover: '/covers/backbag.jpg',
      genre: 'Accessori',
      price: 69,
      countInStock: 4,
      rating: 4,
      numReviews: 0,
      description:
        'Borsa per vinili pensata per i 33 giri, con forme squadrate e semi rigide.',
    },
    {
      title: 'Mobile per vinili',
      artist: 'Zomo',
      path: 'mobile-zomo-accessori',
      cover: '/covers/mobile.jpg',
      genre: 'Accessori',
      price: 98,
      countInStock: 2,
      rating: 5,
      numReviews: 0,
      description:
        'Mobile per vinili dal design unico che si monta facilmente e velocemente.',
    },
    {
      title: 'Kit per la pulizia dei dischi',
      artist: 'Meliconi',
      path: 'kitpulizia-meliconi-accessori',
      cover: '/covers/kit.jpg',
      genre: 'Accessori',
      price: 12,
      countInStock: 10,
      rating: 4.5,
      numReviews: 0,
      description:
        'Kit per la pulizia dei vinili con una spazzola in fibra di carbonio, una spazzola in velluto e un flacone di soluzione pulente.',
    },
  ],
};

export default data;
