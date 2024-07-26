#include <iostream>
#include "app.h"
#include "ATRC.h"

int main () {
    std::unique_ptr<ATRCFiledata> filedata = std::make_unique<ATRCFiledata>();

    // Set some properties
    filedata->Filename = "example.atrc";
    filedata->Encoding = "utf-8";
    filedata->AutoSave = true;

    if (DoesExistVariable(filedata.get(), "reference")) {
        std::cout << "Variable 'reference' exists." << std::endl;
    }
    return 0;
}
