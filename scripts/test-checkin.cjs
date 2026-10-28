const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const path = require('node:path');
const code = fs.readFileSync(path.resolve(__dirname, '../apps-script/Code.gs'), 'utf8');
let rows, writes, released, allowLock, customRule, formula;
const properties = new Map([['CHECKIN_ENABLED', 'true']]);
const lock = {tryLock: () => allowLock, waitLock: () => {}, releaseLock: () => released++};
const sheet = {
  getSheetId: () => 533590447,
  getLastRow: () => rows.length,
  getRange: (row, col, height) => height !== undefined ? {getValues: () => rows} : {
    getValue: () => rows[row - 1][0],
    getFormula: () => formula,
    getDataValidation: () => ({getCriteriaType: () => 'CHECKBOX', getCriteriaValues: () => customRule}),
    setValue: value => {writes.push([row, col, value]); rows[row - 1][0] = value;}
  }
};
const context = vm.createContext({
  console, Date,
  LockService: {getScriptLock: () => lock},
  SpreadsheetApp: {openById: () => ({getSheets: () => [sheet]}), flush: () => {}, DataValidationCriteria: {CHECKBOX: 'CHECKBOX'}},
  PropertiesService: {getScriptProperties: () => ({getProperty: key => properties.get(key), setProperty: (key, value) => properties.set(key, value)})},
  Utilities: {getUuid: () => crypto.randomUUID(), computeHmacSha256Signature: (message, secret) => crypto.createHmac('sha256', secret).update(message).digest(), base64EncodeWebSafe: value => Buffer.from(value).toString('base64url')}
});
vm.runInContext(code, context);
let tests = 0;
function test(name, data, expected, expectedWrites, setup) {
  rows = data.map(row => [...row]); writes = []; released = 0; allowLock = true; customRule = []; formula = '';
  if (setup) setup();
  const token = context.makeToken_();
  const result = context.checkIn({owner: ' テストＡ ', token});
  assert.equal(result.status, expected, name);
  assert.deepEqual(writes, expectedWrites, name);
  if (allowLock) assert.ok(released > 0, name + ' releases lock');
  tests++;
}
test('normalized owner checks only matching row', [[false, '他の人'], [false, 'テストA']], 'success', [[2, 1, true]]);
test('already checked does not write', [[true, 'テストA']], 'already', []);
test('unregistered owner does not write', [[false, '別名']], 'not_found', []);
test('duplicate owner never writes even if one checked', [[true, 'テストA'], [false, 'テストＡ']], 'ambiguous', []);
test('custom checkbox refused', [[false, 'テストA']], 'configuration', [], () => customRule = ['受付済み', false]);
test('explicit boolean checkbox accepted', [[false, 'テストA']], 'success', [[1, 1, true]], () => customRule = [true, false]);
test('formula cell protected', [[false, 'テストA']], 'configuration', [], () => formula = '=FALSE()');
test('contention does not write', [[false, 'テストA']], 'busy', [], () => allowLock = false);
const validToken = context.makeToken_();
assert.equal(context.checkIn({owner: ' ', token: validToken}).status, 'invalid'); tests++;
assert.equal(context.checkIn({owner: 'テストA', token: 'forged'}).status, 'expired'); tests++;
const oldBody = (Date.now() - 7 * 60 * 60 * 1000) + '-old';
assert.equal(context.checkIn({owner: 'テストA', token: oldBody + '.' + context.sign_(oldBody)}).status, 'expired'); tests++;
const html = vm.runInContext('PAGE_HTML_', context);
assert.equal((html.match(/<input\b/g) || []).length, 1);
assert.ok(!html.includes('id="lovot"'));
new vm.Script(html.match(/<script>([\s\S]*)<\/script>/)[1]); tests++;
properties.set('CHECKIN_ENABLED', 'false');
writes = [];
assert.equal(context.checkIn({owner:'テストA',token:validToken}).status, 'closed');
assert.deepEqual(writes, []); tests++;
console.log(`${tests} checks passed. Production sheet untouched.`);
