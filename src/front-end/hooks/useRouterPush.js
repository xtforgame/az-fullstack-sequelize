import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';
import { useConnect } from 'azrmui/hooks/redux-react-hook-ex';

const mapStateToProps = createStructuredSelector({});
const mapDispatchToProps = { push };

export default () => {
  const {
    push,
  } = useConnect(mapStateToProps, mapDispatchToProps);
  return push;
};
