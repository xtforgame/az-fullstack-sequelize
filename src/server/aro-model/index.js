// model for az RDBMS ORM

import Sequelize from 'sequelize';

export default (sequelizeStore) => {
  let authModels = sequelizeStore.getDefaultAroModels();
  return {
    models: {
      ...authModels.models,
      userGroups: {
        pAs: ['id', 'name'],
        columns: {
          id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
          name: Sequelize.STRING(900),
        },
        names: {
          singular: 'userGroup',
          plural: 'userGroups',
        },
        tableOptions: {
          instanceMethods: {
            method3() { return 'instanceMethods'; },
          },
        },
      },
    },
    associationTables: {
      ...authModels.associationTables,
      userUserGroup: {
        pAs: ['role'],
        columns: {
          id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
          role: Sequelize.STRING,
        },
        names: {
          singular: 'userUserGroup',
          plural: 'userUserGroups',
        },
        tableOptions: {},
      },
      groupInvitation: {
        pAs: ['state'],
        columns: {
          id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
          state: Sequelize.INTEGER,
        },
        names: {
          singular: 'groupInvitation',
          plural: 'groupInvitations',
        },
        tableOptions: {},
      },
    },
    associations: [
      ...authModels.associations,
      {
        a: { name: 'users', options: { as: { singular: 'userGroup', plural: 'userGroups' } } },
        type: 'belongsToMany',
        through: { model: 'userUserGroup' },
        b: { name: 'userGroups', options: { as: { singular: 'member', plural: 'members' } } },
      },
      {
        a: { name: 'users', options: { as: { singular: 'groupInvitation', plural: 'groupInvitations' } } },
        type: 'belongsToMany',
        through: { model: 'groupInvitation' },
        b: { name: 'userGroups', options: { as: { singular: 'invitee', plural: 'invitees' } } },
      },
    ],
  };
};
