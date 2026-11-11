FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY services/billing-spring/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY services/billing-spring/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/target/billing-spring-0.1.0.jar ./app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
