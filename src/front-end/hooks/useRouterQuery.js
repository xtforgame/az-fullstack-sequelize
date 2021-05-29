import {
  useLocation,
} from 'react-router-dom';
import qs from 'qs';

// export default () => new URLSearchParams(useLocation().search);

export default () => qs.parse(useLocation().search, { ignoreQueryPrefix: true });
