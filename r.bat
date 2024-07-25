@echo off

if "%1" == "d" (
    if "%2" == "r" (
        .\gradlew build && .\build\exe\main\debug\Lighthouse.exe
    ) else (
        .\gradlew build
    )
    .\gradlew build && .\build\exe\main\debug\Lighthouse.exe
) else if "%1" == "r" (
    if "%2" == "r" (
        .\gradlew assembleRelease && .\build\exe\main\release\Lighthouse.exe
    ) else (
        .\gradlew assembleRelease
    )
)