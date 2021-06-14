export const roleLevels : { [s: string]: number } = {
  owner: 1,
  master: 2,
  member: 3,
};

export const compareRoles = (role1, role2) => {
  return (roleLevels[role1] || roleLevels['member']) - (roleLevels[role2] || roleLevels['member'])
};
