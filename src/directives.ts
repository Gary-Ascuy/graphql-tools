import {
  GraphQLEnumType,
  getNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLField,
  GraphQLNamedType,
  GraphQLArgument,
  GraphQLEnumValue,
  GraphQLInputObjectType,
} from 'graphql';

import {
  // getArgumentValues,
} from 'graphql/execution/values';

export function visitDirectives(
  schema: GraphQLSchema,
  visitor: (
    directiveName: string,
    directiveArgs: any[],
    type: any,
  ) => any,
) {
  function walk(
    type: GraphQLSchema
        | GraphQLNamedType
        | GraphQLField<any, any>
        | GraphQLArgument
        | GraphQLEnumValue
  ) {
    if (type.astNode) {
      type.astNode.directives.forEach(directive => {
        visitor(
          directive.name.value,
          [], // getArgumentValues(directive),
          type,
        );
      });
    }

    if (type instanceof GraphQLSchema) {
      const typeMap = schema.getTypeMap();
      Object.keys(typeMap).forEach(typeName => {
        const namedType = typeMap[typeName];
        if (getNamedType(namedType).name.startsWith('__')) {
          return;
        }
        walk(namedType);
      });

    } else if (type instanceof GraphQLObjectType) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        walk(field);
        if (field && field.args) {
          field.args.forEach(walk);
        }
      });

    } else if (type instanceof GraphQLInputObjectType) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        walk(fields[fieldName]);
      });

    } else if (type instanceof GraphQLEnumType) {
      type.getValues().forEach(walk);
    }

    return type;
  }

  walk(schema);
}
