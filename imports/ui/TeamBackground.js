import React from 'react';

import { nameMap } from './colors';

export default function TeamBackground({
  colors: [ colorA, colorB ] = [ nameMap['red'], nameMap['blue'] ] 
}) {
  return (
    <div className='scoreboard-background'>
      <div className='scoreboard-color-left' style={{ backgroundColor: colorA }} />
      <div className='scoreboard-color-right' style={{ backgroundColor: colorB }} />
    </div>
  );
}
