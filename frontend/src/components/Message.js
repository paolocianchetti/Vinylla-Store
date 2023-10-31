import Alert from 'react-bootstrap/Alert';

function Message(props) {
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
}

export default Message;
