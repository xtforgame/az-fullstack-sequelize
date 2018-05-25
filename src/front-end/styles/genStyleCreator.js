export default subsets => {
  const allSubsetNames = Object.keys(subsets);
  return (theme, _subsetNames = allSubsetNames) => {
    let subsetNames = Array.isArray(_subsetNames) ? _subsetNames : [_subsetNames];
    let result = {};
    subsetNames.map(subsetName => {
      if(subsets[subsetName]){
        result = {
          ...result,
          ...subsets[subsetName](theme),
        };
      }
    });
    return result;
  };
};