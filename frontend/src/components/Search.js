import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="field"
          id="field"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="titolo o artista"
          aria-label="Cerca Vinili"
          aria-describedby="button-search"
        ></FormControl>
        <Button type="submit" variant="outline-primary" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
