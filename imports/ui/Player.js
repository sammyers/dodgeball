import React from 'react';

import { Button } from 'semantic-ui-react';

export default function Player({ name, onClick }) {
  return (
    <Button
      size='large'
      color='red'
      icon='remove user'
      labelPosition='left'
      label={{
        basic: true,
        content: name,
        pointing: false,
      }}
      onClick={onClick}
    />
  );
};
