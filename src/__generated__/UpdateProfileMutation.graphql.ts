/**
 * @generated SignedSource<<dc6837c6e7f33e80bc19a7dced78ca44>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateProfileMutation$variables = {
  file: string;
  githubId: string;
  id: string;
  lastName: string;
  name: string;
  notificationEmail: string;
};
export type UpdateProfileMutation$data = {
  readonly updateUser: {
    readonly file: string | null;
    readonly githubId: string | null;
    readonly id: string | null;
    readonly lastName: string | null;
    readonly name: string | null;
    readonly notificationEmail: string | null;
  } | null;
};
export type UpdateProfileMutation = {
  response: UpdateProfileMutation$data;
  variables: UpdateProfileMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "file"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "githubId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "lastName"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "notificationEmail"
},
v6 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "file",
        "variableName": "file"
      },
      {
        "kind": "Variable",
        "name": "githubId",
        "variableName": "githubId"
      },
      {
        "kind": "Variable",
        "name": "lastName",
        "variableName": "lastName"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "notificationEmail",
        "variableName": "notificationEmail"
      },
      {
        "kind": "Variable",
        "name": "userId",
        "variableName": "id"
      }
    ],
    "concreteType": "UserType",
    "kind": "LinkedField",
    "name": "updateUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
        "name": "lastName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "file",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "githubId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "notificationEmail",
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateProfileMutation",
    "selections": (v6/*: any*/),
    "type": "RootMutationType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdateProfileMutation",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "42dde4c5191acf47a75b381d3f0435f7",
    "id": null,
    "metadata": {},
    "name": "UpdateProfileMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateProfileMutation(\n  $id: String!\n  $name: String!\n  $lastName: String!\n  $file: String!\n  $githubId: String!\n  $notificationEmail: String!\n) {\n  updateUser(userId: $id, name: $name, lastName: $lastName, file: $file, githubId: $githubId, notificationEmail: $notificationEmail) {\n    id\n    name\n    lastName\n    file\n    githubId\n    notificationEmail\n  }\n}\n"
  }
};
})();

(node as any).hash = "b6406cd3b817969a895ab6f58b14aafb";

export default node;