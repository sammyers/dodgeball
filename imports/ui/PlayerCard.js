import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import { Segment, Button, Header } from 'semantic-ui-react';

import Timer from './Timer';

import { getLastOut, reportOut } from '../api/games';

function PlayerCard({ player: { _id, name }, lastOut }) {
  const RespawnTimer = ({ timeIn, timeOut }) => <Timer startTime={timeOut} endTime={timeIn} />;
  const OutReporter = () => (
    <Button.Group>
      <Button
        secondary
        content='Hit'
        icon='crosshairs'
        onClick={() => reportOut(_id, 'hit')}
      />
      <Button.Or />
      <Button
        secondary
        content='Caught'
        icon='star'
        onClick={() => reportOut(_id, 'catch')}
      />
    </Button.Group>
  );

  return (
    <Segment textAlign='center'>
      <Header as='h3' content={name} />
      {lastOut ? <RespawnTimer {...lastOut} /> : <OutReporter />}
    </Segment>
  );
}

export default withTracker(({ player: { _id } }) => ({
  lastOut: getLastOut(_id),
}))(PlayerCard);
