
export const createFragmentFile = (name : string, grapesjsData = {}, config = {}) => {
  const x = 1;
  return {
    version: '0.1.0',
    name,
    grapesjsData,
  };
};

export default createFragmentFile;
