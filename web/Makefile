TAG=1.0.0
NOROOT=-u $$(id -u):$$(id -g)

CONTAINER_DIR=/app/dist
HOST_DIR=src/dist
DOCKERFLAGS=--rm=true $(NOROOT) -v "$$(pwd)/dist":$(CONTAINER_DIR) -t bandwagon:$(TAG)

##############################
#   Docker Targets
##############################

#
# Builds dist files
#
.PHONY:docker-build
docker-build:
	docker build --build-arg UID=$$(id -u) --build-arg GID=$$(id -g) --force-rm=true -t bandwagon:$(TAG) .
	docker run $(DOCKERFLAGS) npm run build

# docker run -v dist:/app/mama -other -options bandwagon:1.0.0 cp dist mama
# run  -v dist:/app/mama  bandwagon:1.0.0 cp -r /app/dist/. /app/mama

#
# Removes the local Docker container
#
.PHONY: docker-clean
docker-clean:
	docker rmi bandwagon:$(TAG)

#
# 'make docker-enter' builds a Docker container with a website
#
.PHONY:docker-enter
docker-enter:
	docker run -ti -p 3000:3000 --rm=true $(NOROOT) -t bandwagon:$(TAG) /bin/bash

##############################
#   Native Localhost
##############################

#
# 'make run' starts a local debugging environment (if this fails, run 'make build' first)
#
.PHONY:run
run:
	npm run start

#
# 'make build' installs missing packages required for `make local` to run
#
.PHONY:build
build:
	npm install

#
# Removes installed node modules
#
.PHONY:clean
clean:
	rm -rf node_modules
	rm -rf dist
