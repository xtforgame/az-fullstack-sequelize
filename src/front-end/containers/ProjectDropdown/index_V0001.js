/* eslint-disable import/prefer-default-export */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import { setSelectedProjectId } from '~/containers/App/actions';
import modelMapEx from '~/containers/App/modelMapEx';

import {
  makeDefaultProjectSelector,
  makeSelectedProjectIdSelector,
} from '~/containers/App/selectors';

const styles = theme => ({
});

class ProjectDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
      // selectedIndex: 0,
    };
  }

  getMenuItmes() {
    const {
      projects,
      defaultProject,
      projectId,
    } = this.props;

    const projectArray = (projects && Object.values(projects)) || [];
    projectArray.sort((a, b) => a.organization_id - b.organization_id);
    return (projectArray).map((project, i) => (
      <MenuItem
        key={project.id}
        selected={(!!defaultProject && project.id === defaultProject.id) || (project.id === projectId)}
        onClick={event => this.handleMenuItemClick(event, i, project.id)}
      >
        {project.name}
      </MenuItem>
    ));
  }

  handleClick = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleMenuItemClick = (event, index, projectId) => {
    const { setSelectedProjectId } = this.props;

    setSelectedProjectId(projectId);
    this.setState({
      // selectedIndex: index,
      open: false,
    });
  };

  render() {
    const {
      classes,
      dispatch,
      setSelectedProjectId,
      projectHierarchy,
      defaultProject,
      projectId,
      ...props
    } = this.props;

    return (
      <React.Fragment>
        <Button
          color="inherit"
          aria-owns={this.state.open ? 'language-menu' : null}
          aria-haspopup="true"
          {...props}
          onClick={this.handleClick}
        >
          {`專案：${(defaultProject && defaultProject.name) || '未選取'}`}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
        >
          {this.getMenuItmes()}
        </Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  projects: modelMapEx.cacher.selectorCreatorSet.project.selectResourceMapValues(),
  defaultProject: makeDefaultProjectSelector(),
  projectId: makeSelectedProjectIdSelector(),
  projectId: () => '1',
});

export default compose(
  connect(mapStateToProps, {
    setSelectedProjectId,
  }),
  withStyles(styles),
)(ProjectDropdown);
