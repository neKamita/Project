FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/project
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=root123

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
