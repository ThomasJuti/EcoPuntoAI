import assert from "node:assert/strict";
import { test } from "node:test";
import { applyConditions } from "./conditions";
import { deviceFor } from "./device-types";

test("phone ficha includes wipe and SIM flags", () => {
  const phone = deviceFor("phones");
  assert.equal(phone.wipeData, true);
  assert.equal(phone.removeSim, true);
  assert.equal(phone.canReuse, true);
  assert.equal(phone.canRepair, true);
  assert.equal(phone.canDonate, true);
  assert.equal(phone.canRecycle, true);
});

test("battery and cell tell the user not to use household trash", () => {
  for (const id of ["batteries", "cells"] as const) {
    const text = deviceFor(id).donts.join(" ");
    assert.match(text, /basura convencional/);
    assert.equal(deviceFor(id).specialHandling, true);
  }
});

test("skipping conditions keeps default catalog copy", () => {
  const phone = deviceFor("phones");
  assert.deepEqual(applyConditions(phone, {}), phone);
});

test("swollen battery tightens storage and forbids puncture", () => {
  const phone = deviceFor("phones");
  const next = applyConditions(phone, { swollenBattery: true });
  assert.notEqual(next.storage, phone.storage);
  assert.match(next.donts.join(" "), /pinches/);
  assert.equal(next.canDonate, false);
  assert.equal(next.specialHandling, true);
  assert.equal(phone.canDonate, true);
});

test("English device-types keeps the same kind ids", () => {
  assert.equal(deviceFor("phones", "en").id, "phones");
  assert.match(deviceFor("unknown", "en").label, /know/i);
});
