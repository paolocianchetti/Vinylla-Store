import { Link } from 'react-router-dom';
import data from '../data';

function Home() {
  return (
    <div>
      <h1>I nostri dischi in vendita</h1>
      <div className="vinyls">
        {data.vinyls.map((vinyl) => (
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
