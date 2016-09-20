TAG=1.0.0
NOROOT=-u $$(id -u):$$(id -g)

CONTAINER_DIR=/app/dist
HOST_DIR="$$(pwd)/dist"
DOCKERFLAGS=--rm=true $(NOROOT) -h buildbox -v $(HOST_DIR):$(CONTAINER_DIR) -t bandwagon-web:$(TAG)

##############################
#   Docker Targets
##############################

#
# Builds dist files
#
.PHONY:docker-build
docker-build:
	mkdir -p $(HOST_DIR)
	docker build --build-arg UID=$$(id -u) --build-arg GID=$$(id -g) --force-rm=true -t bandwagon-web:$(TAG) .
	docker run $(DOCKERFLAGS) npm run build
	#docker run -ti $(DOCKERFLAGS) /bin/bash

#
# Removes the local Docker container
#
.PHONY: docker-clean
docker-clean:
	docker rmi bandwagon-web:$(TAG)

#
# 'make docker-enter' builds a Docker container with a website
#
.PHONY:docker-enter
docker-enter:
	docker run -ti -p 3000:3000 --rm=true $(NOROOT) -t bandwagon-web:$(TAG) /bin/bash

##############################
#   Native Localhost
##############################


#
# 'make build' installs missing packages required for `make local` to run
#
.PHONY:build
build:
	npm install
	npm run build

#
# Removes installed node modules
#
.PHONY:clean
clean:
	rm -rf node_modules
	rm -rf dist
