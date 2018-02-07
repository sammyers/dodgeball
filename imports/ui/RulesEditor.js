import React from 'react';

import { Form, Checkbox, Label, Pagination, Header, Icon, Menu } from 'semantic-ui-react';

const scoreOptions = [10, 20, 50, 75, 100];

export default function RulesEditor({ rules, onChange }) {
  const { respawnTime, increaseRespawnTime, scoreLimit } = rules;

  return (
    <div className='rules-editor'>
      <Header as='h3'>
        <Icon name='options' />
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
        <Form.Field style={{ display: 'flex', alignItems: 'center' }}>
          <Label
            content='Score Limit'
            size='large'
            pointing='right'
            style={{ height: 'fit-content', flex: '0 0 auto' }}
          />
          <Menu widths={5} style={{ marginTop: 0, flexGrow: 1 }}>
            {scoreOptions.map(score => (
              <Menu.Item
                key={score}
                name={score.toString()}
                active={scoreLimit === score}
                onClick={() => onChange('scoreLimit', score)}
              >
                {score}
              </Menu.Item>
            ))}
          </Menu>
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
