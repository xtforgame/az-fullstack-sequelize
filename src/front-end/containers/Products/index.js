import React from 'react';
import FilterSection from './FilterSection';
import DetailTable from './DetailTable';
import ProductList from '../ProductList';

export default (props) => (
  <ProductList
    FilterSection={FilterSection}
    DetailTable={DetailTable}
  />
);
