// @flow
// This file is shared across the demos.

import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import Icon from '@material-ui/core/Icon';

export const getMailFolderList = (closeDrawer, onClick01, onClick02, onClick03) => {
  let closeWrapper = (func) => (e) => {
    closeDrawer && closeDrawer();
    func && func(e);
  }
  return (
    <List subheader={<ListSubheader>Mail Folder List</ListSubheader>}>
      <ListItem onClick={closeWrapper(onClick01)} button>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
      </ListItem>
      <ListItem onClick={closeWrapper(onClick02)} button>
        <ListItemIcon>
          <Icon className="fa fa-calculator" style={{
            fontSize: 20,
            padding: 2,
            width: 20,
            height: 20,
          }} />{/*<StarIcon />*/}
        </ListItemIcon>
        <ListItemText primary="Starred" />
      </ListItem>
      <ListItem onClick={closeWrapper(onClick03)} button>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Send mail" />
      </ListItem>
      <ListItem onClick={closeWrapper()} button>
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="Drafts" />
      </ListItem>
    </List>
  );
};

export const getOtherMailFolderList = () => (
  <List subheader={<ListSubheader>Other Mail Folder List</ListSubheader>}>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="All mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItem>
  </List>
);
