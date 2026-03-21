FROM eclipse-temurin:22-jre

WORKDIR /app

COPY Notiva.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

