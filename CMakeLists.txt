project(Lighthouse C CXX)
cmake_minimum_required(VERSION 3.3.2)

include(cmake/App.cmake)

set(SOURCES "src/Lighthouse.h"
            "src/Lighthouse.cpp"
            "src/main.cpp")
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
add_app("${SOURCES}")