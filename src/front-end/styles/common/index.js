import genStyleCreator from '../genStyleCreator';
import flex from './flex';
import appBar from './appBar';
import mobile from './mobile';

const subsets = {
  flex,
  appBar,
  mobile,
};

export default genStyleCreator(subsets);
