-include .env

ADDR := localhost:8080

PROJECTNAME := $(shell basename "$(PWD)")
BRANCH := $(shell git rev-parse --abbref-ref HEAD)
BUILD := $(shell git rev-parse --short HEAD)

# Go related variables.
GOBASE := $(shell pwd)
GOPATH := $(GOBASE)/vendor:$(GOBASE)
GOBIN := $(GOBASE)/bin
GOFILES := $(wildcard *.go)

# Redirect error output to a file, so we can show it in development mode.
STDERR := /tmp/.$(PROJECTNAME)-stderr.txt

# PID file will keep the process id of the server
PID := /tmp/.$(PROJECTNAME).pid

# Make is verbose in Linux. Make it silent.
MAKEFLAGS += --silent

## install: Install missing dependencies. Runs `go get` internally. e.g; make install get=github.com/foo/bar
install: go-get

## start: Start in development mode. Auto-starts when code changes.
start:
	@bash -c "trap 'make stop' EXIT; $(MAKE) clean compile start-server watch run='make clean compile start-server'"

## stop: Stop development mode.
stop: stop-server

start-server: stop-server
	@echo "  >  $(PROJECTNAME) is available at $(ADDR)"
	@-$(GOBIN)/$(PROJECTNAME)

stop-server:
	@-touch $(PID)
	@-kill `cat $(PID)` 2> /dev/null || true
	@-rm $(PID)

## watch: Run given command when code changes. e.g; make watch run="echo 'hey'"
watch:
	@GOPATH=$(GOPATH) GOBIN=$(GOBIN) yolo -i . -e vendor -e bin -c "$(run)"

restart-server: stop-server start-server

## compile: Compile the binary.
compile:
	@-touch $(STDERR)
	@-rm $(STDERR)
	@-$(MAKE) -s go-compile 2> $(STDERR)
	@cat $(STDERR) | sed -e '1s/.*/\nError:\n/'  | sed 's/make\[.*/ /' | sed "/^/s/^/     /" 1>&2

## exec: Run given command, wrapped with custom GOPATH. e.g; make exec run="go test ./..."
exec:
	@GOPATH=$(GOPATH) GOBIN=$(GOBIN) $(run)

## clean: Clean build files. Runs `go clean` internally.
clean:
	@-rm $(GOBIN)/$(PROJECTNAME) 2> /dev/null
	@-$(MAKE) go-clean

## dev: run build and up on dev environment.
dev: build up

## build: run build on dev environment.
build:
	@COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f docker-compose.yml -f docker-compose.yml build

## up: run docker-compose up with dev environment.
up:
	@docker-compose -f docker-compose.yml -f docker-compose.yml up

## down: run docker-compose down and deletes existing volumes.
down:
	@-docker-compose -f docker-compose.yml -f docker-compose.yml down --volumes

## test: run test and immediately teardown
test: test-up

## test-up: run docker-compose up with dev environment.
test-up:
	@-docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit --remove-orphans

## test-down: run docker-compose down and deletes existing volumes with test environment.
test-down:
	@-docker-compose -f docker-compose.yml -f docker-compose.test.yml down --volumes

## prod: run prod locally
prod: prod-build prod-up

## prod-build: run build on prod environment.
prod-build:
	@-docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

## prod-up: run docker-compose up with prod environment.
prod-up:
	@-docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

go-compile: go-get go-build

go-build:
	@echo "  >  Building binary..."
	@GOPATH=$(GOPATH) GOBIN=$(GOBIN) go build -o $(GOBIN)/$(PROJECTNAME) $(GOFILES)

go-get:
	@echo "  >  Checking if there is any missing dependencies..."
	@GOPATH=$(GOPATH) GOBIN=$(GOBIN) go mod download

go-install:
	@GOPATH=$(GOPATH) GOBIN=$(GOBIN) go install $(GOFILES)

go-clean:
	@echo "  >  Cleaning build cache"
	@GOPATH=$(GOPATH) GOBIN=$(GOBIN) go clean

.PHONY: help
all: help
help: Makefile
	@echo
	@echo " Choose a command run in "$(PROJECTNAME)":"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
