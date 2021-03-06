import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { ProjectI, UserProjectI } from '../../amm-schemas/interfaces';
import { createNewUser } from './user';

export const findProject = async (resourceManager : AmmOrm, userId, projectId, includes : AssociationModelNameAsToInclude[] = []) => {
  const UserProject = resourceManager.getSqlzAssociationModel<UserProjectI>('userProject')!;
  const Project = resourceManager.getSqlzModel<ProjectI>('project')!;

  const userProject = await UserProject.findOne({
    where: {
      user_id: userId,
      project_id: projectId,
    },
  });
  if (!userProject) {
    return null;
  }
  return Project.findOne({
    where: {
      id: projectId,
    },
    include: Project.ammIncloud(includes),
  });
};

export const findAllProject = async (resourceManager : AmmOrm, where, includes : AssociationModelNameAsToInclude[] = []) => {
  const Project = resourceManager.getSqlzModel<ProjectI>('project')!;

  return Project.findAll({
    where,
    include: Project.ammIncloud(includes),
  });
};

export const findProjectMembers = async (resourceManager : AmmOrm, userId, projectId) => {
  const project = await findProject(resourceManager, userId, projectId, [
    {
      as: 'users',
      order: [
        ['created_at', 'ASC'],
      ],
    },
    {
      as: 'users.organizations',
      attributes: ['id', 'name'],
    },
  ]);
  if (!project) {
    return null;
  }
  return project.users;
};

export const patchProject = async (resourceManager : AmmOrm, projectId, data = {}) => {
  const Project = resourceManager.getSqlzModel<ProjectI>('project')!;
  await Project.update({
    data: Sequelize.literal(`data || '${JSON.stringify(data)}'::jsonb`),
  }, {
    where: {
      id: projectId,
    },
  });
  return Project.findOne({
    where: {
      id: projectId,
    },
  });
};

export const addProjectMember = async (resourceManager : AmmOrm, ownerId, projectId, targetData) => {
  // const User = resourceManager.getSqlzModel('user');
  const UserProject = resourceManager.getSqlzAssociationModel<UserProjectI>('userProject')!;
  // const Project = resourceManager.getSqlzModel<ProjectI>('project')!;

  const owner = await UserProject.findOne({
    where: {
      role: 'owner',
      user_id: ownerId,
      project_id: projectId,
    },
  });
  if (!owner) {
    return Promise.resolve(null);
  }
  const transaction = await resourceManager.db.transaction();
  const {
    id,
    name,
    disabled,
    role = 'user',
  } = targetData;
  try {
    const u = await UserProject.create({
      user_id: id,
      project_id: projectId,
      role,
      labels: { disabled, identifier: name },
    }, {
      transaction,
    });
    await transaction.commit();
    return u;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const removeProjectMember = async (resourceManager : AmmOrm, ownerId, projectId, memberId) => {
  // const User = resourceManager.getSqlzModel('user');
  const UserProject = resourceManager.getSqlzAssociationModel<UserProjectI>('userProject')!;
  // const Project = resourceManager.getSqlzModel<ProjectI>('project')!;

  const owner = await UserProject.findOne({
    where: {
      role: 'owner',
      user_id: ownerId,
      project_id: projectId,
    },
  });
  if (!owner) {
    return Promise.resolve(null);
  }
  const u = UserProject.destroy({
    where: {
      user_id: memberId,
      project_id: projectId,
    },
  });
  return u;
};

export const createProjectMember = async (resourceManager : AmmOrm, ownerId, projectId, targetData) => {
  // const User = resourceManager.getSqlzModel('user');
  const UserProject = resourceManager.getSqlzAssociationModel<UserProjectI>('userProject')!;
  // const Project = resourceManager.getSqlzModel<ProjectI>('project')!;

  const owner = await UserProject.findOne({
    where: {
      role: 'owner',
      user_id: ownerId,
      project_id: projectId,
    },
  });
  if (!owner) {
    return Promise.resolve(null);
  }
  const transaction = await resourceManager.db.transaction();
  const {
    username,
    password,
    name,
    privilege,
    disabled,
  } = targetData;
  try {
    const r = await createNewUser(resourceManager, {
      username,
      password,
      name,
      privilege,
    }, {
      org_mgr_id: projectId,
    }, transaction);
    await UserProject.create({
      user_id: r.id,
      project_id: projectId,
      labels: { disabled, identifier: name },
    }, {
      transaction,
    });
    await transaction.commit();
    return r;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const patchProjectMember = async (resourceManager : AmmOrm, ownerId, projectId, targetId, targetData) => {
  // const User = resourceManager.getSqlzModel('user');
  const UserProject = resourceManager.getSqlzAssociationModel<UserProjectI>('userProject')!;
  // const Project = resourceManager.getSqlzModel<ProjectI>('project')!;

  const owner = await UserProject.findOne({
    where: {
      role: 'owner',
      user_id: ownerId,
      project_id: projectId,
    },
  });
  if (!owner) {
    return null;
  }
  const labels : any = { identifier: targetData.identifier };
  const extras = targetData.role ? { role: targetData.role } : {};
  if (targetData.disabled != null) {
    labels.disabled = targetData.disabled;
  }
  return UserProject.update({
    ...extras,
    labels: Sequelize.literal(`labels || '${JSON.stringify(labels)}'::jsonb`),
  }, {
    where: {
      user_id: targetId,
      project_id: projectId,
    },
  });
};
