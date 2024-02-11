export type RegExpFlags = {
  G: 1;
  I: 2;
  M: 4;
  S: 8;
  U: 16;
  Y: 32;
  D: 64;
  V: 128;
};

export interface StringLiteral extends Span {
  type: "StringLiteral";
  value: string;
}

export interface RegExp {
  pattern: string;
  flags: RegExpFlags;
}

export interface RegExpLiteral extends Span {
  type: "RegExpLiteral";
  value: null;
  regex: RegExp;
}

export interface BigintLiteral extends Span {
  type: "BigintLiteral";
  raw: string;
}

export interface NumberLiteral extends Span {
  type: "NumberLiteral";
  value: number;
}

export interface NullLiteral extends Span {
  type: "NullLiteral";
}

export interface BooleanLiteral extends Span {
  type: "BooleanLiteral";
  value: boolean;
}

export interface TSAbstractPropertyDefinition
  extends Omit<PropertyDefinition, "type"> {}
export interface TSAbstractMethodDefinition
  extends Omit<MethodDefinition, "type"> {}

export type ImportOrExportKind = { type: "value" } | { type: "type" };

export interface TSInstantiationExpression extends Span {
  type: "TSInstantiationExpression";
  expression: Expression;
  typeParameters: TSTypeParameterInstantiation;
}

export interface TSNamespaceExportDeclaration extends Span {
  type: "TSNamespaceExportDeclaration";
  id: IdentifierName;
}

export interface TSExportAssignment extends Span {
  type: "TSExportAssignment";
  expression: Expression;
}

export type Modifiers = Modifier[] | null;

export interface Modifier extends Span {
  type: "Modifier";
  kind: ModifierKind;
}

export type ModifierKind =
  | { type: "abstract" }
  | { type: "accessor" }
  | { type: "async" }
  | { type: "const" }
  | { type: "declare" }
  | { type: "default" }
  | { type: "export" }
  | { type: "in" }
  | { type: "public" }
  | { type: "private" }
  | { type: "protected" }
  | { type: "readonly" }
  | { type: "static" }
  | { type: "out" }
  | { type: "override" };

export interface Decorator extends Span {
  type: "Decorator";
  expression: Expression;
}

export interface TSNonNullExpression extends Span {
  type: "TSNonNullExpression";
  expression: Expression;
}

export interface TSExternalModuleReference extends Span {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
}

export type TSModuleReference = TSTypeName | TSExternalModuleReference;

export interface TSImportEqualsDeclaration extends Span {
  type: "TSImportEqualsDeclaration";
  id: BindingIdentifier;
  moduleReference: TSModuleReference;
  isExport: boolean;
  importKind: ImportOrExportKind;
}

export interface TSTypeAssertion extends Span {
  type: "TSTypeAssertion";
  expression: Expression;
  typeAnnotation: TSType;
}

export interface TSSatisfiesExpression extends Span {
  type: "TSSatisfiesExpression";
  expression: Expression;
  typeAnnotation: TSType;
}

export interface TSAsExpression extends Span {
  type: "TSAsExpression";
  expression: Expression;
  typeAnnotation: TSType;
}

export interface TSTemplateLiteralType extends Span {
  type: "TSTemplateLiteralType";
  quasis: TemplateElement[];
  types: TSType[];
}

export type TSMappedTypeModifierOperator = "true" | "+" | "-" | "none";

export interface TSMappedType extends Span {
  type: "TSMappedType";
  typeParameter: TSTypeParameter;
  nameType: TSType | null;
  typeAnnotation: TSTypeAnnotation | null;
  optional: TSMappedTypeModifierOperator;
  readonly: TSMappedTypeModifierOperator;
}

export interface TSConstructorType extends Span {
  type: "TSConstructorType";
  abstract: boolean;
  params: FormalParameters;
  returnType: TSTypeAnnotation;
  typeParameters: TSTypeParameterDeclaration | null;
}

export interface TSFunctionType extends Span {
  type: "TSFunctionType";
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  returnType: TSTypeAnnotation;
  typeParameters: TSTypeParameterDeclaration | null;
}

export interface TSImportType extends Span {
  type: "TSImportType";
  isTypeOf: boolean;
  parameter: TSType;
  qualifier: TSTypeName | null;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSTypeQuery extends Span {
  type: "TSTypeQuery";
  exprName: TSTypeName;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSInferType extends Span {
  type: "TSInferType";
  typeParameter: TSTypeParameter;
}

export interface TSTypeLiteral extends Span {
  type: "TSTypeLiteral";
  members: TSSignature[];
}

export interface TSModuleBlock extends Span {
  type: "TSModuleBlock";
  body: Statement[];
}

export type TSModuleDeclarationBody = TSModuleDeclaration | TSModuleBlock;

export type TSModuleDeclarationName = IdentifierName | StringLiteral;

export interface TSModuleDeclaration extends Span {
  type: "TSModuleDeclaration";
  id: TSModuleDeclarationName;
  body: TSModuleDeclarationBody;
  modifiers: Modifiers;
}

export type TSTypePredicateName = IdentifierName | TSThisKeyword;

export interface TSTypePredicate extends Span {
  type: "TSTypePredicate";
  parameterName: TSTypePredicateName;
  asserts: boolean;
  typeAnnotation: TSTypeAnnotation | null;
}

export interface TSInterfaceHeritage extends Span {
  type: "TSInterfaceHeritage";
  expression: Expression;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSIndexSignatureName extends Span {
  type: "TSIndexSignatureName";
  name: string;
  typeAnnotation: TSTypeAnnotation;
}

export interface TSConstructSignatureDeclaration extends Span {
  type: "TSConstructSignatureDeclaration";
  params: FormalParameters;
  returnType: TSTypeAnnotation | null;
  typeParameters: TSTypeParameterDeclaration | null;
}

export interface TSMethodSignature extends Span {
  type: "TSMethodSignature";
  key: PropertyKey;
  computed: boolean;
  optional: boolean;
  kind: TSMethodSignatureKind;
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  returnType: TSTypeAnnotation | null;
  typeParameters: TSTypeParameterDeclaration | null;
}

export type TSMethodSignatureKind = "method" | "get" | "set";

export interface TSCallSignatureDeclaration extends Span {
  type: "TSCallSignatureDeclaration";
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  returnType: TSTypeAnnotation | null;
  typeParameters: TSTypeParameterDeclaration | null;
}

export interface TSIndexSignature extends Span {
  type: "TSIndexSignature";
  parameters: TSIndexSignatureName[];
  typeAnnotation: TSTypeAnnotation;
}

export type TSSignature =
  | TSIndexSignature
  | TSPropertySignature
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSMethodSignature;

export interface TSPropertySignature extends Span {
  type: "TSPropertySignature";
  computed: boolean;
  optional: boolean;
  readonly: boolean;
  key: PropertyKey;
  typeAnnotation: TSTypeAnnotation | null;
}

export interface TSInterfaceBody extends Span {
  type: "TSInterfaceBody";
  body: TSSignature[];
}

export interface TSInterfaceDeclaration extends Span {
  type: "TSInterfaceDeclaration";
  id: BindingIdentifier;
  body: TSInterfaceBody;
  typeParameters: TSTypeParameterDeclaration | null;
  extends: TSInterfaceHeritage[] | null;
  modifiers: Modifiers;
}

export interface TSClassImplements extends Span {
  type: "TSClassImplements";
  expression: TSTypeName;
  typeParameters: TSTypeParameterInstantiation | null;
}

export type TSAccessibility = "private" | "protected" | "public";

export interface TSTypeAliasDeclaration extends Span {
  type: "TSTypeAliasDeclaration";
  id: BindingIdentifier;
  typeAnnotation: TSType;
  typeParameters: TSTypeParameterDeclaration | null;
  modifiers: Modifiers;
}

export interface TSTypeParameterDeclaration extends Span {
  type: "TSTypeParameterDeclaration";
  params: TSTypeParameter[];
}

export interface TSTypeParameter extends Span {
  type: "TSTypeParameter";
  name: BindingIdentifier;
  constraint: TSType | null;
  default: TSType | null;
  in: boolean;
  out: boolean;
  const: boolean;
}

export interface TSTypeParameterInstantiation extends Span {
  type: "TSTypeParameterInstantiation";
  params: TSType[];
}

export interface TSQualifiedName extends Span {
  type: "TSQualifiedName";
  left: TSTypeName;
  right: IdentifierName;
}

export type TSTypeName = IdentifierReference | TSQualifiedName;

export interface TSTypeReference extends Span {
  type: "TSTypeReference";
  typeName: TSTypeName;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSBigIntKeyword extends Span {
  type: "TSBigIntKeyword";
}

export interface TSObjectKeyword extends Span {
  type: "TSObjectKeyword";
}

export interface TSThisKeyword extends Span {
  type: "TSThisKeyword";
}

export interface TSSymbolKeyword extends Span {
  type: "TSSymbolKeyword";
}

export interface TSVoidKeyword extends Span {
  type: "TSVoidKeyword";
}

export interface TSUndefinedKeyword extends Span {
  type: "TSUndefinedKeyword";
}

export interface TSNullKeyword extends Span {
  type: "TSNullKeyword";
}

export interface TSUnknownKeyword extends Span {
  type: "TSUnknownKeyword";
}

export interface TSNeverKeyword extends Span {
  type: "TSNeverKeyword";
}

export interface TSNumberKeyword extends Span {
  type: "TSNumberKeyword";
}

export interface TSBooleanKeyword extends Span {
  type: "TSBooleanKeyword";
}

export interface TSStringKeyword extends Span {
  type: "TSStringKeyword";
}

export interface TSAnyKeyword extends Span {
  type: "TSAnyKeyword";
}

export type TSTupleElement =
  | TSType
  | TSOptionalType
  | TSRestType
  | TSNamedTupleMember;

export interface TSRestType extends Span {
  type: "TSRestType";
  typeAnnotation: TSType;
}

export interface TSOptionalType extends Span {
  type: "TSOptionalType";
  typeAnnotation: TSType;
}

export interface TSNamedTupleMember extends Span {
  type: "TSNamedTupleMember";
  elementType: TSType;
  label: IdentifierName;
  optional: boolean;
}

export interface TSTupleType extends Span {
  type: "TSTupleType";
  elementTypes: TSTupleElement[];
}

export interface TSIndexedAccessType extends Span {
  type: "TSIndexedAccessType";
  objectType: TSType;
  indexType: TSType;
}

export interface TSArrayType extends Span {
  type: "TSArrayType";
  elementType: TSType;
}

export interface TSTypeOperatorType extends Span {
  type: "TSTypeOperatorType";
  operator: "keyof" | "unique" | "readonly";
  type_annotation: TSType;
}

export interface TSIntersectionType extends Span {
  type: "TSIntersectionType";
  types: TSType[];
}

export interface TSUnionType extends Span {
  type: "TSUnionType";
  types: TSType[];
}

export interface TSConditionalType extends Span {
  type: "TSConditionalType";
  checkType: TSType;
  extendsType: TSType;
  trueType: TSType;
  falseType: TSType;
}

export type TSType =
  | TSAnyKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSThisKeyword
  | TSUndefinedKeyword
  | TSUnknownKeyword
  | TSVoidKeyword
  | TSArrayType
  | TSConditionalType
  | TSConstructorType
  | TSFunctionType
  | TSImportType
  | TSIndexedAccessType
  | TSInferType
  | TSIntersectionType
  | TSLiteralType
  | TSMappedType
  | TSQualifiedName
  | TSTemplateLiteralType
  | TSTupleType
  | TSTypeLiteral
  | TSTypeOperatorType
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUnionType;

export type TSLiteral =
  | BooleanLiteral
  | NullLiteral
  | NumberLiteral
  | BigintLiteral
  | RegExpLiteral
  | StringLiteral
  | TemplateLiteral
  | UnaryExpression;

export interface TSLiteralType extends Span {
  type: "TSLiteralType";
  literal: TSLiteral;
}

export interface TSTypeAnnotation extends Span {
  type: "TSTypeAnnotation";
  typeAnnotation: TSType;
}

export type TSEnumMemberName =
  | IdentifierName
  | StringLiteral
  | Expression
  | NumberLiteral;

export interface TSEnumMember extends Span {
  type: "TSEnumMember";
  id: TSEnumMemberName;
  initializer: Expression | null;
}

export interface TSEnumBody extends Span {
  type: "TSEnumBody";
  members: TSEnumMember[];
}

export interface TSEnumDeclaration extends Span {
  type: "TSEnumDeclaration";
  id: BindingIdentifier;
  body: TSEnumBody;
  modifiers: Modifiers;
}

export interface TSThisParameter extends Span {
  type: "TSThisParameter";
  this: IdentifierName;
  type_annotation: TSTypeAnnotation | null;
}

export interface JSXText extends Span {
  type: "JSXText";
  value: string;
}

export interface JSXSpreadChild extends Span {
  type: "JSXSpreadChild";
  expression: Expression;
}

export type JSXChild =
  | JSXText
  | JSXElement
  | JSXFragment
  | JSXExpressionContainer
  | JSXSpreadChild;

export interface JSXIdentifier extends Span {
  type: "JSXIdentifier";
  name: string;
}

export type JSXAttributeValue =
  | StringLiteral
  | JSXExpressionContainer
  | JSXElement
  | JSXFragment;

export type JSXAttributeName = JSXIdentifier | JSXNamespacedName;

export interface JSXSpreadAttribute extends Span {
  type: "JSXSpreadAttribute";
  argument: Expression;
}

export interface JSXAttribute extends Span {
  type: "JSXAttribute";
  name: JSXAttributeName;
  value: JSXAttributeValue | null;
}

export type JSXAttributeItem = JSXAttribute | JSXSpreadAttribute;

export interface JSXEmptyExpression extends Span {
  type: "JSXEmptyExpression";
}

export type JSXExpression = Expression | JSXEmptyExpression;

export interface JSXExpressionContainer extends Span {
  type: "JSXExpressionContainer";
  expression: JSXExpression;
}

export type JSXMemberExpressionObject = JSXIdentifier | JSXMemberExpression;

export interface JSXMemberExpression extends Span {
  type: "JSXMemberExpression";
  object: JSXMemberExpressionObject;
  property: JSXIdentifier;
}

export interface JSXNamespacedName extends Span {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  property: JSXIdentifier;
}

export type JSXElementName =
  | JSXIdentifier
  | JSXNamespacedName
  | JSXMemberExpression;

export interface JSXClosingFragment extends Span {
  type: "JSXClosingFragment";
}

export interface JSXOpeningFragment extends Span {
  type: "JSXOpeningFragment";
}

export interface JSXFragment extends Span {
  type: "JSXFragment";
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: JSXChild[];
}

export interface JSXClosingElement extends Span {
  type: "JSXClosingElement";
  name: JSXElementName;
}

export interface JSXOpeningElement extends Span {
  type: "JSXOpeningElement";
  selfClosing: boolean;
  name: JSXElementName;
  attributes: JSXAttributeItem[];
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface JSXElement extends Span {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: JSXChild[];
}

export type ModuleExportName = IdentifierName | StringLiteral;

export type ExportDefaultDeclarationKind =
  | Expression
  | Function
  | Class
  | TSInterfaceDeclaration
  | TSEnumDeclaration;

export interface ExportSpecifier extends Span {
  type: "ExportSpecifier";
  local: ModuleExportName;
  exported: ModuleExportName;
  export_kind: ImportOrExportKind;
}

export interface ExportAllDeclaration extends Span {
  type: "ExportAllDeclaration";
  exported: ModuleExportName | null;
  source: StringLiteral;
  with_clause: WithClause | null;
  export_kind: ImportOrExportKind;
}

export interface ExportDefaultDeclaration extends Span {
  type: "ExportDefaultDeclaration";
  declaration: ExportDefaultDeclarationKind;
  exported: ModuleExportName;
}

export interface ExportNamedDeclaration extends Span {
  type: "ExportNamedDeclaration";
  declaration: Declaration | null;
  specifiers: ExportSpecifier[];
  source: StringLiteral | null;
  export_kind: ImportOrExportKind;
}

export type ImportAttributeKey = IdentifierName | StringLiteral;

export interface ImportAttribute extends Span {
  type: "ImportAttribute";
  key: ImportAttributeKey;
  value: StringLiteral;
}

export interface WithClause extends Span {
  type: "WithClause";
  attributes_keyword: IdentifierName;
  with_entries: ImportAttribute[];
}

export interface ImportNamespaceSpecifier extends Span {
  type: "ImportNamespaceSpecifier";
  local: BindingIdentifier;
}

export interface ImportDefaultSpecifier extends Span {
  type: "ImportDefaultSpecifier";
  local: BindingIdentifier;
}

export interface ImportSpecifier extends Span {
  type: "ImportSpecifier";
  imported: ModuleExportName;
  local: BindingIdentifier;
  importKind: ImportOrExportKind;
}

export type ImportDeclarationSpecifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier;

export interface ImportDeclaration extends Span {
  type: "ImportDeclaration";
  specifiers: ImportDeclarationSpecifier[] | null;
  source: StringLiteral;
  withClause: WithClause | null;
  importKind: ImportOrExportKind;
}

export interface ImportExpression extends Span {
  type: "ImportExpression";
  source: Expression;
  arguments: Expression[];
}

export interface AccessorProperty extends Span {
  type: "AccessorProperty";
  key: PropertyKey;
  value: Expression | null;
  computed: boolean;
  static: boolean;
  decorators: Decorator[];
}

export type ModuleDeclaration =
  | ImportDeclaration
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | TSExportAssignment
  | TSNamespaceExportDeclaration;

export interface StaticBlock extends Span {
  type: "StaticBlock";
  body: Statement[];
}

export interface PrivateIdentifier extends Span {
  type: "PrivateIdentifier";
  name: string;
}

export type MethodDefinitionKind = "constructor" | "method" | "get" | "set";

export interface PropertyDefinition extends Span {
  type: "PropertyDefinition";
  key: PropertyKey;
  value: Expression | null;
  computed: boolean;
  static: boolean;
  declare: boolean;
  override: boolean;
  optional: boolean;
  definite: boolean;
  readonly: boolean;
  typeAnnotation: TSTypeAnnotation | null;
  accessibility: TSAccessibility | null;
  decorators: Decorator[];
}

export interface MethodDefinition extends Span {
  type: "MethodDefinition";
  key: PropertyKey;
  value: Function;
  kind: MethodDefinitionKind;
  computed: boolean;
  static: boolean;
  override: boolean;
  optional: boolean;
  accessibility: TSAccessibility | null;
  decorators: Decorator[];
}

export type ClassElement =
  | StaticBlock
  | MethodDefinition
  | PropertyDefinition
  | AccessorProperty
  | TSAbstractMethodDefinition
  | TSAbstractPropertyDefinition
  | TSIndexSignature;

export interface ClassBody extends Span {
  type: "ClassBody";
  body: ClassElement[];
}

export type ClassType = "ClassDeclaration" | "ClassExpression";

export interface Class extends Span {
  type: ClassType;
  id: BindingIdentifier | null;
  superClass: Expression | null;
  body: ClassBody;
  typeParameters: TSTypeParameterDeclaration | null;
  superTypeParameters: TSTypeParameterInstantiation | null;
  implements: TSClassImplements[] | null;
  decorators: Decorator[];
  modifiers: Modifiers;
}

export interface YieldExpression extends Span {
  type: "YieldExpression";
  delegate: boolean;
  argument: Expression | null;
}

export interface ArrowExpression {
  type: "ArrowExpression";
  span: Span;
  expression: boolean;
  async: boolean;
  params: FormalParameters;
  body: FunctionBody;
  typeParameters: TSTypeParameterDeclaration | null;
  returnType: TSTypeAnnotation | null;
}

export interface FunctionBody extends Span {
  type: "FunctionBody";
  directives: Directive[];
  statements: Statement[];
}

export type FormalParameterKind =
  | "FormalParameter"
  | "UniqueFormalParameters"
  | "ArrowFormalParameters"
  | "Signature";

export interface FormalParameter extends Span {
  type: "FormalParameter";
  pattern: BindingPattern;
  accessibility: TSAccessibility | null;
  readonly: boolean;
  decorators: Decorator[];
}

export interface FormalParameters extends Span {
  type: "FormalParameters";
  kind: FormalParameterKind;
  items: FormalParameter[];
  rest: BindingRestElement | null;
}

export interface FunctionDeclaration extends Span {
  type: "FunctionDeclaration";
  id: BindingIdentifier | null;
  body: FunctionBody;
  params: FormalParameters;
  generator: boolean;
  async: boolean;
  typeParameters: TSTypeParameterInstantiation | null;
  returnType: TSTypeAnnotation | null;
  modifiers: Modifiers;
}

export interface FunctionExpression extends Span {
  id: BindingIdentifier | null;
  type: "FunctionExpression";
  body: FunctionBody;
  params: FormalParameters;
  generator: boolean;
  async: boolean;
  typeParameters: TSTypeParameterInstantiation | null;
  returnType: TSTypeAnnotation | null;
  modifiers: Modifiers;
}

export interface TSDeclareFunction extends Span {
    type: "TSDeclareFunction";
    id: BindingIdentifier | null;
    body: FunctionBody;
    params: FormalParameters;
    generator: boolean;
    async: boolean;
    typeParameters: TSTypeParameterInstantiation | null;
    returnType: TSTypeAnnotation | null;
    modifiers: Modifiers;
}

export type Function =
  | FunctionDeclaration
  | FunctionExpression
  | TSDeclareFunction;

export interface BindingRestElement extends Span {
  type: "BindingRestElement";
  argument: BindingPattern;
}

export interface ArrayPattern extends Span {
  type: "ArrayPattern";
  elements: (BindingPattern | null)[];
  rest: BindingRestElement | null;
}

export interface BindingProperty extends Span {
  type: "BindingProperty";
  key: PropertyKey;
  value: BindingPattern;
  shorthand: boolean;
  computed: boolean;
}

export interface ObjectPattern extends Span {
  type: "ObjectPattern";
  properties: BindingProperty[];
  rest: BindingRestElement | null;
}

export interface AssignmentPattern extends Span {
  type: "AssignmentPattern";
  left: BindingPattern;
  right: Expression;
}

export type BindingPatternKind =
  | BindingIdentifier
  | ObjectPattern
  | ArrayPattern
  | AssignmentPattern;

export interface BindingPattern {
  type: "BindingPattern";
  kind: BindingPatternKind;
  typeAnnotation: TSTypeAnnotation | null;
  optional: boolean;
}

export interface DebuggerStatement extends Span {
  type: "DebuggerStatement";
}

export interface CatchClause extends Span {
  type: "CatchClause";
  param: BindingPattern | null;
  body: BlockStatement;
}

export interface TryStatement extends Span {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export interface ThrowStatement extends Span {
  type: "ThrowStatement";
  argument: Expression;
}

export interface LabeledStatement extends Span {
  type: "LabeledStatement";
  label: LabelIdentifier;
  body: Statement;
}

export interface SwitchCase extends Span {
  type: "SwitchCase";
  test: Expression | null;
  consequent: Statement[];
}

export interface SwitchStatement extends Span {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface WithStatement extends Span {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

export interface ReturnStatement extends Span {
  type: "ReturnStatement";
  argument: Expression | null;
}

export interface BreakStatement extends Span {
  type: "BreakStatement";
  label: LabelIdentifier | null;
}

export interface ContinueStatement extends Span {
  type: "ContinueStatement";
  label: LabelIdentifier | null;
}

export type ForStatementLeft =
  | VariableDeclaration
  | AssignmentTarget
  | UsingDeclaration;

export interface ForOfStatement extends Span {
  type: "ForOfStatement";
  await: boolean;
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
}

export interface ForInStatement extends Span {
  type: "ForInStatement";
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
}

export type ForStatementInit =
  | VariableDeclaration
  | Expression
  | UsingDeclaration;

export interface ForStatement extends Span {
  type: "ForStatement";
  init: ForStatementInit | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface WhileStatement extends Span {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends Span {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

export interface IfStatement extends Span {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface ExpressionStatement extends Span {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface EmptyStatement extends Span {
  type: "EmptyStatement";
}

export interface UsingDeclaration extends Span {
  type: "UsingDeclaration";
  isAwait: boolean;
  declarations: VariableDeclarator[];
}

export interface VariableDeclarator extends Span {
  type: "VariableDeclarator";
  id: BindingPattern;
  init: Expression | null;
  definite: boolean;
}

export type VariableDeclarationKind = "var" | "const" | "let";

export interface VariableDeclaration extends Span {
  type: "VariableDeclaration";
  kind: VariableDeclarationKind;
  declarations: VariableDeclarator[];
  modifiers: Modifiers;
}

export type Declaration =
  | VariableDeclaration
  | Function
  | Class
  | UsingDeclaration
  | TSTypeAliasDeclaration
  | TSInterfaceDeclaration
  | TSEnumDeclaration
  | TSModuleDeclaration
  | TSImportEqualsDeclaration;

export interface BlockStatement extends Span {
  type: "BlockStatement";
  body: Statement[];
}

export interface Hashbang extends Span {
  type: "Hashbang";
  value: string;
}

export interface Directive extends Span {
  type: "Directive";
  expression: StringLiteral;
  directive: string;
}

export type Statement =
  | BlockStatement
  | BreakStatement
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | EmptyStatement
  | ExpressionStatement
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | IfStatement
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | WhileStatement
  | WithStatement
  | ModuleDeclaration
  | Declaration;

export interface ParenthesizedExpression extends Span {
  type: "ParenthesizedExpression";
  expression: Expression;
}

export type ChainElement = CallExpression | MemberExpression;

export interface ChainExpression extends Span {
  type: "ChainExpression";
  expression: ChainElement;
}

export interface AwaitExpression extends Span {
  type: "AwaitExpression";
  argument: Expression;
}

export interface Super extends Span {
  type: "Super";
}

export interface SequenceExpression extends Span {
  type: "SequenceExpression";
  expressions: Expression[];
}

export interface AssignmentTargetPropertyProperty extends Span {
  type: "AssignmentTargetPropertyProperty";
  name: PropertyKey;
  binding: AssignmentTargetMaybeDefault;
}

export interface AssignmentTargetPropertyIdentifier extends Span {
  type: "AssignmentTargetPropertyIdentifier";
  binding: IdentifierReference;
  init: Expression | null;
}

export type AssignmentTargetProperty =
  | AssignmentTargetPropertyIdentifier
  | AssignmentTargetPropertyProperty;

export interface AssignmentTargetWithDefault extends Span {
  type: "AssignmentTargetWithDefault";
  binding: AssignmentTarget;
  init: Expression;
}

export type AssignmentTargetMaybeDefault =
  | AssignmentTarget
  | AssignmentTargetWithDefault;

export interface ObjectAssignmentTarget extends Span {
  type: "ObjectAssignmentTarget";
  properties: AssignmentTargetProperty[];
  rest: AssignmentTarget | null;
}

export interface ArrayAssignmentTarget extends Span {
  type: "ArrayAssignmentTarget";
  elements: (AssignmentTargetMaybeDefault | null)[];
  rest: AssignmentTarget | null;
  trailing_comma: Span | null;
}

export type AssignmentTargetPattern =
  | ArrayAssignmentTarget
  | ObjectAssignmentTarget;

export type SimpleAssignmentTarget =
  | IdentifierReference
  | MemberExpression
  | TSAsExpression
  | TSSatisfiesExpression
  | TSNonNullExpression
  | TSTypeAssertion;

export type AssignmentTarget = SimpleAssignmentTarget | AssignmentTargetPattern;

export interface AssignmentExpression extends Span {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: AssignmentTarget;
  right: Expression;
}

export interface ConditionalExpression extends Span {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface LogicalExpression extends Span {
  type: "LogicalExpression";
  left: Expression;
  operator: LogicalOperator;
  right: Expression;
}

export interface PrivateInExpression extends Span {
  type: "PrivateInExpression";
  left: PrivateIdentifier;
  operator: BinaryOperator;
  right: Expression;
}

export interface BinaryExpression extends Span {
  type: "BinaryExpression";
  left: Expression;
  operator: BinaryOperator;
  right: Expression;
}

export interface UnaryExpression extends Span {
  type: "UnaryExpression";
  operator: UnaryOperator;
  argument: Expression;
}

export interface UpdateExpression extends Span {
  type: "UpdateExpression";
  operator: UpdateOperator;
  prefix: boolean;
  argument: SimpleAssignmentTarget;
}

export type Argument = SpreadElement | Expression;

export interface SpreadElement extends Span {
  type: "SpreadElement";
  argument: Expression;
}

export interface MetaProperty extends Span {
  type: "MetaProperty";
  meta: IdentifierName;
  property: IdentifierName;
}

export interface NewExpression extends Span {
  type: "NewExpression";
  callee: Expression;
  arguments: Argument[];
  type_parameters: TSTypeParameterInstantiation | null;
}

export interface CallExpression extends Span {
  type: "CallExpression";
  callee: Expression;
  arguments: Argument[];
  optional: boolean;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface PrivateFieldExpression extends Span {
  type: "PrivateFieldExpression";
  object: Expression;
  field: PrivateIdentifier;
  optional: boolean;
}

export interface StaticMemberExpression extends Span {
  type: "StaticMemberExpression";
  object: Expression;
  property: IdentifierName;
  optional: boolean;
}

export interface ComputedMemberExpression extends Span {
  type: "ComputedMemberExpression";
  object: Expression;
  expression: Expression;
  optional: boolean;
}

export type MemberExpression =
  | ComputedMemberExpression
  | StaticMemberExpression
  | PrivateFieldExpression;

export interface TemplateElementValue {
  raw: string;
  cooked: string | null;
}

export interface TemplateElement extends Span {
  type: "TemplateElement";
  tail: boolean;
  value: TemplateElementValue;
}

export interface TaggedTemplateExpression extends Span {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
  type_parameters: TSTypeParameterInstantiation | null;
}

export interface TemplateLiteral extends Span {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[];
}

export type PropertyKind = "init" | "get" | "set";

export type PropertyKey = IdentifierName | PrivateIdentifier | Expression;

export interface ObjectProperty extends Span {
  type: "ObjectProperty";
  kind: PropertyKind;
  key: PropertyKey;
  value: Expression;
  init: Expression | null;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

export type ObjectPropertyKind = ObjectProperty | SpreadElement;

export interface ObjectExpression extends Span {
  type: "ObjectExpression";
  properties: ObjectPropertyKind[];
  trailing_comma: Span | null;
}

export type ArrayExpressionElement = SpreadElement | Expression | Span;

export interface ArrayExpression extends Span {
  type: "ArrayExpression";
  elements: ArrayExpressionElement[];
  trailing_comma: Span | null;
}

export interface ThisExpression extends Span {
  type: "ThisExpression";
}

export interface LabelIdentifier extends Span {
  type: "LabelIdentifier";
  name: string;
}

export interface BindingIdentifier extends Span {
  type: "BindingIdentifier";
  name: string;
  symbolId: SymbolId | null;
}

export interface IdentifierReference extends Span {
  type: "IdentifierReference";
  name: string;
  referenceId: ReferenceId | null;
  referenceFlag: ReferenceFlag;
}

export interface IdentifierName extends Span {
  type: "IdentifierName";
  name: string;
}

export type Expression =
  | BooleanLiteral
  | NullLiteral
  | NumberLiteral
  | BigintLiteral
  | RegExpLiteral
  | StringLiteral
  | TemplateLiteral
  | IdentifierReference
  | MetaProperty
  | Super
  | ArrayExpression
  | ArrowExpression
  | AssignmentExpression
  | AwaitExpression
  | BinaryExpression
  | CallExpression
  | ChainExpression
  | Class
  | ConditionalExpression
  | Function
  | ImportExpression
  | LogicalExpression
  | MemberExpression
  | NewExpression
  | ObjectExpression
  | ParenthesizedExpression
  | SequenceExpression
  | TaggedTemplateExpression
  | ThisExpression
  | UnaryExpression
  | UpdateExpression
  | YieldExpression
  | PrivateInExpression
  | JSXElement
  | JSXFragment
  | TSAsExpression
  | TSSatisfiesExpression
  | TSTypeAssertion
  | TSNonNullExpression
  | TSInstantiationExpression;

export interface Program extends Span {
  type: "Program";
  sourceType: SourceType;
  directives: Directive[];
  hashbang: Hashbang | null;
  body: Statement[];
}

export type SymbolId = number;

export type ReferenceId = number;
export type ReferenceFlag = {
  None: 0;
  Read: 0b1;
  Write: 0b10;
  Type: 0b100;
  ReadWrite: 0b11;
};

export type UpdateOperator = "++" | "--";

export type UnaryOperator =
  | "-"
  | "+"
  | "!"
  | "~"
  | "typeof"
  | "void"
  | "delete";

export type LogicalOperator = "||" | "&&" | "??";

export type BinaryOperator =
  | "=="
  | "!="
  | "==="
  | "!=="
  | "<"
  | "<="
  | ">"
  | ">="
  | "<<"
  | ">>"
  | ">>>"
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "|"
  | "^"
  | "&"
  | "in"
  | "instanceof"
  | "**";

export type AssignmentOperator =
  | "="
  | "+="
  | "-="
  | "*="
  | "/="
  | "%="
  | "<<="
  | ">>="
  | ">>>="
  | "|="
  | "^="
  | "&="
  | "&&="
  | "||="
  | "??="
  | "**=";

export interface Span {
  start: number;
  end: number;
}

export type LanguageVariant = "standard" | "jsx";

export type ModuleKind = "script" | "module";

export type Language =
  | "javaScript"
  | { typeScript: { isDefinitionFile: boolean } };

export interface SourceType {
  language: Language;
  moduleKind: ModuleKind;
  variant: LanguageVariant;
  alwaysStrict: boolean;
}

export type Node =
  | StringLiteral
  | RegExpLiteral
  | BigintLiteral
  | NumberLiteral
  | NullLiteral
  | BooleanLiteral
  | TSInstantiationExpression
  | TSNamespaceExportDeclaration
  | TSExportAssignment
  | Modifier
  | Decorator
  | TSNonNullExpression
  | TSExternalModuleReference
  | TSImportEqualsDeclaration
  | TSTypeAssertion
  | TSSatisfiesExpression
  | TSAsExpression
  | TSTemplateLiteralType
  | TSMappedType
  | TSConstructorType
  | TSFunctionType
  | TSImportType
  | TSTypeQuery
  | TSInferType
  | TSTypeLiteral
  | TSModuleBlock
  | TSModuleDeclaration
  | TSTypePredicate
  | TSInterfaceHeritage
  | TSIndexSignatureName
  | TSConstructSignatureDeclaration
  | TSMethodSignature
  | TSCallSignatureDeclaration
  | TSIndexSignature
  | TSPropertySignature
  | TSInterfaceBody
  | TSInterfaceDeclaration
  | TSClassImplements
  | TSTypeAliasDeclaration
  | TSTypeParameterDeclaration
  | TSTypeParameter
  | TSTypeParameterInstantiation
  | TSQualifiedName
  | TSTypeReference
  | TSBigIntKeyword
  | TSObjectKeyword
  | TSThisKeyword
  | TSSymbolKeyword
  | TSVoidKeyword
  | TSUndefinedKeyword
  | TSNullKeyword
  | TSUnknownKeyword
  | TSNeverKeyword
  | TSNumberKeyword
  | TSBooleanKeyword
  | TSStringKeyword
  | TSAnyKeyword
  | TSRestType
  | TSOptionalType
  | TSNamedTupleMember
  | TSTupleType
  | TSIndexedAccessType
  | TSArrayType
  | TSTypeOperatorType
  | TSIntersectionType
  | TSUnionType
  | TSConditionalType
  | TSLiteralType
  | TSTypeAnnotation
  | TSEnumMember
  | TSEnumBody
  | TSEnumDeclaration
  | TSThisParameter
  | JSXText
  | JSXSpreadChild
  | JSXIdentifier
  | JSXSpreadAttribute
  | JSXAttribute
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXMemberExpression
  | JSXNamespacedName
  | JSXClosingFragment
  | JSXOpeningFragment
  | JSXFragment
  | JSXClosingElement
  | JSXOpeningElement
  | JSXElement
  | ExportSpecifier
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ImportAttribute
  | WithClause
  | ImportNamespaceSpecifier
  | ImportDefaultSpecifier
  | ImportSpecifier
  | ImportDeclaration
  | ImportExpression
  | AccessorProperty
  | StaticBlock
  | PrivateIdentifier
  | PropertyDefinition
  | MethodDefinition
  | ClassBody
  | Class
  | YieldExpression
  | ArrowExpression
  | FunctionBody
  | BindingRestElement
  | ArrayPattern
  | BindingProperty
  | ObjectPattern
  | AssignmentPattern
  | BindingPattern
  | DebuggerStatement
  | CatchClause
  | TryStatement
  | ThrowStatement
  | LabeledStatement
  | SwitchCase
  | SwitchStatement
  | WithStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | ForOfStatement
  | ForInStatement
  | ForStatement
  | WhileStatement
  | DoWhileStatement
  | IfStatement
  | ExpressionStatement
  | EmptyStatement
  | UsingDeclaration
  | VariableDeclarator
  | VariableDeclaration
  | BlockStatement
  | Hashbang
  | Directive
  | ParenthesizedExpression
  | ChainExpression
  | AwaitExpression
  | Super
  | SequenceExpression
  | AssignmentTargetPropertyProperty
  | AssignmentTargetPropertyIdentifier
  | AssignmentTargetWithDefault
  | ObjectAssignmentTarget
  | ArrayAssignmentTarget
  | AssignmentExpression
  | ConditionalExpression
  | Function
  | LogicalExpression
  | PrivateInExpression
  | BinaryExpression
  | UnaryExpression
  | UpdateExpression
  | SpreadElement
  | MetaProperty
  | NewExpression
  | CallExpression
  | PrivateFieldExpression
  | StaticMemberExpression
  | ComputedMemberExpression
  | TemplateElement
  | TaggedTemplateExpression
  | TemplateLiteral
  | ObjectProperty
  | ObjectExpression
  | ArrayExpression
  | ThisExpression
  | LabelIdentifier
  | BindingIdentifier
  | IdentifierReference
  | IdentifierName
  | Program;
