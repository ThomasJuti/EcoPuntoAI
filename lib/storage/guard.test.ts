import assert from "node:assert/strict";
import { test } from "node:test";
import { assertAuthenticated, HttpError, objectPath } from "./guard";

test("unauthenticated upload is denied with 401", () => {
  assert.throws(() => assertAuthenticated(null), (err: unknown) => {
    assert.ok(err instanceof HttpError);
    assert.equal(err.status, 401);
    return true;
  });
});

test("object path is {user_id}/{id}", () => {
  assert.equal(objectPath("user-1", "photo-2"), "user-1/photo-2");
});
