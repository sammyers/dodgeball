import React from 'react';

import { Input, Segment } from 'semantic-ui-react';
import { CirclePicker } from 'react-color';

import { valueMap, colorValues } from './colors';


export default function TeamSettingsEditor({ label, name, color, onChangeName, onChangeColor }) {
  return (
    <Segment textAlign='center'>
      <Input
        fluid
        label={{ content: label, color: valueMap[color] }}
        placeholder='Add Name'
        value={name}
        onChange={onChangeName}
      />
      <CirclePicker
        colors={colorValues}
        color={color}
        onChangeComplete={onChangeColor}
        width='100%'
      />
    </Segment>
  );
}
