# Notes for Oxc maintainers

### Type improvements from generate-types.ts

- Inline types like LogicalOperator, PropertyKind, ModuleKind, ...
- Change BigInt to bigint
- Expose a `Node` union (https://github.com/oxc-project/oxc/pull/9574)

### Difference with TS-ESTree

- Using deprecated typeParameters on CallExpression/NewExpression/TaggedTemplateExpression/JSXOpeningElement/TSClassImplements/TSInterfaceHeritage/TSImportType/TSTypeQuery/TSTypeReference
- Using deprecated superTypeParameters on ClassDeclaration
- TSInterfaceDeclaration.extends null
- Class.implements null
- `implements NodeJS.ReadableStream`: TSQualifiedName -> MemberExpression
- TSImportAttributes https://github.com/oxc-project/oxc/issues/9663
- ImportExpression.attributes https://github.com/oxc-project/oxc/pull/9665
- TSMappedType.key/constraint
- TSMappedTypeModifierOperator
- FormalParameter
- FunctionBody
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
