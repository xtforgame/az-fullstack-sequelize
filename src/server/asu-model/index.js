// model for az RDBMS ORM

import Sequelize from 'sequelize';
import AsuOrm from 'az-sequelize-utils';

export default (sequelizeStore) => {
  let authModels = sequelizeStore.getDefaultAsuModels();
  return {
    models: {
      ...authModels.models,
      user: {
        ...authModels.models.user,
        columns: {
          ...authModels.models.user.columns,
          userGroups: {
            type: AsuOrm.BELONGS_TO_MANY('userGroup', {
              through: {
                asuModelName: 'userUserGroup',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'u_id',
              otherKey: 'g_id',
            }),
          },
          groupInvitations: {
            type: AsuOrm.BELONGS_TO_MANY('userGroup', {
              through: {
                asuModelName: 'groupInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'u_id',
              otherKey: 'g_id',
            }),
          },
        },
      },
      userGroup: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING(900),
          users: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'userUserGroup',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'g_id',
              otherKey: 'u_id',
            }),
          },
          invitees: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'groupInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'g_id',
              otherKey: 'u_id',
            }),
          },
        },
      },
    },
    associationModels: {
      userUserGroup: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          role: Sequelize.STRING,
        },
        options: {},
      },
      groupInvitation: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          state: Sequelize.INTEGER,
        },
      },
    },
  };
};
