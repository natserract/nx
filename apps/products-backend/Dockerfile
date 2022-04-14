FROM golang:latest AS builder

# Set work dir
WORKDIR /app

# Copy go mod files
COPY go.mod .
COPY go.sum .

RUN go mod download

# Copy all files to directory
COPY . .

# Build the app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Start fresh from smaller image
FROM alpine:latest

RUN apk add --no-cache ca-certificates && update-ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# Expose port 8080
EXPOSE 8080

CMD /wait && echo "Waiting for 5 seconds..." && sleep 5 && ./main
