export interface Program extends Span {
  type: "Program";
  body: Array<Directive | Statement>;
  sourceType: "script" | "module" | "unambiguous";
  hashbang: Hashbang | null;
}
export interface Directive extends Span {
  type: "ExpressionStatement";
  expression: StringLiteral;
  directive: string;
}
export interface StringLiteral extends Span {
  type: "Literal";
  value: string;
  raw: string | null;
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
  | Declaration
  | ModuleDeclaration;
export interface BlockStatement extends Span {
  type: "BlockStatement";
  body: Array<Statement>;
}
export interface BreakStatement extends Span {
  type: "BreakStatement";
  label: LabelIdentifier | null;
}
export interface LabelIdentifier extends Span {
  type: "Identifier";
  name: string;
}
export interface ContinueStatement extends Span {
  type: "ContinueStatement";
  label: LabelIdentifier | null;
}
export interface DebuggerStatement extends Span {
  type: "DebuggerStatement";
}
export interface DoWhileStatement extends Span {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}
export type Expression =
  | BooleanLiteral
  | NullLiteral
  | NumericLiteral
  | BigIntLiteral
  | RegExpLiteral
  | StringLiteral
  | TemplateLiteral
  | IdentifierReference
  | MetaProperty
  | Super
  | ArrayExpression
  | ArrowFunctionExpression
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
  | NewExpression
  | ObjectExpression
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
  | TSInstantiationExpression
  | V8IntrinsicExpression
  | MemberExpression;
export interface BooleanLiteral extends Span {
  type: "Literal";
  value: boolean;
  raw: string | null;
}
export interface NullLiteral extends Span {
  type: "Literal";
  value: null;
  raw: "null" | null;
}
export interface NumericLiteral extends Span {
  type: "Literal";
  value: number;
  raw: string | null;
}
export interface BigIntLiteral extends Span {
  type: "Literal";
  value: bigint;
  raw: string | null;
  bigint: string;
}
export interface RegExpLiteral extends Span {
  type: "Literal";
  value: RegExp | null;
  raw: string | null;
  regex: RegExp;
}
export interface RegExp {
  pattern: string;
  flags: string;
}
export interface TemplateLiteral extends Span {
  type: "TemplateLiteral";
  expressions: Array<Expression>;
  quasis: Array<TemplateElement>;
}
export interface TemplateElement extends Span {
  type: "TemplateElement";
  value: TemplateElementValue;
  tail: boolean;
}
export interface TemplateElementValue {
  raw: string;
  cooked: string | null;
}
export interface IdentifierReference extends Span {
  type: "Identifier";
  name: string;
  decorators?: [];
  optional?: false;
  typeAnnotation?: null;
}
export interface MetaProperty extends Span {
  type: "MetaProperty";
  meta: IdentifierName;
  property: IdentifierName;
}
export interface IdentifierName extends Span {
  type: "Identifier";
  name: string;
  decorators?: [];
  optional?: false;
  typeAnnotation?: null;
}
export interface Super extends Span {
  type: "Super";
}
export interface ArrayExpression extends Span {
  type: "ArrayExpression";
  elements: Array<SpreadElement | null | Expression>;
}
export interface ArrowFunctionExpression extends Span {
  type: "ArrowFunctionExpression";
  id: null;
  expression: boolean;
  generator: false;
  async: boolean;
  params: ParamPattern[];
  body: FunctionBody | Expression;
  typeParameters?: TSTypeParameterDeclaration | null;
  returnType?: TSTypeAnnotation | null;
}
export type ParamPattern = FormalParameter | FormalParameterRest;
export type FormalParameter = { decorators?: Array<Decorator> } & BindingPattern;
export interface Decorator extends Span {
  type: "Decorator";
  expression: Expression;
}
export type BindingPattern = { typeAnnotation?: TSTypeAnnotation | null; optional?: boolean } & (
  | BindingIdentifier
  | ObjectPattern
  | ArrayPattern
  | AssignmentPattern
);
export interface TSTypeAnnotation extends Span {
  type: "TSTypeAnnotation";
  typeAnnotation: TSType;
}
export type TSType =
  | TSAnyKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSIntrinsicKeyword
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSStringKeyword
  | TSSymbolKeyword
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
  | TSNamedTupleMember
  | TSTemplateLiteralType
  | TSThisType
  | TSTupleType
  | TSTypeLiteral
  | TSTypeOperator
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUnionType
  | TSParenthesizedType
  | JSDocNullableType
  | JSDocNonNullableType
  | JSDocUnknownType;
export interface TSAnyKeyword extends Span {
  type: "TSAnyKeyword";
}
export interface TSBigIntKeyword extends Span {
  type: "TSBigIntKeyword";
}
export interface TSBooleanKeyword extends Span {
  type: "TSBooleanKeyword";
}
export interface TSIntrinsicKeyword extends Span {
  type: "TSIntrinsicKeyword";
}
export interface TSNeverKeyword extends Span {
  type: "TSNeverKeyword";
}
export interface TSNullKeyword extends Span {
  type: "TSNullKeyword";
}
export interface TSNumberKeyword extends Span {
  type: "TSNumberKeyword";
}
export interface TSObjectKeyword extends Span {
  type: "TSObjectKeyword";
}
export interface TSStringKeyword extends Span {
  type: "TSStringKeyword";
}
export interface TSSymbolKeyword extends Span {
  type: "TSSymbolKeyword";
}
export interface TSUndefinedKeyword extends Span {
  type: "TSUndefinedKeyword";
}
export interface TSUnknownKeyword extends Span {
  type: "TSUnknownKeyword";
}
export interface TSVoidKeyword extends Span {
  type: "TSVoidKeyword";
}
export interface TSArrayType extends Span {
  type: "TSArrayType";
  elementType: TSType;
}
export interface TSConditionalType extends Span {
  type: "TSConditionalType";
  checkType: TSType;
  extendsType: TSType;
  trueType: TSType;
  falseType: TSType;
}
export interface TSConstructorType extends Span {
  type: "TSConstructorType";
  abstract: boolean;
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation;
}
export interface TSTypeParameterDeclaration extends Span {
  type: "TSTypeParameterDeclaration";
  params: Array<TSTypeParameter>;
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
export interface BindingIdentifier extends Span {
  type: "Identifier";
  name: string;
  decorators?: [];
  optional?: false;
  typeAnnotation?: null;
}
export interface TSFunctionType extends Span {
  type: "TSFunctionType";
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation;
}
export interface TSImportType extends Span {
  type: "TSImportType";
  argument: TSType;
  options: ObjectExpression | null;
  qualifier: TSTypeName | null;
  typeArguments: TSTypeParameterInstantiation | null;
  isTypeOf: boolean;
}
export interface ObjectExpression extends Span {
  type: "ObjectExpression";
  properties: Array<ObjectPropertyKind>;
}
export type ObjectPropertyKind = ObjectProperty | SpreadElement;
export interface ObjectProperty extends Span {
  type: "Property";
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  key: PropertyKey;
  value: Expression;
  kind: "init" | "get" | "set";
}
export type PropertyKey = IdentifierName | PrivateIdentifier | Expression;
export interface PrivateIdentifier extends Span {
  type: "PrivateIdentifier";
  name: string;
}
export interface SpreadElement extends Span {
  type: "SpreadElement";
  argument: Expression;
}
export type TSTypeName = IdentifierReference | TSQualifiedName;
export interface TSQualifiedName extends Span {
  type: "TSQualifiedName";
  left: TSTypeName;
  right: IdentifierName;
}
export interface TSTypeParameterInstantiation extends Span {
  type: "TSTypeParameterInstantiation";
  params: Array<TSType>;
}
export interface TSIndexedAccessType extends Span {
  type: "TSIndexedAccessType";
  objectType: TSType;
  indexType: TSType;
}
export interface TSInferType extends Span {
  type: "TSInferType";
  typeParameter: TSTypeParameter;
}
export interface TSIntersectionType extends Span {
  type: "TSIntersectionType";
  types: Array<TSType>;
}
export interface TSLiteralType extends Span {
  type: "TSLiteralType";
  literal: TSLiteral;
}
export type TSLiteral =
  | BooleanLiteral
  | NumericLiteral
  | BigIntLiteral
  | StringLiteral
  | TemplateLiteral
  | UnaryExpression;
export interface UnaryExpression extends Span {
  type: "UnaryExpression";
  operator: "+" | "-" | "!" | "~" | "typeof" | "void" | "delete";
  prefix: true;
  argument: Expression;
}
export interface TSMappedType extends Span {
  type: "TSMappedType";
  typeParameter: TSTypeParameter;
  nameType: TSType | null;
  typeAnnotation: TSType | null;
  optional: "true" | "+" | "-" | "none";
  readonly: "true" | "+" | "-" | "none";
}
export interface TSNamedTupleMember extends Span {
  type: "TSNamedTupleMember";
  elementType: TSTupleElement;
  label: IdentifierName;
  optional: boolean;
}
export type TSTupleElement = TSOptionalType | TSRestType | TSType;
export interface TSOptionalType extends Span {
  type: "TSOptionalType";
  typeAnnotation: TSType;
}
export interface TSRestType extends Span {
  type: "TSRestType";
  typeAnnotation: TSType;
}
export interface TSTemplateLiteralType extends Span {
  type: "TSTemplateLiteralType";
  quasis: Array<TemplateElement>;
  types: Array<TSType>;
}
export interface TSThisType extends Span {
  type: "TSThisType";
}
export interface TSTupleType extends Span {
  type: "TSTupleType";
  elementTypes: Array<TSTupleElement>;
}
export interface TSTypeLiteral extends Span {
  type: "TSTypeLiteral";
  members: Array<TSSignature>;
}
export type TSSignature =
  | TSIndexSignature
  | TSPropertySignature
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSMethodSignature;
export interface TSIndexSignature extends Span {
  type: "TSIndexSignature";
  parameters: Array<TSIndexSignatureName>;
  typeAnnotation: TSTypeAnnotation;
  readonly: boolean;
  static: boolean;
  accessibility?: null;
}
export interface TSIndexSignatureName extends Span {
  type: "Identifier";
  name: string;
  typeAnnotation: TSTypeAnnotation;
  decorators?: [];
  optional?: false;
}
export interface TSPropertySignature extends Span {
  type: "TSPropertySignature";
  computed: boolean;
  optional: boolean;
  readonly: boolean;
  key: PropertyKey;
  typeAnnotation: TSTypeAnnotation | null;
}
export interface TSCallSignatureDeclaration extends Span {
  type: "TSCallSignatureDeclaration";
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation | null;
}
export interface TSConstructSignatureDeclaration extends Span {
  type: "TSConstructSignatureDeclaration";
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation | null;
}
export interface TSMethodSignature extends Span {
  type: "TSMethodSignature";
  key: PropertyKey;
  computed: boolean;
  optional: boolean;
  kind: "method" | "get" | "set";
  typeParameters: TSTypeParameterDeclaration | null;
  thisParam: TSThisParameter | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation | null;
}
export interface TSThisParameter extends Span {
  type: "Identifier";
  name: "this";
  typeAnnotation: TSTypeAnnotation | null;
  decorators: [];
  optional: false;
}
export interface TSTypeOperator extends Span {
  type: "TSTypeOperator";
  operator: "keyof" | "unique" | "readonly";
  typeAnnotation: TSType;
}
export interface TSTypePredicate extends Span {
  type: "TSTypePredicate";
  parameterName: TSTypePredicateName;
  asserts: boolean;
  typeAnnotation: TSTypeAnnotation | null;
}
export type TSTypePredicateName = IdentifierName | TSThisType;
export interface TSTypeQuery extends Span {
  type: "TSTypeQuery";
  exprName: TSTypeQueryExprName;
  typeArguments: TSTypeParameterInstantiation | null;
}
export type TSTypeQueryExprName = TSImportType | TSTypeName;
export interface TSTypeReference extends Span {
  type: "TSTypeReference";
  typeName: TSTypeName;
  typeArguments: TSTypeParameterInstantiation | null;
}
export interface TSUnionType extends Span {
  type: "TSUnionType";
  types: Array<TSType>;
}
export interface TSParenthesizedType extends Span {
  type: "TSParenthesizedType";
  typeAnnotation: TSType;
}
export interface JSDocNullableType extends Span {
  type: "JSDocNullableType";
  typeAnnotation: TSType;
  postfix: boolean;
}
export interface JSDocNonNullableType extends Span {
  type: "JSDocNonNullableType";
  typeAnnotation: TSType;
  postfix: boolean;
}
export interface JSDocUnknownType extends Span {
  type: "JSDocUnknownType";
}
export interface ObjectPattern extends Span {
  type: "ObjectPattern";
  properties: Array<BindingProperty | BindingRestElement>;
}
export interface BindingProperty extends Span {
  type: "Property";
  method: false;
  shorthand: boolean;
  computed: boolean;
  key: PropertyKey;
  value: BindingPattern;
  kind: "init";
}
export interface BindingRestElement extends Span {
  type: "RestElement";
  argument: BindingPattern;
}
export interface ArrayPattern extends Span {
  type: "ArrayPattern";
  elements: Array<BindingPattern | BindingRestElement | null>;
  decorators?: [];
  optional?: false;
  typeAnnotation?: null;
}
export interface AssignmentPattern extends Span {
  type: "AssignmentPattern";
  left: BindingPattern;
  right: Expression;
  decorators?: [];
}
export interface FormalParameterRest extends Span {
  type: "RestElement";
  argument: BindingPatternKind;
  typeAnnotation: TSTypeAnnotation | null;
  optional: boolean;
}
export type BindingPatternKind = BindingIdentifier | ObjectPattern | ArrayPattern | AssignmentPattern;
export interface FunctionBody extends Span {
  type: "BlockStatement";
  body: Array<Directive | Statement>;
}
export interface AssignmentExpression extends Span {
  type: "AssignmentExpression";
  operator:
    | "="
    | "+="
    | "-="
    | "*="
    | "/="
    | "%="
    | "**="
    | "<<="
    | ">>="
    | ">>>="
    | "|="
    | "^="
    | "&="
    | "||="
    | "&&="
    | "??=";
  left: AssignmentTarget;
  right: Expression;
}
export type AssignmentTarget = SimpleAssignmentTarget | AssignmentTargetPattern;
export type SimpleAssignmentTarget =
  | IdentifierReference
  | TSAsExpression
  | TSSatisfiesExpression
  | TSNonNullExpression
  | TSTypeAssertion
  | MemberExpression;
export interface TSAsExpression extends Span {
  type: "TSAsExpression";
  expression: Expression;
  typeAnnotation: TSType;
}
export interface TSSatisfiesExpression extends Span {
  type: "TSSatisfiesExpression";
  expression: Expression;
  typeAnnotation: TSType;
}
export interface TSNonNullExpression extends Span {
  type: "TSNonNullExpression";
  expression: Expression;
}
export interface TSTypeAssertion extends Span {
  type: "TSTypeAssertion";
  expression: Expression;
  typeAnnotation: TSType;
}
export type MemberExpression = ComputedMemberExpression | StaticMemberExpression | PrivateFieldExpression;
export interface ComputedMemberExpression extends Span {
  type: "MemberExpression";
  object: Expression;
  property: Expression;
  computed: true;
  optional: boolean;
}
export interface StaticMemberExpression extends Span {
  type: "MemberExpression";
  object: Expression;
  property: IdentifierName;
  computed: false;
  optional: boolean;
}
export interface PrivateFieldExpression extends Span {
  type: "MemberExpression";
  object: Expression;
  property: PrivateIdentifier;
  computed: false;
  optional: boolean;
}
export type AssignmentTargetPattern = ArrayAssignmentTarget | ObjectAssignmentTarget;
export interface ArrayAssignmentTarget extends Span {
  type: "ArrayPattern";
  elements: Array<AssignmentTargetMaybeDefault | AssignmentTargetRest | null>;
}
export type AssignmentTargetMaybeDefault = AssignmentTargetWithDefault | AssignmentTarget;
export interface AssignmentTargetWithDefault extends Span {
  type: "AssignmentPattern";
  left: AssignmentTarget;
  right: Expression;
}
export interface AssignmentTargetRest extends Span {
  type: "RestElement";
  argument: AssignmentTarget;
}
export interface ObjectAssignmentTarget extends Span {
  type: "ObjectPattern";
  properties: Array<AssignmentTargetProperty | AssignmentTargetRest>;
}
export type AssignmentTargetProperty = AssignmentTargetPropertyIdentifier | AssignmentTargetPropertyProperty;
export interface AssignmentTargetPropertyIdentifier extends Span {
  type: "Property";
  method: false;
  shorthand: true;
  computed: false;
  key: IdentifierReference;
  value: IdentifierReference | AssignmentTargetWithDefault;
  kind: "init";
}
export interface AssignmentTargetPropertyProperty extends Span {
  type: "Property";
  method: false;
  shorthand: false;
  computed: boolean;
  key: PropertyKey;
  value: AssignmentTargetMaybeDefault;
  kind: "init";
}
export interface AwaitExpression extends Span {
  type: "AwaitExpression";
  argument: Expression;
}
export interface BinaryExpression extends Span {
  type: "BinaryExpression";
  left: Expression;
  operator:
    | "=="
    | "!="
    | "==="
    | "!=="
    | "<"
    | "<="
    | ">"
    | ">="
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "**"
    | "<<"
    | ">>"
    | ">>>"
    | "|"
    | "^"
    | "&"
    | "in"
    | "instanceof";
  right: Expression;
}
export interface CallExpression extends Span {
  type: "CallExpression";
  callee: Expression;
  arguments: Array<Argument>;
  optional: boolean;
  typeArguments?: TSTypeParameterInstantiation | null;
}
export type Argument = SpreadElement | Expression;
export interface ChainExpression extends Span {
  type: "ChainExpression";
  expression: ChainElement;
}
export type ChainElement = CallExpression | TSNonNullExpression | MemberExpression;
export interface Class extends Span {
  type: "ClassDeclaration" | "ClassExpression";
  id: BindingIdentifier | null;
  superClass: Expression | null;
  body: ClassBody;
  decorators?: Array<Decorator>;
  typeParameters?: TSTypeParameterDeclaration | null;
  superTypeArguments?: TSTypeParameterInstantiation | null;
  implements?: Array<TSClassImplements>;
  abstract?: boolean;
  declare?: boolean;
}
export interface ClassBody extends Span {
  type: "ClassBody";
  body: Array<ClassElement>;
}
export type ClassElement = StaticBlock | MethodDefinition | PropertyDefinition | AccessorProperty | TSIndexSignature;
export interface StaticBlock extends Span {
  type: "StaticBlock";
  body: Array<Statement>;
}
export interface MethodDefinition extends Span {
  type: "MethodDefinition" | "TSAbstractMethodDefinition";
  static: boolean;
  computed: boolean;
  key: PropertyKey;
  kind: "constructor" | "method" | "get" | "set";
  value: Function;
  decorators?: Array<Decorator>;
  override?: boolean;
  optional?: boolean;
  accessibility?: "private" | "protected" | "public" | null;
}
export interface Function extends Span {
  type: "FunctionDeclaration" | "FunctionExpression" | "TSDeclareFunction" | "TSEmptyBodyFunctionExpression";
  id: BindingIdentifier | null;
  expression: false;
  generator: boolean;
  async: boolean;
  params: ParamPattern[];
  body: FunctionBody | null;
  declare?: boolean;
  typeParameters?: TSTypeParameterDeclaration | null;
  returnType?: TSTypeAnnotation | null;
}
export interface PropertyDefinition extends Span {
  type: "PropertyDefinition" | "TSAbstractPropertyDefinition";
  static: boolean;
  computed: boolean;
  key: PropertyKey;
  value: Expression | null;
  decorators?: Array<Decorator>;
  declare?: boolean;
  override?: boolean;
  optional?: boolean;
  definite?: boolean;
  readonly?: boolean;
  typeAnnotation?: TSTypeAnnotation | null;
  accessibility?: "private" | "protected" | "public" | null;
}
export interface AccessorProperty extends Span {
  type: "AccessorProperty" | "TSAbstractAccessorProperty";
  key: PropertyKey;
  value: Expression | null;
  computed: boolean;
  static: boolean;
  decorators?: Array<Decorator>;
  definite?: boolean;
  typeAnnotation?: TSTypeAnnotation | null;
  accessibility?: "private" | "protected" | "public" | null;
}
export interface TSClassImplements extends Span {
  type: "TSClassImplements";
  expression: TSTypeName;
  typeArguments: TSTypeParameterInstantiation | null;
}
export interface ConditionalExpression extends Span {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}
export interface ImportExpression extends Span {
  type: "ImportExpression";
  source: Expression;
  options: Expression | null;
}
export interface LogicalExpression extends Span {
  type: "LogicalExpression";
  left: Expression;
  operator: "||" | "&&" | "??";
  right: Expression;
}
export interface NewExpression extends Span {
  type: "NewExpression";
  callee: Expression;
  arguments: Array<Argument>;
  typeArguments?: TSTypeParameterInstantiation | null;
}
export interface SequenceExpression extends Span {
  type: "SequenceExpression";
  expressions: Array<Expression>;
}
export interface TaggedTemplateExpression extends Span {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
  typeArguments?: TSTypeParameterInstantiation | null;
}
export interface ThisExpression extends Span {
  type: "ThisExpression";
}
export interface UpdateExpression extends Span {
  type: "UpdateExpression";
  operator: "++" | "--";
  prefix: boolean;
  argument: SimpleAssignmentTarget;
}
export interface YieldExpression extends Span {
  type: "YieldExpression";
  delegate: boolean;
  argument: Expression | null;
}
export interface PrivateInExpression extends Span {
  type: "BinaryExpression";
  left: PrivateIdentifier;
  operator: "in";
  right: Expression;
}
export interface JSXElement extends Span {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: Array<JSXChild>;
}
export interface JSXOpeningElement extends Span {
  type: "JSXOpeningElement";
  attributes: Array<JSXAttributeItem>;
  name: JSXElementName;
  selfClosing: boolean;
  typeArguments?: TSTypeParameterInstantiation | null;
}
export type JSXAttributeItem = JSXAttribute | JSXSpreadAttribute;
export interface JSXAttribute extends Span {
  type: "JSXAttribute";
  name: JSXAttributeName;
  value: JSXAttributeValue | null;
}
export type JSXAttributeName = JSXIdentifier | JSXNamespacedName;
export interface JSXIdentifier extends Span {
  type: "JSXIdentifier";
  name: string;
}
export interface JSXNamespacedName extends Span {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}
export type JSXAttributeValue = StringLiteral | JSXExpressionContainer | JSXElement | JSXFragment;
export interface JSXExpressionContainer extends Span {
  type: "JSXExpressionContainer";
  expression: JSXExpression;
}
export type JSXExpression = JSXEmptyExpression | Expression;
export interface JSXEmptyExpression extends Span {
  type: "JSXEmptyExpression";
}
export interface JSXFragment extends Span {
  type: "JSXFragment";
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: Array<JSXChild>;
}
export interface JSXOpeningFragment extends Span {
  type: "JSXOpeningFragment";
  attributes: Array<JSXAttributeItem>;
  selfClosing: false;
}
export interface JSXClosingFragment extends Span {
  type: "JSXClosingFragment";
}
export type JSXChild = JSXText | JSXElement | JSXFragment | JSXExpressionContainer | JSXSpreadChild;
export interface JSXText extends Span {
  type: "JSXText";
  value: string;
  raw: string | null;
}
export interface JSXSpreadChild extends Span {
  type: "JSXSpreadChild";
  expression: Expression;
}
export interface JSXSpreadAttribute extends Span {
  type: "JSXSpreadAttribute";
  argument: Expression;
}
export type JSXElementName = JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
export interface JSXMemberExpression extends Span {
  type: "JSXMemberExpression";
  object: JSXMemberExpressionObject;
  property: JSXIdentifier;
}
export type JSXMemberExpressionObject = JSXIdentifier | JSXMemberExpression;
export interface JSXClosingElement extends Span {
  type: "JSXClosingElement";
  name: JSXElementName;
}
export interface TSInstantiationExpression extends Span {
  type: "TSInstantiationExpression";
  expression: Expression;
  typeParameters: TSTypeParameterInstantiation;
}
export interface V8IntrinsicExpression extends Span {
  type: "V8IntrinsicExpression";
  name: IdentifierName;
  arguments: Array<Argument>;
}
export interface EmptyStatement extends Span {
  type: "EmptyStatement";
}
export interface ExpressionStatement extends Span {
  type: "ExpressionStatement";
  expression: Expression;
  directive?: string | null;
}
export interface ForInStatement extends Span {
  type: "ForInStatement";
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
}
export type ForStatementLeft = VariableDeclaration | AssignmentTarget;
export interface VariableDeclaration extends Span {
  type: "VariableDeclaration";
  declarations: Array<VariableDeclarator>;
  kind: "var" | "let" | "const" | "using" | "await using";
  declare?: boolean;
}
export interface VariableDeclarator extends Span {
  type: "VariableDeclarator";
  id: BindingPattern;
  init: Expression | null;
  definite?: boolean;
}
export interface ForOfStatement extends Span {
  type: "ForOfStatement";
  await: boolean;
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
}
export interface ForStatement extends Span {
  type: "ForStatement";
  init: ForStatementInit | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}
export type ForStatementInit = VariableDeclaration | Expression;
export interface IfStatement extends Span {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}
export interface LabeledStatement extends Span {
  type: "LabeledStatement";
  body: Statement;
  label: LabelIdentifier;
}
export interface ReturnStatement extends Span {
  type: "ReturnStatement";
  argument: Expression | null;
}
export interface SwitchStatement extends Span {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: Array<SwitchCase>;
}
export interface SwitchCase extends Span {
  type: "SwitchCase";
  consequent: Array<Statement>;
  test: Expression | null;
}
export interface ThrowStatement extends Span {
  type: "ThrowStatement";
  argument: Expression;
}
export interface TryStatement extends Span {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}
export interface CatchClause extends Span {
  type: "CatchClause";
  param: BindingPattern | null;
  body: BlockStatement;
}
export interface WhileStatement extends Span {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}
export interface WithStatement extends Span {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}
export type Declaration =
  | VariableDeclaration
  | Function
  | Class
  | TSTypeAliasDeclaration
  | TSInterfaceDeclaration
  | TSEnumDeclaration
  | TSModuleDeclaration
  | TSImportEqualsDeclaration;
export interface TSTypeAliasDeclaration extends Span {
  type: "TSTypeAliasDeclaration";
  id: BindingIdentifier;
  typeParameters: TSTypeParameterDeclaration | null;
  typeAnnotation: TSType;
  declare: boolean;
}
export interface TSInterfaceDeclaration extends Span {
  type: "TSInterfaceDeclaration";
  id: BindingIdentifier;
  extends: Array<TSInterfaceHeritage> | null;
  typeParameters: TSTypeParameterDeclaration | null;
  body: TSInterfaceBody;
  declare: boolean;
}
export interface TSInterfaceHeritage extends Span {
  type: "TSInterfaceHeritage";
  expression: Expression;
  typeArguments: TSTypeParameterInstantiation | null;
}
export interface TSInterfaceBody extends Span {
  type: "TSInterfaceBody";
  body: Array<TSSignature>;
}
export interface TSEnumDeclaration extends Span {
  type: "TSEnumDeclaration";
  id: BindingIdentifier;
  members: Array<TSEnumMember>;
  const: boolean;
  declare: boolean;
}
export interface TSEnumMember extends Span {
  type: "TSEnumMember";
  id: TSEnumMemberName;
  initializer: Expression | null;
}
export type TSEnumMemberName = IdentifierName | StringLiteral;
export interface TSModuleDeclaration extends Span {
  type: "TSModuleDeclaration";
  id: TSModuleDeclarationName;
  body: TSModuleDeclarationBody | null;
  kind: "global" | "module" | "namespace";
  declare: boolean;
  global: boolean;
}
export type TSModuleDeclarationName = BindingIdentifier | StringLiteral;
export type TSModuleDeclarationBody = TSModuleDeclaration | TSModuleBlock;
export interface TSModuleBlock extends Span {
  type: "TSModuleBlock";
  body: Array<Directive | Statement>;
}
export interface TSImportEqualsDeclaration extends Span {
  type: "TSImportEqualsDeclaration";
  id: BindingIdentifier;
  moduleReference: TSModuleReference;
  importKind: "value" | "type";
}
export type TSModuleReference = TSExternalModuleReference | TSTypeName;
export interface TSExternalModuleReference extends Span {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
}
export type ModuleDeclaration =
  | ImportDeclaration
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | TSExportAssignment
  | TSNamespaceExportDeclaration;
export interface ImportDeclaration extends Span {
  type: "ImportDeclaration";
  specifiers: Array<ImportDeclarationSpecifier>;
  source: StringLiteral;
  attributes: Array<ImportAttribute>;
  importKind?: "value" | "type";
}
export type ImportDeclarationSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier;
export interface ImportSpecifier extends Span {
  type: "ImportSpecifier";
  imported: ModuleExportName;
  local: BindingIdentifier;
  importKind?: "value" | "type";
}
export type ModuleExportName = IdentifierName | IdentifierReference | StringLiteral;
export interface ImportDefaultSpecifier extends Span {
  type: "ImportDefaultSpecifier";
  local: BindingIdentifier;
}
export interface ImportNamespaceSpecifier extends Span {
  type: "ImportNamespaceSpecifier";
  local: BindingIdentifier;
}
export interface ImportAttribute extends Span {
  type: "ImportAttribute";
  key: ImportAttributeKey;
  value: StringLiteral;
}
export type ImportAttributeKey = IdentifierName | StringLiteral;
export interface ExportAllDeclaration extends Span {
  type: "ExportAllDeclaration";
  exported: ModuleExportName | null;
  source: StringLiteral;
  attributes: Array<ImportAttribute>;
  exportKind?: "value" | "type";
}
export interface ExportDefaultDeclaration extends Span {
  type: "ExportDefaultDeclaration";
  declaration: ExportDefaultDeclarationKind;
}
export type ExportDefaultDeclarationKind = Function | Class | TSInterfaceDeclaration | Expression;
export interface ExportNamedDeclaration extends Span {
  type: "ExportNamedDeclaration";
  declaration: Declaration | null;
  specifiers: Array<ExportSpecifier>;
  source: StringLiteral | null;
  attributes: Array<ImportAttribute>;
  exportKind?: "value" | "type";
}
export interface ExportSpecifier extends Span {
  type: "ExportSpecifier";
  local: ModuleExportName;
  exported: ModuleExportName;
  exportKind?: "value" | "type";
}
export interface TSExportAssignment extends Span {
  type: "TSExportAssignment";
  expression: Expression;
}
export interface TSNamespaceExportDeclaration extends Span {
  type: "TSNamespaceExportDeclaration";
  id: IdentifierName;
}
export interface Hashbang extends Span {
  type: "Hashbang";
  value: string;
}
export interface Span {
  start: number;
  end: number;
}
export type Node =
  | Program
  | Directive
  | StringLiteral
  | BlockStatement
  | BreakStatement
  | LabelIdentifier
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | BooleanLiteral
  | NullLiteral
  | NumericLiteral
  | BigIntLiteral
  | RegExpLiteral
  | TemplateLiteral
  | TemplateElement
  | IdentifierReference
  | MetaProperty
  | IdentifierName
  | Super
  | ArrayExpression
  | ArrowFunctionExpression
  | Decorator
  | TSTypeAnnotation
  | TSAnyKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSIntrinsicKeyword
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSUndefinedKeyword
  | TSUnknownKeyword
  | TSVoidKeyword
  | TSArrayType
  | TSConditionalType
  | TSConstructorType
  | TSTypeParameterDeclaration
  | TSTypeParameter
  | BindingIdentifier
  | TSFunctionType
  | TSImportType
  | ObjectExpression
  | ObjectProperty
  | PrivateIdentifier
  | SpreadElement
  | TSQualifiedName
  | TSTypeParameterInstantiation
  | TSIndexedAccessType
  | TSInferType
  | TSIntersectionType
  | TSLiteralType
  | UnaryExpression
  | TSMappedType
  | TSNamedTupleMember
  | TSOptionalType
  | TSRestType
  | TSTemplateLiteralType
  | TSThisType
  | TSTupleType
  | TSTypeLiteral
  | TSIndexSignature
  | TSIndexSignatureName
  | TSPropertySignature
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSMethodSignature
  | TSThisParameter
  | TSTypeOperator
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUnionType
  | TSParenthesizedType
  | JSDocNullableType
  | JSDocNonNullableType
  | JSDocUnknownType
  | ObjectPattern
  | BindingProperty
  | BindingRestElement
  | ArrayPattern
  | AssignmentPattern
  | FormalParameterRest
  | FunctionBody
  | AssignmentExpression
  | TSAsExpression
  | TSSatisfiesExpression
  | TSNonNullExpression
  | TSTypeAssertion
  | ComputedMemberExpression
  | StaticMemberExpression
  | PrivateFieldExpression
  | ArrayAssignmentTarget
  | AssignmentTargetWithDefault
  | AssignmentTargetRest
  | ObjectAssignmentTarget
  | AssignmentTargetPropertyIdentifier
  | AssignmentTargetPropertyProperty
  | AwaitExpression
  | BinaryExpression
  | CallExpression
  | ChainExpression
  | Class
  | ClassBody
  | StaticBlock
  | MethodDefinition
  | Function
  | PropertyDefinition
  | AccessorProperty
  | TSClassImplements
  | ConditionalExpression
  | ImportExpression
  | LogicalExpression
  | NewExpression
  | SequenceExpression
  | TaggedTemplateExpression
  | ThisExpression
  | UpdateExpression
  | YieldExpression
  | PrivateInExpression
  | JSXElement
  | JSXOpeningElement
  | JSXAttribute
  | JSXIdentifier
  | JSXNamespacedName
  | JSXExpressionContainer
  | JSXEmptyExpression
  | JSXFragment
  | JSXOpeningFragment
  | JSXClosingFragment
  | JSXText
  | JSXSpreadChild
  | JSXSpreadAttribute
  | JSXMemberExpression
  | JSXClosingElement
  | TSInstantiationExpression
  | V8IntrinsicExpression
  | EmptyStatement
  | ExpressionStatement
  | ForInStatement
  | VariableDeclaration
  | VariableDeclarator
  | ForOfStatement
  | ForStatement
  | IfStatement
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | SwitchCase
  | ThrowStatement
  | TryStatement
  | CatchClause
  | WhileStatement
  | WithStatement
  | TSTypeAliasDeclaration
  | TSInterfaceDeclaration
  | TSInterfaceHeritage
  | TSInterfaceBody
  | TSEnumDeclaration
  | TSEnumMember
  | TSModuleDeclaration
  | TSModuleBlock
  | TSImportEqualsDeclaration
  | TSExternalModuleReference
  | ImportDeclaration
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ImportAttribute
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ExportSpecifier
  | TSExportAssignment
  | TSNamespaceExportDeclaration
  | Hashbang;
