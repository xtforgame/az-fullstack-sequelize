/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  card: {
    marginTop: 8,
    marginBottom: 8,
    maxWidth: 400,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    // [theme.breakpoints.up('sm')]: {
    //   marginRight: -8,
    // },
    marginRight: 8,
    [theme.breakpoints.up('sm')]: {
      marginRight: 0,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  headerAction: {
    // marginTop: 'unset',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  headerContent: {
    overflowX: 'hidden',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'unset',
    },
  },
  contentRoot: {
    padding: 8,
    '&:last-child': {
      paddingBottom: 8,
    },
    [theme.breakpoints.up('sm')]: {
      padding: 24,
      '&:last-child': {
        paddingBottom: 24,
      },
    },
  },
});

class SimpleExpansionCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const {
      classes,
      avatar,
      title,
      subheader,
      children,
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={avatar}
          classes={{
            root: classes.headerRoot,
            action: classes.headerAction,
            content: classes.headerContent,
          }}
          action={(
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
          title={title}
          subheader={subheader}
        />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent
            classes={{
              root: classes.contentRoot,
            }}
          >
            {children}
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(SimpleExpansionCard);
