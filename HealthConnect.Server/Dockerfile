FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["HealthConnect.Server.csproj", "./"]
RUN dotnet restore "HealthConnect.Server.csproj"
COPY . .
RUN dotnet build "HealthConnect.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HealthConnect.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthConnect.Server.dll"]

