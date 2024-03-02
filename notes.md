# Notes for Oxc maintainers

## Current blockers/tasks

- Cleanup import attribute AST

## Nice to have

- Add better types to the `@oxc/parser` (see next sections)
- JSON.parse should be done by `@oxc/parser`

### Type improvements from generate-types.ts

- Use types from `parser-wasm` and traverse them from Program to get a clean and stable output
- Inline types like Atom, LogicalOperator, PropertyKind
- Expose a `Node` union
- Pass the output trough Prettier

## Difference with ESTree

### To investigate

- `JSXSpreadChild.expression` missing `JSXEmptyExpression`
- `ThrowStatement.argument` is expression (maybe true in the future 🤞)

### To change?

- Using deprecated typeParameters on CallExpression/JSXOpeningElement/NewExpression/TaggedTemplateExpression/TSClassImplements/TSInterfaceHeritage/TSImportType/TSTypeQuery/TSTypeReference
- Using deprecated superTypeParameters on ClassDeclaration
- Usage of wide modifiers instead of declare/abstract boolean on appropriate nodes
- ImportDeclaration/ExportAllDeclaration.attributes -> .withClause
- TSImportAttribute -> ImportAttribute
- TSImportAttribute value should be StringLiteral
- TSImportAttribute.name is not a union
- ImportExpression.attributes -> ImportExpression.arguments (here TSESTree feels weird)
- TSMappedTypeModifierOperator?

### To be documented?

- FormalParameters
- FunctionBody
- MemberExpression
- ArrayExpression hole
- BindingPattern
- Rest arguments/properties
- TSThisParameter
- TSIndexSignatureName
- UsingDeclaration
- ArrayAssignmentTarget/ObjectAssignmentTarget
- PrivateInExpression
