export default (subsets) => {
  const allSubsetNames = Object.keys(subsets);
  return (theme, _subsetNames = allSubsetNames) => {
    const subsetNames = Array.isArray(_subsetNames) ? _subsetNames : [_subsetNames];
    let result = {};
    subsetNames.forEach((subsetName) => {
      if (subsets[subsetName]) {
        result = {
          ...result,
          ...subsets[subsetName](theme),
        };
      }
    });
    return result;
  };
};
