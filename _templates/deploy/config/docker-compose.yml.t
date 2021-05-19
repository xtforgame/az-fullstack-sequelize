---
to: docker-compose.yml
---
<%
 prefixUpper = h.toPrefixUpper(docker.envVarPrfix.toUpperCase());
 prefixLower = h.toPrefixLower(docker.envVarPrfix.toLowerCase());
%># EnvironmentVariableList:
#   Global:
#     <%= prefixUpper %>_IMAGE_NS: <%= prefixLower %>internal
#     <%= prefixUpper %>_IMAGE_PROJ: default
#     <%= prefixUpper %>_CONTAINER_NS: <%= prefixLower %>internal
#     <%= prefixUpper %>_CONTAINER_PROJ: default
#   Project:

version: '3'
services:
<% if(docker.dockerMinioType === 'mine'){ -%>
  minio1-<%= project.safename %>:
    image: minio/minio:RELEASE.2019-04-09T01-22-30Z

    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-minio1

    volumes:
      - ../minio_data:/data
<% if(docker.minioExposePort){ -%>

    ports:
      - "${<%= prefixUpper %>_MINIO_PORT:-<%= docker.minioExposePort %>}:9000"
<% } -%>

    environment:
      MINIO_ACCESS_KEY: minioxxxak
      MINIO_SECRET_KEY: minioxxxsk

    command: server /data

<% } -%>
<% if(docker.dockerPostgresType === 'mine'){ -%>
  pg-master-<%= project.safename %>:
    image: postgres:12

    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-pg-master-<%= project.safename %>
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: xxxx1234
      PGDATA: /var/lib/postgresql/data/pgdata
<% if(docker.postgresExposePort){ -%>

    ports:
      - "${<%= prefixUpper %>_PG_PORT:-<%= docker.postgresExposePort%>}:5432"
<% } -%>

    volumes:
      - "../pgdata:/var/lib/postgresql/data/pgdata"

<% } -%>
<% if(docker.dockerHasuraType === 'mine'){ -%>
  graphql-engine-<%= project.safename %>:
    image: hasura/graphql-engine:v2.0.0-alpha.3
    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-hasura-<%= project.safename %>
    # restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:xxxx1234@postgres:5432/postgres
      ## HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:xxxx1234@postgres:5432/db_rick_data
      ## enable the console served by server
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true" # set to "false" to disable console
      ## enable debugging mode. It is recommended to disable this in production
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      ## uncomment next line to set an admin secret
      HASURA_GRAPHQL_ADMIN_SECRET: xxxxhsr
    logging:
      driver: "json-file"
      options:
        max-file: "5"
        max-size: "10m"
<% if(docker.dockerPostgresType === 'mine'){ -%>

    links:
<% } -%>
<% if(docker.dockerPostgresType === 'mine'){ -%>
      - "pg-master-<%= project.safename %>:postgres"
<% } -%>

    depends_on:
<% if(docker.dockerPostgresType === 'mine'){ -%>
      - "pg-master-<%= project.safename %>"
<% } -%>
<% if(docker.dockerPostgresType === 'external_link' || docker.dockerMinioType === 'external_link'){ -%>

    external_links:
<% } -%>
<% if(docker.dockerPostgresType === 'external_link'){ -%>
      - <%= docker.postgresExternalLink %>:postgres
<% } -%>
<% if(docker.hasuraExposePort){ -%>

    ports:
      - "${<%= prefixUpper %>_HSR_PORT:-<%= docker.hasuraExposePort%>}:8080"
<% } -%>

<% } -%>
  webserver:
    image: ${<%= prefixUpper %>_IMAGE_NS:-<%= prefixLower %>internal}/${<%= prefixUpper %>_IMAGE_PROJ:-default}/webserver-<%= project.safename %>
    build:
      context: .

    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-webserver-<%= project.safename %>
<% if(docker.dockerPostgresType === 'mine' || docker.dockerMinioType === 'mine'){ -%>

    links:
<% } -%>
<% if(docker.dockerMinioType === 'mine'){ -%>
      - "minio1-<%= project.safename %>:minio1"
<% } -%>
<% if(docker.dockerPostgresType === 'mine'){ -%>
      - "pg-master-<%= project.safename %>:postgres"
<% } -%>
<% if(docker.dockerPostgresType === 'mine' || docker.dockerMinioType === 'mine'){ -%>

    depends_on:
<% } -%>
<% if(docker.dockerMinioType === 'mine'){ -%>
      - "minio1-<%= project.safename %>"
<% } -%>
<% if(docker.dockerPostgresType === 'mine'){ -%>
      - "pg-master-<%= project.safename %>"
<% } -%>
<% if(docker.dockerPostgresType === 'external_link' || docker.dockerMinioType === 'external_link'){ -%>

    external_links:
<% } -%>
<% if(docker.dockerMinioType === 'external_link'){ -%>
      - <%= docker.minioExternalLink %>:minio1
<% } -%>
<% if(docker.dockerPostgresType === 'external_link'){ -%>
      - <%= docker.postgresExternalLink %>:pg-master-<%= project.safename %>
<% } -%>

    environment:
      AFS_SECRETS_FOLDER: "/usr/volumes/share/secrets"

    volumes:
      - ".:/usr/volumes/src/"
      - "../secrets:/usr/volumes/share/secrets"

    command: bash docker-cmd.sh

    # ports:
    #   - "443:443"
    #   - "80:80"
<% if(docker.networkName){ -%>

networks:
  default:
    external:
      name: <%= docker.networkName %>
<% } -%>
