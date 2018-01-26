import React from 'react';

import { Input } from 'semantic-ui-react';
import { CirclePicker } from 'react-color';

import { valueMap, colorValues } from './colors';


export default function TeamEditor({ label, name, color, onChangeName, onChangeColor }) {
  return (
    <div className='team-editor'>
      <Input
        label={{ content: label, color: valueMap[color] }}
        placeholder='Add Name'
        value={name}
        onChange={onChangeName}
      />
      <CirclePicker colors={colorValues} color={color} onChangeComplete={onChangeColor} />
    </div>
  );
}
