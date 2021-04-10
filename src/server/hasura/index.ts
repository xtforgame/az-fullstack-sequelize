/* eslint-disable no-console */
import sequelize, { Sequelize } from 'sequelize';
import fs from 'fs';
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
  JsonModelAttributeBelongsTo,
  JsonModelAttributeHasOne,
  JsonModelAttributeHasMany,
  JsonModelAttributeBelongsToMany,
} from 'az-model-manager';
import {
  postgresHost,
  postgresPort,
  postgresUser,
  postgresDbName,
  postgresPassword,
} from 'config';
import { supportedHasuraRoles } from '../amm-schemas/index';
import HasuraMgrBase, { ViewsInfo } from './HasuraMgrBase';

function databaseLogger(...args) { // eslint-disable-line no-unused-vars
  // write('./db-debug.log', args[0] + '\n');
}

function getConnectString(user) {
  let dbName = 'postgres';
  if (user === postgresUser) {
    dbName = postgresDbName;
  }
  return `postgres://${user}:${encodeURI(postgresPassword)}@${postgresHost}:${postgresPort}/${dbName}`;
}

class HasuraMgr extends HasuraMgrBase {
  constructor() {
    super(getConnectString(postgresUser), {
      dialect: 'postgres',
      logging: databaseLogger,
    });
  }

  getHeaders() : any {
    return {
      'X-Hasura-Role': 'admin',
      'X-Hasura-Admin-Secret': 'xxxxhsr',
      'Content-Type': 'application/json',
    };
  }

  async getMetadata() {
    const { data } = await axios({
      url: 'http://localhost:8081/v1/metadata',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'export_metadata',
        args: {},
      },
    });
    // console.log('metadata :', JSON.stringify(data, null, 2));
    return data;
  }

  async replaceMetadata(metadata) {
    // fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2), { encoding: 'utf-8' });
    try {
      const { data } = await axios({
        url: 'http://localhost:8081/v1/metadata',
        method: 'post',
        headers: this.getHeaders(),
        data: {
          type: 'replace_metadata',
          args: metadata,
        },
      });
      console.log('replaceMetadata data :', data);
      return data;
    } catch (e) {
      console.log('replaceMetadata e :', e);
      throw e;
    }
  }

  async addSource() {
    const metadata = await this.getMetadata();
    if (metadata.sources && metadata.sources.length > 1) {
      return null;
    }
    const { data } = await axios({
      url: 'http://localhost:8081/v1/metadata',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'pg_add_source',
        args: {
          name: 'db_rick_data',
          configuration: {
            connection_info: {
              database_url: 'postgres://postgres:xxxx1234@pg-master:5432/db_rick_data',
              pool_settings: {
                max_connections: 50,
                idle_timeout: 180,
                retries: 1,
              },
            },
          },
        },
      },
    });
    console.log('data :', data);
    return data;
  }

  async getTablesX() {
    const { data } = await axios({
      url: 'http://localhost:8081/v2/query',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'run_sql',
        args: {
          source: 'db_rick_data',
          sql: "SELECT\n    COALESCE(Json_agg(Row_to_json(info)), '[]' :: json) AS tables\n  FROM (\n    SELECT\n      pgn.nspname as table_schema,\n      pgc.relname as table_name,\n      case\n        when pgc.relkind = 'r' then 'TABLE'\n        when pgc.relkind = 'f' then 'FOREIGN TABLE'\n        when pgc.relkind = 'v' then 'VIEW'\n        when pgc.relkind = 'm' then 'MATERIALIZED VIEW'\n        when pgc.relkind = 'p' then 'PARTITIONED TABLE'\n      end as table_type,\n      obj_description(pgc.oid) AS comment,\n      COALESCE(json_agg(DISTINCT row_to_json(isc) :: jsonb || jsonb_build_object('comment', col_description(pga.attrelid, pga.attnum))) filter (WHERE isc.column_name IS NOT NULL), '[]' :: json) AS columns,\n      COALESCE(json_agg(DISTINCT row_to_json(ist) :: jsonb || jsonb_build_object('comment', obj_description(pgt.oid))) filter (WHERE ist.trigger_name IS NOT NULL), '[]' :: json) AS triggers,\n      row_to_json(isv) AS view_info\n\n    FROM pg_class as pgc\n    INNER JOIN pg_namespace as pgn\n      ON pgc.relnamespace = pgn.oid\n\n    /* columns */\n    /* This is a simplified version of how information_schema.columns was\n    ** implemented in postgres 9.5, but modified to support materialized\n    ** views.\n    */\n    LEFT OUTER JOIN pg_attribute AS pga\n      ON pga.attrelid = pgc.oid\n    LEFT OUTER JOIN (\n      SELECT\n        nc.nspname         AS table_schema,\n        c.relname          AS table_name,\n        a.attname          AS column_name,\n        a.attnum           AS ordinal_position,\n        pg_get_expr(ad.adbin, ad.adrelid) AS column_default,\n        CASE WHEN a.attnotnull OR (t.typtype = 'd' AND t.typnotnull) THEN 'NO' ELSE 'YES' END AS is_nullable,\n        CASE WHEN t.typtype = 'd' THEN\n          CASE WHEN bt.typelem <> 0 AND bt.typlen = -1 THEN 'ARRAY'\n               WHEN nbt.nspname = 'pg_catalog' THEN format_type(t.typbasetype, null)\n               ELSE 'USER-DEFINED' END\n        ELSE\n          CASE WHEN t.typelem <> 0 AND t.typlen = -1 THEN 'ARRAY'\n               WHEN nt.nspname = 'pg_catalog' THEN format_type(a.atttypid, null)\n               ELSE 'USER-DEFINED' END\n        END AS data_type,\n        coalesce(bt.typname, t.typname) AS data_type_name\n      FROM (pg_attribute a LEFT JOIN pg_attrdef ad ON attrelid = adrelid AND attnum = adnum)\n        JOIN (pg_class c JOIN pg_namespace nc ON (c.relnamespace = nc.oid)) ON a.attrelid = c.oid\n        JOIN (pg_type t JOIN pg_namespace nt ON (t.typnamespace = nt.oid)) ON a.atttypid = t.oid\n        LEFT JOIN (pg_type bt JOIN pg_namespace nbt ON (bt.typnamespace = nbt.oid))\n          ON (t.typtype = 'd' AND t.typbasetype = bt.oid)\n        LEFT JOIN (pg_collation co JOIN pg_namespace nco ON (co.collnamespace = nco.oid))\n          ON a.attcollation = co.oid AND (nco.nspname, co.collname) <> ('pg_catalog', 'default')\n      WHERE (NOT pg_is_other_temp_schema(nc.oid))\n        AND a.attnum > 0 AND NOT a.attisdropped AND c.relkind in ('r', 'v', 'm', 'f', 'p')\n        AND (pg_has_role(c.relowner, 'USAGE')\n             OR has_column_privilege(c.oid, a.attnum,\n                                     'SELECT, INSERT, UPDATE, REFERENCES'))\n    ) AS isc\n      ON  isc.table_schema = pgn.nspname\n      AND isc.table_name   = pgc.relname\n      AND isc.column_name  = pga.attname\n  \n    /* triggers */\n    LEFT OUTER JOIN pg_trigger AS pgt\n      ON pgt.tgrelid = pgc.oid\n    LEFT OUTER JOIN information_schema.triggers AS ist\n      ON  ist.event_object_schema = pgn.nspname\n      AND ist.event_object_table  = pgc.relname\n      AND ist.trigger_name        = pgt.tgname\n  \n    /* This is a simplified version of how information_schema.views was\n    ** implemented in postgres 9.5, but modified to support materialized\n    ** views.\n    */\n    LEFT OUTER JOIN (\n      SELECT\n        nc.nspname         AS table_schema,\n        c.relname          AS table_name,\n        CASE WHEN pg_has_role(c.relowner, 'USAGE') THEN pg_get_viewdef(c.oid) ELSE null END AS view_definition,\n        CASE WHEN pg_relation_is_updatable(c.oid, false) & 20 = 20 THEN 'YES' ELSE 'NO' END AS is_updatable,\n        CASE WHEN pg_relation_is_updatable(c.oid, false) &  8 =  8 THEN 'YES' ELSE 'NO' END AS is_insertable_into,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 81 = 81) THEN 'YES' ELSE 'NO' END AS is_trigger_updatable,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 73 = 73) THEN 'YES' ELSE 'NO' END AS is_trigger_deletable,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 69 = 69) THEN 'YES' ELSE 'NO' END AS is_trigger_insertable_into\n      FROM pg_namespace nc, pg_class c\n  \n      WHERE c.relnamespace = nc.oid\n        AND c.relkind in ('v', 'm')\n        AND (NOT pg_is_other_temp_schema(nc.oid))\n        AND (pg_has_role(c.relowner, 'USAGE')\n             OR has_table_privilege(c.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')\n             OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES'))\n    ) AS isv\n      ON  isv.table_schema = pgn.nspname\n      AND isv.table_name   = pgc.relname\n  \n    WHERE\n      pgc.relkind IN ('r', 'v', 'f', 'm', 'p')\n      and (pgn.nspname='public')\n    GROUP BY pgc.oid, pgn.nspname, pgc.relname, table_type, isv.*\n  ) AS info;",
          cascade: false,
          read_only: false,
        },
      },
    });
    const d = JSON.parse(data.result[1][0]);
    console.log('d :', d.map(s => s.table_name));
    return d;
  }

  async getTables() {
    const { data } = await axios({
      url: 'http://localhost:8081/v2/query',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'bulk',
        source: 'db_rick_data',
        args: [
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\n    COALESCE(Json_agg(Row_to_json(info)), '[]' :: json) AS tables\n  FROM (\n    SELECT\n      pgn.nspname as table_schema,\n      pgc.relname as table_name,\n      case\n        when pgc.relkind = 'r' then 'TABLE'\n        when pgc.relkind = 'f' then 'FOREIGN TABLE'\n        when pgc.relkind = 'v' then 'VIEW'\n        when pgc.relkind = 'm' then 'MATERIALIZED VIEW'\n        when pgc.relkind = 'p' then 'PARTITIONED TABLE'\n      end as table_type,\n      obj_description(pgc.oid) AS comment,\n      COALESCE(json_agg(DISTINCT row_to_json(isc) :: jsonb || jsonb_build_object('comment', col_description(pga.attrelid, pga.attnum))) filter (WHERE isc.column_name IS NOT NULL), '[]' :: json) AS columns,\n      COALESCE(json_agg(DISTINCT row_to_json(ist) :: jsonb || jsonb_build_object('comment', obj_description(pgt.oid))) filter (WHERE ist.trigger_name IS NOT NULL), '[]' :: json) AS triggers,\n      row_to_json(isv) AS view_info\n\n    FROM pg_class as pgc\n    INNER JOIN pg_namespace as pgn\n      ON pgc.relnamespace = pgn.oid\n\n    /* columns */\n    /* This is a simplified version of how information_schema.columns was\n    ** implemented in postgres 9.5, but modified to support materialized\n    ** views.\n    */\n    LEFT OUTER JOIN pg_attribute AS pga\n      ON pga.attrelid = pgc.oid\n    LEFT OUTER JOIN (\n      SELECT\n        nc.nspname         AS table_schema,\n        c.relname          AS table_name,\n        a.attname          AS column_name,\n        a.attnum           AS ordinal_position,\n        pg_get_expr(ad.adbin, ad.adrelid) AS column_default,\n        CASE WHEN a.attnotnull OR (t.typtype = 'd' AND t.typnotnull) THEN 'NO' ELSE 'YES' END AS is_nullable,\n        CASE WHEN t.typtype = 'd' THEN\n          CASE WHEN bt.typelem <> 0 AND bt.typlen = -1 THEN 'ARRAY'\n               WHEN nbt.nspname = 'pg_catalog' THEN format_type(t.typbasetype, null)\n               ELSE 'USER-DEFINED' END\n        ELSE\n          CASE WHEN t.typelem <> 0 AND t.typlen = -1 THEN 'ARRAY'\n               WHEN nt.nspname = 'pg_catalog' THEN format_type(a.atttypid, null)\n               ELSE 'USER-DEFINED' END\n        END AS data_type,\n        coalesce(bt.typname, t.typname) AS data_type_name\n      FROM (pg_attribute a LEFT JOIN pg_attrdef ad ON attrelid = adrelid AND attnum = adnum)\n        JOIN (pg_class c JOIN pg_namespace nc ON (c.relnamespace = nc.oid)) ON a.attrelid = c.oid\n        JOIN (pg_type t JOIN pg_namespace nt ON (t.typnamespace = nt.oid)) ON a.atttypid = t.oid\n        LEFT JOIN (pg_type bt JOIN pg_namespace nbt ON (bt.typnamespace = nbt.oid))\n          ON (t.typtype = 'd' AND t.typbasetype = bt.oid)\n        LEFT JOIN (pg_collation co JOIN pg_namespace nco ON (co.collnamespace = nco.oid))\n          ON a.attcollation = co.oid AND (nco.nspname, co.collname) <> ('pg_catalog', 'default')\n      WHERE (NOT pg_is_other_temp_schema(nc.oid))\n        AND a.attnum > 0 AND NOT a.attisdropped AND c.relkind in ('r', 'v', 'm', 'f', 'p')\n        AND (pg_has_role(c.relowner, 'USAGE')\n             OR has_column_privilege(c.oid, a.attnum,\n                                     'SELECT, INSERT, UPDATE, REFERENCES'))\n    ) AS isc\n      ON  isc.table_schema = pgn.nspname\n      AND isc.table_name   = pgc.relname\n      AND isc.column_name  = pga.attname\n  \n    /* triggers */\n    LEFT OUTER JOIN pg_trigger AS pgt\n      ON pgt.tgrelid = pgc.oid\n    LEFT OUTER JOIN information_schema.triggers AS ist\n      ON  ist.event_object_schema = pgn.nspname\n      AND ist.event_object_table  = pgc.relname\n      AND ist.trigger_name        = pgt.tgname\n  \n    /* This is a simplified version of how information_schema.views was\n    ** implemented in postgres 9.5, but modified to support materialized\n    ** views.\n    */\n    LEFT OUTER JOIN (\n      SELECT\n        nc.nspname         AS table_schema,\n        c.relname          AS table_name,\n        CASE WHEN pg_has_role(c.relowner, 'USAGE') THEN pg_get_viewdef(c.oid) ELSE null END AS view_definition,\n        CASE WHEN pg_relation_is_updatable(c.oid, false) & 20 = 20 THEN 'YES' ELSE 'NO' END AS is_updatable,\n        CASE WHEN pg_relation_is_updatable(c.oid, false) &  8 =  8 THEN 'YES' ELSE 'NO' END AS is_insertable_into,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 81 = 81) THEN 'YES' ELSE 'NO' END AS is_trigger_updatable,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 73 = 73) THEN 'YES' ELSE 'NO' END AS is_trigger_deletable,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 69 = 69) THEN 'YES' ELSE 'NO' END AS is_trigger_insertable_into\n      FROM pg_namespace nc, pg_class c\n  \n      WHERE c.relnamespace = nc.oid\n        AND c.relkind in ('v', 'm')\n        AND (NOT pg_is_other_temp_schema(nc.oid))\n        AND (pg_has_role(c.relowner, 'USAGE')\n             OR has_table_privilege(c.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')\n             OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES'))\n    ) AS isv\n      ON  isv.table_schema = pgn.nspname\n      AND isv.table_name   = pgc.relname\n  \n    WHERE\n      pgc.relkind IN ('r', 'v', 'f', 'm', 'p')\n      and (pgn.nspname='public')\n    GROUP BY pgc.oid, pgn.nspname, pgc.relname, table_type, isv.*\n  ) AS info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\n\tCOALESCE(json_agg(row_to_json(info)), '[]'::JSON)\nFROM (\n\tSELECT\n\t\tq.table_schema::text AS table_schema,\n\t\tq.table_name::text AS table_name,\n\t\tq.constraint_name::text AS constraint_name,\n\t\tmin(q.ref_table_table_schema::text) AS ref_table_table_schema,\n\t\tmin(q.ref_table::text) AS ref_table,\n\t\tjson_object_agg(ac.attname, afc.attname) AS column_mapping,\n\t\tmin(q.confupdtype::text) AS on_update,\n\t\tmin(q.confdeltype::text) AS\n\t\ton_delete\n\tFROM (\n\t\tSELECT\n\t\t\tctn.nspname AS table_schema,\n\t\t\tct.relname AS table_name,\n\t\t\tr.conrelid AS table_id,\n\t\t\tr.conname AS constraint_name,\n\t\t\tcftn.nspname AS ref_table_table_schema,\n\t\t\tcft.relname AS ref_table,\n\t\t\tr.confrelid AS ref_table_id,\n\t\t\tr.confupdtype,\n\t\t\tr.confdeltype,\n\t\t\tunnest(r.conkey) AS column_id,\n\t\t\tunnest(r.confkey) AS ref_column_id\n\t\tFROM\n\t\t\tpg_constraint r\n\t\t\tJOIN pg_class ct ON r.conrelid = ct.oid\n\t\t\tJOIN pg_namespace ctn ON ct.relnamespace = ctn.oid\n\t\t\tJOIN pg_class cft ON r.confrelid = cft.oid\n\t\t\tJOIN pg_namespace cftn ON cft.relnamespace = cftn.oid\n    WHERE\n      r.contype = 'f'::\"char\"\n      AND (ctn.nspname='public')\n      ) q\n\t\tJOIN pg_attribute ac ON q.column_id = ac.attnum\n\t\t\tAND q.table_id = ac.attrelid\n\t\tJOIN pg_attribute afc ON q.ref_column_id = afc.attnum\n\t\t\tAND q.ref_table_id = afc.attrelid\n\t\tGROUP BY\n\t\t\tq.table_schema,\n\t\t\tq.table_name,\n      q.constraint_name) AS info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\nCOALESCE(\n  json_agg(\n    row_to_json(info)\n  ),\n  '[]' :: JSON\n)\nFROM (\nSELECT\ntc.table_schema,\ntc.table_name,\ntc.constraint_name,\njson_agg(constraint_column_usage.column_name) AS columns\nFROM\ninformation_schema.table_constraints tc\nJOIN (\n  SELECT\n    x.tblschema AS table_schema,\n    x.tblname AS table_name,\n    x.colname AS column_name,\n    x.cstrname AS constraint_name\n  FROM ( SELECT DISTINCT\n      nr.nspname,\n      r.relname,\n      a.attname,\n      c.conname\n    FROM\n      pg_namespace nr,\n      pg_class r,\n      pg_attribute a,\n      pg_depend d,\n      pg_namespace nc,\n      pg_constraint c\n    WHERE\n      nr.oid = r.relnamespace\n      AND r.oid = a.attrelid\n      AND d.refclassid = 'pg_class'::regclass::oid\n      AND d.refobjid = r.oid\n      AND d.refobjsubid = a.attnum\n      AND d.classid = 'pg_constraint'::regclass::oid\n      AND d.objid = c.oid\n      AND c.connamespace = nc.oid\n      AND c.contype = 'c'::\"char\"\n      AND(r.relkind = ANY (ARRAY ['r'::\"char\", 'p'::\"char\"]))\n      AND NOT a.attisdropped\n    UNION ALL\n    SELECT\n      nr.nspname,\n      r.relname,\n      a.attname,\n      c.conname\n    FROM\n      pg_namespace nr,\n      pg_class r,\n      pg_attribute a,\n      pg_namespace nc,\n      pg_constraint c\n    WHERE\n      nr.oid = r.relnamespace\n      AND r.oid = a.attrelid\n      AND nc.oid = c.connamespace\n      AND r.oid = CASE c.contype\n      WHEN 'f'::\"char\" THEN\n        c.confrelid\n      ELSE\n        c.conrelid\n      END\n      AND(a.attnum = ANY (\n          CASE c.contype\n          WHEN 'f'::\"char\" THEN\n            c.confkey\n          ELSE\n            c.conkey\n          END))\n      AND NOT a.attisdropped\n      AND(c.contype = ANY (ARRAY ['p'::\"char\", 'u'::\"char\", 'f'::\"char\"]))\n      AND(r.relkind = ANY (ARRAY ['r'::\"char\", 'p'::\"char\"]))) x (tblschema, tblname, colname, cstrname)) constraint_column_usage ON tc.constraint_name::text = constraint_column_usage.constraint_name::text\n  AND tc.table_schema::text = constraint_column_usage.table_schema::text\n  AND tc.table_name::text = constraint_column_usage.table_name::text\nwhere (tc.table_schema='public')\n  AND tc.constraint_type::text = 'PRIMARY KEY'::text\nGROUP BY\n  tc.table_schema, tc.table_name, tc.constraint_name) as info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\nCOALESCE(\n  json_agg(\n    row_to_json(info)\n  ),\n  '[]' :: JSON\n)\nFROM (\n\tSELECT\n\t\ttc.table_name,\n\t\ttc.constraint_schema AS table_schema,\n\t\ttc.constraint_name,\n\t\tjson_agg(kcu.column_name) AS columns\n\tFROM\n\t\tinformation_schema.table_constraints tc\n\t\tJOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name)\n    where (tc.constraint_schema='public')\n\t\tAND tc.constraint_type::text = 'UNIQUE'::text\n\tGROUP BY\n\t\ttc.table_name,\n\t\ttc.constraint_schema,\n\t\ttc.constraint_name) AS info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\nCOALESCE(\n  json_agg(\n    row_to_json(info)\n  ),\n  '[]' :: JSON\n)\nFROM (\nSELECT n.nspname::text AS table_schema,\n    ct.relname::text AS table_name,\n    r.conname::text AS constraint_name,\n    pg_get_constraintdef(r.oid, true) AS \"check\"\n   FROM pg_constraint r\n     JOIN pg_class ct ON r.conrelid = ct.oid\n     JOIN pg_namespace n ON ct.relnamespace = n.oid\n   where (n.nspname='public')\n   AND r.contype = 'c'::\"char\"\n   ) AS info;",
              cascade: false,
              read_only: false,
            },
          },
        ],
      },
    });
    const tables = JSON.parse(data[0].result[1][0]);
    // console.log('tables :', tables.map(s => s.table_name));
    // const x = JSON.parse(data[1].result[1][0]);
    // console.log('x :', x);
    return tables;
  }

  async getRelationships() {
    const { data } = await axios({
      url: 'http://localhost:8081/v2/query',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'bulk',
        source: 'db_rick_data',
        args: [
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\n    COALESCE(Json_agg(Row_to_json(info)), '[]' :: json) AS tables\n  FROM (\n    SELECT\n      pgn.nspname as table_schema,\n      pgc.relname as table_name,\n      case\n        when pgc.relkind = 'r' then 'TABLE'\n        when pgc.relkind = 'f' then 'FOREIGN TABLE'\n        when pgc.relkind = 'v' then 'VIEW'\n        when pgc.relkind = 'm' then 'MATERIALIZED VIEW'\n        when pgc.relkind = 'p' then 'PARTITIONED TABLE'\n      end as table_type,\n      obj_description(pgc.oid) AS comment,\n      COALESCE(json_agg(DISTINCT row_to_json(isc) :: jsonb || jsonb_build_object('comment', col_description(pga.attrelid, pga.attnum))) filter (WHERE isc.column_name IS NOT NULL), '[]' :: json) AS columns,\n      COALESCE(json_agg(DISTINCT row_to_json(ist) :: jsonb || jsonb_build_object('comment', obj_description(pgt.oid))) filter (WHERE ist.trigger_name IS NOT NULL), '[]' :: json) AS triggers,\n      row_to_json(isv) AS view_info\n\n    FROM pg_class as pgc\n    INNER JOIN pg_namespace as pgn\n      ON pgc.relnamespace = pgn.oid\n\n    /* columns */\n    /* This is a simplified version of how information_schema.columns was\n    ** implemented in postgres 9.5, but modified to support materialized\n    ** views.\n    */\n    LEFT OUTER JOIN pg_attribute AS pga\n      ON pga.attrelid = pgc.oid\n    LEFT OUTER JOIN (\n      SELECT\n        nc.nspname         AS table_schema,\n        c.relname          AS table_name,\n        a.attname          AS column_name,\n        a.attnum           AS ordinal_position,\n        pg_get_expr(ad.adbin, ad.adrelid) AS column_default,\n        CASE WHEN a.attnotnull OR (t.typtype = 'd' AND t.typnotnull) THEN 'NO' ELSE 'YES' END AS is_nullable,\n        CASE WHEN t.typtype = 'd' THEN\n          CASE WHEN bt.typelem <> 0 AND bt.typlen = -1 THEN 'ARRAY'\n               WHEN nbt.nspname = 'pg_catalog' THEN format_type(t.typbasetype, null)\n               ELSE 'USER-DEFINED' END\n        ELSE\n          CASE WHEN t.typelem <> 0 AND t.typlen = -1 THEN 'ARRAY'\n               WHEN nt.nspname = 'pg_catalog' THEN format_type(a.atttypid, null)\n               ELSE 'USER-DEFINED' END\n        END AS data_type,\n        coalesce(bt.typname, t.typname) AS data_type_name\n      FROM (pg_attribute a LEFT JOIN pg_attrdef ad ON attrelid = adrelid AND attnum = adnum)\n        JOIN (pg_class c JOIN pg_namespace nc ON (c.relnamespace = nc.oid)) ON a.attrelid = c.oid\n        JOIN (pg_type t JOIN pg_namespace nt ON (t.typnamespace = nt.oid)) ON a.atttypid = t.oid\n        LEFT JOIN (pg_type bt JOIN pg_namespace nbt ON (bt.typnamespace = nbt.oid))\n          ON (t.typtype = 'd' AND t.typbasetype = bt.oid)\n        LEFT JOIN (pg_collation co JOIN pg_namespace nco ON (co.collnamespace = nco.oid))\n          ON a.attcollation = co.oid AND (nco.nspname, co.collname) <> ('pg_catalog', 'default')\n      WHERE (NOT pg_is_other_temp_schema(nc.oid))\n        AND a.attnum > 0 AND NOT a.attisdropped AND c.relkind in ('r', 'v', 'm', 'f', 'p')\n        AND (pg_has_role(c.relowner, 'USAGE')\n             OR has_column_privilege(c.oid, a.attnum,\n                                     'SELECT, INSERT, UPDATE, REFERENCES'))\n    ) AS isc\n      ON  isc.table_schema = pgn.nspname\n      AND isc.table_name   = pgc.relname\n      AND isc.column_name  = pga.attname\n  \n    /* triggers */\n    LEFT OUTER JOIN pg_trigger AS pgt\n      ON pgt.tgrelid = pgc.oid\n    LEFT OUTER JOIN information_schema.triggers AS ist\n      ON  ist.event_object_schema = pgn.nspname\n      AND ist.event_object_table  = pgc.relname\n      AND ist.trigger_name        = pgt.tgname\n  \n    /* This is a simplified version of how information_schema.views was\n    ** implemented in postgres 9.5, but modified to support materialized\n    ** views.\n    */\n    LEFT OUTER JOIN (\n      SELECT\n        nc.nspname         AS table_schema,\n        c.relname          AS table_name,\n        CASE WHEN pg_has_role(c.relowner, 'USAGE') THEN pg_get_viewdef(c.oid) ELSE null END AS view_definition,\n        CASE WHEN pg_relation_is_updatable(c.oid, false) & 20 = 20 THEN 'YES' ELSE 'NO' END AS is_updatable,\n        CASE WHEN pg_relation_is_updatable(c.oid, false) &  8 =  8 THEN 'YES' ELSE 'NO' END AS is_insertable_into,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 81 = 81) THEN 'YES' ELSE 'NO' END AS is_trigger_updatable,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 73 = 73) THEN 'YES' ELSE 'NO' END AS is_trigger_deletable,\n        CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = c.oid AND tgtype & 69 = 69) THEN 'YES' ELSE 'NO' END AS is_trigger_insertable_into\n      FROM pg_namespace nc, pg_class c\n  \n      WHERE c.relnamespace = nc.oid\n        AND c.relkind in ('v', 'm')\n        AND (NOT pg_is_other_temp_schema(nc.oid))\n        AND (pg_has_role(c.relowner, 'USAGE')\n             OR has_table_privilege(c.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')\n             OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES'))\n    ) AS isv\n      ON  isv.table_schema = pgn.nspname\n      AND isv.table_name   = pgc.relname\n  \n    WHERE\n      pgc.relkind IN ('r', 'v', 'f', 'm', 'p')\n      and (pgn.nspname='public')\n    GROUP BY pgc.oid, pgn.nspname, pgc.relname, table_type, isv.*\n  ) AS info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\n\tCOALESCE(json_agg(row_to_json(info)), '[]'::JSON)\nFROM (\n\tSELECT\n\t\tq.table_schema::text AS table_schema,\n\t\tq.table_name::text AS table_name,\n\t\tq.constraint_name::text AS constraint_name,\n\t\tmin(q.ref_table_table_schema::text) AS ref_table_table_schema,\n\t\tmin(q.ref_table::text) AS ref_table,\n\t\tjson_object_agg(ac.attname, afc.attname) AS column_mapping,\n\t\tmin(q.confupdtype::text) AS on_update,\n\t\tmin(q.confdeltype::text) AS\n\t\ton_delete\n\tFROM (\n\t\tSELECT\n\t\t\tctn.nspname AS table_schema,\n\t\t\tct.relname AS table_name,\n\t\t\tr.conrelid AS table_id,\n\t\t\tr.conname AS constraint_name,\n\t\t\tcftn.nspname AS ref_table_table_schema,\n\t\t\tcft.relname AS ref_table,\n\t\t\tr.confrelid AS ref_table_id,\n\t\t\tr.confupdtype,\n\t\t\tr.confdeltype,\n\t\t\tunnest(r.conkey) AS column_id,\n\t\t\tunnest(r.confkey) AS ref_column_id\n\t\tFROM\n\t\t\tpg_constraint r\n\t\t\tJOIN pg_class ct ON r.conrelid = ct.oid\n\t\t\tJOIN pg_namespace ctn ON ct.relnamespace = ctn.oid\n\t\t\tJOIN pg_class cft ON r.confrelid = cft.oid\n\t\t\tJOIN pg_namespace cftn ON cft.relnamespace = cftn.oid\n    WHERE\n      r.contype = 'f'::\"char\"\n      AND (ctn.nspname='public')\n      ) q\n\t\tJOIN pg_attribute ac ON q.column_id = ac.attnum\n\t\t\tAND q.table_id = ac.attrelid\n\t\tJOIN pg_attribute afc ON q.ref_column_id = afc.attnum\n\t\t\tAND q.ref_table_id = afc.attrelid\n\t\tGROUP BY\n\t\t\tq.table_schema,\n\t\t\tq.table_name,\n      q.constraint_name) AS info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\nCOALESCE(\n  json_agg(\n    row_to_json(info)\n  ),\n  '[]' :: JSON\n)\nFROM (\nSELECT\ntc.table_schema,\ntc.table_name,\ntc.constraint_name,\njson_agg(constraint_column_usage.column_name) AS columns\nFROM\ninformation_schema.table_constraints tc\nJOIN (\n  SELECT\n    x.tblschema AS table_schema,\n    x.tblname AS table_name,\n    x.colname AS column_name,\n    x.cstrname AS constraint_name\n  FROM ( SELECT DISTINCT\n      nr.nspname,\n      r.relname,\n      a.attname,\n      c.conname\n    FROM\n      pg_namespace nr,\n      pg_class r,\n      pg_attribute a,\n      pg_depend d,\n      pg_namespace nc,\n      pg_constraint c\n    WHERE\n      nr.oid = r.relnamespace\n      AND r.oid = a.attrelid\n      AND d.refclassid = 'pg_class'::regclass::oid\n      AND d.refobjid = r.oid\n      AND d.refobjsubid = a.attnum\n      AND d.classid = 'pg_constraint'::regclass::oid\n      AND d.objid = c.oid\n      AND c.connamespace = nc.oid\n      AND c.contype = 'c'::\"char\"\n      AND(r.relkind = ANY (ARRAY ['r'::\"char\", 'p'::\"char\"]))\n      AND NOT a.attisdropped\n    UNION ALL\n    SELECT\n      nr.nspname,\n      r.relname,\n      a.attname,\n      c.conname\n    FROM\n      pg_namespace nr,\n      pg_class r,\n      pg_attribute a,\n      pg_namespace nc,\n      pg_constraint c\n    WHERE\n      nr.oid = r.relnamespace\n      AND r.oid = a.attrelid\n      AND nc.oid = c.connamespace\n      AND r.oid = CASE c.contype\n      WHEN 'f'::\"char\" THEN\n        c.confrelid\n      ELSE\n        c.conrelid\n      END\n      AND(a.attnum = ANY (\n          CASE c.contype\n          WHEN 'f'::\"char\" THEN\n            c.confkey\n          ELSE\n            c.conkey\n          END))\n      AND NOT a.attisdropped\n      AND(c.contype = ANY (ARRAY ['p'::\"char\", 'u'::\"char\", 'f'::\"char\"]))\n      AND(r.relkind = ANY (ARRAY ['r'::\"char\", 'p'::\"char\"]))) x (tblschema, tblname, colname, cstrname)) constraint_column_usage ON tc.constraint_name::text = constraint_column_usage.constraint_name::text\n  AND tc.table_schema::text = constraint_column_usage.table_schema::text\n  AND tc.table_name::text = constraint_column_usage.table_name::text\nwhere (tc.table_schema='public')\n  AND tc.constraint_type::text = 'PRIMARY KEY'::text\nGROUP BY\n  tc.table_schema, tc.table_name, tc.constraint_name) as info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\nCOALESCE(\n  json_agg(\n    row_to_json(info)\n  ),\n  '[]' :: JSON\n)\nFROM (\n\tSELECT\n\t\ttc.table_name,\n\t\ttc.constraint_schema AS table_schema,\n\t\ttc.constraint_name,\n\t\tjson_agg(kcu.column_name) AS columns\n\tFROM\n\t\tinformation_schema.table_constraints tc\n\t\tJOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name)\n    where (tc.constraint_schema='public')\n\t\tAND tc.constraint_type::text = 'UNIQUE'::text\n\tGROUP BY\n\t\ttc.table_name,\n\t\ttc.constraint_schema,\n\t\ttc.constraint_name) AS info;",
              cascade: false,
              read_only: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: "SELECT\nCOALESCE(\n  json_agg(\n    row_to_json(info)\n  ),\n  '[]' :: JSON\n)\nFROM (\nSELECT n.nspname::text AS table_schema,\n    ct.relname::text AS table_name,\n    r.conname::text AS constraint_name,\n    pg_get_constraintdef(r.oid, true) AS \"check\"\n   FROM pg_constraint r\n     JOIN pg_class ct ON r.conrelid = ct.oid\n     JOIN pg_namespace n ON ct.relnamespace = n.oid\n   where (n.nspname='public')\n   AND r.contype = 'c'::\"char\"\n   ) AS info;",
              cascade: false,
              read_only: false,
            },
          },
        ],
      },
    });
    const relationships = JSON.parse(data[1].result[1][0]);
    return relationships;
  }

  async trackTable(tableName : string, customTableName : string) {
    const { data } = await axios({
      url: 'http://localhost:8081/v1/metadata',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'pg_track_table',
        args: {
          source: 'db_rick_data',
          table: tableName,
          configuration: {
            custom_root_fields: {
              select: customTableName,
              // select_by_pk: 'Author',
              // select_aggregate: 'AuthorAggregate',
              // insert: 'AddAuthors',
              // insert_one: 'AddAuthor',
              // update: 'UpdateAuthors',
              // update_by_pk: 'UpdateAuthor',
              // delete: 'DeleteAuthors',
              // delete_by_pk: 'DeleteAuthor',
            },
            custom_column_names: {
              id: 'idX',
            },
          },
        },
      },
    });
    console.log('trackTable data :', data);
    return data;
  }

  async getMainSource() {
    const metadata = await this.getMetadata();
    const source = metadata.sources.find(s => s.name === 'db_rick_data');
    if (!source) {
      throw new Error('no source named "db_rick_data"');
    }
    return source;
  }

  async getTrackedTableMap() {
    const source = await this.getMainSource();
    const tableMap : { [s: string]: any } = {};
    source.tables.forEach((t) => {
      tableMap[t.table.name] = t;
    });
    return tableMap;
  }

  updateTableInSource(source: any, tableName: string, cb: Function, createTable: boolean = false) {
    let table = source.tables.find(t => t.table.name === tableName);
    if (!table) {
      if (createTable) {
        table = {
          table: { schema: 'public', name: tableName },
        };
        source.tables.push(table);
      } else {
        throw new Error(`table not found: ${tableName}`);
      }
    }
    table = cb(table) || table;
    const index = source.tables.findIndex(t => t.table.name === tableName);
    source.tables.splice(index, 1, table);
  }

  async trackTables(metadata?: any) {
    const tableMap = await this.getTrackedTableMap();
    const tables = await this.getTables();
    const args = tables.map((table) => {
      if (tableMap[table.table_name]) {
        return null;
      }
      if (!this.tableNameToAmmModel[table.table_name]
        && !this.associationTableNameToAmmModel[table.table_name]
      ) {
        const viewsInfos = this.getAllViewsInfos();
        let foundView : any;
        for (let index = 0; index < viewsInfos.length; index++) {
          const viewsInfo = viewsInfos[index];
          foundView = Object.values(viewsInfo.views).find((viewInfo) => {
            const modelName = table.table_name.replace(toUnderscore(`_${viewInfo.viewLevelName}`), '').replace('view_', 'tbl_');
            const associationModelName = table.table_name.replace(toUnderscore(`_${viewInfo.viewLevelName}`), '').replace('view_', 'mn_');
            if (this.tableNameToAmmModel[modelName]
              || this.associationTableNameToAmmModel[associationModelName]
            ) {
              return true;
            }
            return false;
          });
          if (foundView) {
            break;
          }
        }

        if (!foundView) {
          return null;
        }
      }
      const resName = toCamel(table.table_name.replace(/^mn_/g, '').replace(/^tbl_/g, '').replace(/^view_/g, ''));
      const pluralResName = sequelize.Utils.pluralize(resName);
      const resNameC = capitalizeFirstLetter(resName);
      const pluralResNameC = capitalizeFirstLetter(pluralResName);
      return {
        type: 'pg_track_table',
        args: {
          source: 'db_rick_data',
          table: table.table_name,
          configuration: {
            custom_name: resName,
            custom_root_fields: {
              select: pluralResName,
              select_by_pk: resName,
              select_aggregate: `${resName}Aggregate`,
              insert: `add${pluralResNameC}`,
              insert_one: `add${resNameC}`,
              update: `update${pluralResNameC}`,
              update_by_pk: `update${resNameC}`,
              delete: `delete${pluralResNameC}`,
              delete_by_pk: `delete${resNameC}`,
            },
            custom_column_names: {
              id: 'id',
            },
          },
        },
      };
    }).filter(t => t);
    if (metadata) {
      const source = metadata.sources.find(s => s.name === 'db_rick_data');
      // // reset all traced tables
      // source.tables = [];
      args.forEach(({ args: a }) => {
        this.updateTableInSource(source, a.table, table => ({
          ...table,
          configuration: a.configuration,
        }), true);
      });
      return null;
    }

    const { data } = await axios({
      url: 'http://localhost:8081/v1/metadata',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'bulk',
        source: 'db_rick_data',
        args,
      },
    });
    console.log('trackTables data :', data);
    return data;
  }

  async addRelationships(metadata?: any) {
    const relationships = await this.getRelationships();
    const args = relationships.reduce((a, relationship) => {
      const relatedModelsWithColumn = this.findRelatedModelsForRelationship(relationship);

      const tableColumn = relatedModelsWithColumn.table!.column!;
      const refTableColumn = relatedModelsWithColumn.refTable!.column!;
      const tableModelTableName = relatedModelsWithColumn.table?.model!.tableName;
      const refTableModelTableName = relatedModelsWithColumn.refTable?.model!.tableName;

      const { foreignKey, ammAs: sourceAs } = (tableColumn.type[2] as BelongsToOptions);
      let targetAs = '';
      if (refTableColumn.type[0] === 'hasOne') {
        targetAs = (refTableColumn.type[2] as HasOneOptions).ammAs as string;
      } else if (refTableColumn.type[0] === 'hasMany') {
        targetAs = (refTableColumn.type[2] as HasManyOptions).ammAs as string;
      } else if (refTableColumn.type[0] === 'belongsToMany') {
        targetAs = (refTableColumn.type[2] as BelongsToManyOptions).ammAs as string;
      }


      // if (foreignKey === 'account_link_id') {
      //   console.log('sourceAs :', sourceAs);

      //   console.log('targetAs :', targetAs);

      //   console.log('tableColumn :', tableColumn);
      //   console.log('tableModelTableName :', tableModelTableName);
      //   console.log('foreignKey :', foreignKey);
      //   console.log('refTableModelTableName :', refTableModelTableName);
      // }

      const newArray = [
        ...a,
        {
          type: 'pg_create_object_relationship',
          args: {
            name: sourceAs,
            table: {
              name: tableModelTableName,
              schema: 'public',
            },
            using: {
              foreign_key_constraint_on: foreignKey,
            },
            source: 'db_rick_data',
          },
        },
        {
          type: 'pg_create_array_relationship',
          args: {
            name: targetAs,
            table: {
              name: refTableModelTableName,
              schema: 'public',
            },
            using: {
              foreign_key_constraint_on: {
                table: {
                  name: tableModelTableName,
                  schema: 'public',
                },
                column: foreignKey,
              },
            },
            source: 'db_rick_data',
          },
        },
      ];
      return newArray;
    }, []);
    if (metadata) {
      const source = metadata.sources.find(s => s.name === 'db_rick_data');
      args.forEach(({ type, args: a }) => {
        this.updateTableInSource(source, a.table.name, (table) => {
          if (type === 'pg_create_object_relationship') {
            table.object_relationships = table.object_relationships || [];
            // if (table.object_relationships.find(r => r.using.foreign_key_constraint_on === a.using.foreign_key_constraint_on)) {
            //   return table;
            // }
            table.object_relationships.push({
              name: a.name,
              using: a.using,
            });
          } else if (type === 'pg_create_array_relationship') {
            table.array_relationships = table.array_relationships || [];
            table.array_relationships.push({
              name: a.name,
              using: a.using,
            });
          }
          return table;
        }, false);
      });
      return null;
    }
    const { data } = await axios({
      url: 'http://localhost:8081/v1/metadata',
      method: 'post',
      headers: this.getHeaders(),
      data: {
        type: 'bulk',
        source: 'db_rick_data',
        args,
      },
    });
    console.log('addRelationships data :', data);
    return data;
  }

  getAllViewsInfos() {
    const modelViewsInfos : ViewsInfo[] = Object.values(this.tableParsedHasuraModelInfo)
    .map(info => info.viewsInfo!).filter(info => info);
    // console.log('modelViewsInfos :', modelViewsInfos);
    const associationViewsInfos = Object.values(this.associationTableParsedHasuraModelInfo)
    .map(info => info.viewsInfo!).filter(info => info);
    // console.log('associationViewsInfos :', associationViewsInfos);
    return modelViewsInfos.concat(associationViewsInfos);
  }

  getViewsInfoForModel(modelName : string) {
    return (
      this.tableParsedHasuraModelInfo[modelName]
      || this.associationTableParsedHasuraModelInfo[modelName]
    )?.viewsInfo;
  }

  async createViews() {
    const requestData : any = {
      type: 'bulk',
      source: 'db_rick_data',
      args: this.getAllViewsInfos()
      .reduce((a, { views }) => [
        ...a,
        ...Object.values(views).reduce((a2, { dropScript, createScript }) => [
          ...a2,
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: dropScript,
              cascade: false,
            },
          },
          {
            type: 'run_sql',
            args: {
              source: 'db_rick_data',
              sql: createScript,
              cascade: false,
            },
          },
        ], <any>[]),
      ], <any>[]),
    };

    try {
      const { data } = await axios({
        url: 'http://localhost:8081/v2/query',
        method: 'post',
        headers: this.getHeaders(),
        data: requestData,
      });
      // const tables = JSON.parse(data[0].result[1][0]);
      // console.log('tables :', tables.map(s => s.table_name));
      // const x = JSON.parse(data[1].result[1][0]);
      // console.log('x :', x);
      console.log('createViews data :', data);
      return data;
    } catch (e) {
      console.log('createViews e :', e);
      throw e;
    }
  }

  addRelationshipsForView = (viewsInfo : ViewsInfo) => {
    const requestData = Object.values(viewsInfo.views).reduce((a, viewInfo) => {
      let model : IJsonSchema;
      if (viewsInfo.isAssociationTable) {
        model = this.jsonSchemasX.schemas.associationModels[viewsInfo.modelName];
      } else {
        model = this.jsonSchemasX.schemas.models[viewsInfo.modelName];
      }
      if (!model) {
        return a;
      }

      const args = viewInfo.columns.map(columnName => ({
        columnName,
        associationType: this.getAssociationType(model.columns[columnName] as JsonModelAttributeInOptionsForm),
      }))
      .filter(({ associationType }) => associationType)
      .reduce((a2, { associationType, columnName }) => {
        // if (viewInfo.viewTableName === 'view_project_org_public') {
        //   console.log('columnName :', columnName);
        // }
        let tableModelName = viewsInfo.modelName;
        let tableColumn : JsonModelAttributeColumnOptions = model.columns[columnName] as JsonModelAttributeColumnOptions;
        // if (viewsInfo.tableName !== 'view_user_group_private') {
        //   return a2;
        // }
        // if (tableColumn.type[0] !== 'belongsToMany' || tableColumn.type[1] !== 'userGroup') {
        //   return a2;
        // }
        let refTableModelName = viewsInfo.modelName;
        let refTableColumn = tableColumn;
        let foreignKey: string = '';
        let sourceAs: string = '';
        let targetAs: string = '';
        let swapped = false;

        const tryParse = (tModelName: string, tC : JsonModelAttributeColumnOptions, mnAs = '') => {
          const tCt = (tC.type as JsonModelAttributeBelongsTo);
          const refModelName = tCt[1];
          const { jsonSchema } = this.getJsonSchema(refModelName);
          Object.keys(jsonSchema.columns).find((key) => {
            const column = jsonSchema.columns[key] as JsonModelAttributeColumnOptions;
            const refAssociationType = this.getAssociationType(column);
            if (!refAssociationType || column.type[0] === 'belongsTo') {
              return false;
            }
            if (column.type[0] === 'hasOne' && column.type[1] === tModelName && (column.type[2] as HasOneOptions).foreignKey === tCt[2].foreignKey) {
              tableModelName = tModelName;
              refTableModelName = refModelName;
              tableColumn = tC;
              sourceAs = (tC.type[2] as BelongsToOptions).ammAs!;
              foreignKey = tCt[2].foreignKey! as string;
              refTableColumn = column;
              targetAs = (column.type[2] as HasOneOptions).ammAs as string;
              return true;
            } else if (column.type[0] === 'hasMany' && column.type[1] === tModelName && (column.type[2] as HasManyOptions).foreignKey === tCt[2].foreignKey) {
              tableModelName = tModelName;
              refTableModelName = refModelName;
              tableColumn = tC;
              sourceAs = (tC.type[2] as BelongsToOptions).ammAs!;
              foreignKey = tCt[2].foreignKey! as string;
              refTableColumn = column;
              targetAs = (column.type[2] as HasManyOptions).ammAs as string;
              return true;
            } else if (
              column.type[0] === 'belongsToMany'
              && (column.type[2] as BelongsToManyOptions).through.ammModelName === tModelName
              && (column.type[2] as BelongsToManyOptions).foreignKey === tCt[2].foreignKey
              && (mnAs === '' || mnAs === (column.type[2] as BelongsToManyOptions).ammAs as string)
            ) {
              tableModelName = tModelName;
              refTableModelName = refModelName;
              tableColumn = tC;
              sourceAs = (tC.type[2] as BelongsToOptions).ammAs!;
              foreignKey = tCt[2].foreignKey! as string;
              refTableColumn = column;
              targetAs = (column.type[2] as BelongsToManyOptions).ammAs as string;
              return true;
            }
            return false;
          });
        };

        const swapAndTryParse = (refModelName: string, tC : JsonModelAttributeColumnOptions, mnAs = '') => {
          swapped = true;
          // //// console.log('refModelName :', refModelName);
          const { jsonSchema } = this.getJsonSchema(refModelName);
          // //// console.log('jsonSchema :', jsonSchema);
          Object.keys(jsonSchema.columns).find((key) => {
            // //// console.log('key :', key);
            const column = jsonSchema.columns[key] as JsonModelAttributeColumnOptions;
            const refAssociationType = this.getAssociationType(column);
            // //// console.log('refAssociationType :', refAssociationType);
            if (!refAssociationType || column.type[0] !== 'belongsTo') {
              return false;
            }
            // //// console.log('column.type :', column.type);
            // //// console.log('tableColumn :', tableColumn);
            if (column.type[0] === 'belongsTo' && column.type[1] === viewsInfo.modelName && (column.type[2] as BelongsToOptions).foreignKey === (<any>tableColumn).type[2].foreignKey) {
              tableColumn = column;
              return true;
            }
            return false;
          });
          tryParse(refModelName, tableColumn, mnAs);
        };

        if (associationType === 'belongsTo') {
          tryParse(viewsInfo.modelName, tableColumn);
        } else if (associationType === 'hasOne' || associationType === 'hasMany') {
          swapAndTryParse(tableColumn.type[1] as string, tableColumn);
        } else if (associationType === 'belongsToMany') {
          const options = (<any>tableColumn.type[2] as BelongsToManyOptions);
          swapAndTryParse(options.through.ammModelName, tableColumn, options.ammAs);
        }

        if (
          !tableColumn
          || !refTableColumn
          || !foreignKey
          || !sourceAs
          || !targetAs
        ) {
          console.log('tableColumn, refTableColumn, foreignKey, sourceAs, targetAs :', tableColumn, refTableColumn, foreignKey, sourceAs, targetAs);
        }

        const tableModelTableName = (<any> this.ammOrm.tableInfo[tableModelName] || this.ammOrm.associationModelInfo[tableModelName]).sqlzOptions.tableName!;
        const refTableModelTableName = (<any> this.ammOrm.tableInfo[refTableModelName] || this.ammOrm.associationModelInfo[refTableModelName]).sqlzOptions.tableName!;
        let result = [
          ...a2,
        ];

        if (swapped) {
          result = [
            ...result,
            {
              type: 'pg_create_array_relationship',
              args: {
                source: 'db_rick_data',
                name: targetAs,
                table: {
                  name: viewInfo.viewTableName,
                  schema: 'public',
                },
                using: {
                  manual_configuration: {
                    remote_table: {
                      name: tableModelTableName,
                      schema: 'public',
                    },
                    column_mapping: {
                      id: foreignKey,
                    },
                    insertion_order: null,
                  },
                },
              },
            },
          ];
        } else {
          result = [
            ...result,
            {
              type: 'pg_create_object_relationship',
              args: {
                source: 'db_rick_data',
                name: sourceAs,
                table: {
                  name: viewInfo.viewTableName,
                  schema: 'public',
                },
                using: {
                  manual_configuration: {
                    remote_table: {
                      name: refTableModelTableName,
                      schema: 'public',
                    },
                    column_mapping: {
                      [foreignKey]: 'id',
                    },
                    insertion_order: null,
                  },
                },
              },
            },
          ];
        }
        return result;
      }, <any>[]);

      const originalTableModelTableName = (<any> this.ammOrm.tableInfo[viewsInfo.modelName] || this.ammOrm.associationModelInfo[viewsInfo.modelName]).sqlzOptions.tableName!;
      const newArray = [
        ...a,
        ...args,
        {
          type: 'pg_create_object_relationship',
          args: {
            source: 'db_rick_data',
            name: 'publicData',
            table: {
              name: viewInfo.viewTableName,
              schema: 'public',
            },
            using: {
              manual_configuration: {
                remote_table: {
                  name: originalTableModelTableName,
                  schema: 'public',
                },
                column_mapping: {
                  id: 'id',
                },
              },
            },
          },
        },
        {
          type: 'pg_create_object_relationship',
          args: {
            source: 'db_rick_data',
            name: `${viewInfo.viewLevelName}Data`,
            table: {
              name: originalTableModelTableName,
              schema: 'public',
            },
            using: {
              manual_configuration: {
                remote_table: {
                  name: viewInfo.viewTableName,
                  schema: 'public',
                },
                column_mapping: {
                  id: 'id',
                },
              },
            },
          },
        },
      ];
      return newArray;
    }, <any>[]);
    // fs.writeFileSync('requestData.json', JSON.stringify(requestData, null, 2), { encoding: 'utf-8' });
    return requestData;
    // const { data } = await axios({
    //   url: 'http://localhost:8081/v1/metadata',
    //   method: 'post',
    //   headers: this.getHeaders(),
    //   data: {
    //     type: 'bulk',
    //     source: 'db_rick_data',
    //     args: requestData,
    //   },
    // });
    // console.log('data :', data);
    // return data;
  }

  async addRelationshipsForViews(metadata?: any) {
    const viewsInfos = this.getAllViewsInfos();
    const args = viewsInfos.reduce((a, vi) => a.concat(this.addRelationshipsForView(vi)), <any>[]);
    if (metadata) {
      const source = metadata.sources.find(s => s.name === 'db_rick_data');
      args.forEach(({ type, args: a }) => {
        this.updateTableInSource(source, a.table.name, (table) => {
          if (type === 'pg_create_object_relationship') {
            table.object_relationships = table.object_relationships || [];
            // if (table.object_relationships.find(r => r.using.foreign_key_constraint_on === a.using.foreign_key_constraint_on)) {
            //   return table;
            // }
            table.object_relationships.push({
              name: a.name,
              using: a.using,
            });
          } else if (type === 'pg_create_array_relationship') {
            table.array_relationships = table.array_relationships || [];
            table.array_relationships.push({
              name: a.name,
              using: a.using,
            });
          }
          return table;
        }, false);
      });
      return null;
    }
    try {
      const { data } = await axios({
        url: 'http://localhost:8081/v1/metadata',
        method: 'post',
        headers: this.getHeaders(),
        data: {
          type: 'bulk',
          source: 'db_rick_data',
          args,
        },
      });
      console.log('addRelationshipsForViews data :', data);
      return data;
    } catch (e) {
      console.log('addRelationshipsForViews e :', e);
      throw e;
    }

    // return (await Promise.all(
    //   viewsInfos.map(
    //     async viewsInfo => this.addRelationshipsForView(viewsInfo),
    //   ),
    // )).reduce((a, v) => a.concat(v), []);
  }

  async getMainSourceTableSelectPermissions(tableName: string = 'view_user_private') {
    const source = await this.getMainSource();
    const table = source.tables.find(t => t.table.name === tableName);
    return (table || {}).select_permissions || [];
  }

  async addPermissions(metadata?: any) {
    const args = <any>[];
    const add = (model : AmmModel) => {
      supportedHasuraRoles.forEach((supportedHasuraRole) => {
        args.push({
          type: 'pg_create_select_permission',
          args: {
            table: {
              name: model.sqlzOptions.tableName!,
              schema: 'public',
            },
            role: supportedHasuraRole,
            permission: {
              filter: {},
              columns: this.getViewsInfoForModel(model.modelName)?.publicColumns || [],
              limit: 25,
              allow_aggregations: true,
            },
            source: 'db_rick_data',
          },
        });
      });
    };
    Object.keys(this.ammOrm.tableInfo).forEach((k) => {
      const model = this.ammOrm.tableInfo[k];
      add(model);
    });
    this.associationTableNameToAmmModel = {};
    Object.keys(this.ammOrm.associationModelInfo).forEach((k) => {
      const model = this.ammOrm.associationModelInfo[k] as AssociationModel;
      add(model);
    });
    if (metadata) {
      const source = metadata.sources.find(s => s.name === 'db_rick_data');
      args.forEach(({ type, args: a }) => {
        this.updateTableInSource(source, a.table.name, (table) => {
          if (type === 'pg_create_select_permission') {
            table.select_permissions = table.select_permissions || [];
            if (table.select_permissions.find(r => r.role === a.role)) {
              return table;
            }
            table.select_permissions.push({
              role: a.role,
              permission: a.permission,
            });
          }
          return table;
        }, false);
      });
      return null;
    }

    try {
      const { data } = await axios({
        url: 'http://localhost:8081/v1/metadata',
        method: 'post',
        headers: this.getHeaders(),
        data: {
          type: 'bulk',
          source: 'db_rick_data',
          args,
        },
      });
      console.log('addPermissions data :', data);
      return data;
    } catch (e) {
      console.log('addPermissions e :', e);
      throw e;
    }

    // return (await Promise.all(
    //   viewsInfos.map(
    //     async viewsInfo => this.addRelationshipsForView(viewsInfo),
    //   ),
    // )).reduce((a, v) => a.concat(v), []);
  }

  async addPermissionsForViews(metadata?: any) {
    const viewsInfos = this.getAllViewsInfos();
    const args = <any>[];

    // const permissions = await this.getMainSourceTableSelectPermissions();
    // const permission = permissions.find(p => p.role === 'user');
    // if (permission) {
    //   args.push({
    //     type: 'pg_drop_select_permission',
    //     args: {
    //       table: {
    //         name: 'view_user_private',
    //         schema: 'public',
    //       },
    //       role: 'user',
    //       source: 'db_rick_data',
    //     },
    //   });
    // }
    // args.push({
    //   type: 'pg_create_select_permission',
    //   args: {
    //     table: {
    //       name: 'view_user_private',
    //       schema: 'public',
    //     },
    //     role: 'user',
    //     permission: {
    //       columns: [
    //         'id',
    //         'name',
    //         'type',
    //         'privilege',
    //         'picture',
    //         'labels',
    //         'data',
    //         'org_mgr_id',
    //         'created_at',
    //         'updated_at',
    //         'deleted_at',
    //       ],
    //       filter: {
    //         id: {
    //           _eq: 'X-Hasura-User-Id',
    //         },
    //       },
    //       limit: 25,
    //       allow_aggregations: true,
    //     },
    //     source: 'db_rick_data',
    //   },
    // });

    Object.values(viewsInfos).forEach((viewsInfo) => {
      Object.values(viewsInfo.views).forEach((view) => {
        Object.values(view.permissions).forEach((permission) => {
          const p = <any>{
            columns: view.columnNames,
            filter: permission!.filter,
          };
          if (permission!.limit != null) {
            p.limit = permission!.limit;
          }
          if (permission!.allow_aggregations != null) {
            p.allow_aggregations = permission!.allow_aggregations;
          }
          args.push({
            type: 'pg_create_select_permission',
            args: {
              table: {
                name: view.viewTableName,
                schema: 'public',
              },
              role: permission!.role,
              permission: p,
              source: 'db_rick_data',
            },
          });
        });
      });
    });
    if (metadata) {
      const source = metadata.sources.find(s => s.name === 'db_rick_data');
      args.forEach(({ type, args: a }) => {
        this.updateTableInSource(source, a.table.name, (table) => {
          if (type === 'pg_create_select_permission') {
            table.select_permissions = table.select_permissions || [];
            if (table.select_permissions.find(r => r.role === a.role)) {
              return table;
            }
            table.select_permissions.push({
              role: a.role,
              permission: a.permission,
            });
          }
          return table;
        }, false);
      });
      return null;
    }

    try {
      const { data } = await axios({
        url: 'http://localhost:8081/v1/metadata',
        method: 'post',
        headers: this.getHeaders(),
        data: {
          type: 'bulk',
          source: 'db_rick_data',
          args,
        },
      });
      console.log('addPermissionsForViews data :', data);
      return data;
    } catch (e) {
      console.log('addPermissionsForViews e :', e);
      throw e;
    }

    // return (await Promise.all(
    //   viewsInfos.map(
    //     async viewsInfo => this.addRelationshipsForView(viewsInfo),
    //   ),
    // )).reduce((a, v) => a.concat(v), []);
  }

  async test() {
    await this.getMetadata();
    await this.addSource();
    // await this.trackTable('tbl_user', 'users');
    // await this.trackTable('tbl_account_link', 'accountLinks');
    await this.createViews();
    const metadata = await this.getMetadata();
    await this.trackTables(metadata);
    await this.addRelationships(metadata);
    await this.addRelationshipsForViews(metadata);
    await this.addPermissions(metadata);
    await this.addPermissionsForViews(metadata);
    await this.replaceMetadata(metadata);
    // await this.getTables();
    // await this.getMetadata();


    // const tables = await this.getTables();
    // tables.forEach(console.log);
  }
}

export default HasuraMgr;
