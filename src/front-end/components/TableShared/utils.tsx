/* eslint-disable react/sort-comp */
import React from 'react';
import moment from 'moment';
import ContentText from 'azrmui/core/Text/ContentText';
import { getDisplayTime } from '~/utils';

export const renderDateTime = (columnName, row, option) => (
  <ContentText>
    {getDisplayTime(row[columnName])}
  </ContentText>
);

export const x = 1;
