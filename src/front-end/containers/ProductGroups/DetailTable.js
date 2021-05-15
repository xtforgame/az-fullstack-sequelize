/* This is an example snippet - you should consider tailoring it
to your service.
*/
/*
  Add these to your `package.json`:
    "apollo-boost": "^0.3.1",
    "graphql": "^14.2.1",
    "graphql-tag": "^2.10.0",
    "react-apollo": "^2.5.5"
*/
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import moment from 'moment';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import { compose } from 'recompose';
import FileSaver from 'file-saver';
import { makeStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import ContentText from 'azrmui/core/Text/ContentText';
import BasicSection from '~/components/Section/Basic';
import EnhancedTable from '~/components/EnhancedTable';
import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import FilterSection from './FilterSection';
import Box from '@material-ui/core/Box';
import ProductList from '../ProductList';

const useStyles = makeStyles(theme => ({
  box: {
  },
}));

export default ({ row }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box className={classes.box} margin={1}>
        <ProductList
          asDetailTable
          groupId={row.id}
        />
      </Box>
    </React.Fragment>
  );
};
