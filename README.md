# AzFullstackSequelizeDev

A fullstack sequelize seed project

Run `npm install`

  1. `npm start` for development
  2. `npm run build` for build

yarn stop-db&&yarn start-db&&yarn start

yarn build-server&&yarn c-cmd-dev RemoteSchemaCompare \
    rick.cloud -- \
    --postgresPort 22002 \
    --postgresPassword xxxx1234

yarn stop-db&&yarn start-db&&yarn build-server-dev&&yarn test:hasura&&yarn amm-sync&&yarn graphql-codegen

rm -rf ../pgdata-m
yarn stop-mig&&yarn start-mig&&yarn test:hasura&&yarn test:migration


postgres://postgres:xxxx1234@postgres:5432/db_rick_data



X-Hasura-Role user
X-Hasura-User-Id 1
X-Hasura-Org-Ids 
X-Hasura-Allowed-Organizations {1,2,3}

```json
{
    "_or": [
        {
            "id": {
                "_eq": "X-Hasura-User-Id"
            }
        },
        {
            "organizations": {
                "organization": {
                    "id": {
                        "_in": "X-Hasura-Allowed-Organisations"
                    }
                }
            }
        }
    ]
}
```
```json
{
    "type": "bulk",
    "source": "db_rick_data",
    "args": [
        {
            "type": "pg_create_select_permission",
            "args": {
                "table": {
                    "name": "tbl_user",
                    "schema": "public"
                },
                "role": "user",
                "permission": {
                    "columns": [
                        "data",
                        "id",
                        "name",
                        "picture",
                        "privilege",
                        "type"
                    ],
                    "computed_fields": [],
                    "backend_only": false,
                    "filter": {
                        "_or": [
                            {
                                "id": {
                                    "_eq": "X-Hasura-User-Id"
                                }
                            },
                            {
                                "organizations": {
                                    "organization": {
                                        "id": {
                                            "_in": "X-Hasura-Allowed-Organisations"
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    "limit": 20,
                    "allow_aggregations": false
                },
                "source": "db_rick_data"
            }
        }
    ]
}
```
```json
{
    "type": "bulk",
    "source": "db_rick_data",
    "args": [
        {
            "type": "pg_create_object_relationship",
            "args": {
                "source": "db_rick_data",
                "name": "user",
                "table": {
                    "name": "user_private",
                    "schema": "public"
                },
                "using": {
                    "manual_configuration": {
                        "remote_table": {
                            "name": "tbl_user",
                            "schema": "public"
                        },
                        "column_mapping": {
                            "id": "id"
                        }
                    }
                }
            }
        },
        {
            "type": "pg_create_object_relationship",
            "args": {
                "source": "db_rick_data",
                "name": "private",
                "table": {
                    "name": "tbl_user",
                    "schema": "public"
                },
                "using": {
                    "manual_configuration": {
                        "remote_table": {
                            "name": "user_private",
                            "schema": "public"
                        },
                        "column_mapping": {
                            "id": "id"
                        }
                    }
                }
            }
        }
    ]
}
```

apollo schema:download --endpoint http://localhost:8081/v1/graphql --header "X-Hasura-Admin-Secret: xxxxhsr"
