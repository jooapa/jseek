:: if arg is debug, build and run in debug mode
if "%1" == "d" (
    .\gradlew build && .\build\exe\main\debug\Lighthouse.exe
) else if "%1" == "r" (
    .\gradlew assembleRelease && .\build\exe\main\release\Lighthouse.exe
)