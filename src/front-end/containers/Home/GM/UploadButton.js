
/* eslint-disable jsx-a11y/label-has-associated-control, no-underscore-dangle */
/* eslint-disable react/prop-types, react/forbid-prop-types, jsx-a11y/label-has-associated-control */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import FormFileInput from 'azrmui/core/FormInputs/FormFileInput';
import { readFileAsBinary } from 'azrmui/utils/uploadHelpers';

/* list of supported file types */
const SheetJSFT = [
  'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', // 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm',
].map(x => `.${x}`).join(',');

const styles = theme => ({
  fab: {
    boxShadow: 'none',
  },
});

const AddImageButton = (props) => {
  const {
    classes,
    color = 'primary',
    Icon = AddIcon,
    buttonProps,
    iconProps,
    ...inputProps
  } = props;
  return (
    <div
      style={{
        position: 'relative',
        width: 48,
        height: 48,
        padding: 4,
      }}
    >
      <FormFileInput
        accept={SheetJSFT}
        readFile={readFileAsBinary}
        {...inputProps}
        // readFileOption={{ hash: true }}
        // inputProps={{
        //   multiple: 'multiple',
        //   value: '',
        // }}
      >
        <Tooltip title="上傳Excel檔案">
          <Fab
            component="span"
            size="small"
            color={color}
            aria-label="add"
            classes={{
              primary: classes.containedPrimary,
            }}
            className={classes.fab}
            {...buttonProps}
          >
            <Icon {...iconProps} />
          </Fab>
        </Tooltip>
      </FormFileInput>
    </div>
  );
};

export default withStyles(styles)(AddImageButton);
