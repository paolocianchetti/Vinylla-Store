import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [vinyls, setVinyls] = useState([]);

  const getData = async () => {
    const result = await axios.get('/api/vinyls');
    console.log('axios result: ', result);
    setVinyls(result.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>I nostri dischi in vendita</h1>
      <div className="vinyls">
        {vinyls.map((vinyl) => (
          <div className="vinyl" key={vinyl.path}>
            <Link to={`/vinyl/${vinyl.path}`}>
              <img src={vinyl.cover} alt={vinyl.title} />
            </Link>
            <div className="vinyl-info">
              <Link to={`/vinyl/${vinyl.path}`}>
                <p>{vinyl.title}</p>
              </Link>
              <p>
                <strong>€{vinyl.price}</strong>
              </p>
              <button>Aggiungi al carrello</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
