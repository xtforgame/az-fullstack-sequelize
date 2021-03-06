/* eslint-disable no-console */
import sequelize, { Sequelize, Options } from 'sequelize';
import axios from 'axios';
import { toCamel, capitalizeFirstLetter, toUnderscore } from 'common/utils';
import {
  AmmOrm,
  AmmSchemas,
  AmmModel,
  AssociationModel,
  IJsonSchema,
  IJsonSchemas,
  JsonSchemasX,
  JsonModelAttributeColumnOptions,
  HasOneOptions,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions,
  ThroughOptions,
  JsonModelAttributeInOptionsForm,
  typeConfigs,
  AmmSchema,
} from 'az-model-manager';

import {
  getJsonSchemasX, ModelExtraOptions, Permissions, PermissionOptions,
} from '../amm-schemas/index';

export type RelationshipRelatedModel = {
  jsonSchema : IJsonSchema;
  isAssociationModel : boolean;
  model : AmmModel;
}

export type RelationshipRelatedModelWithColumn = RelationshipRelatedModel & {
  columnName?: string;
  column?: JsonModelAttributeColumnOptions;
}

export type RelationshipRelatedModelsWithColumn = {
  table?: RelationshipRelatedModelWithColumn;
  refTable?: RelationshipRelatedModelWithColumn;
}

export type ViewInfo = {
  modelName: string;
  viewLevelName: string;
  viewTableName: string;
  columns: string[];
  columnNames: string[];
  permissions: Permissions;
  dropScript: string;
  createScript: string;
};

export type ViewsInfo = {
  isAssociationTable: boolean;
  modelName: string;
  publicColumns: string[];
  publicColumnNames: string[];
  restrictedColumns: string[];
  views: {
    [viewLevelName: string]: ViewInfo;
  };
};

export type ParsedHasuraModelInfo = {
  viewsInfo?: ViewsInfo,
};

class HasuraMgrBase {
  jsonSchemasX : JsonSchemasX;

  ammSchemas : AmmSchemas;

  database : Sequelize;

  ammOrm : AmmOrm;

  tableNameToAmmModel : { [s : string]: AmmModel };

  associationTableNameToAmmModel : { [s : string]: AssociationModel };

  tableParsedHasuraModelInfo : {
    [s : string]: ParsedHasuraModelInfo;
  }

  associationTableParsedHasuraModelInfo : {
    [s : string]: ParsedHasuraModelInfo;
  }

  constructor(pgUri: string, sqlzOptions?: Options) {
    this.jsonSchemasX = getJsonSchemasX();
    const ammSchemas = this.jsonSchemasX.toCoreSchemas();
    if (ammSchemas instanceof Error) {
      throw ammSchemas;
    }
    this.ammSchemas = ammSchemas;

    this.database = new Sequelize(pgUri, sqlzOptions);

    this.tableNameToAmmModel = {};
    this.ammOrm = new AmmOrm(this.database, this.ammSchemas);
    Object.keys(this.ammOrm.tableInfo).forEach((k) => {
      const model = this.ammOrm.tableInfo[k];
      this.tableNameToAmmModel[model.sqlzOptions.tableName!] = model;
    });
    this.associationTableNameToAmmModel = {};
    Object.keys(this.ammOrm.associationModelInfo).forEach((k) => {
      const model = this.ammOrm.associationModelInfo[k] as AssociationModel;
      this.associationTableNameToAmmModel[model.sqlzOptions.tableName!] = model;
    });

    this.tableParsedHasuraModelInfo = {};
    this.associationTableParsedHasuraModelInfo = {};
    const { models, associationModels } = this.jsonSchemasX.schemas;
    this.parseViewsInfos(false, models, associationModels, this.ammOrm.tableInfo)
    .forEach((viewsInfo) => {
      this.tableParsedHasuraModelInfo[viewsInfo.modelName] = {
        viewsInfo,
      };
    });
    // console.log('modelScripts :', modelScripts);
    this.parseViewsInfos(true, models, associationModels, <any>(this.ammOrm.associationModelInfo))
    .forEach((viewsInfo) => {
      this.associationTableParsedHasuraModelInfo[viewsInfo.modelName] = {
        viewsInfo,
      };
    });
    // console.log('associationScripts :', associationScripts);
    // console.log('this.associationTableNameToAmmModel :', this.associationTableNameToAmmModel);
  }

  getAssociationType = (column : JsonModelAttributeInOptionsForm) => {
    const {
      associationType,
    } = typeConfigs[column.type[0]];
    return associationType;
  };

  getForeignKey = (k: string, column : JsonModelAttributeInOptionsForm) => {
    const associationType = this.getAssociationType(column);
    if (!associationType) {
      return toUnderscore(k);
      // return null;
    }
    if (associationType === 'belongsTo') {
      // console.log('column.type[1] :', column.type[1]);
      const option = column.type[2] as BelongsToOptions;
      // console.log('option :', option);
      if (option.foreignKey) {
        if (typeof option.foreignKey === 'string') {
          return option.foreignKey;
        }
        return option.foreignKey.name!;
      }
    }
    return null;
  };

  parsePermission = (model: IJsonSchema<ModelExtraOptions>, permission: PermissionOptions, options: {
    models: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    associationModels: { [s: string]: IJsonSchema<ModelExtraOptions>;},
  }) => {
    const traverseFilter = (node, nodeKey, parent, op, cb : Function = (n => n)) => {
      if (node !== null && typeof node === 'object') {
        Object.entries(node).forEach(([key, value]) => {
          // key is either an array index or object key
          node[key] = traverseFilter(value, key, node, op, cb);
        });
      }
      return cb(node, nodeKey, parent, op, traverseFilter);
    };

    permission.filter = traverseFilter(permission.filter, '', null, options, (node, nodeKey, parent, op, t) => {
      return node;
    });
    return permission;
  }

  parsePermissions = (model: IJsonSchema<ModelExtraOptions>, permissions: Permissions, options: {
    models: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    associationModels: { [s: string]: IJsonSchema<ModelExtraOptions>;},
  }) => Object.keys(permissions).reduce((o, k) => ({ ...o, [k]: this.parsePermission(model, permissions[k], options) }), {});

  parseViewsInfo = (
    isAssociationTable,
    models: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    associationModels: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    modelName: string,
    model: IJsonSchema<ModelExtraOptions>,
    modelInfo: AmmModel,
  ) => {
    const tablePrefix = isAssociationTable ? 'mn_' : 'tbl_';
    const hasuraOptions = model.extraOptions?.hasura;
    if (!hasuraOptions || !modelInfo || !model) {
      return null;
    }
    const restrictedColumnsFromOptions : string[] = hasuraOptions.restrictedColumns || [];
    const publicColumnsFromOptions : string[] = Array.isArray(hasuraOptions.publicColumns) ? hasuraOptions.publicColumns : [];
    const views = hasuraOptions.views || {};

    const result : ViewsInfo = {
      isAssociationTable,
      modelName,
      publicColumns: [],
      publicColumnNames: [],
      restrictedColumns: restrictedColumnsFromOptions,
      views: {},
    };
    Object.keys(views).map(viewLevelName => result.views[viewLevelName] = <any>{
      modelName,
      viewLevelName,
      columns: [],
    });

    const pushPublic = (columnName : string) => {
      if (
        model.columns[columnName]
        && !restrictedColumnsFromOptions.find(c => c === columnName)
        && !result.publicColumns.find(c => c === columnName)
      ) {
        result.publicColumns.push(columnName);
      }
    };
    const pushToView = (viewLevelName: string, columnName : string) => {
      if (
        model.columns[columnName]
        && !restrictedColumnsFromOptions.find(c => c === columnName)
        && !result.views[viewLevelName].columns.find(c => c === columnName)
      ) {
        result.views[viewLevelName].columns.push(columnName);
      }
    };
    const pushToAllViews = (columnName : string) => {
      Object.keys(views).map(viewLevelName => pushToView(viewLevelName, columnName));
    };
    const primaryKey = isAssociationTable
      ? this.jsonSchemasX.schemasMetadata.associationModels[modelName].primaryKey
      : this.jsonSchemasX.schemasMetadata.models[modelName].primaryKey;
    if (primaryKey) {
      if (hasuraOptions.publicColumns && (hasuraOptions.publicColumns.length || hasuraOptions.publicColumns === 'all')) {
        pushPublic(primaryKey);
      }
      pushToAllViews(primaryKey);
    }
    publicColumnsFromOptions.forEach(pushPublic);
    publicColumnsFromOptions.forEach(pushToAllViews);


    Object.keys(views).forEach((viewLevelName) => {
      if (hasuraOptions.publicColumns === 'all') {
        Object.keys(model.columns)
        .filter(k => !restrictedColumnsFromOptions.includes(k))
        .forEach(pushPublic);
      }
      const cols = views[viewLevelName].columns || 'all';
      if (views[viewLevelName] && Array.isArray(cols)) {
        cols.forEach(c => pushToView(viewLevelName, c));
      } else if (restrictedColumnsFromOptions) {
        Object.keys(model.columns)
        .filter(k => !restrictedColumnsFromOptions.includes(k))
        .forEach(c => pushToView(viewLevelName, c));
      } else {
        Object.keys(model.columns)
        .forEach(c => pushToView(viewLevelName, c));
      }
    });

    // if (modelName === 'project') {
    //   console.log('result.views :', result.views);
    // }


    if (result.publicColumns.length) {
      result.publicColumnNames = result.publicColumns.map(k => ({ k, c: model.columns[k] })).map(({ k, c }) => this.getForeignKey(k, <any>c)).filter(c => c)
      .filter(function(item, pos, array) {
        return array.indexOf(item) == pos;
      })
      .concat(['created_at', 'updated_at', 'deleted_at']);
    }

    Object.keys(views).forEach((viewLevelName) => {
      const columnNames : string[] = result.views[viewLevelName].columns.map(k => ({ k, c: model.columns[k] })).map(({ k, c }) => this.getForeignKey(k, <any>c)).filter(c => c)
      .filter(function(item, pos, array) {
        return array.indexOf(item) == pos;
      })
      .concat(['created_at', 'updated_at', 'deleted_at']);
      const viewTableName = toUnderscore(`${modelInfo.tableName.replace(tablePrefix, 'view_')}_${viewLevelName}`);
      // CREATE VIEW view_user_private AS SELECT "id" as "id" FROM tbl_user;
      const dropScript = `DROP VIEW IF EXISTS ${viewTableName};`;
      const createScript = `CREATE VIEW ${viewTableName} AS SELECT ${columnNames.map(c => `"${c}" as "${c}"`).join(', ')} FROM ${modelInfo.tableName};`;
      result.views[viewLevelName] = {
        ...result.views[viewLevelName],
        viewTableName,
        columnNames,
        permissions: this.parsePermissions(model, { ...views[viewLevelName].permissions }, { models, associationModels }),
        dropScript,
        createScript,
      };
    });
    // console.log('result :', result);
    return result;
  }

  parseViewsInfos = (
    isAssociationTable,
    models: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    associationModels: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    modelInfoMap: {
      [name: string]: AmmModel;
    },
  ) => {
    const mdls = isAssociationTable ? associationModels : models;
    return Object.keys(mdls).reduce((a, modelName) => {
      const model = mdls[modelName];
      const modelInfo = modelInfoMap[modelName];
      const viewsInfo = this.parseViewsInfo(
        isAssociationTable,
        models,
        associationModels,
        modelName,
        model,
        modelInfo
      );
      if (viewsInfo) {
        a.push(viewsInfo);
      }
      return a;
    }, <ViewsInfo[]>[]);
  };

  getHeaders() : any {
    return {};
  }

  getAmmModelByTableName(tableName: string) : { ammModel: AmmModel, isAssociationModel: boolean } {
    let ammModel : AmmModel;
    let isAssociationModel : boolean = false;
    ammModel = this.tableNameToAmmModel[tableName];
    if (!ammModel) {
      isAssociationModel = true;
      ammModel = this.associationTableNameToAmmModel[tableName];
    }
    return {
      isAssociationModel,
      ammModel,
    };
  }

  getAmmSchema(modelName: string) : { ammSchema: AmmSchema, isAssociationModel: boolean } {
    let ammSchema : AmmSchema;
    let isAssociationModel : boolean = false;
    ammSchema = this.ammSchemas.models[modelName];
    if (!ammSchema) {
      isAssociationModel = true;
      ammSchema = this.ammSchemas.associationModels![modelName];
    }
    return {
      isAssociationModel,
      ammSchema,
    };
  }

  getJsonSchema(modelName: string) : { jsonSchema: IJsonSchema, isAssociationModel: boolean } {
    let jsonSchema : IJsonSchema;
    let isAssociationModel : boolean = false;
    jsonSchema = this.jsonSchemasX.schemas.models[modelName];
    if (!jsonSchema) {
      isAssociationModel = true;
      jsonSchema = this.jsonSchemasX.schemas.associationModels[modelName];
    }
    return {
      isAssociationModel,
      jsonSchema,
    };
  }

  findRelatedModelByPgTableName(tableName : string) : RelationshipRelatedModel {
    let model = this.tableNameToAmmModel[tableName];
    let jsonSchema : IJsonSchema;
    let isAssociationModel : boolean = false;
    if (model) {
      jsonSchema = this.jsonSchemasX.schemas.models[model.sqlzOptions.modelName!];
    } else {
      isAssociationModel = true;
      model = this.associationTableNameToAmmModel[tableName];
      jsonSchema = this.jsonSchemasX.schemas.associationModels[model.sqlzOptions.modelName!];
    }
    return {
      jsonSchema,
      isAssociationModel,
      model,
    };
  }

  findRelatedModelByModelName(modelName : string) : RelationshipRelatedModel {
    let model = this.ammOrm.tableInfo[modelName];
    let jsonSchema : IJsonSchema;
    let isAssociationModel : boolean = false;
    if (model) {
      jsonSchema = this.jsonSchemasX.schemas.models[model.sqlzOptions.modelName!];
    } else {
      isAssociationModel = true;
      model = this.ammOrm.associationModelInfo[modelName] as AssociationModel;
      jsonSchema = this.jsonSchemasX.schemas.associationModels[model.sqlzOptions.modelName!];
    }
    return {
      jsonSchema,
      isAssociationModel,
      model,
    };
  }

  findTableColumnForRelationship(relationship, table : RelationshipRelatedModel, foreignKey) : RelationshipRelatedModelWithColumn {
    let columnName = '';
    let column : JsonModelAttributeColumnOptions | undefined;
    const tableJsonSchema = table.jsonSchema;
    Object.keys(tableJsonSchema.columns).forEach((k) => {
      const c = tableJsonSchema.columns[k] as JsonModelAttributeColumnOptions;
      let fk : string = '';
      if (c.type[0] === 'belongsTo') {
        // console.log(' ===> c[0] :', c.type[0]);
        // console.log(' ===> c[1] :', c.type[1]);
        fk = (c.type[2] as BelongsToOptions).foreignKey as string;
        // console.log(' ===> c[2].foreignKey :', fk);
      }
      if (foreignKey === fk) {
        columnName = k;
        column = c;
        // console.log('column :', column);
        /* rick_log */// console.log(' ===> fk :', fk);
      }
    });
    return {
      ...table,
      columnName,
      column,
    };
  }

  findRefTableColumnForRelationship(relationship, tableModelName : string, tableWithColumn : RelationshipRelatedModelWithColumn, refTable : RelationshipRelatedModel, foreignKey) : RelationshipRelatedModelWithColumn {
    let columnName = '';
    let column : JsonModelAttributeColumnOptions | undefined;
    /* rick_log */// console.log('tableModelName :', tableModelName);
    const tableJsonSchema = refTable.jsonSchema;
    Object.keys(tableJsonSchema.columns).forEach((k) => {
      const c = tableJsonSchema.columns[k] as JsonModelAttributeColumnOptions;
      let fk : string = '';
      if (c.type[1] === tableModelName) {
        if (c.type[0] === 'hasOne') {
          // console.log(' ===> c[0] :', c.type[0]);
          // console.log(' ===> c[1] :', c.type[1]);
          fk = (c.type[2] as HasOneOptions).foreignKey as string;
          // console.log(' ===> c[2].foreignKey :', fk);
        } else if (c.type[0] === 'hasMany') {
          // console.log(' ===> c[0] :', c.type[0]);
          // console.log(' ===> c[1] :', c.type[1]);
          fk = (c.type[2] as HasManyOptions).foreignKey as string;
          // console.log(' ===> c[2].foreignKey :', fk);
        }
      } else if (c.type[0] === 'belongsToMany'
        && (c.type[2] as BelongsToManyOptions).through.ammModelName === tableModelName
        && (c.type[2] as BelongsToManyOptions).through.ammThroughTableColumnAs === tableWithColumn.columnName
      ) {
        // console.log('(c.type[2] as BelongsToManyOptions) :', (c.type[2] as BelongsToManyOptions));
        // console.log('tableWithColumn.columnName :', tableWithColumn.columnName);
        // console.log('tableWithColumn.column :', tableWithColumn.column);

        // console.log(' ===> c[0] :', c.type[0]);
        // console.log(' ===> c[1] :', c.type[1]);
        // console.log(' ===> c[2].ammModelName :', ((c.type[2] as BelongsToManyOptions).through as ThroughOptions).ammModelName);

        fk = (c.type[2] as BelongsToManyOptions).foreignKey as string;
        // console.log(' ===> c[2].foreignKey :', fk);
      }
      if (foreignKey === fk) {
        // if (column) {
        //   console.log('tableWithColumn.columnName :', tableWithColumn.columnName);
        //   console.log('tableWithColumn.column :', tableWithColumn.column);


        //   console.log('columnName :', columnName);
        //   console.log('(column.type[2] as BelongsToManyOptions) :', (column.type[2] as BelongsToManyOptions));
        //   console.log('k :', k);
        //   console.log('(c.type[2] as BelongsToManyOptions) :', (c.type[2] as BelongsToManyOptions));
        // }
        columnName = k;
        column = c;
        // console.log('column :', column.type[0]);
        /* rick_log */// console.log(' ===> fk :', fk);
      }
    });
    return {
      ...refTable,
      columnName,
      column,
    };
  }

  findRelatedModelsForRelationship(relationship) : RelationshipRelatedModelsWithColumn {
    /* rick_log */// console.log('=========================');
    /* rick_log */// console.log('relationship.table_name :', relationship.table_name);
    /* rick_log */// console.log('relationship.ref_table :', relationship.ref_table);
    // console.log('relationship.column_mapping :', relationship.column_mapping);
    const foreignKey : string = Object.keys(relationship.column_mapping)[0];
    /* rick_log */// console.log('foreignKey :', foreignKey);
    const relatedModelsWithColumn : RelationshipRelatedModelsWithColumn = {};
    const table = this.findRelatedModelByPgTableName(relationship.table_name);
    relatedModelsWithColumn.table = this.findTableColumnForRelationship(relationship, table, foreignKey);
    // console.log('relatedModelsWithColumn.table.column :', relatedModelsWithColumn.table.column);
    const refModelName = relatedModelsWithColumn.table.column!.type[1] as string;
    const refTable = this.findRelatedModelByModelName(refModelName);
    relatedModelsWithColumn.refTable = this.findRefTableColumnForRelationship(relationship, table.model.modelName, relatedModelsWithColumn.table, refTable, foreignKey);
    /* rick_log */// console.log('=========================');
    return relatedModelsWithColumn;
  }
}

export default HasuraMgrBase;
