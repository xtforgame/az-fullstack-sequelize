import Sequelize from 'sequelize';
import AsuOrm from 'az-sequelize-utils';

export default (modelsOption = {}) => {
  const {
    user: {
      publicColumns: userPublicColumns = [],
      columns: userColumns = {},
    } = {},
    accountLink: {
      publicColumns: accountLinkPublicColumns = [],
      columns: accountLinkColumns = {},
    } = {},
  } = modelsOption;

  return {
    user: {
      publicColumns: Array.from(new Set(['id', 'name', 'privilege', 'labels', ...userPublicColumns])),
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        name: {
          type: Sequelize.STRING,
          // unique: true,
          comment: 'Username',
        },
        privilege: Sequelize.STRING,
        labels: {
          type: Sequelize.JSONB,
          defaultValue: {},
        },
        accountLinks: {
          type: AsuOrm.HAS_MANY('accountLink', {
            foreignKey: 'user_id',
          }),
        },
        ...userColumns,
      },
    },
    accountLink: {
      publicColumns: Array.from(new Set(['id', 'provider_id', 'provider_user_id', ...accountLinkPublicColumns])),
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        provider_id: {
          type: Sequelize.STRING,
          // unique: true,
        },
        provider_user_id: {
          type: Sequelize.STRING,
          // unique: true,
        },
        provider_user_access_info: {
          type: Sequelize.JSONB,
          // unique: true,
        },
        user: {
          type: AsuOrm.BELONGS_TO('user', {
            foreignKey: 'user_id',
          }),
        },
        ...accountLinkColumns,
      },
    },
  };
};
