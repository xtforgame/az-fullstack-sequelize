import React from 'react';
import PropTypes from 'prop-types';

const flexContainer = {
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  width: '100%',
};

const flex1 = {
  flex: 1,
};


export class SegmentContainer extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    animation: PropTypes.number,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    percent: 0,
    animation: 200,
    height: 10,
  }

  render() {
    const { percent, animation, absolute, className, height, children } = this.props;
    const containerStyle = {
      width: percent + '%',
      transition: `width ${animation}ms`,
      position: 'relative',
      minHeight: height,
    };

    if(absolute){
      containerStyle.position = 'absolute';
      containerStyle.bottom = 0;
    }

    return (
      <div className={className} style={containerStyle}>
        {children}
      </div>
    );
  }
}

export class Segment extends React.Component {
  static propTypes = {
    percent: PropTypes.number,
    color: PropTypes.string,
    animation: PropTypes.number,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    percent: 0,
    color: '#0BD318',
    animation: 200,
    height: 10,
  }

  render() {
    const { color, percent, animation, absolute, className, height, children } = this.props;
    const barStyle = {
      width: '100%',
      backgroundColor: color,
      height,
      position: 'absolute',
      bottom: 0,
    };

    return (
      <SegmentContainer
        percent={percent}
        animation={animation}
        absolute={absolute}
        className={className}
        height={height}
      >
        <div style={barStyle}/>
        <div style={flexContainer}>
          <div style={flex1}/>
          {children}
          <div style={flex1}/>
        </div>
      </SegmentContainer>
    );
  }
}

export default class StackedProgress extends React.Component {
  static propTypes = {
    mainLabel: PropTypes.any,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    mainLabel: '',
    height: 0,
  }

  render() {
    const { title, mainLabel, className, children, height, ...rest } = this.props;
    let totalPercent = 0;
    (children || []).map(child => {
      totalPercent += (child && child.props && child.props.percent) || 0;
    });
    return (
      <div className={className} {...rest}>
        <div style={flexContainer}>
          {title}
          <div style={{ width: '100%' }}>
            <div style={flexContainer}>
              {children}
            </div>
            <div style={flexContainer}>
              <Segment
                absolute
                color={'none'}
                percent={totalPercent}
                height={height}
              >
                {mainLabel}
              </Segment>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
