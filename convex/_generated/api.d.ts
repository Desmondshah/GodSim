/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as advancedGameEngine from "../advancedGameEngine.js";
import type * as advancedSystemsTest from "../advancedSystemsTest.js";
import type * as aiPoweredComponents from "../aiPoweredComponents.js";
import type * as auth from "../auth.js";
import type * as gameEngine from "../gameEngine.js";
import type * as gameEngine_backup from "../gameEngine_backup.js";
import type * as gameEngine_new from "../gameEngine_new.js";
import type * as http from "../http.js";
import type * as router from "../router.js";
import type * as test from "../test.js";
import type * as ultraAdvancedEngine from "../ultraAdvancedEngine.js";
import type * as worldSetup from "../worldSetup.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  advancedGameEngine: typeof advancedGameEngine;
  advancedSystemsTest: typeof advancedSystemsTest;
  aiPoweredComponents: typeof aiPoweredComponents;
  auth: typeof auth;
  gameEngine: typeof gameEngine;
  gameEngine_backup: typeof gameEngine_backup;
  gameEngine_new: typeof gameEngine_new;
  http: typeof http;
  router: typeof router;
  test: typeof test;
  ultraAdvancedEngine: typeof ultraAdvancedEngine;
  worldSetup: typeof worldSetup;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
