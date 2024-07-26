@echo off
setlocal

if "%1" == "" (
    echo Usage: r [build type] [run]
    echo ---------------------
    echo -----[build type]-----
    echo r: Release build
    echo d: Debug build
    echo --------[run]---------
    echo r: Run the executable
    echo b: build
    echo rb: build and run the executable
    echo ---------------------
    goto :eof
)

if "%1" == "r" (
    set "BUILD_CMD=assembleRelease"
    set "EXECUTABLE_PATH=.\build\exe\main\release\Lighthouse.exe"
) else if "%1" == "d" (
    set "BUILD_CMD=assembleDebug"
    set "EXECUTABLE_PATH=.\build\exe\main\debug\Lighthouse.exe"
) else (
    echo Invalid build type: %1
    goto :eof
)

if "%2" == "r" (
    "%EXECUTABLE_PATH%"
) else if "%2" == "rb" (
    gradlew %BUILD_CMD%
    if errorlevel 1 goto :eof
    "%EXECUTABLE_PATH%"
) else if "%2" == "b" (
    gradlew %BUILD_CMD%
    if errorlevel 1 goto :eof
) else (
    echo Invalid run type: %2
    goto :eof
)

endlocal