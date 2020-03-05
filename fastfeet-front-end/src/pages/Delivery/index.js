import React from 'react';
import { Input } from '@rocketseat/unform';
import { MdSearch, MdAdd } from 'react-icons/md';

import { Container, SearchAndSignDeliveries } from './styles';

export default function Delivery() {
  return (
    <Container>
      <header>
        <strong>Gerenciando encomendas</strong>
      </header>

      <SearchAndSignDeliveries>
        <div>
          <button type="button">
            <MdSearch size="24" color="#999" />
          </button>
          <Input
            type="text"
            name="deliverySearch"
            placeholder="Busca por encomendas"
          />
        </div>
        <button id="newDeliveryButton" type="button">
          <MdAdd size="24" color="#fff" />
          <strong>CADASTRAR</strong>
        </button>
      </SearchAndSignDeliveries>
    </Container>
  );
}
