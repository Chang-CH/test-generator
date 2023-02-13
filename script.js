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
inputFactoryFail = ["OPEN_PARENTHESIS","CLOSE_PARENTHESIS","OPEN_BRACKET","CLOSE_BRACKET","SEMI_COLON","NAME","THEN","ELSE","PROCEDURE"];
inputFactoryPass = ["PLUS","MINUS","TIMES","DIV","MOD","ASSIGN","EQUAL","GREATER_THAN","GREATER_THAN_OR_EQUAL","LESS_THAN","LESS_THAN_OR_EQUAL","NOT_EQUAL","AND","OR","NOT","PROCEDURE_NAME","VARIABLE_NAME","CONSTANT","IF","WHILE","READ","CALL","PRINT"];
inputSpecificPass = ["PROCEDURE", "STMTLST"];
inputSpecificFail = ["PLUS"];

// templates
const testMapFactoryPass = (inpt) => {
  return `
        TEST_METHOD(Test_FactoryMethod_${underToPascalCase(inpt)}_Ok) {
            SimpleTree* tree = SimpleTree::createTree(new SimpleToken(SimpleTokenType::${inpt}, "test", 11));
            Assert::IsTrue(tree->getType() == SimpleTreeType::${inpt});
            Assert::AreEqual(tree->getLine(), 11);
            Assert::IsNull(tree->getParent());
        }

  `
}

const testMapFactoryFail = (inpt) => {
  return `
          TEST_METHOD(Test_FactoryMethod_${underToPascalCase(inpt)}_Fails) {
            Assert::ExpectException<UnexpectedTokenException>([&]() {
                SimpleTree::createTree(new SimpleToken(SimpleTokenType::${inpt}, "test", 11));
                });
        }

  `
}

const testMapSpecificPass = (inpt) => {
  return `
        TEST_METHOD(Test_FactoryMethod_${underToPascalCase(inpt)}_Ok) {
            SimpleTree* tree = SimpleTree::createTreeSpecific(SimpleTreeType::${inpt});
            Assert::IsTrue(tree->getType() == SimpleTreeType::${inpt});
            Assert::IsNull(tree->getParent());
        }

  `
}

const testMapSpecificFail = (inpt) => {
  return `
          TEST_METHOD(Test_TreeSpecificMethod_${underToPascalCase(inpt)}_Fails) {
            Assert::ExpectException<std::invalid_argument>([&]() {
                SimpleTree::createTreeSpecific(SimpleTreeType::${inpt});
                });
        }

  `
}





const tests = inputFactoryPass.map(testMapFactoryPass).join("\n") + 
inputFactoryFail.map(testMapFactoryFail).join("\n") + 
inputSpecificPass.map(testMapSpecificPass).join("\n") + 
inputSpecificFail.map(testMapSpecificFail).join("\n")

const main = `
#include "stdafx.h"
#include "CppUnitTest.h"

#include "SP/SimpleTree/SimpleTree.h"
#include <vector>

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace TestSimpleTree
{
    TEST_CLASS(TestSimpleTree)
    {
${tests}
    };
}
`

op.innerText = main;
