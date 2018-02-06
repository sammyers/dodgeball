import React, { Component } from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

import { Segment, Button, Header, Modal, Icon } from 'semantic-ui-react';

import Timer from './Timer';

import { getLastOut, reportOut, removePlayerFromGame } from '../api/games';

class PlayerCard extends Component {
  state = { diff: 0, modalOpen: false };

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

  handleOpenModal = () => this.setState({ modalOpen: true })

  handleCloseModal = () => this.setState({ modalOpen: false })

  render() {
    const { player: { _id, name }, lastOut, report = true } = this.props;
    const RespawnTimer = ({ timeIn, timeOut }) => <Timer startTime={timeOut} endTime={timeIn} />;
    const OutReporter = () => (
      <Button.Group>
        <Button
          secondary
          content='Got Hit'
          icon='crosshairs'
          onClick={() => reportOut(_id, 'hit')}
        />
        <Button.Or />
        <Button
          secondary
          content='Got Caught'
          icon='star'
          onClick={() => reportOut(_id, 'catch')}
        />
      </Button.Group>
    );

    const showTimer = (this.props.lastOut && (this.state.diff > -10000)) || !report;

    return (
      <Segment textAlign='center' style={{ height: '7.5rem' }}>
        <div style={{ height: '38px' }}>
          <Header as='h3' content={name} floated='left' />
          <Modal
            basic
            size='small'
            open={this.state.modalOpen}
            onClose={this.handleCloseModal}
            trigger={
              <Button
                floated='right'
                icon='remove user'
                color='red'
                onClick={this.handleOpenModal}
              />
            }
          >
            <Header icon='remove user' content='Remove Player from Game' />
            <Modal.Content>
              <p>Are you sure you want to remove {name} from the game?</p>
            </Modal.Content>
            <Modal.Actions>
            <Button basic color='red' inverted onClick={this.handleCloseModal}>
              <Icon name='remove' /> No
            </Button>
            <Button color='green' inverted onClick={() => {
              removePlayerFromGame(_id);
              this.handleCloseModal();
            }}>
              <Icon name='checkmark' /> Yes
            </Button>
          </Modal.Actions>
          </Modal>
        </div>
        {showTimer ? <RespawnTimer {...lastOut} /> : <OutReporter />}
      </Segment>
    );
  }
}

export default withTracker(({ player: { _id } }) => ({
  lastOut: getLastOut(_id),
}))(PlayerCard);
