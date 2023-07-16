/**
 * @generated SignedSource<<5ea79493f6741d522a681fdad0b9fa1b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type JoinGroupMutation$variables = {
  assignmentId: string;
  courseId: string;
  groupId: string;
};
export type JoinGroupMutation$data = {
  readonly joinGroup: {
    readonly assignmentId: string;
    readonly group: {
      readonly courseId: string;
      readonly id: string;
      readonly name: string | null;
    };
    readonly id: string;
  };
};
export type JoinGroupMutation = {
  response: JoinGroupMutation$data;
  variables: JoinGroupMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "assignmentId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "courseId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "groupId"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "assignmentId",
        "variableName": "assignmentId"
      },
      {
        "kind": "Variable",
        "name": "courseId",
        "variableName": "courseId"
      },
      {
        "kind": "Variable",
        "name": "groupId",
        "variableName": "groupId"
      }
    ],
    "concreteType": "InternalGroupParticipantType",
    "kind": "LinkedField",
    "name": "joinGroup",
    "plural": false,
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "InternalGroupType",
        "kind": "LinkedField",
        "name": "group",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "courseId",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "assignmentId",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "JoinGroupMutation",
    "selections": (v4/*: any*/),
    "type": "RootMutationType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "JoinGroupMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "1d84aa1069f17655ce09aaf0c602930e",
    "id": null,
    "metadata": {},
    "name": "JoinGroupMutation",
    "operationKind": "mutation",
    "text": "mutation JoinGroupMutation(\n  $groupId: ID!\n  $courseId: ID!\n  $assignmentId: ID!\n) {\n  joinGroup(groupId: $groupId, courseId: $courseId, assignmentId: $assignmentId) {\n    id\n    group {\n      id\n      name\n      courseId\n    }\n    assignmentId\n  }\n}\n"
  }
};
})();

(node as any).hash = "07c5ee043d61b88b56e6756cf5fe267c";

export default node;