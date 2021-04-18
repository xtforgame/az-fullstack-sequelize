import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import PublishIcon from '@material-ui/icons/Publish';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuItem from '@material-ui/core/MenuItem';
import {
  Redirect,
} from 'react-router-dom';
import TableAppBar from 'azrmui/core/Tables/TableAppBar';
import EnhancedTable from 'azrmui/core/Tables/EnhancedTable';
import ProgressWithMask from 'azrmui/core/Progress/ProgressWithMask';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import createCommonStyles from 'azrmui/styles/common';
import useEffectIgnoreFirstRun from 'azrmui/hooks/useEffectIgnoreFirstRun';
import { WorkBookReader } from 'xlsx-helper';
import SimpleTabs from './SimpleTabs';
import UploadButton from './UploadButton';
import SearchDialog from './SearchDialog';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  paper: {
    width: '100%',
  },
  detailCell: {
    backgroundColor: theme.palette.background.default,
  },
  deleteIcon: {
    color: theme.palette.common.white,
  },
  appBarChip: {
    color: theme.palette.common.white,
    margin: theme.spacing(1),
    background: fade(theme.palette.common.white, 0.15),
    '&:hover, &:focus': {
      background: fade(theme.palette.common.white, 0.15),
    },
    '&:active': {
      background: fade(theme.palette.common.white, 0.15),
    },
  },
});

const getColumnData = () => [
  {
    id: 'name', numeric: false, padding: 'none', label: '商品編號',
  },
  { id: 'goodName', numeric: false, label: '商品名稱' },
  // { id: 'sizes', numeric: false, label: '商品名稱' },
  // { id: 'fits', numeric: false, label: ' 更新日' },
  { id: 'comment', numeric: false, label: '商品排列類型' },
];

function createData2(row) {
  return {
    ...row,
    id: row['Product Name(English)*'],
    name: row['Product Name(English)*'],
    goodName: row['Product Name(Chinese)*'],
  };
}

const SubContent03 = (props) => { // eslint-disable-line react/prefer-stateless-function
  const {
    classes,
  } = props;

  const [rows, setRows] = useState(null);
  let [filteredRows, setFilterRows] = useState(null);
  const [searchText, setSearchText] = useState('');

  const updateFilterRows = (rows) => {
    let filteredRows = rows;
    if (searchText) {
      filteredRows = filteredRows.filter(r => (r.name || '').toLowerCase().includes(searchText.toLowerCase())
        || (r.goodName || '').toLowerCase().includes(searchText.toLowerCase()));
    }
    setFilterRows(filteredRows);
  };

  const refresh = async () => {
    const { data } = await axios('api/goodmap');
    const rows = data.map(createData2);
    setRows(rows);
    updateFilterRows(rows);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    updateFilterRows(rows || []);
  }, [searchText]);

  filteredRows = [];

  return (
    <Paper className={classes.root}>
      <TableAppBar>
        <div className={classes.flex1} />
        {/* <Chip
          label="分類：外衣"
          onDelete={() => {}}
          className={classes.appBarChip}
        /> */}
        {
          !!searchText && (
            <Chip
              label={`搜尋：${searchText}`}
              onDelete={() => setSearchText('')}
              classes={{ deleteIcon: classes.deleteIcon }}
              className={classes.appBarChip}
            />
          )
        }
        {/* <IconButton color="inherit" onClick={() => {}} aria-label="refresh">
          <SearchIcon />
        </IconButton> */}
        <SearchDialog
          searchText={searchText}
          onChange={v => setSearchText(v)}
        />
        <Tooltip title="上傳Excel檔案">
          <UploadButton
            id="add-image-button"
            Icon={PublishIcon}
            onLoadEnd={(uploadInfo) => {
              const wbr = new WorkBookReader();
              wbr.read(uploadInfo.buffer, { type: 'array' });
              // wbr.test(0);
              if (!wbr.workBook.SheetNames[0]) {
                alert('檔案中沒有有效的工作表');
              }
              const rowMap = {};
              wbr.forEachRowEx(wbr.workBook.SheetNames[0], (r) => {
                rowMap[r['Product Name(English)*']] = r;
              }, {
                getModifiedColumnNames: (colNames) => {
                  if (!colNames[colNames.length - 2]) {
                    colNames[colNames.length - 2] = 'sizes';
                  }
                  if (!colNames[colNames.length - 1]) {
                    colNames[colNames.length - 1] = 'fits';
                  }
                  return colNames;
                },
              });
              setRows(null);
              axios({
                method: 'post',
                url: 'api/goodmap/updates',
                data: rowMap,
              })
              .then(({ data }) => {
                refresh();
              });
              // console.log('uploadInfo :', uploadInfo);
            }}
          />
        </Tooltip>
        <Tooltip title="重新整理">
          <IconButton
            color="inherit"
            onClick={() => {
              setRows(null);
              refresh();
            }}
            aria-label="refresh"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="登出">
          <IconButton
            color="inherit"
            onClick={() => {
              axios({
                method: 'delete',
                url: 'api/sessions/me',
              })
              .then(({ data }) => {
                window.location.reload();
              });
            }}
            aria-label="refresh"
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </TableAppBar>
      <EnhancedTable
        loading={!filteredRows}
        orderBy="id"
        order="asc"
        withDetail
        getActionMenuItems={closeMenu => ([
          // <MenuItem
          //   key="edit"
          //   onClick={() => {
          //     // console.log('Edit');
          //     closeMenu();
          //   }}
          // >
          //   Edit
          // </MenuItem>,
          // <MenuItem
          //   key="delete"
          //   onClick={() => {
          //     // console.log('Delete');
          //     closeMenu();
          //   }}
          // >
          //   Delete
          // </MenuItem>,
        ])}
        defaultSortBy="id"
        columns={getColumnData()}
        rows={filteredRows || []}
        renderRowDetail={
          (row, { columns }) => (
            <Paper className={classes.paper}>
              <SimpleTabs refresh={refresh} row={row} columns={columns} />
            </Paper>
          )
        }
      />
    </Paper>
  );
};

export default withStyles(styles)(SubContent03);
