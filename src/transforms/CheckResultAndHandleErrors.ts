import { GraphQLResolveInfo } from 'graphql';
import { checkResultAndHandleErrors } from '../stitching/errors';
import { Transform } from './index';

export default function CheckResultAndHandleErrors(
  info: GraphQLResolveInfo,
  fieldName?: string,
): Transform {
  return {
    transformResult(result: any): any {
      return checkResultAndHandleErrors(result, info, fieldName);
    },
  };
}
