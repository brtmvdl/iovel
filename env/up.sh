
docker-compose  \
  -f $(pwd)/docker-compose.yaml  \
  --env-file $(pwd)/docker-compose.env up  \
  --remove-orphans  \
  --force-recreate  \
  --build 
