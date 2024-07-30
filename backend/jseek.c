#include <stdio.h>
#include <stdlib.h>
#include "Everything.h"

LPCWSTR charToLPCWSTR(const char* charArray)
{
    int len;
    int slength = (int)strlen(charArray) + 1;
    len = MultiByteToWideChar(CP_ACP, 0, charArray, slength, 0, 0); 
    wchar_t* buf = (wchar_t*)malloc(len * sizeof(wchar_t));
    MultiByteToWideChar(CP_ACP, 0, charArray, slength, buf, len);
    return buf;
}

int main(int argc,char **argv)
{
    DWORD i;
    
    if(argc < 3)
    {
        printf("Usage: jseek [maxResults] [searchQuery...]\n");
        return 1;
    }

    DWORD max_value = strtoul(argv[1], NULL, 10);
    
    size_t argSearchStartIndex = 2;
    size_t totalLength = 0;
    for (i = argSearchStartIndex; i < argc; i++) {
        totalLength += strlen(argv[i]) + 1; // +1 for space or null terminator
    }

    // Allocate memory for the concatenated string
    char* tmp_searchQuery = (char*)malloc(totalLength * sizeof(char));
    tmp_searchQuery[0] = '\0'; // Initialize as empty string

    // Concatenate each argument to the allocated string
    for (i = argSearchStartIndex; i < argc; i++) {
        strcat(tmp_searchQuery, argv[i]);
        if (i < argc - 1) {
            strcat(tmp_searchQuery, " "); // Add space between arguments
        }
    }

    // printf("Searching for: '%s'\n", tmp_searchQuery);

    LPCWSTR searchQuery = charToLPCWSTR(tmp_searchQuery);

    // Init Everything.
    Everything_SetSearchW(searchQuery);
    // request files and folders
    Everything_SetRequestFlags(EVERYTHING_REQUEST_FILE_NAME|EVERYTHING_REQUEST_PATH|EVERYTHING_REQUEST_DATE_MODIFIED);
    Everything_SetSort(EVERYTHING_SORT_DATE_MODIFIED_DESCENDING);
    Everything_SetMax(max_value);
    
    // Execute the query.
    Everything_Query(TRUE);
    
    // Display results.
    for(i=0;i<Everything_GetNumResults();i++)
    {
        printf("%s\\%s | %s\n",
            Everything_GetResultPath(i),
            Everything_GetResultFileName(i), 
            Everything_GetResultFileName(i)	
        );
    }
    // Free the allocated memory
    free((void*)searchQuery);
    
    return 0;
}
