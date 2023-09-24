/**
 * @generated SignedSource<<0ca2698c8b760d9e753c064d0c93d936>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CourseInfoQuery$variables = {
  courseId: string;
};
export type CourseInfoQuery$data = {
  readonly viewer: {
    readonly availableOrganizations: {
      readonly names: ReadonlyArray<string>;
    };
    readonly course: {
      readonly assignments: ReadonlyArray<{
        readonly id: string;
        readonly isGroup: boolean | null;
        readonly nonExistentSubmissions: ReadonlyArray<{
          readonly id: string;
        }>;
        readonly submissions: ReadonlyArray<{
          readonly assignmentId: string;
          readonly id: string;
          readonly pullRequestUrl: string;
          readonly review: {
            readonly grade: number | null;
            readonly id: string;
            readonly revisionRequested: boolean | null;
          } | null;
          readonly submittedAt: string;
        }>;
        readonly title: string | null;
      }>;
      readonly id: string;
      readonly name: string;
      readonly organization: string | null;
      readonly studentsCount: number;
      readonly subject: {
        readonly id: string;
        readonly name: string;
      };
      readonly teachersCount: number;
    } | null;
    readonly id: string;
    readonly name: string;
  } | null;
};
export type CourseInfoQuery = {
  response: CourseInfoQuery$data;
  variables: CourseInfoQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "courseId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "onlyReviewerSubmissions",
    "value": false
  }
],
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ViewerType",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "courseId"
          }
        ],
        "concreteType": "CourseType",
        "kind": "LinkedField",
        "name": "course",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "organization",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "studentsCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "teachersCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "AssignmentType",
            "kind": "LinkedField",
            "name": "assignments",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "title",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isGroup",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "SubmissionType",
                "kind": "LinkedField",
                "name": "submissions",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "submittedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "pullRequestUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "assignmentId",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "InternalReviewType",
                    "kind": "LinkedField",
                    "name": "review",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "revisionRequested",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "grade",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "submissions(onlyReviewerSubmissions:false)"
              },
              {
                "alias": null,
                "args": (v3/*: any*/),
                "concreteType": "NonExistentSubmissionType",
                "kind": "LinkedField",
                "name": "nonExistentSubmissions",
                "plural": true,
                "selections": [
                  (v1/*: any*/)
                ],
                "storageKey": "nonExistentSubmissions(onlyReviewerSubmissions:false)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "SubjectType",
            "kind": "LinkedField",
            "name": "subject",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ViewerOrganizations",
        "kind": "LinkedField",
        "name": "availableOrganizations",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "names",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CourseInfoQuery",
    "selections": (v4/*: any*/),
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CourseInfoQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "7cbada083f07cec34b4fca94fe24c9a1",
    "id": null,
    "metadata": {},
    "name": "CourseInfoQuery",
    "operationKind": "query",
    "text": "query CourseInfoQuery(\n  $courseId: ID!\n) {\n  viewer {\n    id\n    name\n    course(id: $courseId) {\n      id\n      name\n      organization\n      studentsCount\n      teachersCount\n      assignments {\n        id\n        title\n        isGroup\n        submissions(onlyReviewerSubmissions: false) {\n          id\n          submittedAt\n          pullRequestUrl\n          assignmentId\n          review {\n            id\n            revisionRequested\n            grade\n          }\n        }\n        nonExistentSubmissions(onlyReviewerSubmissions: false) {\n          id\n        }\n      }\n      subject {\n        id\n        name\n      }\n    }\n    availableOrganizations {\n      names\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "97c1e03d3839383a49f400b4c3d8aef6";

export default node;
