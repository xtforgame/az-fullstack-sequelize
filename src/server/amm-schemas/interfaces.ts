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
  userGroups?: UserGroupCreationAttributes[];
  groupInvitations?: UserGroupCreationAttributes[];
  organizations?: OrganizationCreationAttributes[];
  organizationInvitations?: OrganizationCreationAttributes[];
  projects?: ProjectCreationAttributes[];
  projectInvitations?: ProjectCreationAttributes[];
  userSettings?: UserSettingCreationAttributes[];
  memos?: MemoCreationAttributes[];
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
  userGroups?: ExtendedModel<UserGroupI>[];
  groupInvitations?: ExtendedModel<UserGroupI>[];
  organizations?: ExtendedModel<OrganizationI>[];
  organizationInvitations?: ExtendedModel<OrganizationI>[];
  projects?: ExtendedModel<ProjectI>[];
  projectInvitations?: ExtendedModel<ProjectI>[];
  userSettings?: ExtendedModel<UserSettingI>[];
  memos?: ExtendedModel<MemoI>[];
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

// ============== start model: Log ==============
export type LogCreationAttributes = {
  type?: string;
  data?: any;
};

export type LogAttributes = {
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
  users?: UserCreationAttributes[];
  projects?: ProjectCreationAttributes[];
  inviters?: UserCreationAttributes[];
  invitees?: UserCreationAttributes[];
};

export type OrganizationAttributes = {
  id: string;
  name?: string;
  users?: ExtendedModel<UserI>[];
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

// ============== start model: UserUserGroup ==============
export type UserUserGroupCreationAttributes = {
  role?: string;
  user_id?: string;
  user?: UserCreationAttributes;
  group_id?: string;
  userGroup?: UserGroupCreationAttributes;
};

export type UserUserGroupAttributes = {
  id: string;
  role?: string;
  user_id?: string;
  user?: ExtendedModel<UserI>;
  group_id?: string;
  userGroup?: ExtendedModel<UserGroupI>;
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

  // association: userGroup
  getUserGroup: BelongsToGetAssociationMixin<UserGroupI>;
  setUserGroup: BelongsToSetAssociationMixin<UserGroupI, string>;
  createUserGroup: BelongsToCreateAssociationMixin<UserGroupI>;
};
// ============== end model: UserUserGroup ==============

// ============== start model: GroupInvitation ==============
export type GroupInvitationCreationAttributes = {
  state?: number;
  invitee_id?: string;
  user?: UserCreationAttributes;
  group_id?: string;
  userGroup?: UserGroupCreationAttributes;
};

export type GroupInvitationAttributes = {
  id: string;
  state?: number;
  invitee_id?: string;
  user?: ExtendedModel<UserI>;
  group_id?: string;
  userGroup?: ExtendedModel<UserGroupI>;
};

export type GroupInvitationI = GroupInvitationAttributes & {

  // timestamps
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date;

  // association: user
  getUser: BelongsToGetAssociationMixin<UserI>;
  setUser: BelongsToSetAssociationMixin<UserI, string>;
  createUser: BelongsToCreateAssociationMixin<UserI>;

  // association: userGroup
  getUserGroup: BelongsToGetAssociationMixin<UserGroupI>;
  setUserGroup: BelongsToSetAssociationMixin<UserGroupI, string>;
  createUserGroup: BelongsToCreateAssociationMixin<UserGroupI>;
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
  user?: UserCreationAttributes;
  organization_id?: string;
  organization?: OrganizationCreationAttributes;
};

export type OrganizationInvitationAttributes = {
  id: string;
  state?: number;
  invitee_id?: string;
  user?: ExtendedModel<UserI>;
  organization_id?: string;
  organization?: ExtendedModel<OrganizationI>;
};

export type OrganizationInvitationI = OrganizationInvitationAttributes & {

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
  user?: UserCreationAttributes;
  project_id?: string;
  project?: ProjectCreationAttributes;
};

export type ProjectInvitationAttributes = {
  id: string;
  state?: number;
  invitee_id?: string;
  user?: ExtendedModel<UserI>;
  project_id?: string;
  project?: ExtendedModel<ProjectI>;
};

export type ProjectInvitationI = ProjectInvitationAttributes & {

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

