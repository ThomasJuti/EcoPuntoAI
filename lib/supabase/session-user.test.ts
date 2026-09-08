import assert from "node:assert/strict";
import { test } from "node:test";
import {
  accessTokenFromCookieValue,
  combineAuthTokenCookies,
  isAuthTokenCookie,
  sessionUserFromAccessToken,
} from "./session-user";

function jwtWith(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `hdr.${body}.sig`;
}

test("sessionUserFromAccessToken reads sub, email and Google avatar", () => {
  const token = jwtWith({
    sub: "user-1",
    email: "a@b.co",
    exp: Math.floor(Date.now() / 1000) + 3600,
    user_metadata: {
      avatar_url: "https://lh3.googleusercontent.com/a/x",
      full_name: "Ana",
    },
  });
  const user = sessionUserFromAccessToken(token);
  assert.equal(user?.id, "user-1");
  assert.equal(user?.email, "a@b.co");
  assert.equal(user?.name, "Ana");
  assert.equal(user?.avatarUrl, "https://lh3.googleusercontent.com/a/x");
});

test("sessionUserFromAccessToken rejects expired tokens", () => {
  const token = jwtWith({
    sub: "user-1",
    exp: Math.floor(Date.now() / 1000) - 10,
  });
  assert.equal(sessionUserFromAccessToken(token), null);
});

test("accessTokenFromCookieValue parses json and base64- cookies", () => {
  const token = jwtWith({ sub: "user-1", exp: Math.floor(Date.now() / 1000) + 60 });
  const json = JSON.stringify({ access_token: token });
  assert.equal(accessTokenFromCookieValue(json), token);
  const wrapped = `base64-${Buffer.from(json).toString("base64")}`;
  assert.equal(accessTokenFromCookieValue(wrapped), token);
});

test("isAuthTokenCookie ignores the PKCE verifier", () => {
  assert.equal(isAuthTokenCookie("sb-abc-auth-token"), true);
  assert.equal(isAuthTokenCookie("sb-abc-auth-token.0"), true);
  assert.equal(isAuthTokenCookie("sb-abc-auth-token-code-verifier"), false);
});

test("combineAuthTokenCookies does not mix in the verifier and joins chunks in order", () => {
  const token = jwtWith({ sub: "user-1", exp: Math.floor(Date.now() / 1000) + 60 });
  const json = JSON.stringify({ access_token: token });
  const combined = combineAuthTokenCookies([
    { name: "sb-x-auth-token-code-verifier", value: "pkce" },
    { name: "sb-x-auth-token.1", value: json.slice(10) },
    { name: "sb-x-auth-token.0", value: json.slice(0, 10) },
  ]);
  assert.equal(combined, json);
  assert.equal(accessTokenFromCookieValue(combined ?? ""), token);
});
