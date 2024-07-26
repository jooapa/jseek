#include "test.h"
#include <cassert>

int main() {
    Lighthouse::Test test;
    assert(test.test().compare("Hello, World!") == 0);
    return 0;
}
