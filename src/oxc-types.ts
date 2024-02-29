export interface Program extends Span {
  type: "Program";
  sourceType: SourceType;
  directives: Directive[];
  hashbang: Hashbang | null;
  body: Statement[];
}
export interface SourceType {
  language: "javaScript" | { typeScript: { isDefinitionFile: boolean } };
  moduleKind: "script" | "module";
  variant: "standard" | "jsx";
  alwaysStrict: boolean;
}
export interface Directive extends Span {
  type: "Directive";
  expression: StringLiteral;
  directive: string;
}
export interface StringLiteral extends Span {
  type: "StringLiteral";
  value: string;
}
export interface Hashbang extends Span {
  type: "Hashbang";
  value: string;
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
export interface BlockStatement extends Span {
  type: "BlockStatement";
  body: Statement[];
}
export interface BreakStatement extends Span {
  type: "BreakStatement";
  label: LabelIdentifier | null;
}
export interface LabelIdentifier extends Span {
  type: "LabelIdentifier";
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
  | BigintLiteral
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
export interface BooleanLiteral extends Span {
  type: "BooleanLiteral";
  value: boolean;
}
export interface NullLiteral extends Span {
  type: "NullLiteral";
}
export interface NumericLiteral extends Span {
  type: "NumericLiteral";
  value: number;
}
export interface BigintLiteral extends Span {
  type: "BigintLiteral";
  raw: string;
}
export interface RegExpLiteral extends Span {
  type: "RegExpLiteral";
  value: null;
  regex: RegExp;
}
export interface RegExp {
  pattern: string;
  flags: { G: 1; I: 2; M: 4; S: 8; U: 16; Y: 32; D: 64; V: 128 };
}
export interface TemplateLiteral extends Span {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[];
}
export interface TemplateElement extends Span {
  type: "TemplateElement";
  tail: boolean;
  value: TemplateElementValue;
}
export interface TemplateElementValue {
  raw: string;
  cooked: string | null;
}
export interface IdentifierReference extends Span {
  type: "IdentifierReference";
  name: string;
  referenceId: number | null;
  referenceFlag: { None: 0; Read: 1; Write: 2; Type: 4; ReadWrite: 3 };
}
export interface MetaProperty extends Span {
  type: "MetaProperty";
  meta: IdentifierName;
  property: IdentifierName;
}
export interface IdentifierName extends Span {
  type: "IdentifierName";
  name: string;
}
export interface Super extends Span {
  type: "Super";
}
export interface ArrayExpression extends Span {
  type: "ArrayExpression";
  elements: ArrayExpressionElement[];
  trailing_comma: Span | null;
}
export type ArrayExpressionElement = SpreadElement | Expression | Span;
export interface SpreadElement extends Span {
  type: "SpreadElement";
  argument: Expression;
}
export interface Span {
  start: number;
  end: number;
}
export interface ArrowFunctionExpression extends Span {
  type: "ArrowFunctionExpression";
  expression: boolean;
  async: boolean;
  params: FormalParameters;
  body: FunctionBody;
  typeParameters: TSTypeParameterDeclaration | null;
  returnType: TSTypeAnnotation | null;
}
export interface FormalParameters extends Span {
  type: "FormalParameters";
  kind: "FormalParameter" | "UniqueFormalParameters" | "ArrowFormalParameters" | "Signature";
  items: FormalParameter[];
  rest: BindingRestElement | null;
}
export interface FormalParameter extends Span {
  type: "FormalParameter";
  pattern: BindingPattern;
  accessibility: ("private" | "protected" | "public") | null;
  readonly: boolean;
  decorators: Decorator[];
}
export interface BindingPattern {
  type: "BindingPattern";
  kind: BindingPatternKind;
  typeAnnotation: TSTypeAnnotation | null;
  optional: boolean;
}
export type BindingPatternKind = BindingIdentifier | ObjectPattern | ArrayPattern | AssignmentPattern;
export interface BindingIdentifier extends Span {
  type: "BindingIdentifier";
  name: string;
  symbolId: number | null;
}
export interface ObjectPattern extends Span {
  type: "ObjectPattern";
  properties: BindingProperty[];
  rest: BindingRestElement | null;
}
export interface BindingProperty extends Span {
  type: "BindingProperty";
  key: PropertyKey;
  value: BindingPattern;
  shorthand: boolean;
  computed: boolean;
}
export type PropertyKey = IdentifierName | PrivateIdentifier | Expression;
export interface PrivateIdentifier extends Span {
  type: "PrivateIdentifier";
  name: string;
}
export interface BindingRestElement extends Span {
  type: "BindingRestElement";
  argument: BindingPattern;
}
export interface ArrayPattern extends Span {
  type: "ArrayPattern";
  elements: (BindingPattern | null)[];
  rest: BindingRestElement | null;
}
export interface AssignmentPattern extends Span {
  type: "AssignmentPattern";
  left: BindingPattern;
  right: Expression;
}
export interface TSTypeAnnotation extends Span {
  type: "TSTypeAnnotation";
  typeAnnotation: TSType;
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
  | TSThisType
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
  | TSTypeOperator
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUnionType
  | JSDocNullableType
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
export interface TSThisType extends Span {
  type: "TSThisType";
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
  params: FormalParameters;
  returnType: TSTypeAnnotation;
  typeParameters: TSTypeParameterDeclaration | null;
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
export interface TSFunctionType extends Span {
  type: "TSFunctionType";
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  returnType: TSTypeAnnotation;
  typeParameters: TSTypeParameterDeclaration | null;
}
export interface TSThisParameter extends Span {
  type: "TSThisParameter";
  this: IdentifierName;
  typeAnnotation: TSTypeAnnotation | null;
}
export interface TSImportType extends Span {
  type: "TSImportType";
  isTypeOf: boolean;
  argument: TSType;
  qualifier: TSTypeName | null;
  attributes: TSImportAttributes | null;
  typeParameters: TSTypeParameterInstantiation | null;
}
export type TSTypeName = IdentifierReference | TSQualifiedName;
export interface TSQualifiedName extends Span {
  type: "TSQualifiedName";
  left: TSTypeName;
  right: IdentifierName;
}
export interface TSImportAttributes extends Span {
  type: "TSImportAttributes";
  elements: TSImportAttribute[];
}
export interface TSImportAttribute extends Span {
  type: "TSImportAttribute";
  name: TSImportAttributeName;
  value: Expression;
}
export type TSImportAttributeName = IdentifierName | StringLiteral;
export interface TSTypeParameterInstantiation extends Span {
  type: "TSTypeParameterInstantiation";
  params: TSType[];
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
  types: TSType[];
}
export interface TSLiteralType extends Span {
  type: "TSLiteralType";
  literal: TSLiteral;
}
export type TSLiteral =
  | BooleanLiteral
  | NullLiteral
  | NumericLiteral
  | BigintLiteral
  | RegExpLiteral
  | StringLiteral
  | TemplateLiteral
  | UnaryExpression;
export interface UnaryExpression extends Span {
  type: "UnaryExpression";
  operator: "-" | "+" | "!" | "~" | "typeof" | "void" | "delete";
  argument: Expression;
}
export interface TSMappedType extends Span {
  type: "TSMappedType";
  typeParameter: TSTypeParameter;
  nameType: TSType | null;
  typeAnnotation: TSTypeAnnotation | null;
  optional: "true" | "+" | "-" | "none";
  readonly: "true" | "+" | "-" | "none";
}
export interface TSTemplateLiteralType extends Span {
  type: "TSTemplateLiteralType";
  quasis: TemplateElement[];
  types: TSType[];
}
export interface TSTupleType extends Span {
  type: "TSTupleType";
  elementTypes: TSTupleElement[];
}
export type TSTupleElement = TSType | TSOptionalType | TSRestType | TSNamedTupleMember;
export interface TSOptionalType extends Span {
  type: "TSOptionalType";
  typeAnnotation: TSType;
}
export interface TSRestType extends Span {
  type: "TSRestType";
  typeAnnotation: TSType;
}
export interface TSNamedTupleMember extends Span {
  type: "TSNamedTupleMember";
  elementType: TSType;
  label: IdentifierName;
  optional: boolean;
}
export interface TSTypeLiteral extends Span {
  type: "TSTypeLiteral";
  members: TSSignature[];
}
export type TSSignature =
  | TSIndexSignature
  | TSPropertySignature
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSMethodSignature;
export interface TSIndexSignature extends Span {
  type: "TSIndexSignature";
  parameters: TSIndexSignatureName[];
  typeAnnotation: TSTypeAnnotation;
}
export interface TSIndexSignatureName extends Span {
  type: "TSIndexSignatureName";
  name: string;
  typeAnnotation: TSTypeAnnotation;
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
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  returnType: TSTypeAnnotation | null;
  typeParameters: TSTypeParameterDeclaration | null;
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
  kind: "method" | "get" | "set";
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  returnType: TSTypeAnnotation | null;
  typeParameters: TSTypeParameterDeclaration | null;
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
  exprName: TSTypeName;
  typeParameters: TSTypeParameterInstantiation | null;
}
export interface TSTypeReference extends Span {
  type: "TSTypeReference";
  typeName: TSTypeName;
  typeParameters: TSTypeParameterInstantiation | null;
}
export interface TSUnionType extends Span {
  type: "TSUnionType";
  types: TSType[];
}
export interface JSDocNullableType extends Span {
  type: "JSDocNullableType";
  typeAnnotation: TSType;
  postfix: boolean;
}
export interface JSDocUnknownType extends Span {
  type: "JSDocUnknownType";
}
export interface Decorator extends Span {
  type: "Decorator";
  expression: Expression;
}
export interface FunctionBody extends Span {
  type: "FunctionBody";
  directives: Directive[];
  statements: Statement[];
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
  left: AssignmentTarget;
  right: Expression;
}
export type AssignmentTarget = SimpleAssignmentTarget | AssignmentTargetPattern;
export type SimpleAssignmentTarget =
  | IdentifierReference
  | MemberExpression
  | TSAsExpression
  | TSSatisfiesExpression
  | TSNonNullExpression
  | TSTypeAssertion;
export type MemberExpression = ComputedMemberExpression | StaticMemberExpression | PrivateFieldExpression;
export interface ComputedMemberExpression extends Span {
  type: "ComputedMemberExpression";
  object: Expression;
  expression: Expression;
  optional: boolean;
}
export interface StaticMemberExpression extends Span {
  type: "StaticMemberExpression";
  object: Expression;
  property: IdentifierName;
  optional: boolean;
}
export interface PrivateFieldExpression extends Span {
  type: "PrivateFieldExpression";
  object: Expression;
  field: PrivateIdentifier;
  optional: boolean;
}
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
export type AssignmentTargetPattern = ArrayAssignmentTarget | ObjectAssignmentTarget;
export interface ArrayAssignmentTarget extends Span {
  type: "ArrayAssignmentTarget";
  elements: (AssignmentTargetMaybeDefault | null)[];
  rest: AssignmentTarget | null;
  trailing_comma: Span | null;
}
export interface ObjectAssignmentTarget extends Span {
  type: "ObjectAssignmentTarget";
  properties: AssignmentTargetProperty[];
  rest: AssignmentTarget | null;
}
export type AssignmentTargetProperty = AssignmentTargetPropertyIdentifier | AssignmentTargetPropertyProperty;
export interface AssignmentTargetPropertyIdentifier extends Span {
  type: "AssignmentTargetPropertyIdentifier";
  binding: IdentifierReference;
  init: Expression | null;
}
export interface AssignmentTargetPropertyProperty extends Span {
  type: "AssignmentTargetPropertyProperty";
  name: PropertyKey;
  binding: AssignmentTargetMaybeDefault;
}
export type AssignmentTargetMaybeDefault = AssignmentTarget | AssignmentTargetWithDefault;
export interface AssignmentTargetWithDefault extends Span {
  type: "AssignmentTargetWithDefault";
  binding: AssignmentTarget;
  init: Expression;
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
  right: Expression;
}
export interface CallExpression extends Span {
  type: "CallExpression";
  callee: Expression;
  arguments: Argument[];
  optional: boolean;
  typeParameters: TSTypeParameterInstantiation | null;
}
export type Argument = SpreadElement | Expression;
export interface ChainExpression extends Span {
  type: "ChainExpression";
  expression: ChainElement;
}
export type ChainElement = CallExpression | MemberExpression;
export interface Class extends Span {
  type: "ClassDeclaration" | "ClassExpression";
  id: BindingIdentifier | null;
  superClass: Expression | null;
  body: ClassBody;
  typeParameters: TSTypeParameterDeclaration | null;
  superTypeParameters: TSTypeParameterInstantiation | null;
  implements: TSClassImplements[] | null;
  decorators: Decorator[];
  modifiers: Modifier[] | null;
}
export interface ClassBody extends Span {
  type: "ClassBody";
  body: ClassElement[];
}
export type ClassElement = StaticBlock | MethodDefinition | PropertyDefinition | AccessorProperty | TSIndexSignature;
export interface StaticBlock extends Span {
  type: "StaticBlock";
  body: Statement[];
}
export interface MethodDefinition extends Span {
  type: "MethodDefinition" | "TSAbstractMethodDefinition";
  key: PropertyKey;
  value: Function;
  kind: "constructor" | "method" | "get" | "set";
  computed: boolean;
  static: boolean;
  override: boolean;
  optional: boolean;
  accessibility: ("private" | "protected" | "public") | null;
  decorators: Decorator[];
}
export interface Function extends Span {
  type: "FunctionDeclaration" | "FunctionExpression" | "TSDeclareFunction";
  id: BindingIdentifier | null;
  generator: boolean;
  async: boolean;
  thisParam: TSThisParameter | null;
  params: FormalParameters;
  body: FunctionBody | null;
  typeParameters: TSTypeParameterDeclaration | null;
  returnType: TSTypeAnnotation | null;
  modifiers: Modifier[] | null;
}
export interface Modifier extends Span {
  type: "Modifier";
  kind:
    | "abstract"
    | "accessor"
    | "async"
    | "const"
    | "declare"
    | "default"
    | "export"
    | "in"
    | "public"
    | "private"
    | "protected"
    | "readonly"
    | "static"
    | "out"
    | "override";
}
export interface PropertyDefinition extends Span {
  type: "PropertyDefinition" | "TSAbstractPropertyDefinition";
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
  accessibility: ("private" | "protected" | "public") | null;
  decorators: Decorator[];
}
export interface AccessorProperty extends Span {
  type: "AccessorProperty";
  key: PropertyKey;
  value: Expression | null;
  computed: boolean;
  static: boolean;
  decorators: Decorator[];
}
export interface TSClassImplements extends Span {
  type: "TSClassImplements";
  expression: TSTypeName;
  typeParameters: TSTypeParameterInstantiation | null;
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
  arguments: Expression[];
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
  arguments: Argument[];
  typeParameters: TSTypeParameterInstantiation | null;
}
export interface ObjectExpression extends Span {
  type: "ObjectExpression";
  properties: ObjectPropertyKind[];
  trailing_comma: Span | null;
}
export type ObjectPropertyKind = ObjectProperty | SpreadElement;
export interface ObjectProperty extends Span {
  type: "ObjectProperty";
  kind: "init" | "get" | "set";
  key: PropertyKey;
  value: Expression;
  init: Expression | null;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}
export interface ParenthesizedExpression extends Span {
  type: "ParenthesizedExpression";
  expression: Expression;
}
export interface SequenceExpression extends Span {
  type: "SequenceExpression";
  expressions: Expression[];
}
export interface TaggedTemplateExpression extends Span {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
  typeParameters: TSTypeParameterInstantiation | null;
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
  type: "PrivateInExpression";
  left: PrivateIdentifier;
  operator:
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
  right: Expression;
}
export interface JSXElement extends Span {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: JSXChild[];
}
export interface JSXOpeningElement extends Span {
  type: "JSXOpeningElement";
  selfClosing: boolean;
  name: JSXElementName;
  attributes: JSXAttributeItem[];
  typeParameters: TSTypeParameterInstantiation | null;
}
export type JSXElementName = JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
export interface JSXIdentifier extends Span {
  type: "JSXIdentifier";
  name: string;
}
export interface JSXNamespacedName extends Span {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  property: JSXIdentifier;
}
export interface JSXMemberExpression extends Span {
  type: "JSXMemberExpression";
  object: JSXMemberExpressionObject;
  property: JSXIdentifier;
}
export type JSXMemberExpressionObject = JSXIdentifier | JSXMemberExpression;
export type JSXAttributeItem = JSXAttribute | JSXSpreadAttribute;
export interface JSXAttribute extends Span {
  type: "JSXAttribute";
  name: JSXAttributeName;
  value: JSXAttributeValue | null;
}
export type JSXAttributeName = JSXIdentifier | JSXNamespacedName;
export type JSXAttributeValue = StringLiteral | JSXExpressionContainer | JSXElement | JSXFragment;
export interface JSXExpressionContainer extends Span {
  type: "JSXExpressionContainer";
  expression: JSXExpression;
}
export type JSXExpression = Expression | JSXEmptyExpression;
export interface JSXEmptyExpression extends Span {
  type: "JSXEmptyExpression";
}
export interface JSXFragment extends Span {
  type: "JSXFragment";
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: JSXChild[];
}
export interface JSXOpeningFragment extends Span {
  type: "JSXOpeningFragment";
}
export interface JSXClosingFragment extends Span {
  type: "JSXClosingFragment";
}
export type JSXChild = JSXText | JSXElement | JSXFragment | JSXExpressionContainer | JSXSpreadChild;
export interface JSXText extends Span {
  type: "JSXText";
  value: string;
}
export interface JSXSpreadChild extends Span {
  type: "JSXSpreadChild";
  expression: Expression;
}
export interface JSXSpreadAttribute extends Span {
  type: "JSXSpreadAttribute";
  argument: Expression;
}
export interface JSXClosingElement extends Span {
  type: "JSXClosingElement";
  name: JSXElementName;
}
export interface TSInstantiationExpression extends Span {
  type: "TSInstantiationExpression";
  expression: Expression;
  typeParameters: TSTypeParameterInstantiation;
}
export interface EmptyStatement extends Span {
  type: "EmptyStatement";
}
export interface ExpressionStatement extends Span {
  type: "ExpressionStatement";
  expression: Expression;
}
export interface ForInStatement extends Span {
  type: "ForInStatement";
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
}
export type ForStatementLeft = VariableDeclaration | AssignmentTarget | UsingDeclaration;
export interface VariableDeclaration extends Span {
  type: "VariableDeclaration";
  kind: "var" | "const" | "let";
  declarations: VariableDeclarator[];
  modifiers: Modifier[] | null;
}
export interface VariableDeclarator extends Span {
  type: "VariableDeclarator";
  id: BindingPattern;
  init: Expression | null;
  definite: boolean;
}
export interface UsingDeclaration extends Span {
  type: "UsingDeclaration";
  isAwait: boolean;
  declarations: VariableDeclarator[];
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
export type ForStatementInit = VariableDeclaration | Expression | UsingDeclaration;
export interface IfStatement extends Span {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}
export interface LabeledStatement extends Span {
  type: "LabeledStatement";
  label: LabelIdentifier;
  body: Statement;
}
export interface ReturnStatement extends Span {
  type: "ReturnStatement";
  argument: Expression | null;
}
export interface SwitchStatement extends Span {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}
export interface SwitchCase extends Span {
  type: "SwitchCase";
  test: Expression | null;
  consequent: Statement[];
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
export type ModuleDeclaration =
  | ImportDeclaration
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | TSExportAssignment
  | TSNamespaceExportDeclaration;
export interface ImportDeclaration extends Span {
  type: "ImportDeclaration";
  specifiers: ImportDeclarationSpecifier[] | null;
  source: StringLiteral;
  withClause: WithClause | null;
  importKind: "value" | "type";
}
export type ImportDeclarationSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier;
export interface ImportSpecifier extends Span {
  type: "ImportSpecifier";
  imported: ModuleExportName;
  local: BindingIdentifier;
  importKind: "value" | "type";
}
export type ModuleExportName = IdentifierName | StringLiteral;
export interface ImportDefaultSpecifier extends Span {
  type: "ImportDefaultSpecifier";
  local: BindingIdentifier;
}
export interface ImportNamespaceSpecifier extends Span {
  type: "ImportNamespaceSpecifier";
  local: BindingIdentifier;
}
export interface WithClause extends Span {
  type: "WithClause";
  attributesKeyword: IdentifierName;
  withEntries: ImportAttribute[];
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
  withClause: WithClause | null;
  exportKind: "value" | "type";
}
export interface ExportDefaultDeclaration extends Span {
  type: "ExportDefaultDeclaration";
  declaration: ExportDefaultDeclarationKind;
  exported: ModuleExportName;
}
export type ExportDefaultDeclarationKind = Expression | Function | Class | TSInterfaceDeclaration | TSEnumDeclaration;
export interface TSInterfaceDeclaration extends Span {
  type: "TSInterfaceDeclaration";
  id: BindingIdentifier;
  body: TSInterfaceBody;
  typeParameters: TSTypeParameterDeclaration | null;
  extends: TSInterfaceHeritage[] | null;
  modifiers: Modifier[] | null;
}
export interface TSInterfaceBody extends Span {
  type: "TSInterfaceBody";
  body: TSSignature[];
}
export interface TSInterfaceHeritage extends Span {
  type: "TSInterfaceHeritage";
  expression: Expression;
  typeParameters: TSTypeParameterInstantiation | null;
}
export interface TSEnumDeclaration extends Span {
  type: "TSEnumDeclaration";
  id: BindingIdentifier;
  members: TSEnumMember[];
  modifiers: Modifier[] | null;
}
export interface TSEnumMember extends Span {
  type: "TSEnumMember";
  id: TSEnumMemberName;
  initializer: Expression | null;
}
export type TSEnumMemberName = IdentifierName | StringLiteral | Expression | NumericLiteral;
export interface ExportNamedDeclaration extends Span {
  type: "ExportNamedDeclaration";
  declaration: Declaration | null;
  specifiers: ExportSpecifier[];
  source: StringLiteral | null;
  exportKind: "value" | "type";
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
export interface TSTypeAliasDeclaration extends Span {
  type: "TSTypeAliasDeclaration";
  id: BindingIdentifier;
  typeAnnotation: TSType;
  typeParameters: TSTypeParameterDeclaration | null;
  modifiers: Modifier[] | null;
}
export interface TSModuleDeclaration extends Span {
  type: "TSModuleDeclaration";
  id: TSModuleDeclarationName;
  body: TSModuleDeclarationBody;
  kind: "global" | "module" | "namespace";
  modifiers: Modifier[] | null;
}
export type TSModuleDeclarationName = IdentifierName | StringLiteral;
export type TSModuleDeclarationBody = TSModuleDeclaration | TSModuleBlock;
export interface TSModuleBlock extends Span {
  type: "TSModuleBlock";
  body: Statement[];
}
export interface TSImportEqualsDeclaration extends Span {
  type: "TSImportEqualsDeclaration";
  id: BindingIdentifier;
  moduleReference: TSModuleReference;
  isExport: boolean;
  importKind: "value" | "type";
}
export type TSModuleReference = TSTypeName | TSExternalModuleReference;
export interface TSExternalModuleReference extends Span {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
}
export interface ExportSpecifier extends Span {
  type: "ExportSpecifier";
  local: ModuleExportName;
  exported: ModuleExportName;
  exportKind: "value" | "type";
}
export interface TSExportAssignment extends Span {
  type: "TSExportAssignment";
  expression: Expression;
}
export interface TSNamespaceExportDeclaration extends Span {
  type: "TSNamespaceExportDeclaration";
  id: IdentifierName;
}
export type Node =
  | Program
  | Directive
  | StringLiteral
  | Hashbang
  | BlockStatement
  | BreakStatement
  | LabelIdentifier
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | BooleanLiteral
  | NullLiteral
  | NumericLiteral
  | BigintLiteral
  | RegExpLiteral
  | TemplateLiteral
  | TemplateElement
  | IdentifierReference
  | MetaProperty
  | IdentifierName
  | Super
  | ArrayExpression
  | SpreadElement
  | ArrowFunctionExpression
  | FormalParameters
  | FormalParameter
  | BindingPattern
  | BindingIdentifier
  | ObjectPattern
  | BindingProperty
  | PrivateIdentifier
  | BindingRestElement
  | ArrayPattern
  | AssignmentPattern
  | TSTypeAnnotation
  | TSAnyKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSThisType
  | TSUndefinedKeyword
  | TSUnknownKeyword
  | TSVoidKeyword
  | TSArrayType
  | TSConditionalType
  | TSConstructorType
  | TSTypeParameterDeclaration
  | TSTypeParameter
  | TSFunctionType
  | TSThisParameter
  | TSImportType
  | TSQualifiedName
  | TSImportAttributes
  | TSImportAttribute
  | TSTypeParameterInstantiation
  | TSIndexedAccessType
  | TSInferType
  | TSIntersectionType
  | TSLiteralType
  | UnaryExpression
  | TSMappedType
  | TSTemplateLiteralType
  | TSTupleType
  | TSOptionalType
  | TSRestType
  | TSNamedTupleMember
  | TSTypeLiteral
  | TSIndexSignature
  | TSIndexSignatureName
  | TSPropertySignature
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSMethodSignature
  | TSTypeOperator
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUnionType
  | JSDocNullableType
  | JSDocUnknownType
  | Decorator
  | FunctionBody
  | AssignmentExpression
  | ComputedMemberExpression
  | StaticMemberExpression
  | PrivateFieldExpression
  | TSAsExpression
  | TSSatisfiesExpression
  | TSNonNullExpression
  | TSTypeAssertion
  | ArrayAssignmentTarget
  | ObjectAssignmentTarget
  | AssignmentTargetPropertyIdentifier
  | AssignmentTargetPropertyProperty
  | AssignmentTargetWithDefault
  | AwaitExpression
  | BinaryExpression
  | CallExpression
  | ChainExpression
  | Class
  | ClassBody
  | StaticBlock
  | MethodDefinition
  | Function
  | Modifier
  | PropertyDefinition
  | AccessorProperty
  | TSClassImplements
  | ConditionalExpression
  | ImportExpression
  | LogicalExpression
  | NewExpression
  | ObjectExpression
  | ObjectProperty
  | ParenthesizedExpression
  | SequenceExpression
  | TaggedTemplateExpression
  | ThisExpression
  | UpdateExpression
  | YieldExpression
  | PrivateInExpression
  | JSXElement
  | JSXOpeningElement
  | JSXIdentifier
  | JSXNamespacedName
  | JSXMemberExpression
  | JSXAttribute
  | JSXExpressionContainer
  | JSXEmptyExpression
  | JSXFragment
  | JSXOpeningFragment
  | JSXClosingFragment
  | JSXText
  | JSXSpreadChild
  | JSXSpreadAttribute
  | JSXClosingElement
  | TSInstantiationExpression
  | EmptyStatement
  | ExpressionStatement
  | ForInStatement
  | VariableDeclaration
  | VariableDeclarator
  | UsingDeclaration
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
  | ImportDeclaration
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | WithClause
  | ImportAttribute
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | TSInterfaceDeclaration
  | TSInterfaceBody
  | TSInterfaceHeritage
  | TSEnumDeclaration
  | TSEnumMember
  | ExportNamedDeclaration
  | TSTypeAliasDeclaration
  | TSModuleDeclaration
  | TSModuleBlock
  | TSImportEqualsDeclaration
  | TSExternalModuleReference
  | ExportSpecifier
  | TSExportAssignment
  | TSNamespaceExportDeclaration;
