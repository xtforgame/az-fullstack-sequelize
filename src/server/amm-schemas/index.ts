/* eslint-disable no-shadow */

// model for az RDBMS ORM
import sequelize from 'sequelize';
import {
  AmmOrm, AmmSchemas, IJsonSchemas, JsonSchemasX,
  JsonModelAttributes,
} from 'az-model-manager';


export enum EnumSupportedHasuraRoles {
  user = 'user',
  manager = 'manager',
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
    publicColumns?: string[] | 'all',
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

const productColumns : JsonModelAttributes = {
  thumbnail: {
    type: 'jsonb',
    defaultValue: {},
  },
  pictures: {
    type: 'jsonb',
    defaultValue: [],
  },
  type: ['string', 900],
  name: ['string', 900],
  nameEn: ['string', 900],
  price: ['integer'],
  weight: 'float',
  description: 'text',
  materials: 'text',
  data: {
    type: 'jsonb',
    defaultValue: {},
  },
  disabled: {
    type: 'boolean',
    defaultValue: false,
  },
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          // publicColumns: [
          //   'id', 'provider_id',
          // ],
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
        realName: {
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

        confirmationSentAt: 'date',
        confirmationToken: 'string',
        confirmedAt: 'date',
        currentSignInAt: 'string',
        currentSignInIp: 'string',
        email: 'string',
        lastSignInAt: 'string',
        lastSignInIp: 'string',
        manageCoupon: 'boolean',
        mobile: 'string',
        unconfirmedEmail: 'string',
        signInCount: 'integer',
        ordersPriceTotal: 'integer',
        ordersCount: 'integer',

        managedBy: ['belongsTo', 'organization', {
          foreignKey: 'org_mgr_id',
        }],
        browserSessions: ['hasMany', 'browserSession', {
          foreignKey: 'user_id',
        }],
        notifications: ['hasMany', 'notification', {
          foreignKey: 'user_id',
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
        defaultBuyerInfo: ['hasOne', 'buyerInfo', {
          foreignKey: 'as_default_to',
        }],
        defaultRecipientInfo: ['hasOne', 'recipientInfo', {
          foreignKey: 'as_default_to',
        }],
        buyerInfos: ['hasMany', 'buyerInfo', {
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
        coupons: ['hasMany', 'coupon', {
          foreignKey: 'user_id',
        }],
        provideCoupons: ['hasMany', 'coupon', {
          foreignKey: 'admin_user_id',
        }],
        couponRecords: ['hasMany', 'couponRecord', {
          foreignKey: 'user_id',
        }],
        asIssueAuthor: ['hasMany', 'issue', {
          foreignKey: 'user_id',
        }],
        asIssueCommentAuthor: ['hasMany', 'issueComment', {
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
                  return options.sequelize.query('ALTER SEQUENCE tbl_user_id_seq RESTART WITH 5', { type: sequelize.QueryTypes.SELECT })
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('id')),
            // },
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    browserSession: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        sessionId: 'string',
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
            ammModelName: 'cartProduct',
            ammThroughTableColumnAs: 'cart',
            ammThroughAs: 'relation',
          },
          foreignKey: 'cart_id',
          otherKey: 'product_id',
        }],
      },
    },
    notification: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        sessionId: 'string',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
      },
    },
    log: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
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
            // orgSharedVd: {
            //   columns: ['data', 'ownedUser', 'users', 'projects'],
            //   permissions: getViewPermissions(null),
            // },
          },
          // publicColumns: [
          //   'id', 'name',
          // ],
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
            // orgSharedVd: {
            //   columns: ['type', 'data', 'users', 'organization'],
            //   permissions: getViewPermissions(null),
            // },
          },
          // publicColumns: [
          //   'id', 'name',
          // ],
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
            // orgSharedVd: {
            //   columns: ['data', 'users'],
            //   permissions: getViewPermissions(null),
            // },
          },
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
    productCategory: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: 'string',
        nameEn: 'string',
        code: 'string',
        priority: 'integer',
        active: 'boolean',
        specsText: 'text',
        specPic: {
          type: 'jsonb',
          defaultValue: null,
        },
        specsDesc: 'text',
        modelsReference1: 'text',
        modelsReference2: 'text',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        groups: ['hasMany', 'productGroup', {
          foreignKey: 'category_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          publicColumns: [
            'id',
            'name',
            'priority',
            'active',
            'data',
            'groups',
          ],
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
        uid: 'string',
        customId: 'string',
        color: 'string',
        colorName: 'string',
        colorCode: 'string',
        size: 'string',
        ...productColumns,
        variantData: {
          type: 'jsonb',
          defaultValue: {},
        },
        sizeChart: 'string',
        priority: 'integer',
        ordering: 'integer',
        instock: 'integer',
        orderQuota: 'integer',
        isLimit: {
          type: 'boolean',
          defaultValue: false,
        },
        soldout: {
          type: 'boolean',
          defaultValue: false,
        },
        group: ['belongsTo', 'productGroup', {
          foreignKey: 'group_id',
        }],
        spec: ['belongsTo', 'productSpec', {
          foreignKey: 'spec_id',
        }],
        carts: ['belongsToMany', 'browserSession', {
          through: {
            unique: false,
            ammModelName: 'cartProduct',
            ammThroughTableColumnAs: 'product',
            ammThroughAs: 'relation',
          },
          foreignKey: 'product_id',
          otherKey: 'cart_id',
        }],
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          publicColumns: [
            'id',
            'customId',
            'color',
            'size',
            'thumbnail',
            'pictures',
            'name',
            'price',
            'weight',
            'description',
            'data',
            'group',
          ],
        },
      },
    },
    productGroup: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        uid: 'string',
        customId: 'string',
        ...productColumns,
        modelsReference1: 'text',
        modelsReference2: 'text',
        products: ['hasMany', 'product', {
          foreignKey: 'group_id',
        }],
        category: ['belongsTo', 'productCategory', {
          foreignKey: 'category_id',
        }],
        spec: ['hasMany', 'productSpec', {
          foreignKey: 'group_id',
        }],
        campaigns: ['belongsToMany', 'campaign', {
          through: {
            unique: false,
            ammModelName: 'productGroupCampaign',
            ammThroughTableColumnAs: 'productGroup',
            ammThroughAs: 'relation',
          },
          foreignKey: 'product_group_id',
          otherKey: 'campaign_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          publicColumns: 'all',
        },
      },
    },
    productSpec: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: 'string',
        nameEn: 'string',
        code: 'string',
        priority: 'integer',
        spec: 'text',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        products: ['hasMany', 'product', {
          foreignKey: 'spec_id',
        }],
        group: ['belongsTo', 'productGroup', {
          foreignKey: 'group_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          publicColumns: [
            'id',
            'name',
            'priority',
            'active',
            'data',
            'groups',
          ],
        },
      },
    },
    campaign: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        name: ['string', 900],
        nameEn: ['string', 900],
        description: 'text',
        prTitle: 'text',
        prDescription: 'text',
        newIn: 'boolean',
        type: ['string', 191],
        durationType: ['string', 900], // 'time-range', 'permanent'
        start: 'date',
        end: 'date',
        state: 'string',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        originData: {
          type: 'jsonb',
          defaultValue: {},
        },
        productGroups: ['belongsToMany', 'productGroup', {
          through: {
            unique: false,
            ammModelName: 'productGroupCampaign',
            ammThroughTableColumnAs: 'campaign',
            ammThroughAs: 'relation',
          },
          foreignKey: 'campaign_id',
          otherKey: 'product_group_id',
        }],
        orders: ['belongsToMany', 'order', {
          through: {
            unique: false,
            ammModelName: 'orderCampaign',
            ammThroughTableColumnAs: 'campaign',
            ammThroughAs: 'relation',
          },
          foreignKey: 'campaign_id',
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          publicColumns: 'all',
          // publicColumns: [
          //   'id',
          //   'name',
          //   'data',
          //   'productGroups',
          // ],
        },
      },
    },
    buyerInfo: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        configName: 'string',
        name: 'string',
        mobile: 'string',
        phone1: 'string',
        phone2: 'string',
        country: 'string',
        zipcode: 'string',
        address: 'string',
        area: 'string',
        region: 'string',
        email1: 'string',
        email2: 'string',
        memo: 'string',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
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
        configName: 'string',
        name: 'string',
        mobile: 'string',
        phone1: 'string',
        phone2: 'string',
        country: 'string',
        zipcode: 'string',
        address: 'string',
        area: 'string',
        email1: 'string',
        email2: 'string',
        memo: 'string',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
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
        state: {
          type: 'string',
          defaultValue: 'unpaid',
          /*
            unpaid: '未付款',
            paid: '已付款',
            selected: '待出貨',
            shipped: '已出貨',
            returned: '已退貨',
            expired: '已過期'
          */
        },
        memo: 'text',
        shipmentId: 'text',
        buyerName: 'string',
        recipientName: 'string',
        buyer: {
          type: 'jsonb',
          defaultValue: {},
        },
        recipient: {
          type: 'jsonb',
          defaultValue: {},
        },
        metadata: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },

        legacyData: {
          type: 'jsonb',
          defaultValue: {},
        },

        invoiceNumber: 'string',
        invoiceStatus: 'string',

        payWay: 'string',
        logistics: 'string',
        countryCode: 'string',
        foreign: 'boolean',

        selectedAt: 'date',
        expiredAt: 'date',
        paidAt: 'date',
        shippedAt: 'date',

        atmAccount: 'string',
        esunData: 'text',
        esunOrderId: 'string',
        esunTradeInfo: 'text',
        esunTradeState: 'string',

        paypalData: 'text',
        paypalToken: 'string',

        cvsName: 'string',
        smseData: 'text',
        smsePayno: 'string',
        smseSmilepayno: 'string',

        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        campaigns: ['belongsToMany', 'campaign', {
          through: {
            unique: false,
            ammModelName: 'orderCampaign',
            ammThroughTableColumnAs: 'order',
            ammThroughAs: 'relation',
          },
          foreignKey: 'order_id',
          otherKey: 'campaign_id',
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
        couponRecord: ['hasOne', 'couponRecord', {
          foreignKey: 'order_id',
        }],
        issues: ['hasMany', 'issue', {
          foreignKey: 'order_id',
        }],
      },
      options: {
        indexes: [
          {
            name: 'order_state',
            fields: ['state'],
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    issue: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        type: 'string',
        state: 'string',
        requirement: {
          type: 'jsonb',
          defaultValue: {},
        },
        comments: {
          type: ['hasMany', 'issueComment', {
            foreignKey: 'issue_id',
          }],
        },
        order: {
          type: ['belongsTo', 'order', {
            foreignKey: 'order_id',
          }],
        },
        title: {
          type: ['string', 200],
        },
        user: {
          type: ['belongsTo', 'user', {
            foreignKey: 'user_id',
          }],
        },
        content: 'text',
        metadata: {
          type: 'jsonb',
          defaultValue: {},
        },
      },
      options: {},
    },
    issueComment: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        user: {
          type: ['belongsTo', 'user', {
            foreignKey: 'user_id',
          }],
        },
        content: {
          type: 'jsonb',
          defaultValue: {},
        },
        metadata: {
          type: 'jsonb',
          defaultValue: {},
        },
        issue: {
          type: ['belongsTo', 'issue', {
            foreignKey: 'issue_id',
          }],
        },
      },
      options: {},
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
        buyer: {
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
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    coupon: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        price: {
          type: 'integer',
          defaultValue: 0,
        },
        isDeduct: {
          type: 'boolean',
          defaultValue: false,
        },
        memo: 'text',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        adminUser: ['belongsTo', 'user', {
          foreignKey: 'admin_user_id',
        }],
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        couponRecord: ['hasOne', 'couponRecord', {
          foreignKey: 'coupon_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    couponRecord: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        action: 'string',
        price: {
          type: 'integer',
          defaultValue: 0,
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
        user: ['belongsTo', 'user', {
          foreignKey: 'user_id',
        }],
        byCoupon: ['belongsTo', 'coupon', {
          foreignKey: 'coupon_id',
        }],
        byOrder: ['belongsTo', 'order', {
          foreignKey: 'order_id',
        }],
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    shippingFee: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        countryCode: 'string',
        weight: {
          type: 'double',
          defaultValue: 0,
        },
        price: {
          type: 'integer',
          defaultValue: 0,
        },
      },
      extraOptions: {
        hasura: {
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions({ _or: [userIdF('inviter_id'), userIdF('invitee_id')] }),
            // },
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
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(userIdF('user_id')),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(userIdF('user_id')),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    cartProduct: {
      columns: {
        id: {
          type: 'bigint',
          primaryKey: true,
          autoIncrement: true,
        },
        quantity: 'integer',
        price: 'integer',
        subtotal: 'integer',
        assignedQuantity: 'integer',
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
      },
      options: {
        indexes: [
          {
            name: 'cart_product_uniqueness',
            unique: true,
            fields: ['cart_id', 'product_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
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
        returnedQuantity: 'integer',
        price: 'integer',
        subtotal: 'integer',
        assignedQuantity: 'integer',
        fulfilled: 'boolean',
        soldout: 'boolean',
        snapshot: {
          type: 'jsonb',
          defaultValue: {},
        },
        data: {
          type: 'jsonb',
          defaultValue: {},
        },
      },
      options: {
        // indexes: [
        //   {
        //     name: 'order_product_uniqueness',
        //     unique: true,
        //     fields: ['order_id', 'product_id'],
        //     where: {
        //       deleted_at: null,
        //     },
        //   },
        // ],
      },
      extraOptions: {
        hasura: {
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    productGroupCampaign: {
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
      },
      options: {
        indexes: [
          {
            name: 'product_group_campaign_uniqueness',
            unique: true,
            fields: ['product_group_id', 'campaign_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
          },
          restrictedColumns: [],
        },
      },
    },
    orderCampaign: {
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
      },
      options: {
        indexes: [
          {
            name: 'order_campaign_uniqueness',
            unique: true,
            fields: ['order_id', 'campaign_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
      extraOptions: {
        hasura: {
          publicColumns: ['id'],
          views: {
            privateVd: {
              columns: 'all',
              permissions: getViewPermissions(null),
            },
            // orgSharedVd: {
            //   columns: 'all',
            //   permissions: getViewPermissions(null),
            // },
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
