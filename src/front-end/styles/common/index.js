import genStyleCreator from '../genStyleCreator';
import flex from './flex';
import appBar from './appBar';

const subsets = {
  flex,
  appBar,
};

export default genStyleCreator(subsets);
