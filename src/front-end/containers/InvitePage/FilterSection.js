import React, { useState } from 'react';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { FormTextField, FormSpace } from 'azrmui/core/FormInputs';
import MenuItem from '@material-ui/core/MenuItem';
import { FormFieldButtonSelect } from 'azrmui/core/FormInputs';
import DateInput from './DateInput';
import TagsAutocomplete from './TagsAutocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      padding: theme.spacing(2),
      margin: theme.spacing(4),
      width: '100%',
    },
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  flex1: {
    maxWidth: 400,
    flex: 1,
  },
}));

export default () => {
  const classes = useStyles();
  const [searchText, setSearchText, searchTextError, setSearchTextError] = useStateWithError('');
  const [dateRange, setDateRange] = useState(null);


  return (
    <div className={classes.root}>
      <Paper variant="outlined" elevation={0}>
        <DialogTitle id="alert-dialog-title">產生邀請函</DialogTitle>
        <DialogContent>
          <div className={classes.flexContainer}>
            <div className={classes.flex1}>
              <FormTextField
                label="受邀人"
                error={!!searchTextError}
                helperText={searchTextError}
                // label={label}
                // onKeyPress={handleEnterForTextField}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                // margin="dense"
                fullWidth
              />
              <FormSpace variant="content1" />
              <DateInput
                title="選取讀書會日期"
                value={dateRange}
                onChange={setDateRange}
                buttonProps={{
                  margin: 'dense',
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => {}} color="primary">
            產生邀請函
          </Button>
        </DialogActions>
      </Paper>
    </div>
  );
};
