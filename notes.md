# Notes for Oxc maintainers

## oxc-parser package

- Missing `/parser.<platform>.node`, see patch
- JSON.parse should be done by the wrapper & program should be typed with types from the [#2158](https://github.com/oxc-project/oxc/pull/2158) (see `oxcParse` util)

## AST types issues

- `JSDocNullableType` & `JSDocUnknownType` types are non-existent
- `Function` map to native Function type, `FunctionType` is unused and should map to strings instead of nodes
- NIT: Atom & EmptyObject should be inlined
- NIT: Inline `TSTypeOperatorType.operator`
- NIT: Exposing a `NodeMap` type could be useful

## Difference with ESTree

### Unnecessary?

- ArrowFunctionExpression-> ArrowExpression
- NumericLiteral -> NumberLiteral (Technically Babel AST)
- importKind/exportKind
- Property -> BindingProperty
- TSTypeOperator -> TSTypeOperatorType
- TSTypeOperatorType.type_annotation

### To be documented?

- FormalParameters
- FunctionBody
- MemberExpression
- ArrayExpression hole
- BindingPattern
- Rest arguments/properties
