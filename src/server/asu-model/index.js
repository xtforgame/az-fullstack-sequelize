// model for az RDBMS ORM

import Sequelize from 'sequelize';
import AsuOrm from 'az-sequelize-utils';

export default (sequelizeStore) => {
  let authModels = sequelizeStore.getDefaultAsuModels();
  return {
    models: {
      ...authModels.models,
      accountLink: {
        ...authModels.models.accountLink,
        columns: {
          ...authModels.models.accountLink.columns,
          recoveryToken: {
            type: AsuOrm.HAS_ONE('recoveryToken', {
              foreignKey: 'account_link_id',
            }),
          },
        },
      },
      user: {
        ...authModels.models.user,
        columns: {
          ...authModels.models.user.columns,
          email: Sequelize.STRING(900),
          picture: Sequelize.TEXT,
          data: {
            type: Sequelize.JSONB,
            defaultValue: {},
          },
          userGroups: {
            type: AsuOrm.BELONGS_TO_MANY('userGroup', {
              through: {
                asuModelName: 'userUserGroup',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'user_id',
              otherKey: 'group_id',
            }),
          },
          groupInvitations: {
            type: AsuOrm.BELONGS_TO_MANY('userGroup', {
              through: {
                asuModelName: 'groupInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'invitee_id',
              otherKey: 'group_id',
            }),
          },
          organizations: {
            type: AsuOrm.BELONGS_TO_MANY('organization', {
              through: {
                asuModelName: 'userOrganization',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'user_id',
              otherKey: 'organization_id',
            }),
          },
          organizationInvitations: {
            type: AsuOrm.BELONGS_TO_MANY('organization', {
              through: {
                asuModelName: 'organizationInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'invitee_id',
              otherKey: 'organization_id',
            }),
          },
          projects: {
            type: AsuOrm.BELONGS_TO_MANY('project', {
              through: {
                asuModelName: 'userProject',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'user_id',
              otherKey: 'project_id',
            }),
          },
          projectInvitations: {
            type: AsuOrm.BELONGS_TO_MANY('project', {
              through: {
                asuModelName: 'projectInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'invitee_id',
              otherKey: 'project_id',
            }),
          },
        },
        options: {
          ...authModels.models.user.options,
          hooks: {
            // executed "before" `Model.sync(...)`
            beforeSync: function (options) {
              // console.log('beforeSync');
            },
            // executed "after" `Model.sync(...)`
            afterSync: function (options) {
              // this = Model
              // console.log('afterSync');
              return options.sequelize.query('SELECT start_value, last_value, is_called FROM tbl_user_id_seq', { type: Sequelize.QueryTypes.SELECT })
              .then(([result]) => {
                if(!result.is_called){
                  return options.sequelize.query('ALTER SEQUENCE tbl_user_id_seq RESTART WITH 1000000001', { type: Sequelize.QueryTypes.SELECT })
                  .then((result2) => {});
                }
              });
            },
          },
        },
      },
      log: {
        columns: {
          type: Sequelize.STRING(900),
          data: {
            type: Sequelize.JSONB,
            defaultValue: {},
          },
        },
      },
      recoveryToken: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          type: Sequelize.STRING(20),
          key: Sequelize.STRING(900),
          token: Sequelize.STRING(900),
          accountLink: {
            type: AsuOrm.BELONGS_TO('accountLink', {
              foreignKey: 'account_link_id',
            }),
          },
        },
        options: {
          timestamps: true,
          paranoid: false,
          indexes: [
            {
              name: 'reset_password_key_should_be_unique',
              unique: true,
              fields: [/* 'type', */'key'],
            },
            {
              name: 'reset_password_token_should_be_unique',
              unique: true,
              fields: ['token'],
            },
            {
              name: 'only_one_reset_password_token_for_account_link',
              unique: true,
              fields: ['account_link_id'],
            },
          ],
        },
      },
      serviceAccount: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING(900),
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
              foreignKey: 'group_id',
              otherKey: 'user_id',
            }),
          },
          inviters: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'groupInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'group_id',
              otherKey: 'inviter_id',
            }),
          },
          invitees: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'groupInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'group_id',
              otherKey: 'invitee_id',
            }),
          },
        },
      },
      organization: {
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
                asuModelName: 'userOrganization',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'organization_id',
              otherKey: 'user_id',
            }),
          },
          projects: {
            type: AsuOrm.HAS_MANY('project', {
              foreignKey: 'organization_id',
            }),
          },
          inviters: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'organizationInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'organization_id',
              otherKey: 'inviter_id',
            }),
          },
          invitees: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'organizationInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'organization_id',
              otherKey: 'invitee_id',
            }),
          },
        },
      },
      project: {
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
                asuModelName: 'userProject',
                asuThroughAs: 'relationship',
              },
              foreignKey: 'project_id',
              otherKey: 'user_id',
            }),
          },
          organization: {
            type: AsuOrm.BELONGS_TO('organization', {
              foreignKey: 'organization_id',
            }),
          },
          inviters: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'projectInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'project_id',
              otherKey: 'inviter_id',
            }),
          },
          invitees: {
            type: AsuOrm.BELONGS_TO_MANY('user', {
              through: {
                asuModelName: 'projectInvitation',
                asuThroughAs: 'state',
              },
              foreignKey: 'project_id',
              otherKey: 'invitee_id',
            }),
          },
          protectedResources: {
            type: AsuOrm.HAS_MANY('protectedResource', {
              foreignKey: 'project_id',
            }),
          },
        },
      },
      service: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING(900),
        },
      },
      protectedResource: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.STRING(900),
          mime_type: Sequelize.STRING(900),
          metadata: {
            type: Sequelize.JSONB,
            defaultValue: {},
          },
          data: {
            type: Sequelize.BLOB,
            set(val) {
              if(ArrayBuffer.isView(val) || val instanceof ArrayBuffer){
                this.setDataValue('data', val);
              }else if(typeof val === 'string'){
                this.setDataValue('data', Buffer.from(val, 'utf8'));
              }else{
                this.setDataValue('data', Buffer.from(JSON.stringify(val), 'utf8'));
              }
            },
            get() {
              const mimeType = this.getDataValue('mime_type');
              if(mimeType === 'application/json'){
                return JSON.parse(this.getDataValue('data').toString('utf8'));
              }else if(mimeType.substr(0, 4) === 'text'){
                return this.getDataValue('data').toString('utf8');
              }else{
                return this.getDataValue('data');
              }
            },
          },
          project: {
            type: AsuOrm.BELONGS_TO('project', {
              foreignKey: 'project_id',
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
        options: {
          indexes: [
            {
              name: 'group_only_invite_once',
              unique: true,
              fields: ['group_id', 'inviter_id', 'invitee_id'],
              where: {
                deleted_at: null,
              },
            },
          ],
        },
      },
      userOrganization: {
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
      organizationInvitation: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          state: Sequelize.INTEGER,
        },
        options: {
          indexes: [
            {
              name: 'organization_only_invite_once',
              unique: true,
              fields: ['organization_id', 'inviter_id', 'invitee_id'],
              where: {
                deleted_at: null,
              },
            },
          ],
        },
      },
      userProject: {
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
      projectInvitation: {
        columns: {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
          },
          state: Sequelize.INTEGER,
        },
        options: {
          indexes: [
            {
              name: 'project_only_invite_once',
              unique: true,
              fields: ['project_id', 'inviter_id', 'invitee_id'],
              where: {
                deleted_at: null,
              },
            },
          ],
        },
      },
    },
  };
};
