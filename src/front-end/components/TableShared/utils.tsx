/* eslint-disable react/sort-comp */
import React from 'react';
import moment from 'moment';
import ContentText from 'azrmui/core/Text/ContentText';

export const renderDateTime = (columnName, row, option) => (
  <ContentText>
    {row[columnName] ? moment(row[columnName]).format('YYYY/MM/DD[\n]HH:mm:ss') : 'N/A'}
  </ContentText>
);

export const x = 1;
