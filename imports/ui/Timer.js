import React, { Component } from 'react';
import moment from 'moment';

import { Progress } from 'semantic-ui-react';

export default class Timer extends Component {
  state = { diff: 0 };

  tick = () => {
    const diff = moment(this.props.endTime).diff(moment());
    this.setState({ diff: diff > 0 ? diff : 0 });
  }

  componentDidMount() {
    this.tick();
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const minutes = Math.floor((this.state.diff / 60000) % 60);
    const seconds = Math.floor((this.state.diff / 1000) % 60);
    const length = moment(this.props.endTime).diff(moment(this.props.startTime));
    const percent = (length - this.state.diff) / length * 100;

    return (
      <Progress
        indicating
        percent={percent}
        size='medium'
        label={{
          children: `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`
        }}
      />
    );
  }
}
