#include <stdio.h>
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
	
	if(argc < 2)
	{
		return 1;
	}

	LPCWSTR searchQuery = charToLPCWSTR(argv[1]);

	// Init Everything.
	Everything_SetSearchW(searchQuery);
	Everything_SetRequestFlags(EVERYTHING_REQUEST_FILE_NAME|EVERYTHING_REQUEST_PATH);
	Everything_SetSort(EVERYTHING_SORT_DATE_MODIFIED_DESCENDING);
	Everything_SetMax(1);
	
	// Execute the query.
	Everything_Query(TRUE);
	
    // Display results.
    for (i = 0; i < Everything_GetNumResults(); i++)
    {
        // Get the result's full path to the file.
		Everything_GetResultFullPathNameW(i, (LPWSTR)argv[1], MAX_PATH);
		printf("%ls\n", argv[1]);
    }
    
    // Free the allocated memory
    free((void*)searchQuery);
	
	return 0;
}
