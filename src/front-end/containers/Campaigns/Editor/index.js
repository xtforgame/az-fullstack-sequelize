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
import useStateWithError from 'azrmui/hooks/useStateWithError';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
  FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import MenuItem from '@material-ui/core/MenuItem';
import DateRangeInput from '~/components/DateRangeInput';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/EnhancedTable/LoadingMask';
import TagsAutocomplete from '../TagsAutocomplete';


const campaignTypeInfo = [
  { id: 'seasonal', name: '季節活動' },
  { id: 'permanent-discount', name: '折扣' },
  { id: 'discount-total-price', name: '滿額折扣' },
  { id: 'free-shipping-total-price', name: '滿額免運' },
  { id: 'free-shipping-total-amount', name: '滿量免運' },
];
const campaignTypeNameMap = campaignTypeInfo.reduce((m, v) => ({ ...m, [v.id]: v.name }), {});
const campaignTypeNameFunc = id => campaignTypeNameMap[id] || '<不明狀態>';
const campaignTypes = campaignTypeInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));

const campaignStateInfo = [
  { id: 'na', name: '<N/A>' },
  { id: 'actived', name: '連線' },
  { id: 'past_actived', name: '過季連線' },
  { id: 'in_store', name: '店內' },
  { id: 'expired', name: '過期(上架不可選)' },
  { id: 'hide', name: '隱藏(前端不顯示)' },
];
const campaignStateNameMap = campaignStateInfo.reduce((m, v) => ({ ...m, [v.id]: v.name }), {});
const campaignStateNameFunc = id => campaignStateNameMap[id] || '<不明狀態>';
const campaignStates = campaignStateInfo.map(({ id, name }) => ({ id, name: name || '<不明狀態>' }));


const useStyles = makeStyles(theme => ({
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

const CampaignEditor = (props) => {
  const {
    editingData,
  } = props;

  const classes = useStyles();

  const [name, setName, nameError, setNameError] = useStateWithError(editingData.name);
  const [selectedType, setSelectedType] = useState({ id: editingData.type, name: campaignTypeNameFunc(editingData.type) });
  const handleTypeMenuItemClick = (event, exEvent, i) => {
    setSelectedType(exEvent);
  };

  const [dateRange, setDateRange] = useState([editingData.start, editingData.end]);

  const [selectedState, setSelectedState] = useState({ id: editingData.state, name: campaignStateNameFunc(editingData.state) });
  const handleStateMenuItemClick = (event, exEvent, i) => {
    setSelectedState(exEvent);
  };

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">編輯活動</DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            <FormTextField
              label="活動名稱"
              error={!!nameError}
              helperText={nameError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={name}
              onChange={e => setName(e.target.value)}
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" />
            <FormFieldButtonSelect
              id="type-selector"
              label="活動類型"
              value={selectedType}
              options={campaignTypes}
              onChange={handleTypeMenuItemClick}
              toInputValue={v => (v && `${v.name}`) || '<未選取>'}
              toButtonValue={v => `${(v && v.name) || '<未選取>'}`}
              fullWidth
              margin="dense"
            />
            <FormSpace variant="content1" />
            {/* <FormDatePicker
              label="搜尋文字"
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" /> */}
            <DateRangeInput
              title="選取時間範圍"
              value={dateRange}
              onChange={setDateRange}
              buttonProps={{
                margin: 'dense',
              }}
            />
            <FormSpace variant="content1" />
            <FormFieldButtonSelect
              id="state-selector"
              label="狀態"
              value={selectedState}
              options={campaignStates}
              onChange={handleStateMenuItemClick}
              toInputValue={v => (v && `${v.name}`) || '<未選取>'}
              toButtonValue={v => `${(v && v.name) || '<未選取>'}`}
              fullWidth
              margin="dense"
            />
            <FormSpace variant="content1" />
            <TagsAutocomplete
              label="搜尋包含商品"
              error={!!nameError}
              helperText={nameError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              // value={name}
              // onChange={e => setName(e.target.value)}
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" />
            <TagsAutocomplete
              label="搜尋活動"
              error={!!nameError}
              helperText={nameError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              // value={name}
              // onChange={e => setName(e.target.value)}
              margin="dense"
              fullWidth
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {}} color="primary">
          搜尋
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};


const CAMPAIGN_QUERY = gql`
  query Campaign($id: bigint! = 0) {
    campaign(id: $id){
      id
      name
      type
      durationType
      state
      start
      end
      data
      created_at
      updated_at
      deleted_at
    }
  }
`;

export default (props) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    match,
  } = props;

  const {
    id,
  } = match.params;

  const classes = useStyles();

  const { loading, error, data } = useQuery(CAMPAIGN_QUERY, {
    variables: {
      name: refreshCount.toString(),
      id,
    },
    fetchPolicy: 'network-only',
  });

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in CAMPAIGN_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <BasicSection withMaxWith>
      {(!loading && !error && data && data.campaign) && (
        <CampaignEditor
          editingData={data.campaign}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </BasicSection>
  );
};
