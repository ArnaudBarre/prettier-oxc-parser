# Notes for Oxc maintainers

## oxc-parser package

- JSON.parse should be done by the wrapper & program should be typed with types from the [#2158](https://github.com/oxc-project/oxc/pull/2158) (see `oxcParse` util)

## AST issues

- Missing comments info
- https://github.com/oxc-project/oxc/issues/2394
- https://github.com/oxc-project/oxc/issues/2395

## AST types issues

- `JSDocNullableType` & `JSDocUnknownType` types are non-existent
- `Function` map to native Function type, `FunctionType` is unused and should map to strings instead of nodes
- `TSAbstractPropertyDefinition` & `TSAbstractMethodDefinition` are missing type props
- `JSXSpreadChild.expression` missing `JSXEmptyExpression`
- `ThrowStatement.argument` is expression (maybe true in the future 🤞)
- NIT: Atom & EmptyObject should be inlined
- NIT: Inline `TSTypeOperatorType.operator`
- NIT: Exposing a `NodeMap` type could be useful

## Difference with ESTree

### Name change

| TSESTree                | OXC                |
| ----------------------- | ------------------ |
| ArrowFunctionExpression | ArrowExpression    |
| NumericLiteral          | NumberLiteral      |
| Property                | BindingProperty    |
| TSThisType              | TSThisKeyword      |
| TSTypeOperator          | TSTypeOperatorType |

### Unnecessary?

- importKind/exportKind
- TSTypeOperatorType.type_annotation
- NewExpression/TaggedTemplateExpression.type_parameters
- TemplateElementValue.cooked nullable?
- Using deprecated typeParameters
- Usage of wide modifiers instead of declare/abstract boolean on appropriate nodes
- TSEnumDeclaration.members -> TSEnumDeclaration.body.members
- ImportDeclaration/ExportAllDeclaration.attributes -> .withClause
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
