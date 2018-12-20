import React from 'react';
import Button from '@material-ui/core/Button';
import EmbeddedMocha from '~/embedded-tests/embedded-mocha';

export default class TestContent extends React.PureComponent {
  run = () => {
    if (this.props.testCase) {
      this.ebdMocha = this.ebdMocha || new EmbeddedMocha();
      this.ebdMocha.run(this.props.testCase);
    }
  };

  render() {
    return (
      <div>
        <Button
          dense="true"
          color="primary"
          onClick={this.run}
        >
          Run
        </Button>
      </div>
    );
  }
}
