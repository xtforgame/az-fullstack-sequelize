/* eslint-disable react/sort-comp */
import { makeStyles } from '@material-ui/core/styles';
import useCrudPages from '~/containers/hooks/useCrudPages';
import { collectionConfig } from '~/domain-logic/resourceHelpers/productCategory';
import Editor from './Editor';
import FilterSection from './FilterSection';
import DetailTable from './DetailTable';

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: 900,
  },
}));

export default (props) => {
  const { render } = useCrudPages({
    collectionConfig,
    Editor,
    FilterSection,
    // DetailTable,
  });
  return render();
};
