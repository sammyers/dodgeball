import React, { Component } from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import { Segment, Button, Header } from 'semantic-ui-react';

import Timer from './Timer';

import { getLastOut, reportOut } from '../api/games';

class PlayerCard extends Component {
  state = { diff: 0 };

  tick = () => {
    const { lastOut } = this.props;
    this.setState({ diff: lastOut ? moment(lastOut.timeIn).diff(moment()) : 0 });
  }

  componentDidMount() {
    this.tick();
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { player: { _id, name }, lastOut, report = true } = this.props;
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

    const showTimer = (this.props.lastOut && (this.state.diff > -10000)) || !report;

    return (
      <Segment textAlign='center' style={{ height: '7.5rem' }}>
        <Header as='h3' content={name} />
        {showTimer ? <RespawnTimer {...lastOut} /> : <OutReporter />}
      </Segment>
    );
  }
}

export default withTracker(({ player: { _id } }) => ({
  lastOut: getLastOut(_id),
}))(PlayerCard);
