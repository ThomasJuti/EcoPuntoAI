import assert from "node:assert/strict";
import { test } from "node:test";
import { localeFromAcceptLanguage } from "./locale";

test("empty Accept-Language defaults to Spanish", () => {
  assert.equal(localeFromAcceptLanguage(null), "es");
  assert.equal(localeFromAcceptLanguage(""), "es");
});

test("English device language wins", () => {
  assert.equal(localeFromAcceptLanguage("en-US,en;q=0.9"), "en");
  assert.equal(localeFromAcceptLanguage("en"), "en");
});

test("Spanish device language wins", () => {
  assert.equal(localeFromAcceptLanguage("es-CO,es;q=0.9,en;q=0.8"), "es");
});

test("q-values pick the preferred tag", () => {
  assert.equal(localeFromAcceptLanguage("es;q=0.4,en-GB;q=0.8"), "en");
});

test("unknown languages fall back to Spanish", () => {
  assert.equal(localeFromAcceptLanguage("fr-FR,de;q=0.8"), "es");
});
