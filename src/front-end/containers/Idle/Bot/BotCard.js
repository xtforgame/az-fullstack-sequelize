import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {
  yellow, grey, green, lightBlue, orange, red,
} from '@material-ui/core/colors';
import ButtonBase from '@material-ui/core/ButtonBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import GaugeBar from './GaugeBar';
import droneX from './DroneX.png';

const styles = theme => ({
  flexContaner: {
    display: 'flex',
    flexDirection: 'row',
  },
  card: {
    // marginTop: 8,
    // marginBottom: 8,
    width: 300,
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    margin: 8,
    width: 64,
    height: 64,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  status: {
    margin: 8,
    width: 200,
    // flex: 1,
  },
  buttonBase: {
    marginTop: 8,
    marginBottom: 8,
    position: 'relative',
    textAlign: 'left',
  },
});

class BotCard extends React.Component {
  getMemoryUsage() {
    let {
      botInfo,
      heapStatistics,
    } = this.props;
    botInfo = botInfo || {};
    heapStatistics = heapStatistics || {};
    const memoryLimit = (botInfo.memoryLimit && botInfo.memoryLimit * 1024 * 1024) || 0;
    const used_heap_size = heapStatistics.used_heap_size || 0;
    const available_size = memoryLimit - used_heap_size;
    const memoryPercent = memoryLimit ? Math.round(available_size / memoryLimit * 100) : 0;

    const limitMB = memoryLimit ? (memoryLimit / 1024 / 1024).toFixed(2) : null;
    const availableMB = memoryLimit ? (available_size / 1024 / 1024).toFixed(2) : null;
    return {
      limitMB,
      availableMB,
      memoryPercent,
    };
  }

  getProcTimeUsage() {
    const { botInfo = {} } = this.props;
    const {
      procTime,
      procTimeLimit,
    } = botInfo;
    const procTimePercent = procTimeLimit ? Math.round(procTime / procTimeLimit * 100) : 0;

    const limitProcTime = procTimeLimit ? Math.round(procTimeLimit / 1000) : null;
    const availableProcTime = procTimeLimit ? Math.round(procTime / 1000) : null;
    return {
      limitProcTime,
      availableProcTime,
      procTimePercent,
    };
  }

  getBandwidthUsage() {
    const { botInfo = {} } = this.props;
    const {
      bandwidth,
      bandwidthLimit,
    } = botInfo;
    const bandwidthPercent = bandwidthLimit ? Math.round(bandwidth / bandwidthLimit * 100) : 0;

    const limitBandwidth = bandwidthLimit || null;
    const availableBandwidth = bandwidthLimit ? bandwidth : null;
    return {
      limitBandwidth,
      availableBandwidth,
      bandwidthPercent,
    };
  }

  getFeatureUsage() {
    const { botInfo = {} } = this.props;
    const {
      feature,
      featureLimit,
    } = botInfo;
    const featurePercent = featureLimit ? Math.round(feature / featureLimit * 100) : 0;

    const limitFeature = featureLimit || null;
    const availableFeature = featureLimit ? feature : null;
    return {
      limitFeature,
      availableFeature,
      featurePercent,
    };
  }

  getStorageUsage() {
    const { botInfo = {} } = this.props;
    const {
      storage,
      storageLimit,
    } = botInfo;
    const storagePercent = storageLimit ? Math.round(storage / storageLimit * 100) : 0;

    const limitStorage = storageLimit ? (storageLimit / 1024 / 1024).toFixed(2) : null;
    const availableStorage = storageLimit ? (storage / 1024 / 1024).toFixed(2) : null;
    return {
      limitStorage,
      availableStorage,
      storagePercent,
    };
  }

  render() {
    const {
      classes, theme, onClick, name,
    } = this.props;
    const labelColor = fade(theme.palette.background.paper, 0.7);
    const textColor = theme.palette.text.primary;

    const {
      limitMB,
      availableMB,
      memoryPercent,
    } = this.getMemoryUsage();

    const {
      limitProcTime,
      availableProcTime,
      procTimePercent,
    } = this.getProcTimeUsage();

    const {
      limitBandwidth,
      availableBandwidth,
      bandwidthPercent,
    } = this.getBandwidthUsage();

    const {
      limitFeature,
      availableFeature,
      featurePercent,
    } = this.getFeatureUsage();

    const {
      limitStorage,
      availableStorage,
      storagePercent,
    } = this.getStorageUsage();

    return (
      <ButtonBase
        focusRipple
        className={classes.buttonBase}
        style={{
          // width: '30%',
          padding: 0,
        }}
        onClick={onClick}
      >
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image={droneX}
            title="Live from memory album cover"
          />
          <div className={classes.status}>
            <div className={classes.flexContaner}>
              <div style={{
                height: 10,
                width: 10,
                margin: 7,
                // boxSizing: 'border-box',
                borderWidth: 1,
                borderColor: textColor,
                borderStyle: 'solid',
                backgroundColor: green[700],
                borderRadius: '50%',
              }}
              />
              <Typography variant="body2" gutterBottom>
                {name}
              </Typography>
            </div>
            <GaugeBar
              title="Memory :"
              mainLabel={limitMB ? '' : 'N/A'}
              textColor={textColor}
              labelColor={labelColor}
              segments={[
                {
                  name: '1', label: limitMB != null ? `${availableMB} / ${limitMB} MB` : '', percent: memoryPercent, color: green[700],
                },
                {
                  name: '2', label: '', percent: 100 - memoryPercent, color: grey[700],
                },
              ]}
            />
            <GaugeBar
              title="ProcTime :"
              mainLabel={limitProcTime ? '' : 'N/A'}
              textColor={textColor}
              labelColor={labelColor}
              segments={[
                {
                  name: '1', label: limitProcTime != null ? `${availableProcTime} / ${limitProcTime} Sec.` : '', percent: procTimePercent, color: lightBlue[700],
                },
                {
                  name: '2', label: '', percent: 100 - procTimePercent, color: grey[700],
                },
              ]}
            />
            <GaugeBar
              title="Bandwidth :"
              mainLabel={limitBandwidth ? '' : 'N/A'}
              textColor={textColor}
              labelColor={labelColor}
              segments={[
                {
                  name: '1', label: limitBandwidth != null ? `${availableBandwidth} / ${limitBandwidth}` : '', percent: bandwidthPercent, color: yellow[700],
                },
                {
                  name: '2', label: '', percent: 100 - bandwidthPercent, color: grey[700],
                },
              ]}
            />
            <GaugeBar
              title="Feature :"
              mainLabel={limitFeature ? '' : 'N/A'}
              textColor={textColor}
              labelColor={labelColor}
              segments={[
                {
                  name: '1', label: limitFeature != null ? `${availableFeature} / ${limitFeature}` : '', percent: featurePercent, color: orange[700],
                },
                {
                  name: '2', label: '', percent: 100 - featurePercent, color: grey[700],
                },
              ]}
            />
            <GaugeBar
              title="Storage :"
              mainLabel={limitStorage ? '' : 'N/A'}
              textColor={textColor}
              labelColor={labelColor}
              segments={[
                {
                  name: '1', label: limitStorage != null ? `${availableStorage} / ${limitStorage} MB` : '', percent: storagePercent, color: red[700],
                },
                {
                  name: '2', label: '', percent: 100 - storagePercent, color: grey[700],
                },
              ]}
            />
          </div>
        </Card>
      </ButtonBase>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BotCard);
