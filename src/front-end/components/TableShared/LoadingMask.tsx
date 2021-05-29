import React from 'react';
import Fade from '@material-ui/core/Fade';
import ProgressWithMask from 'azrmui/core/Progress/ProgressWithMask';

export type LoadingMaskProps = {
  loading?: boolean;
};

export default ({
  loading,
}: LoadingMaskProps) => (
  <Fade
    in={loading}
    timeout={{
      enter: 0,
      exit: 200,
    }}
    unmountOnExit
  >
    <ProgressWithMask
      backgroundColor="rgba(255, 255, 255, 0.5)"
      zIndex={1101}
      delay={0}
    />
  </Fade>
);
