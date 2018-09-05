/* eslint-disable react/no-multi-comp, react/prop-types, react/forbid-prop-types */
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
    fullHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    percent: 0,
    animation: 200,
    fullHeight: 10,
  }

  render() {
    const {
      percent, animation, absolute, className, fullHeight, children,
    } = this.props;
    const containerStyle = {
      width: `${percent}%`,
      transition: `width ${animation}ms`,
      position: 'relative',
      minHeight: fullHeight,
    };

    if (absolute) {
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
    barHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    fullHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    percent: 0,
    color: '#0BD318',
    animation: 200,
    barHeight: 10,
    fullHeight: 10,
  }

  render() {
    const {
      color, percent, animation, absolute, className, barHeight, fullHeight, children,
    } = this.props;
    const barStyle = {
      width: '100%',
      backgroundColor: color,
      height: barHeight,
      position: 'absolute',
      bottom: 0,
    };

    return (
      <SegmentContainer
        percent={percent}
        animation={animation}
        absolute={absolute}
        className={className}
        fullHeight={fullHeight}
      >
        <div style={{ ...barStyle }} />
        <div style={{ ...flexContainer, position: 'absolute' }}>
          <div style={flex1} />
          {children}
          <div style={flex1} />
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
    const {
      title, mainLabel, className, children, barHeight, fullHeight, ...rest
    } = this.props;
    let totalPercent = 0;
    (children || []).forEach((child) => {
      totalPercent += (child && child.props && child.props.percent) || 0;
    });
    return (
      <div className={className} {...rest}>
        <div style={flexContainer}>
          {title}
          {title && '\u00A0'}
          <div style={flex1}>
            <div style={flexContainer}>
              {children}
            </div>
            <div style={flexContainer}>
              <Segment
                absolute
                color="none"
                percent={totalPercent}
                barHeight={barHeight}
                fullHeight={fullHeight}
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
