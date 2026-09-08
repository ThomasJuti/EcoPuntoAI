import assert from "node:assert/strict";
import { test } from "node:test";
import { assertAdmin, assertAuthenticated, HttpError, objectPath } from "./guard";

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

test("non-admin Google user cannot mutate points (403)", () => {
  assert.throws(() => assertAdmin(false), (err: unknown) => {
    assert.ok(err instanceof HttpError);
    assert.equal(err.status, 403);
    return true;
  });
});
