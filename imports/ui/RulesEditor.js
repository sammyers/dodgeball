import React from 'react';

import { Form, Checkbox, Label, Pagination, Header, Icon } from 'semantic-ui-react';

export default function RulesEditor({ rules, onChange }) {
  const { respawnTime, increaseRespawnTime } = rules;

  return (
    <div className='rules-editor'>
      <Header as='h3'>
        <Icon name='settings' />
        <Header.Content>Game Rules</Header.Content>
      </Header>
      <Form>
        <Form.Field>
          <Label content='Respawn Time (minutes)' size='large' pointing='right' />
          <Pagination
            firstItem={null}
            lastItem={null}
            activePage={respawnTime}
            onPageChange={(event, { activePage }) => onChange('respawnTime', activePage)}
            totalPages={5}
          />
        </Form.Field>
        <Checkbox
          label='Respawn Time increases as the game progresses'
          checked={increaseRespawnTime}
          onChange={(event, { value }) => onChange('increaseRespawnTime', value)}
        />
      </Form>
    </div>
  );
}
