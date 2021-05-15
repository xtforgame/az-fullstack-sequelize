import sequelize, {
  Sequelize,

  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,

  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyCreateAssociationMixin,

  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,

  BelongsToManyCountAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
} from 'sequelize';
import { Overwrite, ExtendedModel } from 'az-model-manager';

// ============== start model: AccountLink ==============
export type AccountLinkCreationAttributes = {
  provider_id?: string;
  provider_user_id?: string;
  provider_user_access_info?: any;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
  recoveryToken?: RecoveryTokenCreationAttributes;
};

export type AccountLinkAttributes = {
  id: string;
  provider_id?: string;
  provider_user_id?: string;
  provider_user_access_info?: any;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  recoveryToken?: ExtendedModel<RecoveryTokenI>;
};

export type AccountLinkI = AccountLinkAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: recoveryToken
  getRecoveryToken: HasOneGetAssociationMixin<RecoveryTokenI>;
  setRecoveryToken: HasOneSetAssociationMixin<RecoveryTokenI, string>;
  createRecoveryToken: HasOneCreateAssociationMixin<RecoveryTokenI>;
};
// ============== end model: AccountLink ==============

// ============== start model: User ==============
export type UserCreationAttributes = {
  name?: string;
  type?: string;
  privilege?: string;
  labels?: any;
  accountLinks?: AccountLinkCreationAttributes[];
  picture?: string;
  data?: any;
  org_mgr_id?: string;
  managedBy?: OrganizationCreationAttributes;
  browserSessions?: BrowserSessionCreationAttributes[];
  notifications?: NotificationCreationAttributes[];
  userGroups?: UserGroupCreationAttributes[];
  groupInvitations?: UserGroupCreationAttributes[];
  invitedGroupUsers?: UserGroupCreationAttributes[];
  organizations?: OrganizationCreationAttributes[];
  organizationInvitations?: OrganizationCreationAttributes[];
  invitedOrganizationUsers?: OrganizationCreationAttributes[];
  projects?: ProjectCreationAttributes[];
  projectInvitations?: ProjectCreationAttributes[];
  invitedProjectUsers?: ProjectCreationAttributes[];
  leftMessages?: ContactUsMessageCreationAttributes[];
  assignedMessage?: ContactUsMessageCreationAttributes[];
  userSettings?: UserSettingCreationAttributes[];
  memos?: MemoCreationAttributes[];
  defaultOrdererInfo?: OrdererInfoCreationAttributes;
  defaultRecipientInfo?: RecipientInfoCreationAttributes;
  ordererInfos?: OrdererInfoCreationAttributes[];
  recipientInfos?: RecipientInfoCreationAttributes[];
  orders?: OrderCreationAttributes[];
  subscriptionOrders?: SubscriptionOrderCreationAttributes[];
  coupons?: CouponCreationAttributes[];
  provideCoupons?: CouponCreationAttributes[];
  couponRecords?: CouponRecordCreationAttributes[];
};

export type UserAttributes = {
  id: string;
  name?: string;
  type?: string;
  privilege?: string;
  labels?: any;
  accountLinks?: ExtendedModel<AccountLinkI>[];
  picture?: string;
  data?: any;
  org_mgr_id?: string;
  managedBy?: ExtendedModel<OrganizationI>;
  browserSessions?: ExtendedModel<BrowserSessionI>[];
  notifications?: ExtendedModel<NotificationI>[];
  userGroups?: ExtendedModel<UserGroupI>[];
  groupInvitations?: ExtendedModel<UserGroupI>[];
  invitedGroupUsers?: ExtendedModel<UserGroupI>[];
  organizations?: ExtendedModel<OrganizationI>[];
  organizationInvitations?: ExtendedModel<OrganizationI>[];
  invitedOrganizationUsers?: ExtendedModel<OrganizationI>[];
  projects?: ExtendedModel<ProjectI>[];
  projectInvitations?: ExtendedModel<ProjectI>[];
  invitedProjectUsers?: ExtendedModel<ProjectI>[];
  leftMessages?: ExtendedModel<ContactUsMessageI>[];
  assignedMessage?: ExtendedModel<ContactUsMessageI>[];
  userSettings?: ExtendedModel<UserSettingI>[];
  memos?: ExtendedModel<MemoI>[];
  defaultOrdererInfo?: ExtendedModel<OrdererInfoI>;
  defaultRecipientInfo?: ExtendedModel<RecipientInfoI>;
  ordererInfos?: ExtendedModel<OrdererInfoI>[];
  recipientInfos?: ExtendedModel<RecipientInfoI>[];
  orders?: ExtendedModel<OrderI>[];
  subscriptionOrders?: ExtendedModel<SubscriptionOrderI>[];
  coupons?: ExtendedModel<CouponI>[];
  provideCoupons?: ExtendedModel<CouponI>[];
  couponRecords?: ExtendedModel<CouponRecordI>[];
};

export type UserI = UserAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: accountLinks
  countAccountLinks: HasManyCountAssociationsMixin;
  hasAccountLink: HasManyHasAssociationMixin<AccountLinkI, string>;
  hasAccountLinks: HasManyHasAssociationsMixin<AccountLinkI, string>;
  getAccountLinks: HasManyGetAssociationsMixin<AccountLinkI>;
  setAccountLinks: HasManySetAssociationsMixin<AccountLinkI, string>;
  addAccountLink: HasManyAddAssociationMixin<AccountLinkI, string>;
  addAccountLinks: HasManyAddAssociationsMixin<AccountLinkI, string>;
  removeAccountLink: HasManyRemoveAssociationMixin<AccountLinkI, string>;
  removeAccountLinks: HasManyRemoveAssociationsMixin<AccountLinkI, string>;
  createAccountLink: HasManyCreateAssociationMixin<AccountLinkI>;

  // association: managedBy
  getManagedBy: BelongsToGetAssociationMixin<OrganizationI>;
  setManagedBy: BelongsToSetAssociationMixin<OrganizationI, string>;
  createManagedBy: BelongsToCreateAssociationMixin<OrganizationI>;

  // association: browserSessions
  countBrowserSessions: HasManyCountAssociationsMixin;
  hasBrowserSession: HasManyHasAssociationMixin<BrowserSessionI, string>;
  hasBrowserSessions: HasManyHasAssociationsMixin<BrowserSessionI, string>;
  getBrowserSessions: HasManyGetAssociationsMixin<BrowserSessionI>;
  setBrowserSessions: HasManySetAssociationsMixin<BrowserSessionI, string>;
  addBrowserSession: HasManyAddAssociationMixin<BrowserSessionI, string>;
  addBrowserSessions: HasManyAddAssociationsMixin<BrowserSessionI, string>;
  removeBrowserSession: HasManyRemoveAssociationMixin<BrowserSessionI, string>;
  removeBrowserSessions: HasManyRemoveAssociationsMixin<BrowserSessionI, string>;
  createBrowserSession: HasManyCreateAssociationMixin<BrowserSessionI>;

  // association: notifications
  countNotifications: HasManyCountAssociationsMixin;
  hasNotification: HasManyHasAssociationMixin<NotificationI, string>;
  hasNotifications: HasManyHasAssociationsMixin<NotificationI, string>;
  getNotifications: HasManyGetAssociationsMixin<NotificationI>;
  setNotifications: HasManySetAssociationsMixin<NotificationI, string>;
  addNotification: HasManyAddAssociationMixin<NotificationI, string>;
  addNotifications: HasManyAddAssociationsMixin<NotificationI, string>;
  removeNotification: HasManyRemoveAssociationMixin<NotificationI, string>;
  removeNotifications: HasManyRemoveAssociationsMixin<NotificationI, string>;
  createNotification: HasManyCreateAssociationMixin<NotificationI>;

  // association: userGroups
  countUserGroups: BelongsToManyCountAssociationsMixin;
  hasUserGroup: BelongsToManyHasAssociationMixin<UserGroupI, string>;
  hasUserGroups: BelongsToManyHasAssociationsMixin<UserGroupI, string>;
  getUserGroups: BelongsToManyGetAssociationsMixin<UserGroupI>;
  setUserGroups: BelongsToManySetAssociationsMixin<UserGroupI, string>;
  addUserGroup: BelongsToManyAddAssociationMixin<UserGroupI, string>;
  addUserGroups: BelongsToManyAddAssociationsMixin<UserGroupI, string>;
  removeUserGroup: BelongsToManyRemoveAssociationMixin<UserGroupI, string>;
  removeUserGroups: BelongsToManyRemoveAssociationsMixin<UserGroupI, string>;
  createUserGroup: BelongsToManyCreateAssociationMixin<UserGroupI>;


  // association: groupInvitations
  countGroupInvitations: BelongsToManyCountAssociationsMixin;
  hasGroupInvitation: BelongsToManyHasAssociationMixin<UserGroupI, string>;
  hasGroupInvitations: BelongsToManyHasAssociationsMixin<UserGroupI, string>;
  getGroupInvitations: BelongsToManyGetAssociationsMixin<UserGroupI>;
  setGroupInvitations: BelongsToManySetAssociationsMixin<UserGroupI, string>;
  addGroupInvitation: BelongsToManyAddAssociationMixin<UserGroupI, string>;
  addGroupInvitations: BelongsToManyAddAssociationsMixin<UserGroupI, string>;
  removeGroupInvitation: BelongsToManyRemoveAssociationMixin<UserGroupI, string>;
  removeGroupInvitations: BelongsToManyRemoveAssociationsMixin<UserGroupI, string>;
  createGroupInvitation: BelongsToManyCreateAssociationMixin<UserGroupI>;


  // association: invitedGroupUsers
  countInvitedGroupUsers: BelongsToManyCountAssociationsMixin;
  hasInvitedGroupUser: BelongsToManyHasAssociationMixin<UserGroupI, string>;
  hasInvitedGroupUsers: BelongsToManyHasAssociationsMixin<UserGroupI, string>;
  getInvitedGroupUsers: BelongsToManyGetAssociationsMixin<UserGroupI>;
  setInvitedGroupUsers: BelongsToManySetAssociationsMixin<UserGroupI, string>;
  addInvitedGroupUser: BelongsToManyAddAssociationMixin<UserGroupI, string>;
  addInvitedGroupUsers: BelongsToManyAddAssociationsMixin<UserGroupI, string>;
  removeInvitedGroupUser: BelongsToManyRemoveAssociationMixin<UserGroupI, string>;
  removeInvitedGroupUsers: BelongsToManyRemoveAssociationsMixin<UserGroupI, string>;
  createInvitedGroupUser: BelongsToManyCreateAssociationMixin<UserGroupI>;


  // association: organizations
  countOrganizations: BelongsToManyCountAssociationsMixin;
  hasOrganization: BelongsToManyHasAssociationMixin<OrganizationI, string>;
  hasOrganizations: BelongsToManyHasAssociationsMixin<OrganizationI, string>;
  getOrganizations: BelongsToManyGetAssociationsMixin<OrganizationI>;
  setOrganizations: BelongsToManySetAssociationsMixin<OrganizationI, string>;
  addOrganization: BelongsToManyAddAssociationMixin<OrganizationI, string>;
  addOrganizations: BelongsToManyAddAssociationsMixin<OrganizationI, string>;
  removeOrganization: BelongsToManyRemoveAssociationMixin<OrganizationI, string>;
  removeOrganizations: BelongsToManyRemoveAssociationsMixin<OrganizationI, string>;
  createOrganization: BelongsToManyCreateAssociationMixin<OrganizationI>;


  // association: organizationInvitations
  countOrganizationInvitations: BelongsToManyCountAssociationsMixin;
  hasOrganizationInvitation: BelongsToManyHasAssociationMixin<OrganizationI, string>;
  hasOrganizationInvitations: BelongsToManyHasAssociationsMixin<OrganizationI, string>;
  getOrganizationInvitations: BelongsToManyGetAssociationsMixin<OrganizationI>;
  setOrganizationInvitations: BelongsToManySetAssociationsMixin<OrganizationI, string>;
  addOrganizationInvitation: BelongsToManyAddAssociationMixin<OrganizationI, string>;
  addOrganizationInvitations: BelongsToManyAddAssociationsMixin<OrganizationI, string>;
  removeOrganizationInvitation: BelongsToManyRemoveAssociationMixin<OrganizationI, string>;
  removeOrganizationInvitations: BelongsToManyRemoveAssociationsMixin<OrganizationI, string>;
  createOrganizationInvitation: BelongsToManyCreateAssociationMixin<OrganizationI>;


  // association: invitedOrganizationUsers
  countInvitedOrganizationUsers: BelongsToManyCountAssociationsMixin;
  hasInvitedOrganizationUser: BelongsToManyHasAssociationMixin<OrganizationI, string>;
  hasInvitedOrganizationUsers: BelongsToManyHasAssociationsMixin<OrganizationI, string>;
  getInvitedOrganizationUsers: BelongsToManyGetAssociationsMixin<OrganizationI>;
  setInvitedOrganizationUsers: BelongsToManySetAssociationsMixin<OrganizationI, string>;
  addInvitedOrganizationUser: BelongsToManyAddAssociationMixin<OrganizationI, string>;
  addInvitedOrganizationUsers: BelongsToManyAddAssociationsMixin<OrganizationI, string>;
  removeInvitedOrganizationUser: BelongsToManyRemoveAssociationMixin<OrganizationI, string>;
  removeInvitedOrganizationUsers: BelongsToManyRemoveAssociationsMixin<OrganizationI, string>;
  createInvitedOrganizationUser: BelongsToManyCreateAssociationMixin<OrganizationI>;


  // association: projects
  countProjects: BelongsToManyCountAssociationsMixin;
  hasProject: BelongsToManyHasAssociationMixin<ProjectI, string>;
  hasProjects: BelongsToManyHasAssociationsMixin<ProjectI, string>;
  getProjects: BelongsToManyGetAssociationsMixin<ProjectI>;
  setProjects: BelongsToManySetAssociationsMixin<ProjectI, string>;
  addProject: BelongsToManyAddAssociationMixin<ProjectI, string>;
  addProjects: BelongsToManyAddAssociationsMixin<ProjectI, string>;
  removeProject: BelongsToManyRemoveAssociationMixin<ProjectI, string>;
  removeProjects: BelongsToManyRemoveAssociationsMixin<ProjectI, string>;
  createProject: BelongsToManyCreateAssociationMixin<ProjectI>;


  // association: projectInvitations
  countProjectInvitations: BelongsToManyCountAssociationsMixin;
  hasProjectInvitation: BelongsToManyHasAssociationMixin<ProjectI, string>;
  hasProjectInvitations: BelongsToManyHasAssociationsMixin<ProjectI, string>;
  getProjectInvitations: BelongsToManyGetAssociationsMixin<ProjectI>;
  setProjectInvitations: BelongsToManySetAssociationsMixin<ProjectI, string>;
  addProjectInvitation: BelongsToManyAddAssociationMixin<ProjectI, string>;
  addProjectInvitations: BelongsToManyAddAssociationsMixin<ProjectI, string>;
  removeProjectInvitation: BelongsToManyRemoveAssociationMixin<ProjectI, string>;
  removeProjectInvitations: BelongsToManyRemoveAssociationsMixin<ProjectI, string>;
  createProjectInvitation: BelongsToManyCreateAssociationMixin<ProjectI>;


  // association: invitedProjectUsers
  countInvitedProjectUsers: BelongsToManyCountAssociationsMixin;
  hasInvitedProjectUser: BelongsToManyHasAssociationMixin<ProjectI, string>;
  hasInvitedProjectUsers: BelongsToManyHasAssociationsMixin<ProjectI, string>;
  getInvitedProjectUsers: BelongsToManyGetAssociationsMixin<ProjectI>;
  setInvitedProjectUsers: BelongsToManySetAssociationsMixin<ProjectI, string>;
  addInvitedProjectUser: BelongsToManyAddAssociationMixin<ProjectI, string>;
  addInvitedProjectUsers: BelongsToManyAddAssociationsMixin<ProjectI, string>;
  removeInvitedProjectUser: BelongsToManyRemoveAssociationMixin<ProjectI, string>;
  removeInvitedProjectUsers: BelongsToManyRemoveAssociationsMixin<ProjectI, string>;
  createInvitedProjectUser: BelongsToManyCreateAssociationMixin<ProjectI>;


  // association: leftMessages
  countLeftMessages: HasManyCountAssociationsMixin;
  hasLeftMessage: HasManyHasAssociationMixin<ContactUsMessageI, string>;
  hasLeftMessages: HasManyHasAssociationsMixin<ContactUsMessageI, string>;
  getLeftMessages: HasManyGetAssociationsMixin<ContactUsMessageI>;
  setLeftMessages: HasManySetAssociationsMixin<ContactUsMessageI, string>;
  addLeftMessage: HasManyAddAssociationMixin<ContactUsMessageI, string>;
  addLeftMessages: HasManyAddAssociationsMixin<ContactUsMessageI, string>;
  removeLeftMessage: HasManyRemoveAssociationMixin<ContactUsMessageI, string>;
  removeLeftMessages: HasManyRemoveAssociationsMixin<ContactUsMessageI, string>;
  createLeftMessage: HasManyCreateAssociationMixin<ContactUsMessageI>;

  // association: assignedMessage
  countAssignedMessages: HasManyCountAssociationsMixin;
  hasAssignedMessage: HasManyHasAssociationMixin<ContactUsMessageI, string>;
  hasAssignedMessages: HasManyHasAssociationsMixin<ContactUsMessageI, string>;
  getAssignedMessages: HasManyGetAssociationsMixin<ContactUsMessageI>;
  setAssignedMessages: HasManySetAssociationsMixin<ContactUsMessageI, string>;
  addAssignedMessage: HasManyAddAssociationMixin<ContactUsMessageI, string>;
  addAssignedMessages: HasManyAddAssociationsMixin<ContactUsMessageI, string>;
  removeAssignedMessage: HasManyRemoveAssociationMixin<ContactUsMessageI, string>;
  removeAssignedMessages: HasManyRemoveAssociationsMixin<ContactUsMessageI, string>;
  createAssignedMessage: HasManyCreateAssociationMixin<ContactUsMessageI>;

  // association: userSettings
  countUserSettings: HasManyCountAssociationsMixin;
  hasUserSetting: HasManyHasAssociationMixin<UserSettingI, string>;
  hasUserSettings: HasManyHasAssociationsMixin<UserSettingI, string>;
  getUserSettings: HasManyGetAssociationsMixin<UserSettingI>;
  setUserSettings: HasManySetAssociationsMixin<UserSettingI, string>;
  addUserSetting: HasManyAddAssociationMixin<UserSettingI, string>;
  addUserSettings: HasManyAddAssociationsMixin<UserSettingI, string>;
  removeUserSetting: HasManyRemoveAssociationMixin<UserSettingI, string>;
  removeUserSettings: HasManyRemoveAssociationsMixin<UserSettingI, string>;
  createUserSetting: HasManyCreateAssociationMixin<UserSettingI>;

  // association: memos
  countMemos: BelongsToManyCountAssociationsMixin;
  hasMemo: BelongsToManyHasAssociationMixin<MemoI, string>;
  hasMemos: BelongsToManyHasAssociationsMixin<MemoI, string>;
  getMemos: BelongsToManyGetAssociationsMixin<MemoI>;
  setMemos: BelongsToManySetAssociationsMixin<MemoI, string>;
  addMemo: BelongsToManyAddAssociationMixin<MemoI, string>;
  addMemos: BelongsToManyAddAssociationsMixin<MemoI, string>;
  removeMemo: BelongsToManyRemoveAssociationMixin<MemoI, string>;
  removeMemos: BelongsToManyRemoveAssociationsMixin<MemoI, string>;
  createMemo: BelongsToManyCreateAssociationMixin<MemoI>;


  // association: defaultOrdererInfo
  getDefaultOrdererInfo: HasOneGetAssociationMixin<OrdererInfoI>;
  setDefaultOrdererInfo: HasOneSetAssociationMixin<OrdererInfoI, string>;
  createDefaultOrdererInfo: HasOneCreateAssociationMixin<OrdererInfoI>;

  // association: defaultRecipientInfo
  getDefaultRecipientInfo: HasOneGetAssociationMixin<RecipientInfoI>;
  setDefaultRecipientInfo: HasOneSetAssociationMixin<RecipientInfoI, string>;
  createDefaultRecipientInfo: HasOneCreateAssociationMixin<RecipientInfoI>;

  // association: ordererInfos
  countOrdererInfos: HasManyCountAssociationsMixin;
  hasOrdererInfo: HasManyHasAssociationMixin<OrdererInfoI, string>;
  hasOrdererInfos: HasManyHasAssociationsMixin<OrdererInfoI, string>;
  getOrdererInfos: HasManyGetAssociationsMixin<OrdererInfoI>;
  setOrdererInfos: HasManySetAssociationsMixin<OrdererInfoI, string>;
  addOrdererInfo: HasManyAddAssociationMixin<OrdererInfoI, string>;
  addOrdererInfos: HasManyAddAssociationsMixin<OrdererInfoI, string>;
  removeOrdererInfo: HasManyRemoveAssociationMixin<OrdererInfoI, string>;
  removeOrdererInfos: HasManyRemoveAssociationsMixin<OrdererInfoI, string>;
  createOrdererInfo: HasManyCreateAssociationMixin<OrdererInfoI>;

  // association: recipientInfos
  countRecipientInfos: HasManyCountAssociationsMixin;
  hasRecipientInfo: HasManyHasAssociationMixin<RecipientInfoI, string>;
  hasRecipientInfos: HasManyHasAssociationsMixin<RecipientInfoI, string>;
  getRecipientInfos: HasManyGetAssociationsMixin<RecipientInfoI>;
  setRecipientInfos: HasManySetAssociationsMixin<RecipientInfoI, string>;
  addRecipientInfo: HasManyAddAssociationMixin<RecipientInfoI, string>;
  addRecipientInfos: HasManyAddAssociationsMixin<RecipientInfoI, string>;
  removeRecipientInfo: HasManyRemoveAssociationMixin<RecipientInfoI, string>;
  removeRecipientInfos: HasManyRemoveAssociationsMixin<RecipientInfoI, string>;
  createRecipientInfo: HasManyCreateAssociationMixin<RecipientInfoI>;

  // association: orders
  countOrders: HasManyCountAssociationsMixin;
  hasOrder: HasManyHasAssociationMixin<OrderI, string>;
  hasOrders: HasManyHasAssociationsMixin<OrderI, string>;
  getOrders: HasManyGetAssociationsMixin<OrderI>;
  setOrders: HasManySetAssociationsMixin<OrderI, string>;
  addOrder: HasManyAddAssociationMixin<OrderI, string>;
  addOrders: HasManyAddAssociationsMixin<OrderI, string>;
  removeOrder: HasManyRemoveAssociationMixin<OrderI, string>;
  removeOrders: HasManyRemoveAssociationsMixin<OrderI, string>;
  createOrder: HasManyCreateAssociationMixin<OrderI>;

  // association: subscriptionOrders
  countSubscriptionOrders: HasManyCountAssociationsMixin;
  hasSubscriptionOrder: HasManyHasAssociationMixin<SubscriptionOrderI, string>;
  hasSubscriptionOrders: HasManyHasAssociationsMixin<SubscriptionOrderI, string>;
  getSubscriptionOrders: HasManyGetAssociationsMixin<SubscriptionOrderI>;
  setSubscriptionOrders: HasManySetAssociationsMixin<SubscriptionOrderI, string>;
  addSubscriptionOrder: HasManyAddAssociationMixin<SubscriptionOrderI, string>;
  addSubscriptionOrders: HasManyAddAssociationsMixin<SubscriptionOrderI, string>;
  removeSubscriptionOrder: HasManyRemoveAssociationMixin<SubscriptionOrderI, string>;
  removeSubscriptionOrders: HasManyRemoveAssociationsMixin<SubscriptionOrderI, string>;
  createSubscriptionOrder: HasManyCreateAssociationMixin<SubscriptionOrderI>;

  // association: coupons
  countCoupons: HasManyCountAssociationsMixin;
  hasCoupon: HasManyHasAssociationMixin<CouponI, string>;
  hasCoupons: HasManyHasAssociationsMixin<CouponI, string>;
  getCoupons: HasManyGetAssociationsMixin<CouponI>;
  setCoupons: HasManySetAssociationsMixin<CouponI, string>;
  addCoupon: HasManyAddAssociationMixin<CouponI, string>;
  addCoupons: HasManyAddAssociationsMixin<CouponI, string>;
  removeCoupon: HasManyRemoveAssociationMixin<CouponI, string>;
  removeCoupons: HasManyRemoveAssociationsMixin<CouponI, string>;
  createCoupon: HasManyCreateAssociationMixin<CouponI>;

  // association: provideCoupons
  countProvideCoupons: HasManyCountAssociationsMixin;
  hasProvideCoupon: HasManyHasAssociationMixin<CouponI, string>;
  hasProvideCoupons: HasManyHasAssociationsMixin<CouponI, string>;
  getProvideCoupons: HasManyGetAssociationsMixin<CouponI>;
  setProvideCoupons: HasManySetAssociationsMixin<CouponI, string>;
  addProvideCoupon: HasManyAddAssociationMixin<CouponI, string>;
  addProvideCoupons: HasManyAddAssociationsMixin<CouponI, string>;
  removeProvideCoupon: HasManyRemoveAssociationMixin<CouponI, string>;
  removeProvideCoupons: HasManyRemoveAssociationsMixin<CouponI, string>;
  createProvideCoupon: HasManyCreateAssociationMixin<CouponI>;

  // association: couponRecords
  countCouponRecords: HasManyCountAssociationsMixin;
  hasCouponRecord: HasManyHasAssociationMixin<CouponRecordI, string>;
  hasCouponRecords: HasManyHasAssociationsMixin<CouponRecordI, string>;
  getCouponRecords: HasManyGetAssociationsMixin<CouponRecordI>;
  setCouponRecords: HasManySetAssociationsMixin<CouponRecordI, string>;
  addCouponRecord: HasManyAddAssociationMixin<CouponRecordI, string>;
  addCouponRecords: HasManyAddAssociationsMixin<CouponRecordI, string>;
  removeCouponRecord: HasManyRemoveAssociationMixin<CouponRecordI, string>;
  removeCouponRecords: HasManyRemoveAssociationsMixin<CouponRecordI, string>;
  createCouponRecord: HasManyCreateAssociationMixin<CouponRecordI>;
};
// ============== end model: User ==============

// ============== start model: UserSetting ==============
export type UserSettingCreationAttributes = {
  type?: string;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
};

export type UserSettingAttributes = {
  id: string;
  type?: string;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
};

export type UserSettingI = UserSettingAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;
};
// ============== end model: UserSetting ==============

// ============== start model: BrowserSession ==============
export type BrowserSessionCreationAttributes = {
  sessionId?: string;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
  products?: ProductCreationAttributes[];
};

export type BrowserSessionAttributes = {
  id: string;
  sessionId?: string;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  products?: ExtendedModel<ProductI>[];
};

export type BrowserSessionI = BrowserSessionAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: products
  countProducts: BelongsToManyCountAssociationsMixin;
  hasProduct: BelongsToManyHasAssociationMixin<ProductI, string>;
  hasProducts: BelongsToManyHasAssociationsMixin<ProductI, string>;
  getProducts: BelongsToManyGetAssociationsMixin<ProductI>;
  setProducts: BelongsToManySetAssociationsMixin<ProductI, string>;
  addProduct: BelongsToManyAddAssociationMixin<ProductI, string>;
  addProducts: BelongsToManyAddAssociationsMixin<ProductI, string>;
  removeProduct: BelongsToManyRemoveAssociationMixin<ProductI, string>;
  removeProducts: BelongsToManyRemoveAssociationsMixin<ProductI, string>;
  createProduct: BelongsToManyCreateAssociationMixin<ProductI>;

};
// ============== end model: BrowserSession ==============

// ============== start model: Notification ==============
export type NotificationCreationAttributes = {
  sessionId?: string;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
};

export type NotificationAttributes = {
  id: string;
  sessionId?: string;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
};

export type NotificationI = NotificationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;
};
// ============== end model: Notification ==============

// ============== start model: Log ==============
export type LogCreationAttributes = {
  type?: string;
  data?: any;
};

export type LogAttributes = {
  id: string;
  type?: string;
  data?: any;
};

export type LogI = LogAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;
};
// ============== end model: Log ==============

// ============== start model: RecoveryToken ==============
export type RecoveryTokenCreationAttributes = {
  type?: string;
  key?: string;
  token?: string;
  account_link_id?: string;
  accountLink?: AccountLinkCreationAttributes;
};

export type RecoveryTokenAttributes = {
  id: string;
  type?: string;
  key?: string;
  token?: string;
  account_link_id?: string;
  accountLink?: ExtendedModel<AccountLinkI>;
};

export type RecoveryTokenI = RecoveryTokenAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: accountLink
  getAccountLink: BelongsToGetAssociationMixin<AccountLinkI>;
  setAccountLink: BelongsToSetAssociationMixin<AccountLinkI, string>;
  createAccountLink: BelongsToCreateAssociationMixin<AccountLinkI>;
};
// ============== end model: RecoveryToken ==============

// ============== start model: UserGroup ==============
export type UserGroupCreationAttributes = {
  name?: string;
  users?: UserCreationAttributes[];
  inviters?: UserCreationAttributes[];
  invitees?: UserCreationAttributes[];
};

export type UserGroupAttributes = {
  id: string;
  name?: string;
  users?: ExtendedModel<UserI>[];
  inviters?: ExtendedModel<UserI>[];
  invitees?: ExtendedModel<UserI>[];
};

export type UserGroupI = UserGroupAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: users
  countUsers: BelongsToManyCountAssociationsMixin;
  hasUser: BelongsToManyHasAssociationMixin<UserI, string>;
  hasUsers: BelongsToManyHasAssociationsMixin<UserI, string>;
  getUsers: BelongsToManyGetAssociationsMixin<UserI>;
  setUsers: BelongsToManySetAssociationsMixin<UserI, string>;
  addUser: BelongsToManyAddAssociationMixin<UserI, string>;
  addUsers: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeUser: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeUsers: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createUser: BelongsToManyCreateAssociationMixin<UserI>;


  // association: inviters
  countInviters: BelongsToManyCountAssociationsMixin;
  hasInviter: BelongsToManyHasAssociationMixin<UserI, string>;
  hasInviters: BelongsToManyHasAssociationsMixin<UserI, string>;
  getInviters: BelongsToManyGetAssociationsMixin<UserI>;
  setInviters: BelongsToManySetAssociationsMixin<UserI, string>;
  addInviter: BelongsToManyAddAssociationMixin<UserI, string>;
  addInviters: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeInviter: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeInviters: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createInviter: BelongsToManyCreateAssociationMixin<UserI>;


  // association: invitees
  countInvitees: BelongsToManyCountAssociationsMixin;
  hasInvitee: BelongsToManyHasAssociationMixin<UserI, string>;
  hasInvitees: BelongsToManyHasAssociationsMixin<UserI, string>;
  getInvitees: BelongsToManyGetAssociationsMixin<UserI>;
  setInvitees: BelongsToManySetAssociationsMixin<UserI, string>;
  addInvitee: BelongsToManyAddAssociationMixin<UserI, string>;
  addInvitees: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeInvitee: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeInvitees: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createInvitee: BelongsToManyCreateAssociationMixin<UserI>;

};
// ============== end model: UserGroup ==============

// ============== start model: Organization ==============
export type OrganizationCreationAttributes = {
  name?: string;
  data?: any;
  users?: UserCreationAttributes[];
  ownedUser?: UserCreationAttributes[];
  projects?: ProjectCreationAttributes[];
  inviters?: UserCreationAttributes[];
  invitees?: UserCreationAttributes[];
};

export type OrganizationAttributes = {
  id: string;
  name?: string;
  data?: any;
  users?: ExtendedModel<UserI>[];
  ownedUser?: ExtendedModel<UserI>[];
  projects?: ExtendedModel<ProjectI>[];
  inviters?: ExtendedModel<UserI>[];
  invitees?: ExtendedModel<UserI>[];
};

export type OrganizationI = OrganizationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: users
  countUsers: BelongsToManyCountAssociationsMixin;
  hasUser: BelongsToManyHasAssociationMixin<UserI, string>;
  hasUsers: BelongsToManyHasAssociationsMixin<UserI, string>;
  getUsers: BelongsToManyGetAssociationsMixin<UserI>;
  setUsers: BelongsToManySetAssociationsMixin<UserI, string>;
  addUser: BelongsToManyAddAssociationMixin<UserI, string>;
  addUsers: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeUser: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeUsers: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createUser: BelongsToManyCreateAssociationMixin<UserI>;


  // association: ownedUser
  countOwnedUsers: HasManyCountAssociationsMixin;
  hasOwnedUser: HasManyHasAssociationMixin<UserI, string>;
  hasOwnedUsers: HasManyHasAssociationsMixin<UserI, string>;
  getOwnedUsers: HasManyGetAssociationsMixin<UserI>;
  setOwnedUsers: HasManySetAssociationsMixin<UserI, string>;
  addOwnedUser: HasManyAddAssociationMixin<UserI, string>;
  addOwnedUsers: HasManyAddAssociationsMixin<UserI, string>;
  removeOwnedUser: HasManyRemoveAssociationMixin<UserI, string>;
  removeOwnedUsers: HasManyRemoveAssociationsMixin<UserI, string>;
  createOwnedUser: HasManyCreateAssociationMixin<UserI>;

  // association: projects
  countProjects: HasManyCountAssociationsMixin;
  hasProject: HasManyHasAssociationMixin<ProjectI, string>;
  hasProjects: HasManyHasAssociationsMixin<ProjectI, string>;
  getProjects: HasManyGetAssociationsMixin<ProjectI>;
  setProjects: HasManySetAssociationsMixin<ProjectI, string>;
  addProject: HasManyAddAssociationMixin<ProjectI, string>;
  addProjects: HasManyAddAssociationsMixin<ProjectI, string>;
  removeProject: HasManyRemoveAssociationMixin<ProjectI, string>;
  removeProjects: HasManyRemoveAssociationsMixin<ProjectI, string>;
  createProject: HasManyCreateAssociationMixin<ProjectI>;

  // association: inviters
  countInviters: BelongsToManyCountAssociationsMixin;
  hasInviter: BelongsToManyHasAssociationMixin<UserI, string>;
  hasInviters: BelongsToManyHasAssociationsMixin<UserI, string>;
  getInviters: BelongsToManyGetAssociationsMixin<UserI>;
  setInviters: BelongsToManySetAssociationsMixin<UserI, string>;
  addInviter: BelongsToManyAddAssociationMixin<UserI, string>;
  addInviters: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeInviter: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeInviters: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createInviter: BelongsToManyCreateAssociationMixin<UserI>;


  // association: invitees
  countInvitees: BelongsToManyCountAssociationsMixin;
  hasInvitee: BelongsToManyHasAssociationMixin<UserI, string>;
  hasInvitees: BelongsToManyHasAssociationsMixin<UserI, string>;
  getInvitees: BelongsToManyGetAssociationsMixin<UserI>;
  setInvitees: BelongsToManySetAssociationsMixin<UserI, string>;
  addInvitee: BelongsToManyAddAssociationMixin<UserI, string>;
  addInvitees: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeInvitee: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeInvitees: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createInvitee: BelongsToManyCreateAssociationMixin<UserI>;

};
// ============== end model: Organization ==============

// ============== start model: Project ==============
export type ProjectCreationAttributes = {
  type?: string;
  name?: string;
  data?: any;
  users?: UserCreationAttributes[];
  organization_id?: string;
  organization?: OrganizationCreationAttributes;
  inviters?: UserCreationAttributes[];
  invitees?: UserCreationAttributes[];
};

export type ProjectAttributes = {
  id: string;
  type?: string;
  name?: string;
  data?: any;
  users?: ExtendedModel<UserI>[];
  organization_id?: string;
  organization?: ExtendedModel<OrganizationI>;
  inviters?: ExtendedModel<UserI>[];
  invitees?: ExtendedModel<UserI>[];
};

export type ProjectI = ProjectAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: users
  countUsers: BelongsToManyCountAssociationsMixin;
  hasUser: BelongsToManyHasAssociationMixin<UserI, string>;
  hasUsers: BelongsToManyHasAssociationsMixin<UserI, string>;
  getUsers: BelongsToManyGetAssociationsMixin<UserI>;
  setUsers: BelongsToManySetAssociationsMixin<UserI, string>;
  addUser: BelongsToManyAddAssociationMixin<UserI, string>;
  addUsers: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeUser: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeUsers: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createUser: BelongsToManyCreateAssociationMixin<UserI>;


  // association: organization
  getOrganization: BelongsToGetAssociationMixin<OrganizationI>;
  setOrganization: BelongsToSetAssociationMixin<OrganizationI, string>;
  createOrganization: BelongsToCreateAssociationMixin<OrganizationI>;

  // association: inviters
  countInviters: BelongsToManyCountAssociationsMixin;
  hasInviter: BelongsToManyHasAssociationMixin<UserI, string>;
  hasInviters: BelongsToManyHasAssociationsMixin<UserI, string>;
  getInviters: BelongsToManyGetAssociationsMixin<UserI>;
  setInviters: BelongsToManySetAssociationsMixin<UserI, string>;
  addInviter: BelongsToManyAddAssociationMixin<UserI, string>;
  addInviters: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeInviter: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeInviters: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createInviter: BelongsToManyCreateAssociationMixin<UserI>;


  // association: invitees
  countInvitees: BelongsToManyCountAssociationsMixin;
  hasInvitee: BelongsToManyHasAssociationMixin<UserI, string>;
  hasInvitees: BelongsToManyHasAssociationsMixin<UserI, string>;
  getInvitees: BelongsToManyGetAssociationsMixin<UserI>;
  setInvitees: BelongsToManySetAssociationsMixin<UserI, string>;
  addInvitee: BelongsToManyAddAssociationMixin<UserI, string>;
  addInvitees: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeInvitee: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeInvitees: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createInvitee: BelongsToManyCreateAssociationMixin<UserI>;

};
// ============== end model: Project ==============

// ============== start model: Memo ==============
export type MemoCreationAttributes = {
  data?: any;
  users?: UserCreationAttributes[];
};

export type MemoAttributes = {
  id: string;
  data?: any;
  users?: ExtendedModel<UserI>[];
};

export type MemoI = MemoAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: users
  countUsers: BelongsToManyCountAssociationsMixin;
  hasUser: BelongsToManyHasAssociationMixin<UserI, string>;
  hasUsers: BelongsToManyHasAssociationsMixin<UserI, string>;
  getUsers: BelongsToManyGetAssociationsMixin<UserI>;
  setUsers: BelongsToManySetAssociationsMixin<UserI, string>;
  addUser: BelongsToManyAddAssociationMixin<UserI, string>;
  addUsers: BelongsToManyAddAssociationsMixin<UserI, string>;
  removeUser: BelongsToManyRemoveAssociationMixin<UserI, string>;
  removeUsers: BelongsToManyRemoveAssociationsMixin<UserI, string>;
  createUser: BelongsToManyCreateAssociationMixin<UserI>;

};
// ============== end model: Memo ==============

// ============== start model: ContactUsMessage ==============
export type ContactUsMessageCreationAttributes = {
  message?: string;
  data?: any;
  author_id?: string;
  author?: UserCreationAttributes;
  assignee_id?: string;
  assignee?: UserCreationAttributes;
  state?: string;
};

export type ContactUsMessageAttributes = {
  id: string;
  message?: string;
  data?: any;
  author_id?: string;
  author?: ExtendedModel<UserI>;
  assignee_id?: string;
  assignee?: ExtendedModel<UserI>;
  state?: string;
};

export type ContactUsMessageI = ContactUsMessageAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: author
  getAuthor: BelongsToGetAssociationMixin<UserI>;
  setAuthor: BelongsToSetAssociationMixin<UserI, string>;
  createAuthor: BelongsToCreateAssociationMixin<UserI>;

  // association: assignee
  getAssignee: BelongsToGetAssociationMixin<UserI>;
  setAssignee: BelongsToSetAssociationMixin<UserI, string>;
  createAssignee: BelongsToCreateAssociationMixin<UserI>;
};
// ============== end model: ContactUsMessage ==============

// ============== start model: ProductCategory ==============
export type ProductCategoryCreationAttributes = {
  name?: string;
  nameEn?: string;
  priority?: number;
  active?: boolean;
  data?: any;
  groups?: ProductGroupCreationAttributes[];
};

export type ProductCategoryAttributes = {
  id: string;
  name?: string;
  nameEn?: string;
  priority?: number;
  active?: boolean;
  data?: any;
  groups?: ExtendedModel<ProductGroupI>[];
};

export type ProductCategoryI = ProductCategoryAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: groups
  countGroups: HasManyCountAssociationsMixin;
  hasGroup: HasManyHasAssociationMixin<ProductGroupI, string>;
  hasGroups: HasManyHasAssociationsMixin<ProductGroupI, string>;
  getGroups: HasManyGetAssociationsMixin<ProductGroupI>;
  setGroups: HasManySetAssociationsMixin<ProductGroupI, string>;
  addGroup: HasManyAddAssociationMixin<ProductGroupI, string>;
  addGroups: HasManyAddAssociationsMixin<ProductGroupI, string>;
  removeGroup: HasManyRemoveAssociationMixin<ProductGroupI, string>;
  removeGroups: HasManyRemoveAssociationsMixin<ProductGroupI, string>;
  createGroup: HasManyCreateAssociationMixin<ProductGroupI>;
};
// ============== end model: ProductCategory ==============

// ============== start model: Product ==============
export type ProductCreationAttributes = {
  uid?: string;
  customId?: string;
  color?: string;
  colorName?: string;
  colorCode?: string;
  size?: string;
  thumbnail?: any;
  pictures?: any;
  type?: string;
  name?: string;
  nameEn?: string;
  price?: number;
  weight?: number;
  description?: string;
  materials?: string;
  data?: any;
  disabled?: boolean;
  variantData?: any;
  sizeChart?: string;
  priority?: number;
  ordering?: number;
  instock?: number;
  orderQuota?: number;
  isLimit?: boolean;
  soldout?: boolean;
  group_id?: string;
  group?: ProductGroupCreationAttributes;
  carts?: BrowserSessionCreationAttributes[];
  orders?: OrderCreationAttributes[];
};

export type ProductAttributes = {
  id: string;
  uid?: string;
  customId?: string;
  color?: string;
  colorName?: string;
  colorCode?: string;
  size?: string;
  thumbnail?: any;
  pictures?: any;
  type?: string;
  name?: string;
  nameEn?: string;
  price?: number;
  weight?: number;
  description?: string;
  materials?: string;
  data?: any;
  disabled?: boolean;
  variantData?: any;
  sizeChart?: string;
  priority?: number;
  ordering?: number;
  instock?: number;
  orderQuota?: number;
  isLimit?: boolean;
  soldout?: boolean;
  group_id?: string;
  group?: ExtendedModel<ProductGroupI>;
  carts?: ExtendedModel<BrowserSessionI>[];
  orders?: ExtendedModel<OrderI>[];
};

export type ProductI = ProductAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: group
  getGroup: BelongsToGetAssociationMixin<ProductGroupI>;
  setGroup: BelongsToSetAssociationMixin<ProductGroupI, string>;
  createGroup: BelongsToCreateAssociationMixin<ProductGroupI>;

  // association: carts
  countCarts: BelongsToManyCountAssociationsMixin;
  hasCart: BelongsToManyHasAssociationMixin<BrowserSessionI, string>;
  hasCarts: BelongsToManyHasAssociationsMixin<BrowserSessionI, string>;
  getCarts: BelongsToManyGetAssociationsMixin<BrowserSessionI>;
  setCarts: BelongsToManySetAssociationsMixin<BrowserSessionI, string>;
  addCart: BelongsToManyAddAssociationMixin<BrowserSessionI, string>;
  addCarts: BelongsToManyAddAssociationsMixin<BrowserSessionI, string>;
  removeCart: BelongsToManyRemoveAssociationMixin<BrowserSessionI, string>;
  removeCarts: BelongsToManyRemoveAssociationsMixin<BrowserSessionI, string>;
  createCart: BelongsToManyCreateAssociationMixin<BrowserSessionI>;


  // association: orders
  countOrders: BelongsToManyCountAssociationsMixin;
  hasOrder: BelongsToManyHasAssociationMixin<OrderI, string>;
  hasOrders: BelongsToManyHasAssociationsMixin<OrderI, string>;
  getOrders: BelongsToManyGetAssociationsMixin<OrderI>;
  setOrders: BelongsToManySetAssociationsMixin<OrderI, string>;
  addOrder: BelongsToManyAddAssociationMixin<OrderI, string>;
  addOrders: BelongsToManyAddAssociationsMixin<OrderI, string>;
  removeOrder: BelongsToManyRemoveAssociationMixin<OrderI, string>;
  removeOrders: BelongsToManyRemoveAssociationsMixin<OrderI, string>;
  createOrder: BelongsToManyCreateAssociationMixin<OrderI>;

};
// ============== end model: Product ==============

// ============== start model: ProductGroup ==============
export type ProductGroupCreationAttributes = {
  uid?: string;
  customId?: string;
  thumbnail?: any;
  pictures?: any;
  type?: string;
  name?: string;
  nameEn?: string;
  price?: number;
  weight?: number;
  description?: string;
  materials?: string;
  data?: any;
  disabled?: boolean;
  products?: ProductCreationAttributes[];
  category_id?: string;
  category?: ProductCategoryCreationAttributes;
  campaigns?: CampaignCreationAttributes[];
};

export type ProductGroupAttributes = {
  id: string;
  uid?: string;
  customId?: string;
  thumbnail?: any;
  pictures?: any;
  type?: string;
  name?: string;
  nameEn?: string;
  price?: number;
  weight?: number;
  description?: string;
  materials?: string;
  data?: any;
  disabled?: boolean;
  products?: ExtendedModel<ProductI>[];
  category_id?: string;
  category?: ExtendedModel<ProductCategoryI>;
  campaigns?: ExtendedModel<CampaignI>[];
};

export type ProductGroupI = ProductGroupAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: products
  countProducts: HasManyCountAssociationsMixin;
  hasProduct: HasManyHasAssociationMixin<ProductI, string>;
  hasProducts: HasManyHasAssociationsMixin<ProductI, string>;
  getProducts: HasManyGetAssociationsMixin<ProductI>;
  setProducts: HasManySetAssociationsMixin<ProductI, string>;
  addProduct: HasManyAddAssociationMixin<ProductI, string>;
  addProducts: HasManyAddAssociationsMixin<ProductI, string>;
  removeProduct: HasManyRemoveAssociationMixin<ProductI, string>;
  removeProducts: HasManyRemoveAssociationsMixin<ProductI, string>;
  createProduct: HasManyCreateAssociationMixin<ProductI>;

  // association: category
  getCategory: BelongsToGetAssociationMixin<ProductCategoryI>;
  setCategory: BelongsToSetAssociationMixin<ProductCategoryI, string>;
  createCategory: BelongsToCreateAssociationMixin<ProductCategoryI>;

  // association: campaigns
  countCampaigns: BelongsToManyCountAssociationsMixin;
  hasCampaign: BelongsToManyHasAssociationMixin<CampaignI, string>;
  hasCampaigns: BelongsToManyHasAssociationsMixin<CampaignI, string>;
  getCampaigns: BelongsToManyGetAssociationsMixin<CampaignI>;
  setCampaigns: BelongsToManySetAssociationsMixin<CampaignI, string>;
  addCampaign: BelongsToManyAddAssociationMixin<CampaignI, string>;
  addCampaigns: BelongsToManyAddAssociationsMixin<CampaignI, string>;
  removeCampaign: BelongsToManyRemoveAssociationMixin<CampaignI, string>;
  removeCampaigns: BelongsToManyRemoveAssociationsMixin<CampaignI, string>;
  createCampaign: BelongsToManyCreateAssociationMixin<CampaignI>;

};
// ============== end model: ProductGroup ==============

// ============== start model: Campaign ==============
export type CampaignCreationAttributes = {
  name?: string;
  type?: string;
  durationType?: string;
  start?: Date;
  end?: Date;
  state?: string;
  data?: any;
  productGroups?: ProductGroupCreationAttributes[];
};

export type CampaignAttributes = {
  id: string;
  name?: string;
  type?: string;
  durationType?: string;
  start?: Date;
  end?: Date;
  state?: string;
  data?: any;
  productGroups?: ExtendedModel<ProductGroupI>[];
};

export type CampaignI = CampaignAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: productGroups
  countProductGroups: BelongsToManyCountAssociationsMixin;
  hasProductGroup: BelongsToManyHasAssociationMixin<ProductGroupI, string>;
  hasProductGroups: BelongsToManyHasAssociationsMixin<ProductGroupI, string>;
  getProductGroups: BelongsToManyGetAssociationsMixin<ProductGroupI>;
  setProductGroups: BelongsToManySetAssociationsMixin<ProductGroupI, string>;
  addProductGroup: BelongsToManyAddAssociationMixin<ProductGroupI, string>;
  addProductGroups: BelongsToManyAddAssociationsMixin<ProductGroupI, string>;
  removeProductGroup: BelongsToManyRemoveAssociationMixin<ProductGroupI, string>;
  removeProductGroups: BelongsToManyRemoveAssociationsMixin<ProductGroupI, string>;
  createProductGroup: BelongsToManyCreateAssociationMixin<ProductGroupI>;

};
// ============== end model: Campaign ==============

// ============== start model: OrdererInfo ==============
export type OrdererInfoCreationAttributes = {
  configName?: string;
  name?: string;
  mobile?: string;
  phone1?: string;
  phone2?: string;
  zipcode?: string;
  address?: string;
  area?: string;
  email1?: string;
  email2?: string;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
  as_default_to?: string;
  asDefaultTo?: UserCreationAttributes;
};

export type OrdererInfoAttributes = {
  id: string;
  configName?: string;
  name?: string;
  mobile?: string;
  phone1?: string;
  phone2?: string;
  zipcode?: string;
  address?: string;
  area?: string;
  email1?: string;
  email2?: string;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  as_default_to?: string;
  asDefaultTo?: ExtendedModel<UserI>;
};

export type OrdererInfoI = OrdererInfoAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: asDefaultTo
  getAsDefaultTo: BelongsToGetAssociationMixin<UserI>;
  setAsDefaultTo: BelongsToSetAssociationMixin<UserI, string>;
  createAsDefaultTo: BelongsToCreateAssociationMixin<UserI>;
};
// ============== end model: OrdererInfo ==============

// ============== start model: RecipientInfo ==============
export type RecipientInfoCreationAttributes = {
  configName?: string;
  name?: string;
  mobile?: string;
  phone1?: string;
  phone2?: string;
  zipcode?: string;
  address?: string;
  area?: string;
  email1?: string;
  email2?: string;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
  as_default_to?: string;
  asDefaultTo?: UserCreationAttributes;
};

export type RecipientInfoAttributes = {
  id: string;
  configName?: string;
  name?: string;
  mobile?: string;
  phone1?: string;
  phone2?: string;
  zipcode?: string;
  address?: string;
  area?: string;
  email1?: string;
  email2?: string;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  as_default_to?: string;
  asDefaultTo?: ExtendedModel<UserI>;
};

export type RecipientInfoI = RecipientInfoAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: asDefaultTo
  getAsDefaultTo: BelongsToGetAssociationMixin<UserI>;
  setAsDefaultTo: BelongsToSetAssociationMixin<UserI, string>;
  createAsDefaultTo: BelongsToCreateAssociationMixin<UserI>;
};
// ============== end model: RecipientInfo ==============

// ============== start model: Order ==============
export type OrderCreationAttributes = {
  state?: string;
  memo?: string;
  shipmentId?: string;
  orderer?: any;
  recipient?: any;
  data?: any;
  payWay?: string;
  payTime?: Date;
  selectedAt?: Date;
  expiredAt?: Date;
  paidAt?: Date;
  shippedAt?: Date;
  atmAccount?: string;
  esunData?: string;
  esunOrderId?: string;
  esunTradeInfo?: string;
  esunTradeState?: string;
  cvsName?: string;
  smseData?: string;
  smsePayno?: string;
  smseSmilepayno?: string;
  user_id?: string;
  user?: UserCreationAttributes;
  products?: ProductCreationAttributes[];
  couponRecord?: CouponRecordCreationAttributes;
};

export type OrderAttributes = {
  id: string;
  state?: string;
  memo?: string;
  shipmentId?: string;
  orderer?: any;
  recipient?: any;
  data?: any;
  payWay?: string;
  payTime?: Date;
  selectedAt?: Date;
  expiredAt?: Date;
  paidAt?: Date;
  shippedAt?: Date;
  atmAccount?: string;
  esunData?: string;
  esunOrderId?: string;
  esunTradeInfo?: string;
  esunTradeState?: string;
  cvsName?: string;
  smseData?: string;
  smsePayno?: string;
  smseSmilepayno?: string;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  products?: ExtendedModel<ProductI>[];
  couponRecord?: ExtendedModel<CouponRecordI>;
};

export type OrderI = OrderAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: products
  countProducts: BelongsToManyCountAssociationsMixin;
  hasProduct: BelongsToManyHasAssociationMixin<ProductI, string>;
  hasProducts: BelongsToManyHasAssociationsMixin<ProductI, string>;
  getProducts: BelongsToManyGetAssociationsMixin<ProductI>;
  setProducts: BelongsToManySetAssociationsMixin<ProductI, string>;
  addProduct: BelongsToManyAddAssociationMixin<ProductI, string>;
  addProducts: BelongsToManyAddAssociationsMixin<ProductI, string>;
  removeProduct: BelongsToManyRemoveAssociationMixin<ProductI, string>;
  removeProducts: BelongsToManyRemoveAssociationsMixin<ProductI, string>;
  createProduct: BelongsToManyCreateAssociationMixin<ProductI>;


  // association: couponRecord
  getCouponRecord: HasOneGetAssociationMixin<CouponRecordI>;
  setCouponRecord: HasOneSetAssociationMixin<CouponRecordI, string>;
  createCouponRecord: HasOneCreateAssociationMixin<CouponRecordI>;
};
// ============== end model: Order ==============

// ============== start model: SubscriptionOrder ==============
export type SubscriptionOrderCreationAttributes = {
  memo?: string;
  shipmentId?: string;
  orderer?: any;
  recipient?: any;
  data?: any;
  user_id?: string;
  user?: UserCreationAttributes;
};

export type SubscriptionOrderAttributes = {
  id: string;
  memo?: string;
  shipmentId?: string;
  orderer?: any;
  recipient?: any;
  data?: any;
  user_id?: string;
  user?: ExtendedModel<UserI>;
};

export type SubscriptionOrderI = SubscriptionOrderAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;
};
// ============== end model: SubscriptionOrder ==============

// ============== start model: Coupon ==============
export type CouponCreationAttributes = {
  price?: number;
  isDeduct?: boolean;
  memo?: string;
  data?: any;
  admin_user_id?: string;
  adminUser?: UserCreationAttributes;
  user_id?: string;
  user?: UserCreationAttributes;
  couponRecord?: CouponRecordCreationAttributes;
};

export type CouponAttributes = {
  id: string;
  price?: number;
  isDeduct?: boolean;
  memo?: string;
  data?: any;
  admin_user_id?: string;
  adminUser?: ExtendedModel<UserI>;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  couponRecord?: ExtendedModel<CouponRecordI>;
};

export type CouponI = CouponAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: adminUser
  getAdminUser: BelongsToGetAssociationMixin<UserI>;
  setAdminUser: BelongsToSetAssociationMixin<UserI, string>;
  createAdminUser: BelongsToCreateAssociationMixin<UserI>;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: couponRecord
  getCouponRecord: HasOneGetAssociationMixin<CouponRecordI>;
  setCouponRecord: HasOneSetAssociationMixin<CouponRecordI, string>;
  createCouponRecord: HasOneCreateAssociationMixin<CouponRecordI>;
};
// ============== end model: Coupon ==============

// ============== start model: CouponRecord ==============
export type CouponRecordCreationAttributes = {
  action?: string;
  price?: number;
  user_id?: string;
  user?: UserCreationAttributes;
  coupon_id?: string;
  byCoupon?: CouponCreationAttributes;
  order_id?: string;
  byOrder?: OrderCreationAttributes;
};

export type CouponRecordAttributes = {
  id: string;
  action?: string;
  price?: number;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  coupon_id?: string;
  byCoupon?: ExtendedModel<CouponI>;
  order_id?: string;
  byOrder?: ExtendedModel<OrderI>;
};

export type CouponRecordI = CouponRecordAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: byCoupon
  getByCoupon: BelongsToGetAssociationMixin<CouponI>;
  setByCoupon: BelongsToSetAssociationMixin<CouponI, string>;
  createByCoupon: BelongsToCreateAssociationMixin<CouponI>;

  // association: byOrder
  getByOrder: BelongsToGetAssociationMixin<OrderI>;
  setByOrder: BelongsToSetAssociationMixin<OrderI, string>;
  createByOrder: BelongsToCreateAssociationMixin<OrderI>;
};
// ============== end model: CouponRecord ==============

// ============== start model: UserUserGroup ==============
export type UserUserGroupCreationAttributes = {
  role?: string;
  user_id?: string;
  user?: UserCreationAttributes;
  group_id?: string;
  group?: UserGroupCreationAttributes;
};

export type UserUserGroupAttributes = {
  id: string;
  role?: string;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  group_id?: string;
  group?: ExtendedModel<UserGroupI>;
};

export type UserUserGroupI = UserUserGroupAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: group
  getGroup: BelongsToGetAssociationMixin<UserGroupI>;
  setGroup: BelongsToSetAssociationMixin<UserGroupI, string>;
  createGroup: BelongsToCreateAssociationMixin<UserGroupI>;
};
// ============== end model: UserUserGroup ==============

// ============== start model: GroupInvitation ==============
export type GroupInvitationCreationAttributes = {
  state?: number;
  invitee_id?: string;
  invitee?: UserCreationAttributes;
  inviter_id?: string;
  inviter?: UserCreationAttributes;
  group_id?: string;
  group?: UserGroupCreationAttributes;
};

export type GroupInvitationAttributes = {
  id: string;
  state?: number;
  invitee_id?: string;
  invitee?: ExtendedModel<UserI>;
  inviter_id?: string;
  inviter?: ExtendedModel<UserI>;
  group_id?: string;
  group?: ExtendedModel<UserGroupI>;
};

export type GroupInvitationI = GroupInvitationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: invitee
  getInvitee: BelongsToGetAssociationMixin<UserI>;
  setInvitee: BelongsToSetAssociationMixin<UserI, string>;
  createInvitee: BelongsToCreateAssociationMixin<UserI>;

  // association: inviter
  getInviter: BelongsToGetAssociationMixin<UserI>;
  setInviter: BelongsToSetAssociationMixin<UserI, string>;
  createInviter: BelongsToCreateAssociationMixin<UserI>;

  // association: group
  getGroup: BelongsToGetAssociationMixin<UserGroupI>;
  setGroup: BelongsToSetAssociationMixin<UserGroupI, string>;
  createGroup: BelongsToCreateAssociationMixin<UserGroupI>;
};
// ============== end model: GroupInvitation ==============

// ============== start model: UserOrganization ==============
export type UserOrganizationCreationAttributes = {
  labels?: any;
  data?: any;
  role?: string;
  user_id?: string;
  user?: UserCreationAttributes;
  organization_id?: string;
  organization?: OrganizationCreationAttributes;
};

export type UserOrganizationAttributes = {
  id: string;
  labels?: any;
  data?: any;
  role?: string;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  organization_id?: string;
  organization?: ExtendedModel<OrganizationI>;
};

export type UserOrganizationI = UserOrganizationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: organization
  getOrganization: BelongsToGetAssociationMixin<OrganizationI>;
  setOrganization: BelongsToSetAssociationMixin<OrganizationI, string>;
  createOrganization: BelongsToCreateAssociationMixin<OrganizationI>;
};
// ============== end model: UserOrganization ==============

// ============== start model: OrganizationInvitation ==============
export type OrganizationInvitationCreationAttributes = {
  state?: number;
  invitee_id?: string;
  invitee?: UserCreationAttributes;
  inviter_id?: string;
  inviter?: UserCreationAttributes;
  organization_id?: string;
  organization?: OrganizationCreationAttributes;
};

export type OrganizationInvitationAttributes = {
  id: string;
  state?: number;
  invitee_id?: string;
  invitee?: ExtendedModel<UserI>;
  inviter_id?: string;
  inviter?: ExtendedModel<UserI>;
  organization_id?: string;
  organization?: ExtendedModel<OrganizationI>;
};

export type OrganizationInvitationI = OrganizationInvitationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: invitee
  getInvitee: BelongsToGetAssociationMixin<UserI>;
  setInvitee: BelongsToSetAssociationMixin<UserI, string>;
  createInvitee: BelongsToCreateAssociationMixin<UserI>;

  // association: inviter
  getInviter: BelongsToGetAssociationMixin<UserI>;
  setInviter: BelongsToSetAssociationMixin<UserI, string>;
  createInviter: BelongsToCreateAssociationMixin<UserI>;

  // association: organization
  getOrganization: BelongsToGetAssociationMixin<OrganizationI>;
  setOrganization: BelongsToSetAssociationMixin<OrganizationI, string>;
  createOrganization: BelongsToCreateAssociationMixin<OrganizationI>;
};
// ============== end model: OrganizationInvitation ==============

// ============== start model: UserProject ==============
export type UserProjectCreationAttributes = {
  labels?: any;
  data?: any;
  role?: string;
  user_id?: string;
  user?: UserCreationAttributes;
  project_id?: string;
  project?: ProjectCreationAttributes;
};

export type UserProjectAttributes = {
  id: string;
  labels?: any;
  data?: any;
  role?: string;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  project_id?: string;
  project?: ExtendedModel<ProjectI>;
};

export type UserProjectI = UserProjectAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: project
  getProject: BelongsToGetAssociationMixin<ProjectI>;
  setProject: BelongsToSetAssociationMixin<ProjectI, string>;
  createProject: BelongsToCreateAssociationMixin<ProjectI>;
};
// ============== end model: UserProject ==============

// ============== start model: ProjectInvitation ==============
export type ProjectInvitationCreationAttributes = {
  state?: number;
  invitee_id?: string;
  invitee?: UserCreationAttributes;
  inviter_id?: string;
  inviter?: UserCreationAttributes;
  project_id?: string;
  project?: ProjectCreationAttributes;
};

export type ProjectInvitationAttributes = {
  id: string;
  state?: number;
  invitee_id?: string;
  invitee?: ExtendedModel<UserI>;
  inviter_id?: string;
  inviter?: ExtendedModel<UserI>;
  project_id?: string;
  project?: ExtendedModel<ProjectI>;
};

export type ProjectInvitationI = ProjectInvitationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: invitee
  getInvitee: BelongsToGetAssociationMixin<UserI>;
  setInvitee: BelongsToSetAssociationMixin<UserI, string>;
  createInvitee: BelongsToCreateAssociationMixin<UserI>;

  // association: inviter
  getInviter: BelongsToGetAssociationMixin<UserI>;
  setInviter: BelongsToSetAssociationMixin<UserI, string>;
  createInviter: BelongsToCreateAssociationMixin<UserI>;

  // association: project
  getProject: BelongsToGetAssociationMixin<ProjectI>;
  setProject: BelongsToSetAssociationMixin<ProjectI, string>;
  createProject: BelongsToCreateAssociationMixin<ProjectI>;
};
// ============== end model: ProjectInvitation ==============

// ============== start model: UserMemo ==============
export type UserMemoCreationAttributes = {
  role?: string;
  user_id?: string;
  user?: UserCreationAttributes;
  memo_id?: string;
  memo?: MemoCreationAttributes;
};

export type UserMemoAttributes = {
  id: string;
  role?: string;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  memo_id?: string;
  memo?: ExtendedModel<MemoI>;
};

export type UserMemoI = UserMemoAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: memo
  getMemo: BelongsToGetAssociationMixin<MemoI>;
  setMemo: BelongsToSetAssociationMixin<MemoI, string>;
  createMemo: BelongsToCreateAssociationMixin<MemoI>;
};
// ============== end model: UserMemo ==============

// ============== start model: CartProduct ==============
export type CartProductCreationAttributes = {
  quantity?: number;
  price?: number;
  subtotal?: number;
  assignedQuantity?: number;
  data?: any;
  cart_id?: string;
  cart?: BrowserSessionCreationAttributes;
  product_id?: string;
  product?: ProductCreationAttributes;
};

export type CartProductAttributes = {
  id: string;
  quantity?: number;
  price?: number;
  subtotal?: number;
  assignedQuantity?: number;
  data?: any;
  cart_id?: string;
  cart?: ExtendedModel<BrowserSessionI>;
  product_id?: string;
  product?: ExtendedModel<ProductI>;
};

export type CartProductI = CartProductAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: cart
  getCart: BelongsToGetAssociationMixin<BrowserSessionI>;
  setCart: BelongsToSetAssociationMixin<BrowserSessionI, string>;
  createCart: BelongsToCreateAssociationMixin<BrowserSessionI>;

  // association: product
  getProduct: BelongsToGetAssociationMixin<ProductI>;
  setProduct: BelongsToSetAssociationMixin<ProductI, string>;
  createProduct: BelongsToCreateAssociationMixin<ProductI>;
};
// ============== end model: CartProduct ==============

// ============== start model: OrderProduct ==============
export type OrderProductCreationAttributes = {
  quantity?: number;
  price?: number;
  subtotal?: number;
  assignedQuantity?: number;
  data?: any;
  product_id?: string;
  product?: ProductCreationAttributes;
  order_id?: string;
  order?: OrderCreationAttributes;
};

export type OrderProductAttributes = {
  id: string;
  quantity?: number;
  price?: number;
  subtotal?: number;
  assignedQuantity?: number;
  data?: any;
  product_id?: string;
  product?: ExtendedModel<ProductI>;
  order_id?: string;
  order?: ExtendedModel<OrderI>;
};

export type OrderProductI = OrderProductAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: product
  getProduct: BelongsToGetAssociationMixin<ProductI>;
  setProduct: BelongsToSetAssociationMixin<ProductI, string>;
  createProduct: BelongsToCreateAssociationMixin<ProductI>;

  // association: order
  getOrder: BelongsToGetAssociationMixin<OrderI>;
  setOrder: BelongsToSetAssociationMixin<OrderI, string>;
  createOrder: BelongsToCreateAssociationMixin<OrderI>;
};
// ============== end model: OrderProduct ==============

// ============== start model: ProductGroupCampaign ==============
export type ProductGroupCampaignCreationAttributes = {
  data?: any;
  product_group_id?: string;
  productGroup?: ProductGroupCreationAttributes;
  campaign_id?: string;
  campaign?: CampaignCreationAttributes;
};

export type ProductGroupCampaignAttributes = {
  id: string;
  data?: any;
  product_group_id?: string;
  productGroup?: ExtendedModel<ProductGroupI>;
  campaign_id?: string;
  campaign?: ExtendedModel<CampaignI>;
};

export type ProductGroupCampaignI = ProductGroupCampaignAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: productGroup
  getProductGroup: BelongsToGetAssociationMixin<ProductGroupI>;
  setProductGroup: BelongsToSetAssociationMixin<ProductGroupI, string>;
  createProductGroup: BelongsToCreateAssociationMixin<ProductGroupI>;

  // association: campaign
  getCampaign: BelongsToGetAssociationMixin<CampaignI>;
  setCampaign: BelongsToSetAssociationMixin<CampaignI, string>;
  createCampaign: BelongsToCreateAssociationMixin<CampaignI>;
};
// ============== end model: ProductGroupCampaign ==============

