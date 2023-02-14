const op = document.getElementById("output");

// utils
const underToCamelCase = (inpt) => {
  return inpt.toLowerCase().replace(/_([a-zA-Z])/g, (g) => g[1].toUpperCase());
}
const underToPascalCase = (inpt) => {
  const cap = inpt[0].toUpperCase() + inpt.slice(1);
  return underToCamelCase(cap);
}

// constants
inputFactoryFail = ["val1", "val2"];
inputFactoryPass = ["val3", "val4"];
// templates
const testMapFactoryPass = (inpt) => {
  return `
        TEST_METHOD(Test_${underToPascalCase(inpt)}_Ok) {
            // TODO: ${inpt}
        }

  `
}

const testMapFactoryFail = (inpt) => {
  return `
          TEST_METHOD(Test_FactoryMethod_${underToPascalCase(inpt)}_Fails) {
            // TODO: ${inpt}
        }

  `
}

const tests = inputFactoryPass.map(testMapFactoryPass).join("\n") + 
inputFactoryFail.map(testMapFactoryFail).join("\n")

const main = `
#include "stdafx.h"
#include "CppUnitTest.h"

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace name
{
    TEST_CLASS(classname)
    {
${tests}
    };
}
`

op.innerText = main;
