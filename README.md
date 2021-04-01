# AzFullstackSequelizeDev

A fullstack sequelize seed project

Run `npm install`

  1. `npm start` for development
  2. `npm run build` for build

yarn stop-db&&yarn start-db&&yarn start

yarn stop-db&&yarn start-db&&yarn test:hasura


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
