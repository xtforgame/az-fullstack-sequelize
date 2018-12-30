import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ServiceCard from '~/components/Cards/ServiceCard';
import ContainerCard from '~/components/Cards/ContainerCard';
import SuccessButton from '~/components/Buttons/SuccessButton';
import ServiceDialog from './ServiceDialog';

const styles = {
  placeholder: {
    height: 40,
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  cardWrapper: {
    margin: 8,
  },
  icon: {
    fontSize: 24,
  },
  listFull: {
    width: 'auto',
  },
};

const owner = 'rick';
const proj = `${owner}-proj01`;

class SubContent04 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingService: null,
    };
  }

  startModifyService = name => () => {
    this.setState({
      editingService: name || true,
    });
  }

  updateService = (data) => {
    this.setState({
      editingService: null,
    });
  }

  render() {
    const {
      classes,
    } = this.props;
    const { editingService } = this.state;

    return (
      <div className={classes.mainContainer}>
        <SuccessButton
          color="primary"
          onClick={this.startModifyService()}
        >
          New Service
        </SuccessButton>
        <div className={classes.placeholder} />
        <Divider />
        <div className={classes.placeholder} />
        <Typography variant="h4">
          Services
        </Typography>
        <div className={classes.cardContainer}>
          <ServiceCard
            name={proj}
            status={{
              type: 'danger',
              state: 'down',
            }}
            ports={[
              { type: 'TCP', number: '80' },
              { type: 'TCP', number: '443' },
            ]}
            tags={{
              proj,
              owner,
            }}
            containers={{
              nginx: 'rick-proj01-nginx',
              web: 'rick-proj01-web-service',
              postgres: 'rick-proj01-postgres',
            }}
            onClickSettings={this.startModifyService(proj)}
          />
        </div>
        <div className={classes.placeholder} />
        <Typography variant="h4">
          Containers
        </Typography>
        <div className={classes.cardContainer}>
          <ContainerCard
            name={`${proj}-nginx`}
            status={{
              type: 'danger',
              state: 'down',
            }}
            image="nginx:1.7.9"
            ports={[
              { type: 'TCP', number: '80' },
              { type: 'TCP', number: '443' },
            ]}
            tags={{
              proj,
              owner,
            }}
          />
          <ContainerCard
            name={`${proj}-web-service`}
            status={{
              type: 'warning',
              state: 'starting',
            }}
            image="rick/web:1.2.0"
            ports={[
              { type: 'TCP', number: '80' },
              { type: 'TCP', number: '443' },
            ]}
            tags={{
              proj,
              owner,
            }}
          />
          <ContainerCard
            name={`${proj}-postgres`}
            status={{
              type: 'healthy',
              state: 'running',
            }}
            image="postgres:9.6"
            ports={[
              { type: 'TCP', number: '5432' },
            ]}
            tags={{
              proj,
              owner,
            }}
          />
          <ContainerCard
            name={`${proj}-web-service-test`}
            status={{
              type: 'unknown',
              state: 'unknown',
            }}
            image="rick/web:1.2.0"
            ports={[
              { type: 'TCP', number: '80' },
              { type: 'TCP', number: '443' },
            ]}
            tags={{
              proj,
              owner,
              mode: 'dev',
            }}
          />
        </div>
        <ServiceDialog
          fullScreen
          name={editingService}
          open={!!editingService}
          contentText={undefined}
          buttonComponents={{ yes: SuccessButton }}
          buttonTexts={{ yes: 'Create' }}
          onClose={this.updateService}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SubContent04);
