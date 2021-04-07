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
} from 'az-model-manager';

import { getJsonSchemasX, ModelExtraOptions } from '../amm-schemas/index';

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

export type PrivateViewInfo = {
  publicColumns: string[];
  privateColumns: string[];
  privateColumnNames: string[];
  dropScript: string;
  createScript: string;
};

export type ParsedHasuraModelInfo = {
  privateViewInfo?: PrivateViewInfo,
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
    this.parsePrivateViewInfos(false, this.jsonSchemasX.schemas.models, this.ammOrm.tableInfo)
    .forEach((r) => {
      this.tableParsedHasuraModelInfo[r.modelName] = {
        privateViewInfo: r.privateViewInfo,
      };
    });
    // console.log('modelScripts :', modelScripts);
    this.parsePrivateViewInfos(true, this.jsonSchemasX.schemas.associationModels, <any>(this.ammOrm.associationModelInfo))
    .forEach((r) => {
      this.associationTableParsedHasuraModelInfo[r.modelName] = {
        privateViewInfo: r.privateViewInfo,
      };
    });
    // console.log('associationScripts :', associationScripts);
    // console.log('this.associationTableNameToAmmModel :', this.associationTableNameToAmmModel);
  }

  parsePrivateViewInfo = (
    isAssociationTable,
    modelName: string,
    model: IJsonSchema<ModelExtraOptions>,
    modelInfo: AmmModel,
  ) => {
    const tablePrefix = isAssociationTable ? 'mn_' : 'tbl_';
    const hasuraOptions = model.extraOptions?.hasura;
    if (!hasuraOptions || !modelInfo || !model) {
      return null;
    }
    const privateColumns : string[] = [];
    const pushPrivate = (columnName : string) => {
      if (
        model.columns[columnName]
        && !privateColumns.find(c => c === columnName)
      ) {
        privateColumns.push(columnName);
      }
    };
    const publicColumns : string[] = [];
    const pushPublic = (columnName : string) => {
      if (
        model.columns[columnName]
        && !publicColumns.find(c => c === columnName)
      ) {
        publicColumns.push(columnName);
      }
    };
    if (model.columns.id) {
      pushPrivate('id');
    }
    if (hasuraOptions.publicColumns) {
      hasuraOptions.publicColumns.forEach(pushPublic);
      hasuraOptions.publicColumns.forEach(pushPrivate);
    }
    if (hasuraOptions.privateColumns) {
      hasuraOptions.privateColumns.forEach(pushPrivate);
    }
    if (hasuraOptions.restrictedColumns) {
      Object.keys(model.columns)
      .filter(k => !hasuraOptions.restrictedColumns!.includes(k))
      .forEach(pushPrivate);
    } else {
      Object.keys(model.columns)
      .forEach(pushPrivate);
    }
    const getForeignKey = (k: string, column : JsonModelAttributeInOptionsForm) => {
      const {
        associationType,
      } = typeConfigs[column.type[0]];
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
    const privateColumnNames : string[] = privateColumns.map(k => ({ k, c: model.columns[k] })).map(({ k, c }) => getForeignKey(k, <any>c)).filter(c => c);
    const tableName = `${modelInfo.tableName.replace(tablePrefix, 'view_')}_private`;
    // CREATE VIEW view_user_private AS SELECT "id" as "id" FROM tbl_user;
    const dropScript = `DROP VIEW IF EXISTS ${tableName};`;
    const createScript = `CREATE VIEW ${tableName} AS SELECT ${privateColumnNames.map(c => `"${c}" as "${c}"`).join(', ')} FROM ${modelInfo.tableName};`;
    return <PrivateViewInfo>{
      publicColumns,
      privateColumns,
      privateColumnNames,
      dropScript,
      createScript,
    };
  }

  parsePrivateViewInfos = (
    isAssociationTable,
    models: { [s: string]: IJsonSchema<ModelExtraOptions>;},
    modelInfoMap: {
      [name: string]: AmmModel;
    },
  ) => Object.keys(models).reduce((a, modelName) => {
    const model = models[modelName];
    const modelInfo = modelInfoMap[modelName];
    const privateViewInfo = this.parsePrivateViewInfo(
      isAssociationTable,
      modelName,
      model,
      modelInfo
    );
    if (privateViewInfo) {
      a.push({
        modelName,
        privateViewInfo,
      });
    }
    return a;
  }, <{ modelName: string, privateViewInfo: PrivateViewInfo }[]>[]);

  getHeaders() : any {
    return {};
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
