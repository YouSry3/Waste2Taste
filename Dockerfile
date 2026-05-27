FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# انسخ كل المشروع
COPY . .

# ادخل على مشروع الـ API
WORKDIR /src/BackEnd/FoodRescue.PL

# restore + publish مباشرة
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "FoodRescue.PL.dll"]