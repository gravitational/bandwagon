# ENV environment variable defaults to 'staging', but can be set to 'production',
# for example:
#   > ENV=production make push
TAG=1.0.0
NOROOT=-u $$(id -u):$$(id -g)
ENV?=staging

##############################
#   Docker Targets
##############################

#
# Builds the website Docker container (to be deployed later)
#
.PHONY:docker-build
docker-build:
	docker build --build-arg UID=$$(id -u) --build-arg GID=$$(id -g) --force-rm=true -t bandwagon:$(TAG) .

#
# Starts the web site under local Docker
#
.PHONY: docker-run
docker-run:
	docker run -ti -p 3000:3000 --rm=true $(NOROOT) -t bandwagon:$(TAG) npm run start

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
