# Notes for Oxc maintainers

## oxc-parser package

- JSON.parse should be done by the wrapper & program should be typed with types from the [#2158](https://github.com/oxc-project/oxc/pull/2158) (see `oxcParse` util)

## AST types issues

- `JSDocNullableType` & `JSDocUnknownType` types are non-existent
- `Function` map to native Function type, `FunctionType` is unused and should map to strings instead of nodes
- `TSAbstractPropertyDefinition` & `TSAbstractMethodDefinition` are missing type props
- `JSXSpreadChild.expression` missing `JSXEmptyExpression`
- `ThrowStatement.argument` is expression (maybe true in the future 🤞)
- NIT: Atom & EmptyObject should be inlined
- NIT: Inline `TSTypeOperator.operator`
- NIT: Exposing a `NodeMap` type could be useful

## Difference with ESTree

# Merged, to be removed from mapper function

- https://github.com/oxc-project/oxc/issues/2395
- TSTypeAliasDeclaration.end is 0

### Addressed in [#2506](https://github.com/oxc-project/oxc/pull/2506)

- ArrowFunctionExpression.span
- TSTypeOperator.type_annotation
- NewExpression/TaggedTemplateExpression.type_parameters
- importKind/exportKind
- TSEnumDeclaration.members -> TSEnumDeclaration.body.members
- comment.type should be `Line | Block`

### Name change

| TSESTree        | OXC               |
| --------------- | ----------------- |
| Property        | BindingProperty   |
| ImportAttribute | TSImportAttribute |
| Property        | ObjectProperty    |

### Unnecessary?

- TemplateElementValue.cooked nullable?
- Using deprecated typeParameters on CallExpression/JSXOpeningElement/NewExpression/TaggedTemplateExpression/TSHeritageBase/TSImportType/TSTypeQuery/TSTypeReference
- Using deprecated superTypeParameters on ClassDeclaration
- Usage of wide modifiers instead of declare/abstract boolean on appropriate nodes
- ImportDeclaration/ExportAllDeclaration.attributes -> .withClause
- TSImportAttributes intermediate node
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
