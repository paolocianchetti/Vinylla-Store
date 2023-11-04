import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Steps(props) {
  return (
    <Row className="steps">
      <Col className={props.login ? 'active' : ''}>Login</Col>
      <Col className={props.shipping ? 'active' : ''}>Spedizione</Col>
      <Col className={props.payment ? 'active' : ''}>Pagamento</Col>
      <Col className={props.order ? 'active' : ''}>Ordine</Col>
    </Row>
  );
}
