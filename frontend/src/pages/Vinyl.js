import { useParams } from 'react-router-dom';

function Vinyl() {
  const params = useParams();
  const { path } = params;
  return (
    <div>
      <h1>{path}</h1>
    </div>
  );
}

export default Vinyl;
