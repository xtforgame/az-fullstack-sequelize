/* eslint-disable no-shadow */

// model for az RDBMS ORM
import sequelize from 'sequelize';
import {
  AmmOrm, AmmSchemas, IJsonSchemas, JsonSchemasX,
} from 'az-model-manager';


export enum EnumSupportedHasuraRoles {
   user= 'user',
   manager= 'manager',
}

export const supportedHasuraRoles = [
  EnumSupportedHasuraRoles.user,
  EnumSupportedHasuraRoles.manager,
];

type SupportedHasuraRoleNames = keyof typeof EnumSupportedHasuraRoles;

export type PermissionOptions = {
  role: SupportedHasuraRoleNames;
  filter: any;
  limit?: number | null;
  allow_aggregations?: boolean;
}

export type Permissions = {
  [name in SupportedHasuraRoleNames]?: PermissionOptions;
}

export type ModelExtraOptions = {
  hasura: {
    views?: {
      [viewLevelName: string]: {
        columns?: string[] | 'all',
        permissions: Permissions,
      },
    },
    publicColumns?: string[],
    restrictedColumns?: string[],
  },
}

const userIdF : (userIdColumnName : string) => any = (userIdColumnName : string) => {
  if (!userIdColumnName) {
    return null;
  }
  return {
    [userIdColumnName]: {
      _eq: 'X-Hasura-User-Id',
    },
  };
};

const belongsToManyUser : (asName : string, userIdName : string) => any = (asName : string, userIdName : string) => {
  if (!asName || !userIdName) {
    return null;
  }
  return {
    [asName]: {
      [userIdName]: { _eq: 'X-Hasura-User-Id' },
    },
  };
};

const getViewPermissions : (filter : any) => Permissions = (filter : any) => {
  if (!filter) {
    return {};
  }
  return {
    user: {
      role: EnumSupportedHasuraRoles.user,
      filter,
      limit: 25,
      allow_aggregations: true,
    },
    manager: {
      role: EnumSupportedHasuraRoles.manager,
      filter,
      limit: 25,
      allow_aggregations: true,
    },
  };
};

export const getJsonSchema : () => IJsonSchemas<ModelExtraOptions> = () => ({
  models: {
    accountLink: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        provider_id: 'string',
        provider_user_id: 'string',
        provider_user_access_info: {
          type: 'jsonb',
          // unique: true,
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        recoveryToken: ['hasOne', 'recoveryToken', {
          foreignKey: 'account_link_id',
        }],
      },
      options: {
        indexes: [
          {
            name: 'provider_user_id_should_be_unique',
            unique: true,
            fields: ['user_id', 'provider_id', 'provider_user_id'],
            where: {
              deleted_at: null,
            },
          },
          {
            unique: true,
            fields: ['provider_id', 'provider_user_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          publicColumns: [
            'id', 'provider_id',
          ],
          restrictedColumns: [
            'provider_user_access_info',
          ],
        },
      },
    },
    user: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: 'string',
          // unique: true,
          comment: 'Username',
        },
        type: {
          type: 'string',
          defaultValue: 'regular',
          comment: 'type of user. ex. regular, room, ... etc.',
        },
        privilege: 'string',
        labels: {
          type: 'jsonb',
          defaultValue: {},
        },
        accountLinks: ['hasMany', 'accountLink', {
          foreignKey: 'user_id',
        }],
        // email: ['string', 900],
        picture: 'text',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        managedBy: ['belongsTo', 'organization', {
          foreignKey: 'org_mgr_id',
        }],
        userGroups: ['belongsToMany', 'userGroup', {
          through: {
            unique: false,
            ammModelName: 'userUserGroup',
            ammThroughTableColumnAs: 'user',
            ammThroughAs: 'relation',
          },
          foreignKey: 'user_id',
          otherKey: 'group_id',
        }],
        groupInvitations: ['belongsToMany', 'userGroup', {
          through: {
            unique: false,
            ammModelName: 'groupInvitation',
            ammThroughTableColumnAs: 'invitee',
            ammThroughAs: 'state',
          },
          foreignKey: 'invitee_id',
          otherKey: 'group_id',
        }],
        invitedGroupUsers: ['belongsToMany', 'userGroup', {
          through: {
            unique: false,
            ammModelName: 'groupInvitation',
            ammThroughTableColumnAs: 'inviter',
            ammThroughAs: 'state',
          },
          foreignKey: 'inviter_id',
          otherKey: 'group_id',
        }],
        organizations: ['belongsToMany', 'organization', {
          through: {
            unique: false,
            ammModelName: 'userOrganization',
            ammThroughTableColumnAs: 'user',
            ammThroughAs: 'relation',
          },
          foreignKey: 'user_id',
          otherKey: 'organization_id',
        }],
        organizationInvitations: ['belongsToMany', 'organization', {
          through: {
            unique: false,
            ammModelName: 'organizationInvitation',
            ammThroughTableColumnAs: 'invitee',
            ammThroughAs: 'state',
          },
          foreignKey: 'invitee_id',
          otherKey: 'organization_id',
        }],
        invitedOrganizationUsers: ['belongsToMany', 'organization', {
          through: {
            unique: false,
            ammModelName: 'organizationInvitation',
            ammThroughTableColumnAs: 'inviter',
            ammThroughAs: 'state',
          },
          foreignKey: 'inviter_id',
          otherKey: 'organization_id',
        }],
        projects: ['belongsToMany', 'project', {
          through: {
            unique: false,
            ammModelName: 'userProject',
            ammThroughTableColumnAs: 'user',
            ammThroughAs: 'relation',
          },
          foreignKey: 'user_id',
          otherKey: 'project_id',
        }],
        projectInvitations: ['belongsToMany', 'project', {
          through: {
            unique: false,
            ammModelName: 'projectInvitation',
            ammThroughTableColumnAs: 'invitee',
            ammThroughAs: 'state',
          },
          foreignKey: 'invitee_id',
          otherKey: 'project_id',
        }],
        invitedProjectUsers: ['belongsToMany', 'project', {
          through: {
            unique: false,
            ammModelName: 'projectInvitation',
            ammThroughTableColumnAs: 'inviter',
            ammThroughAs: 'state',
          },
          foreignKey: 'inviter_id',
          otherKey: 'project_id',
        }],
        leftMessages: ['hasMany', 'contactUsMessage', {
          foreignKey: 'author_id',
        }],
        assignedMessage: ['hasMany', 'contactUsMessage', {
          foreignKey: 'assignee_id',
        }],
        userSettings: ['hasMany', 'userSetting', {
          foreignKey: 'user_id',
        }],
        memos: ['belongsToMany', 'memo', {
          through: {
            unique: false,
            ammModelName: 'userMemo',
            ammThroughTableColumnAs: 'user',
            ammThroughAs: 'relation',
          },
          foreignKey: 'user_id',
          otherKey: 'memo_id',
        }],
        defaultOrdererInfo: ['hasOne', 'ordererInfo', {
          foreignKey: 'as_default_to',
        }],
        defaultRecipientInfo: ['hasOne', 'recipientInfo', {
          foreignKey: 'as_default_to',
        }],
        ordererInfos: ['hasMany', 'ordererInfo', {
          foreignKey: 'user_id',
        }],
        recipientInfos: ['hasMany', 'recipientInfo', {
          foreignKey: 'user_id',
        }],
        orders: ['hasMany', 'order', {
          foreignKey: 'user_id',
        }],
        subscriptionOrders: ['hasMany', 'subscriptionOrder', {
          foreignKey: 'user_id',
        }],
      },
      options: {
        name: {
          singular: 'user',
          plural: 'users',
        },
        // defaultScope: {
        //   attributes: userPublicColumns,
        // },
        hooks: {
          // executed "before" `Model.sync(...)`
          beforeSync(options) {
            // console.log('beforeSync');
          },
          // executed "after" `Model.sync(...)`
          afterSync(options : any) {
            // this = Model
            // console.log('afterSync');
            return options.sequelize.query('SELECT last_value, is_called FROM public.tbl_user_id_seq', { type: sequelize.QueryTypes.SELECT })
              .then(([result]) => {
                if (!result.is_called) {
                  return options.sequelize.query('ALTER SEQUENCE tbl_user_id_seq RESTART WITH 1000000001', { type: sequelize.QueryTypes.SELECT })
                  .then((result2) => {});
                }
                return Promise.resolve();
              });
          },
        },
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('id')),
            },
          },
          publicColumns: [
            'id', 'name', 'type', 'privilege', 'picture',
          ],
        },
      },
    },
    userSetting: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        type: {
          type: ['string', 200],
          defaultValue: 'general',
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
      },
      options: {
        indexes: [
          {
            name: 'setting_type_should_be_unique_for_each_user',
            unique: true,
            fields: ['user_id', 'type'],
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    log: {
      columns: {
        type: ['string', 900],
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
      },
    },
    recoveryToken: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        type: ['string', 200],
        key: ['string', 900],
        token: ['string', 900],
        accountLink: ['belongsTo', 'accountLink', {
          foreignKey: 'account_link_id',
        }],
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
    userGroup: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: ['string', 900],
        users: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'userUserGroup',
            ammThroughTableColumnAs: 'group',
            ammThroughAs: 'relation',
          },
          foreignKey: 'group_id',
          otherKey: 'user_id',
        }],
        inviters: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'groupInvitation',
            ammThroughTableColumnAs: 'group',
            ammThroughAs: 'state',
          },
          foreignKey: 'group_id',
          otherKey: 'inviter_id',
        }],
        invitees: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'groupInvitation',
            ammThroughTableColumnAs: 'group',
            ammThroughAs: 'state',
          },
          foreignKey: 'group_id',
          otherKey: 'invitee_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(belongsToManyUser('users', 'user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    organization: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: ['string', 900],
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        users: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'userOrganization',
            ammThroughTableColumnAs: 'organization',
            ammThroughAs: 'relation',
          },
          foreignKey: 'organization_id',
          otherKey: 'user_id',
        }],
        ownedUser: ['hasMany', 'user', {
          foreignKey: 'org_mgr_id',
        }],
        projects: ['hasMany', 'project', {
          foreignKey: 'organization_id',
        }],
        inviters: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'organizationInvitation',
            ammThroughTableColumnAs: 'organization',
            ammThroughAs: 'state',
          },
          foreignKey: 'organization_id',
          otherKey: 'inviter_id',
        }],
        invitees: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'organizationInvitation',
            ammThroughTableColumnAs: 'organization',
            ammThroughAs: 'state',
          },
          foreignKey: 'organization_id',
          otherKey: 'invitee_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: ['data', 'ownedUser', 'users', 'projects'],
              permissions: getViewPermissions(belongsToManyUser('users', 'user_id')),
            },
            orgSharedVd: {
              columns: ['data', 'ownedUser', 'users', 'projects'],
              permissions: getViewPermissions(null),
            },
          },
          publicColumns: [
            'id', 'name',
          ],
        },
      },
    },
    project: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        type: ['string', 900],
        name: ['string', 900],
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        users: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'userProject',
            ammThroughTableColumnAs: 'project',
            ammThroughAs: 'relation',
          },
          foreignKey: 'project_id',
          otherKey: 'user_id',
        }],
        organization: ['belongsTo', 'organization', {
          foreignKey: 'organization_id',
        }],
        inviters: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'projectInvitation',
            ammThroughTableColumnAs: 'project',
            ammThroughAs: 'state',
          },
          foreignKey: 'project_id',
          otherKey: 'inviter_id',
        }],
        invitees: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'projectInvitation',
            ammThroughTableColumnAs: 'project',
            ammThroughAs: 'state',
          },
          foreignKey: 'project_id',
          otherKey: 'invitee_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: ['type', 'data', 'users', 'organization'],
              permissions: getViewPermissions(belongsToManyUser('users', 'user_id')),
            },
            orgSharedVd: {
              columns: ['type', 'data', 'users', 'organization'],
              permissions: getViewPermissions(null),
            },
          },
          publicColumns: [
            'id', 'name',
          ],
        },
      },
    },
    memo: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        users: ['belongsToMany', 'user', {
          through: {
            unique: false,
            ammModelName: 'userMemo',
            ammThroughTableColumnAs: 'memo',
            ammThroughAs: 'relation',
          },
          foreignKey: 'memo_id',
          otherKey: 'user_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: ['data'],
              permissions: getViewPermissions(null),
            },
            orgSharedVd: {
              columns: ['data', 'users'],
              permissions: getViewPermissions(null),
            },
          },
          publicColumns: [
            'id',
          ],
        },
      },
    },
    contactUsMessage: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        message: ['string', 900],
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        author: ['belongsTo', 'user', {
          foreignKey: 'author_id',
        }],
        assignee: ['belongsTo', 'user', {
          foreignKey: 'assignee_id',
        }],
        state: {
          type: ['string', 900],
          defaultValue: 'pending',
        },
      },
    },
    product: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        thumbnail: 'string',
        pictures: {
          type: 'jsonb',
          defaultValue: [],
        },
        name: ['string', 900],
        price: ['integer'],
        weight: 'float',
        description: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        orders: ['belongsToMany', 'order', {
          through: {
            unique: false,
            ammModelName: 'orderProduct',
            ammThroughTableColumnAs: 'product',
            ammThroughAs: 'relation',
          },
          foreignKey: 'product_id',
          otherKey: 'order_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
          },
          publicColumns: [
            'id',
            'thumbnail',
            'pictures',
            'name',
            'price',
            'weight',
            'description',
            'data',
          ],
        },
      },
    },
    ordererInfo: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: 'string',
        mobile: 'string',
        phone1: 'string',
        phone2: 'string',
        zipcode: 'string',
        address: 'string',
        area: 'string',
        email1: 'string',
        email2: 'string',
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        asDefaultTo: ['belongsTo', 'user', {
          foreignKey: 'as_default_to',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    recipientInfo: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: 'string',
        mobile: 'string',
        phone1: 'string',
        phone2: 'string',
        zipcode: 'string',
        address: 'string',
        area: 'string',
        email1: 'string',
        email2: 'string',
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        asDefaultTo: ['belongsTo', 'user', {
          foreignKey: 'as_default_to',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    order: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        memo: 'text',
        shipmentId: 'text',
        orderer: {
          type: 'jsonb',
          defaultValue: {},
        },
        recipient: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        products: ['belongsToMany', 'product', {
          through: {
            unique: false,
            ammModelName: 'orderProduct',
            ammThroughTableColumnAs: 'order',
            ammThroughAs: 'relation',
          },
          foreignKey: 'order_id',
          otherKey: 'product_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    subscriptionOrder: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        memo: 'text',
        shipmentId: 'text',
        orderer: {
          type: 'jsonb',
          defaultValue: {},
        },
        recipient: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
  },
  associationModels: {
    userUserGroup: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        role: 'string',
      },
      options: {
        indexes: [
          {
            name: 'user_user_group_uniqueness',
            unique: true,
            fields: ['user_id', 'group_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    groupInvitation: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        state: 'integer',
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
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    userOrganization: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        labels: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        role: 'string',
      },
      options: {
        indexes: [
          {
            name: 'user_organization_uniqueness',
            unique: true,
            fields: ['user_id', 'organization_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    organizationInvitation: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        state: 'integer',
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
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    userProject: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        labels: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        role: 'string',
      },
      options: {
        indexes: [
          {
            name: 'user_project_uniqueness',
            unique: true,
            fields: ['user_id', 'project_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    projectInvitation: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        state: 'integer',
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
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    userMemo: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        role: 'string',
      },
      options: {
        indexes: [
          {
            name: 'user_memo_uniqueness',
            unique: true,
            fields: ['user_id', 'memo_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
          },
          restrictedColumns: [],
        },
      },
    },
    orderProduct: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        quantity: 'integer',
        price: 'integer',
        totalPrice: 'integer',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
      },
      options: {
        indexes: [
          {
            name: 'order_product_uniqueness',
            unique: true,
            fields: ['order_id', 'product_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            orgSharedVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
          },
          restrictedColumns: [],
        },
      },
    },
  },
});

export const getJsonSchemasX : () => JsonSchemasX = () => {
  const result = new JsonSchemasX('public', <any>getJsonSchema());
  result.toCoreSchemas();
  return result;
};

const getAmmSchemas : () => AmmSchemas = () => {
  const result = new JsonSchemasX('public', <any>getJsonSchema()).toCoreSchemas();
  if (result instanceof Error) {
    throw result;
  }
  return result;
};

export default getAmmSchemas;
