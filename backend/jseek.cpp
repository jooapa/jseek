#include <iostream>
#include <string>
#include <vector>
#include <locale>
#include <codecvt>
#include "Everything.h"

std::wstring charToLPCWSTR(const std::string& charArray) {
    std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
    return converter.from_bytes(charArray);
}

int main(int argc, char** argv) {
    if (argc < 3) {
        std::cerr << "Usage: jseek [maxResults] [searchQuery...]\n";
        return 1;
    }

    DWORD max_value = std::stoul(argv[1]);

    std::string tmp_searchQuery;
    for (int i = 2; i < argc; ++i) {
        tmp_searchQuery += argv[i];
        if (i < argc - 1) {
            tmp_searchQuery += " ";
        }
    }

    std::wstring searchQuery = charToLPCWSTR(tmp_searchQuery);

    Everything_SetSearchW(searchQuery.c_str());
    Everything_SetRequestFlags(EVERYTHING_REQUEST_FILE_NAME | EVERYTHING_REQUEST_PATH | EVERYTHING_REQUEST_DATE_MODIFIED);
    Everything_SetSort(EVERYTHING_SORT_DATE_MODIFIED_DESCENDING);
    Everything_SetMax(max_value);

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

        std::wcout << Everything_GetResultPath(i) << L"\\" << Everything_GetResultFileName(i) << L"|" << Everything_GetResultFileName(i) << L"|" << type << L"\n";
    }

    return 0;
}