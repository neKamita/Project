# Use an official Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven build file and the source code
COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Copy the packaged jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Copy the database initialization script
COPY init-db.sh /docker-entrypoint-initdb.d/

# Expose the port the application runs on
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "app.jar"]