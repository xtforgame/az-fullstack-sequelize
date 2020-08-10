import React, { useState } from 'react';
import { renderRoutes } from 'react-router-config';

export default ({ route }) => {
  const [content, setContent] = useState('Xxxxxxx');
  setTimeout(() => {
    setContent('Ooooooo');
  }, 2000);
  return (
    <div>
      {content}
      <br />
      {renderRoutes(route.routes)}
    </div>
  );
};
