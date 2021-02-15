## Docker Build & Run Instructions

docker build -t node-rest-api .
docker run -it -p 8080:8080 --name=nodeapi node-rest-api
