# Notes for Oxc maintainers

### Type improvements from generate-types.ts

- Inline types like LogicalOperator, PropertyKind, ModuleKind, ...
- Change BigInt to bigint
- Expose a `Node` union (https://github.com/oxc-project/oxc/pull/9574)

### Difference with TS-ESTree

- TSInterfaceDeclaration.extends null
- Class.implements null
- `implements NodeJS.ReadableStream`: TSQualifiedName -> MemberExpression
- TSMappedType.key/constraint
- TSMappedTypeModifierOperator
- TSThisParameter
- ExportDefaultDeclaration.exportKind
- TSEnumDeclaration.members -> body
- Progora.hasbang -> comment
- `declare namespace monaco.editor {}`: TSModuleDeclaration.TSModuleDeclaration.ModuleBlock -> TSModuleDeclaration.ModuleBlock
- TSTypeQuery.exprName[name=this] => TSTypeQuery.ThisExpression
- TSImportType[isTypeOf=true] => TSTypeQuery
- Missing TSParameterProperty
- TSTypePredicate.parameterName: Identifier[name=this] => TSThisType
- Class span start on export class with decorators https://github.com/estree/estree/issues/315

### Glitch of OXC AST in types

- PrivateInExpression
- ObjectProperty, ObjectAssignmentTarget, BindingProperty, AssignmentTargetPropertyProperty, ArrayAssignmentTarget, AssignmentTargetRest, ...
- TSIndexSignatureName
- Directive
- FunctionBody
- FormalParameter
- TSThisParameter
