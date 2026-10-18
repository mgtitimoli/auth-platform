import type {StandardSchemaV1} from "@standard-schema/spec";
import {HTTPException} from "hono/http-exception";
import {validator} from "hono-openapi";

import type {ValidationTargetName} from "./types";

type IssuePath = NonNullable<StandardSchemaV1.Issue["path"]>;

type IssuePathSegment = IssuePath[number];

const issuePathSegmentToString = (issuePathSegment: IssuePathSegment) =>
  typeof issuePathSegment === "object"
    ? issuePathSegment.key
    : issuePathSegment;

const issuePathToString = (issuePaths: IssuePath) =>
  issuePaths.map(issuePathSegmentToString).join(".");

const issueToString = (issue: StandardSchemaV1.Issue) => {
  const issuePaths = issue.path ?? [];

  return (
    issue.message +
    (issuePaths.length === 0 ? "" : " in " + issuePathToString(issuePaths))
  );
};

const validate = <
  TSchema extends StandardSchemaV1,
  TValidationTargetName extends ValidationTargetName
>(
  target: TValidationTargetName,
  schema: TSchema
) =>
  validator(target, schema, result => {
    if (result.success) {
      return;
    }

    const issues = result.error;

    const message = issues.map(issueToString).join(" | ");

    throw new HTTPException(400, {cause: issues, message});
  });

export {validate};
