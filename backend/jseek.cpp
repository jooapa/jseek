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

// Function to get the icon handle
HICON GetFileIcon(const std::wstring& path) {
    SHFILEINFO shFileInfo;
    ZeroMemory(&shFileInfo, sizeof(SHFILEINFO));

    // Get the icon handle
    if (SHGetFileInfo(path.c_str(), 0, &shFileInfo, sizeof(SHFILEINFO), SHGFI_ICON | SHGFI_LARGEICON)) {
        return shFileInfo.hIcon;
    }
    return nullptr;
}

std::wstring CharToLPCWSTR(const std::string& charArray) {
    try {
        std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
        return converter.from_bytes(charArray);
    } catch (const std::range_error& e) {
        std::cerr << "Conversion error: " << e.what() << std::endl;
        return L""; // Return an empty wide string on error
    }
}

int main(int argc, char** argv) {
    if (argc < 3) {
        std::cerr << "Usage: jseek [maxResults] [searchQuery...]\n";
        return 1;
    }

    DWORD max_results = std::stoul(argv[1]);

    std::string tmp_searchQuery;
    for (int i = 2; i < argc; ++i) {
        tmp_searchQuery += argv[i];
        if (i < argc - 1) {
            tmp_searchQuery += " ";
        }
    }

    std::wstring searchQuery = CharToLPCWSTR(tmp_searchQuery);

    Everything_SetSearchW(searchQuery.c_str());
    Everything_SetRequestFlags(EVERYTHING_REQUEST_FILE_NAME | EVERYTHING_REQUEST_PATH | EVERYTHING_REQUEST_DATE_MODIFIED);
    // set the sort to sort by the best match
    Everything_SetSort(EVERYTHING_SORT_DATE_MODIFIED_DESCENDING);
    Everything_SetMax(max_results);

    Everything_Query(TRUE);

    for (DWORD i = 0; i < Everything_GetNumResults(); ++i) {
        // determine file type
        std::wstring type;
        if (Everything_IsFileResult(i)) {
            type = L"File";
        } else if (Everything_IsFolderResult(i)) {
            type = L"Folder";
        } else if (Everything_IsVolumeResult(i)) {
            type = L"Volume";
        } else {
            type = L"Unknown";
        }

        LPCTSTR resultPath = Everything_GetResultPath(i);
        LPCTSTR resultFileName = Everything_GetResultFileName(i);

        // if first character is a \ then it is a volume
        if (resultPath[0] == 0) {
            type = L"Volume";
        }

        // get the icon handle
        HICON icon = GetFileIcon(resultPath);

        // get the icon index
        int iconIndex = 0;
        if (icon) {
            iconIndex = LookupIconIdFromDirectoryEx((PBYTE)icon, TRUE, 0, 0, LR_DEFAULTCOLOR);
        }

        // free the icon handle
        if (icon) {
            DestroyIcon(icon);
        }

        if (type == L"Volume") {
            std::wcout << resultFileName << L"|" << resultFileName << L"|";
        } else {
            std::wcout << resultPath << L"\\" << resultFileName  << L"|" << resultFileName << L"|";
        }

        std::wcout << type << L"|" << iconIndex << std::endl;
    }

    return 0;
}