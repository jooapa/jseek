#define UNICODE
#define _UNICODE

#include <iostream>
#include <string>
#include <cstring>
#include <vector>
#include <locale>
#include <codecvt>
#include <shlobj.h>
#include <shlwapi.h>
#include <stdexcept>
#include "Everything.h"
#include "Windows.h"
#include <cstdint>
#include <wincodec.h>
#include <fstream>
#include <shellapi.h>
#include <gdiplus.h>
#include <iomanip>

enum class Type {
    File,
    Folder,
    Volume,
    Web,
    Other
};

// Example output for one search result:
// C:\Users\user\Documents\file.txt|file.txt|Type|Display Name|Info Name\n
void makeReply(std::wstring path, std::wstring name, Type type, std::wstring displayName, std::wstring infoName) {
    
    std::wstring imagePath = L"";
    // make the image path
    if (type == Type::File) {
        imagePath = L"assets/file.png";
    }
    else if (type == Type::Folder) {
        imagePath = L"assets/folder.svg";
    }
    else if (type == Type::Volume) {
        imagePath = L"assets/drive.svg";
    }
    else if (type == Type::Web) {
        imagePath = L"assets/web.png";
    }
    else {
        imagePath = L"/assets/file.png";
    }
    
    std::wstring reply = 
        path 
    + L"|" + 
        name 
    + L"|" + 
        (type == 
        Type::File ? L"File" : 
        type == Type::Folder    ? L"Folder" : 
        type == Type::Volume    ? L"Volume" : 
        type == Type::Web       ? L"Web" : 
        type == Type::Other     ? L"Other" : 
        L"Unknown"
        ) 
    + L"|" + 
        displayName 
    + L"|" + 
        infoName 
    + L"|" + 
        imagePath
    + L"\n";

    std::wcout << reply;
}

std::wstring CharToLPCWSTR(const std::string& charArray) {
    int size_needed = MultiByteToWideChar(CP_UTF8, 0, charArray.c_str(), (int)charArray.size(), NULL, 0);
    if (size_needed == 0) {
        std::cerr << "Conversion error: MultiByteToWideChar failed" << std::endl;
        return L""; // Return an empty wide string on error
    }
    std::wstring wstrTo(size_needed, 0);
    MultiByteToWideChar(CP_UTF8, 0, charArray.c_str(), (int)charArray.size(), &wstrTo[0], size_needed);
    return wstrTo;
}

bool g_isWebSearch = false;
bool y_isWebSearch = false;
bool b_isWebSearch = false;
bool d_isWebSearch = false;
bool w_isWebSearch = false;

// Function to convert std::wstring to UTF-8 std::string
std::string wstring_to_utf8(const std::wstring& wstr) {
    std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
    return converter.to_bytes(wstr);
}

void PrintWebSearch(std::wstring searchQuery, DWORD* max_results) {
    // std::wcout << L"searchQuery: '" << searchQuery << L"'" << std::endl;
    std::wstring searchUsing;
    // if the search query is less than 2 characters then return
    if (searchQuery.size() < 2) {
        return;
    }
    std::wstring searchQueryStr = searchQuery.substr(2);

    std::wstring searchUrl;
    std::wstring SearchDisplay;
    // if the first two characters are "g " then it is a google search
    if (searchQuery[0] == L'g' && searchQuery[1] == L' ') {
        g_isWebSearch = true;
        searchUsing = L"Search using Google search";
        searchUrl = L"https://www.google.com/search?q=" + searchQueryStr;

    } else if (searchQuery[0] == L'y' && searchQuery[1] == L' ') {
        y_isWebSearch = true;
        searchUsing = L"Search using Yahoo search";
        searchUrl = L"https://search.yahoo.com/search?p=" + searchQueryStr;
    } else if (searchQuery[0] == L'b' && searchQuery[1] == L' ') {
        b_isWebSearch = true;
        searchUsing = L"Search using Bing search";
        searchUrl = L"https://www.bing.com/search?q=" + searchQueryStr;
    } else if (searchQuery[0] == L'd' && searchQuery[1] == L' ') {
        d_isWebSearch = true;
        searchUsing = L"Search using DuckDuckGo search";
        searchUrl = L"https://duckduckgo.com/?q=" + searchQueryStr;
    } else if (searchQuery[0] == L'w' && searchQuery[1] == L' ') {
        w_isWebSearch = true;
        searchUsing = L"Search using Wikipedia search";
        searchUrl = L"https://en.wikipedia.org/wiki/" + searchQueryStr;
    }
    
    if (g_isWebSearch || y_isWebSearch || b_isWebSearch || d_isWebSearch || w_isWebSearch) {
        makeReply(
            searchUrl,
            searchUsing,
            Type::Web,
            searchQueryStr == std::wstring(L"") ? L"Type something to search.." : L"'" + searchQueryStr + L"'",
            searchUsing
        );

        if (*max_results == 1) {
            *max_results = 0;
        }
    }
}

void ContinueWithEverything(std::wstring searchQuery, DWORD* max_results) {
    Everything_SetSearchW(searchQuery.c_str());
    Everything_SetRequestFlags(EVERYTHING_REQUEST_FILE_NAME | EVERYTHING_REQUEST_PATH | EVERYTHING_REQUEST_DATE_MODIFIED);
    // set the sort to sort by the best match
    Everything_SetSort(EVERYTHING_SORT_DATE_MODIFIED_DESCENDING);
    Everything_SetMax(*max_results);

    Everything_Query(TRUE);
    
    for (DWORD i = 0; i < Everything_GetNumResults(); ++i) {
            // determine file type
            Type type;
            if (Everything_IsFileResult(i)) {
                type = Type::File;
            } else if (Everything_IsFolderResult(i)) {
                type = Type::Folder;
            } else if (Everything_IsVolumeResult(i)) {
                type = Type::Volume;
            } else {
                type = Type::Other;
            }
    
            LPCTSTR resultPath = Everything_GetResultPath(i);
            LPCTSTR resultFileName = Everything_GetResultFileName(i);
    
            // if first character is a \ then it is a volume
            if (resultPath[0] == 0) {
                type = Type::Volume;
            }
    
            std::wstring fullFilePath;
    
            if (type == Type::Volume) {
                fullFilePath = resultFileName;
            } else {
                fullFilePath = std::wstring(resultPath) + L"\\" + resultFileName;
            }

            makeReply(
                fullFilePath,
                resultFileName,
                type,
                resultFileName,
                fullFilePath
            );
    
        }

    Everything_CleanUp();

}

int main(int argc, char** argv) {
    if (argc < 3) {
        std::cerr << "Usage: jseek [maxResults] [searchQuery...]\n";
        return 1;
    }

    DWORD max_results = std::stoul(argv[1]);

    std::wstring tmp_searchQuery;
    for (int i = 2; i < argc; ++i) {
        tmp_searchQuery += CharToLPCWSTR(argv[i]);
        if (i < argc - 1) {
            tmp_searchQuery += L" ";
        }
    }

    std::wstring searchQuery = tmp_searchQuery;

    // if the search query is less than 2 characters then return
    // if (searchQuery.size() < 2) {
    //     return 0;
    // }

    ContinueWithEverything(searchQuery, &max_results);
    return 0;
}