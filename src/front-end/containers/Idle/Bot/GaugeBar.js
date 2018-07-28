import React from 'react';
import StackedProgress, {
  Segment,
} from '~/components/Progress/StackedProgress';

export default class GaugeBar extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const {
      title,
      segments = [],
      textColor = 'inherit',
      labelColor = 'rgba(255, 255, 255, 0.7)',
    } = this.props;
    let total = segments.reduce((v, segment) => v + (segment.percent || 0), 0);
    let mainLabel = this.props.mainLabel || <span style={{ backgroundColor: labelColor }}>{`${Math.round(total)}%`}</span>;
    mainLabel = undefined;
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 15,
        lineHeight: '10px',
        color: textColor,
        fontSize: 10,
      }}>
        <div style={{
          flex: 1,
        }} />
        <StackedProgress
          title={title}
          mainLabel={mainLabel}
          height={4}
        >
          {segments.map(segment => {
            return (
              <Segment
                key={segment.name}
                color={segment.color}
                percent={segment.percent}
                height={segment.height || 4}
              >
                <span style={{ backgroundColor: labelColor }}>{`${Math.round(segment.percent)}%`}</span>
              </Segment>
            );
          })}
        </StackedProgress>
        <div style={{
          flex: 1,
        }} />
      </div>
    );
  }
}
