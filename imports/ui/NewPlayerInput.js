import React from 'react';

import { Dropdown, Button } from 'semantic-ui-react';

export default function NewPlayerInput({
  allPlayers,
  currentPlayers,
  value,
  onSearchChange,
  onSelect,
  onPlayerAdd,
}) {
  const isNewName = !!value && !allPlayers.some(({ name }) => name === value);

  return (
    <div className='new-player'>
      <Dropdown
        search
        selection
        selectOnBlur={false}
        selectOnNavigation={false}
        placeholder='New Player Name'
        noResultsMessage='No players found.'
        value=''
        options={
          allPlayers.filter(
            ({ _id }) => !currentPlayers.includes(_id)
          ).map(
            ({ _id, name }) => ({ key: _id, value: _id, text: name })
          )
        }
        searchQuery={value}
        onSearchChange={onSearchChange}
        onChange={onSelect}
      />
      {isNewName &&
        <Button icon='add user' content='Add New Player' onClick={onPlayerAdd} />
      }
    </div>
  );
}
