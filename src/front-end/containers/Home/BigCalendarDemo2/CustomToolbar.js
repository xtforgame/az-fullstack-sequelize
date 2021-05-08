// !!!! migic
// https://github.com/jquense/react-big-calendar/issues/818

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import RightArrowIcon from '@material-ui/icons/ChevronRight';
import LeftArrowIcon from '@material-ui/icons/ChevronLeft';
import { FormFieldButtonSelect, FormSpace } from 'azrmui/core/FormInputs';

class CalendarToolBar extends React.PureComponent {
  handleChange = (event, value) => {
    this.props.onView(value);
  };

  render() {
    const {
      view, views, onNavigate, label,
    } = this.props;

    const getMenuItem = ({
      option,
      // selectedOption,
      isSelected,
      handleOptionClick,
    }) => (
      <MenuItem
        key={option}
        selected={isSelected}
        value={option}
        onClick={handleOptionClick}
      >
        {option}
      </MenuItem>
    );

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" style={{ textTransform: 'capitalize', width: '100%' }}>{label}</Typography>
        </div>
        <FormSpace variant="content1" />
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <IconButton onClick={() => onNavigate('PREV')}><LeftArrowIcon /></IconButton>
          <FormControl style={{ marginLeft: 16 }}>
            <FormFieldButtonSelect
              id="view-selecor"
              value={view}
              options={views}
              getMenuItem={getMenuItem}
              onChange={this.handleChange}
              toInputValue={value => value}
              toButtonValue={value => value}

              // label="類型"
              margin="dense"
              style={{ width: 120, textAlign: 'center' }}
            >
              {views.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </FormFieldButtonSelect>
          </FormControl>
          <IconButton onClick={() => onNavigate('NEXT')}><RightArrowIcon /></IconButton>
        </div>
        <FormSpace variant="content2" />
      </div>
    );
  }
}

CalendarToolBar.propTypes = {
  onView: PropTypes.func,
  onNavigate: PropTypes.func,
  label: PropTypes.string,
  view: PropTypes.string,
  views: PropTypes.array,
};

export default CalendarToolBar;
