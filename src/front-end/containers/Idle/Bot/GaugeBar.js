/* eslint-disable max-len */
import React from 'react';
import StackedProgress, {
  Segment,
} from '~/components/Progress/StackedProgress';

export const getTextStyle = color => ({

  height: 15,
  lineHeight: '10px',
  color,
  fontSize: 10,
});

export default class GaugeBar extends React.Component {
  render() {
    const {
      title,
      segments = [],
      textColor = 'inherit',
      labelColor = 'rgba(255, 255, 255, 0.7)',
    } = this.props;
    // let total = segments.reduce((v, segment) => v + (segment.percent || 0), 0);
    // let mainLabel = this.props.mainLabel != null ? this.props.mainLabel : <span style={{ backgroundColor: labelColor }}>{`${Math.round(total)}%`}</span>;
    const { mainLabel } = this.props;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        ...getTextStyle(textColor),
      }}
      >
        <div style={{
          flex: 1,
        }}
        />
        <StackedProgress
          title={title}
          mainLabel={mainLabel && (
            <span style={{ backgroundColor: labelColor }}>
              {mainLabel}
            </span>
          )}
          barHeight={4}
          fullHeight={10}
        >
          {segments.map(segment => (
            <Segment
              key={segment.name}
              color={segment.color}
              percent={segment.percent}
              barHeight={segment.height || 4}
              fullHeight={10}
            >
              <span style={{ backgroundColor: labelColor }}>
                {segment.label != null ? segment.label : `${Math.round(segment.percent)}%`}
              </span>
            </Segment>
          ))}
        </StackedProgress>
        <div style={{
          flex: 1,
        }}
        />
      </div>
    );
  }
}
