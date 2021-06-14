import React, { useState } from 'react';
import BasicSection from '~/components/Section/Basic';
import { Link } from 'react-router-dom';

import FilterSection from './FilterSection';

export default ({ row }) => {
  const [filter, setFilter] = useState({});
  console.log('props :', row);
  return (
    <React.Fragment>
      <Link
        to={{
          pathname: '/coupon-record',
          search: `?userId=${row.id}`,
          state: { fromDashboard: true }
        }}
      >
        購物金紀錄
      </Link>
    </React.Fragment>
  );
};
