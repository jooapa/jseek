#include <stdio.h>
#include "Everything.h"

int main(int argc,char **argv)
{
	DWORD i;
	
	// Set the search string to abc
	Everything_SetSearch("abc");
	
	// Execute the query.
	Everything_Query(TRUE);
	
	// Display results.
	for(i=0;i<Everything_GetNumResults();i++)
	{
		printf("%s [%s]\n",Everything_GetResultFileName(i),Everything_GetResultPath(i));
	}
	
	return 0;
}