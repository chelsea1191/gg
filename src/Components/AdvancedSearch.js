import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AdvancedSearch = ({ allGames }) => {
  return (
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant='link' eventKey='0'>
            Advanced Search
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey='0'>
          <Card.Body>search params here</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
export default AdvancedSearch;
