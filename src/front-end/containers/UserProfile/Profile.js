import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Typography from 'material-ui/Typography';
import bgImg from './StockSnap_3FOSIEZDTW.jpg';
import classNames from 'classnames';
import Avatar from 'material-ui/Avatar';
import Centered from '~/components/Layout/Centered';
import IconButton from 'material-ui/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import deepOrange from 'material-ui/colors/deepOrange';
import SuccessButton from '~/components/Buttons/SuccessButton';

import {
  FormTextInput,
  FormSelect,
  FormAutocomplete,
} from '~/components/SignInSignUp';

const styles = (theme) => ({
  // media: {
  //   height: 0,
  //   paddingTop: '56.25%', // 16:9
  // },
  card: {
    width: 345,
  },
  media: {
    position: 'relative',
    height: 150,
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    // margin: 10,
  },
  orangeAvatar: {
    // margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  absolute: {
    position: 'absolute',
  },
  bigAvatar: {
    width: 96,
    height: 96,
  },

  space1: {
    height: '50%',
  },

  space2: {
    height: 55,
  },

  space3: {
    height: 20,
  },

  avatarContainer: {
    position: 'relative',
    height: '100%',
  },

  editButton: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 8,
  },

  editPhoto: {
    color: theme.palette.common.white,
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },

  input: {
    display: 'none',
  },
});

class Profile extends React.Component {
  constructor(...args){
    super(...args);
    this.state = {
      editing: false,
    };
  }

  startEditing = () => {
    this.setState({
      editing: true,
    });
  };

  cancelEditing = () => {
    this.setState({
      editing: false,
    });
  };

  render(){
    const { classes } = this.props;
    return (
      <Centered>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={bgImg}
            title=""
          >
            <div className={classes.space1} />
            <Centered
              className={classes.avatarContainer}
            >
              <Avatar
                alt="Adelle Charles"
                {...{/*src: bgImg*/}}
                className={classNames(classes.orangeAvatar, classes.bigAvatar)}
              >
                <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
                <Typography variant="display1">
                  宗麟
                </Typography>
                {this.state.editing &&
                  <React.Fragment>
                    <div
                      className={classNames(classes.absolute, classes.bigAvatar)}
                      style={{backgroundColor: 'rgba(0, 0, 0, 0.35)'}}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton component="span" className={classNames(classes.editPhoto)}>
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </React.Fragment>}
              </Avatar>
              <Button
                variant="fab"
                color={this.state.editing ? 'default' : 'secondary'}
                aria-label={this.state.editing ? 'cancel' : 'edit'}
                className={classes.editButton}
                onClick={this.state.editing ? this.cancelEditing : this.startEditing}
              >
                {this.state.editing ? (<CloseIcon />) : (<EditIcon />)}
              </Button>
            </Centered>
          </CardMedia>
          <div className={classes.space2} />
          <CardContent>
            {this.state.editing ?
              <React.Fragment>
                <FormTextInput
                  id={'name'}
                  label={'Name'}
                  onKeyPress={() => {}}
                  value={'Rick Chen'}
                  onChange={() => {}}
                  formProps={{
                    style: {
                      width: '100%',
                    },
                  }}
                  fullWidth
                />
                <div className={classes.space3} />
              </React.Fragment> :
              <Centered>
                <Typography gutterBottom variant="headline" component="h2">
                  Rick Chen
                </Typography>
              </Centered>
            }
            {this.state.editing ?
              <FormTextInput
                id={'bio'}
                label={'Bio'}
                onKeyPress={() => {}}
                value={`I should write my bio here but I don't even understand what I'm writing, just putting lots of words here.`}
                onChange={() => {}}
                formProps={{
                  style: {
                    width: '100%',
                  },
                }}
                multiline
                fullWidth
                rows={1}
                rowsMax={10}
              /> :
              <Typography component="p">
                I should write my bio here but I don't even understand what I'm writing, just putting lots of words here.
              </Typography>
            }
          </CardContent>
          {this.state.editing &&
            <CardActions>
              <SuccessButton
                size="small"
                variant="raised"
                fullWidth
                color="primary"
                onClick={() => {}}
              >
                Save
              </SuccessButton>
            </CardActions>}
        </Card>
      </Centered>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
