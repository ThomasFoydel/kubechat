FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY analytics/Analytics.sln ./analytics/
COPY analytics/Analytics.Api/Analytics.Api.csproj ./analytics/Analytics.Api/

RUN dotnet restore ./analytics/Analytics.Api/Analytics.Api.csproj

COPY analytics/Analytics.Api ./analytics/Analytics.Api

RUN dotnet publish ./analytics/Analytics.Api/Analytics.Api.csproj \
    -c Release \
    -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5227

EXPOSE 5227

ENTRYPOINT ["dotnet", "Analytics.Api.dll"]
