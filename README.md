# Docker Java App

A small Amazon-inspired e-commerce frontend backed by a Spring Boot REST API.
This repository is intentionally database-free while we learn Docker.

## Technology

- Java 17
- Spring Boot
- Maven
- HTML
- CSS
- JavaScript

## Current application

The app provides:

- Product catalog
- Product search
- Category filtering
- Product sorting
- Shopping cart
- Browser local-storage cart persistence
- REST API for products

## Run locally

```bash
mvn spring-boot:run
```

Open:

http://localhost:8080

API:

http://localhost:8080/api/products

## Build

```bash
mvn clean package
```

The JAR is created under `target/`.

## Docker

Docker will be added later as part of the learning process. The first Dockerfile will be a simple single-stage Dockerfile.

## Database

There is intentionally no database yet. Database integration will be introduced later as a separate Docker learning step.
