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
  minio1:
    image: minio/minio:RELEASE.2019-04-09T01-22-30Z

    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-afs-minio1

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
  pg-master:
    image: postgres:12

    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-afs-pg-master
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
  webserver:
    image: ${<%= prefixUpper %>_IMAGE_NS:-<%= prefixLower %>internal}/${<%= prefixUpper %>_IMAGE_PROJ:-default}/afswebserver
    build:
      context: .

    container_name: ${<%= prefixUpper %>_CONTAINER_NS:-<%= prefixLower %>internal}-${<%= prefixUpper %>_CONTAINER_PROJ:-default}-afs-webserver
<% if(docker.dockerPostgresType === 'mine' || docker.dockerMinioType === 'mine'){ -%>

    links:
<% } -%>
<% if(docker.dockerMinioType === 'mine'){ -%>
      - "minio1:minio1"
<% } -%>
<% if(docker.dockerPostgresType === 'mine'){ -%>
      - "pg-master:postgres"
<% } -%>
<% if(docker.dockerPostgresType === 'mine' || docker.dockerMinioType === 'mine'){ -%>

    depends_on:
<% } -%>
<% if(docker.dockerMinioType === 'mine'){ -%>
      - "minio1"
<% } -%>
<% if(docker.dockerPostgresType === 'mine'){ -%>
      - "pg-master"
<% } -%>
<% if(docker.dockerPostgresType === 'external_link' || docker.dockerMinioType === 'external_link'){ -%>

    external_links:
<% } -%>
<% if(docker.dockerMinioType === 'external_link'){ -%>
      - <%= docker.minioExternalLink %>:minio1
<% } -%>
<% if(docker.dockerPostgresType === 'external_link'){ -%>
      - <%= docker.postgresExternalLink %>:pg-master
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
