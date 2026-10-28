/** 小さな森のお茶会 NFCチェックイン。シート1のA列のみを更新します。 */
const SETTINGS = Object.freeze({
  spreadsheetId: '1JRhvQBhPYPCVju4ySm1BhjqXIdxaF52sRlVjzUs-TPo',
  sheetId: 533590447,
  firstDataRow: 1,
  tokenLifetimeMs: 6 * 60 * 60 * 1000
});

function doGet() {
  const html = isOpen_()
    ? PAGE_HTML_.replace('__PAGE_TOKEN__', makeToken_())
      .replace('__OWNER_OPTIONS__', () => ownerOptionsHtml_(loadOwnerNames_()))
    : CLOSED_HTML_;
  return HtmlService.createHtmlOutput(html)
    .setTitle('小さな森のお茶会｜チェックイン')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** 公開する書き込み窓口。本人入力と照合できた1行だけを受付済みにします。 */
function checkIn(payload) {
  if (!isOpen_()) return closedResponse_();
  if (!payload || !validToken_(payload.token)) {
    return {status: 'expired', message: 'ページの有効期限が切れました。再読み込みしてお試しください。'};
  }
  if (typeof payload.owner !== 'string' || payload.owner.length > 100 ||
      !normalizeName_(payload.owner)) {
    return {status: 'invalid', message: 'オーナー名を選択してください。'};
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return {status: 'busy', message: 'ただいま受付が混み合っています。少し待ってからもう一度送信してください。'};
  }
  try {
    if (!isOpen_()) return closedResponse_();
    const sheet = getCheckinSheet_();
    const count = sheet.getLastRow() - SETTINGS.firstDataRow + 1;
    const rows = count > 0 ? sheet.getRange(SETTINGS.firstDataRow, 1, count, 2).getValues() : [];
    const matches = findMatches_(rows, payload.owner);
    if (matches.length === 0 || excludedOwnerKeys_().has(normalizeName_(payload.owner))) {
      return {status: 'not_found', message: 'お申し込み内容と一致しませんでした。申し込み時のオーナー名をご確認ください。分からない場合は受付スタッフにお声がけください。'};
    }
    if (matches.length !== 1) {
      return {status: 'ambiguous', message: '同じお名前の登録が複数あります。受付スタッフにお声がけください。'};
    }
    const match = matches[0];
    const cell = sheet.getRange(SETTINGS.firstDataRow + match, 1);
    // スクリプトでの同時送信を直列化し、既存チェックも尊重します。
    const checked = cell.getValue();
    if (checked === true) {
      return {status: 'already', message: 'すでにチェックイン済みです。この画面を受付スタッフにお見せください。'};
    }
    const rule = cell.getDataValidation();
    if (checked !== false || cell.getFormula() || !rule ||
        rule.getCriteriaType() !== SpreadsheetApp.DataValidationCriteria.CHECKBOX ||
        !standardCheckbox_(rule.getCriteriaValues())) {
      // 標準のTRUE/FALSEチェックボックス以外は書き換えません。
      return {status: 'configuration', message: '受付の設定確認が必要です。受付スタッフにお声がけください。'};
    }
    cell.setValue(true);
    SpreadsheetApp.flush();
    return {status: 'success', message: 'チェックインが完了しました。この画面を受付スタッフにお見せください。'};
  } catch (error) {
    // 内部情報やシートの内容を参加者の画面に返しません。
    console.error('Check-in failed: ' + (error && error.name ? error.name : 'Error'));
    return {status: 'error', message: '受付処理を確認できませんでした。もう一度送信してください。続く場合は受付スタッフにお声がけください。'};
  } finally {
    lock.releaseLock();
  }
}

function getCheckinSheet_() {
  const sheet = SpreadsheetApp.openById(SETTINGS.spreadsheetId).getSheets()
    .find(s => s.getSheetId() === SETTINGS.sheetId);
  if (!sheet) throw new Error('Configured sheet not found');
  return sheet;
}

function loadOwnerNames_() {
  const sheet = getCheckinSheet_();
  const count = sheet.getLastRow() - SETTINGS.firstDataRow + 1;
  if (count <= 0) return [];
  const seen = new Set();
  const excluded = excludedOwnerKeys_();
  return sheet.getRange(SETTINGS.firstDataRow, 2, count, 1).getValues()
    .map(row => String(row[0] == null ? '' : row[0]).trim())
    .filter(name => {
      const key = normalizeName_(name);
      if (!key || excluded.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function excludedOwnerKeys_() {
  const configured = PropertiesService.getScriptProperties().getProperty('CHECKIN_EXCLUDED_OWNERS');
  const names = configured ? JSON.parse(configured) : [];
  if (!Array.isArray(names) || names.some(name => typeof name !== 'string')) {
    throw new Error('Invalid excluded owner configuration');
  }
  return new Set(names.map(normalizeName_));
}

function escapeHtml_(value) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  return String(value).replace(/[&<>"']/g, char => entities[char]);
}

function ownerOptionsHtml_(names) {
  return names.map(name => '<option value="' + escapeHtml_(name) + '">' + escapeHtml_(name) + '</option>').join('');
}

function isOpen_() {
  return PropertiesService.getScriptProperties().getProperty('CHECKIN_ENABLED') === 'true';
}

function closedResponse_() {
  return {status: 'closed', message: '受付の準備中です。受付スタッフにお声がけください。'};
}

function standardCheckbox_(values) {
  return values.length === 0 ||
    (values.length === 1 && values[0] === true) ||
    (values.length === 2 && values[0] === true && values[1] === false);
}

function normalizeName_(value) {
  return String(value == null ? '' : value).normalize('NFKC').replace(/[\s\u200B\uFEFF]+/g, '').toLowerCase();
}

function findMatches_(rows, owner) {
  const ownerKey = normalizeName_(owner);
  return rows.reduce((indices, row, index) => {
    if (normalizeName_(row[1]) === ownerKey) indices.push(index);
    return indices;
  }, []);
}

function getSecret_() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('CHECKIN_PAGE_SECRET');
  if (secret) return secret;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    secret = props.getProperty('CHECKIN_PAGE_SECRET');
    if (!secret) {
      secret = Utilities.getUuid() + Utilities.getUuid();
      props.setProperty('CHECKIN_PAGE_SECRET', secret);
    }
    return secret;
  } finally {
    lock.releaseLock();
  }
}

function sign_(message) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(message, getSecret_()));
}

function makeToken_() {
  const body = Date.now() + '-' + Utilities.getUuid();
  return body + '.' + sign_(body);
}

function validToken_(token) {
  if (typeof token !== 'string' || token.length > 250) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const issued = Number(parts[0].split('-')[0]);
  const age = Date.now() - issued;
  return Number.isFinite(issued) && age >= 0 && age <= SETTINGS.tokenLifetimeMs && parts[1] === sign_(parts[0]);
}

const PAGE_HTML_ = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<style>
:root{font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;color:#243f33;background:#f4f6ef;font-synthesis:none}
*{box-sizing:border-box}body{margin:0;padding:32px 20px 24px}main{max-width:440px;margin:auto}.event{font-size:12px;letter-spacing:.13em;text-align:center;color:#667b69;margin:0 0 24px}.mark{display:block;width:62px;height:62px;margin:0 auto 18px;color:#34634b}h1{font-size:27px;letter-spacing:.04em;text-align:center;margin:0 0 12px;line-height:1.5}.intro{font-size:14px;line-height:1.9;text-align:center;color:#607063;margin:0 0 28px}.card{background:white;border:1px solid #dfe6db;border-radius:22px;padding:26px 23px;box-shadow:0 8px 30px #244f3310}label{font-size:14px;font-weight:600;display:block;margin-bottom:9px}.field+.field{margin-top:24px}.select-wrap{position:relative}.select-wrap:after{content:"";position:absolute;right:18px;top:50%;width:7px;height:7px;border-right:1.5px solid #607063;border-bottom:1.5px solid #607063;transform:translateY(-70%) rotate(45deg);pointer-events:none}select{appearance:none;-webkit-appearance:none;width:100%;border:1px solid #cbd6c9;border-radius:11px;background:#fff;padding:15px 44px 15px 13px;font:inherit;font-size:16px;color:#243f33;min-height:54px}select:focus{outline:3px solid #c6d9b3;border-color:#426c4b}.hint{font-size:12px;color:#718071;line-height:1.7;margin:8px 0 0}button{font:inherit;width:100%;min-height:56px;border:0;border-radius:12px;background:#305c43;color:white;font-weight:600;cursor:pointer;padding:15px;margin-top:28px}button:focus-visible{outline:3px solid #a9c78c;outline-offset:3px}button:disabled{opacity:.65;cursor:wait}.note{font-size:12px;color:#718071;text-align:center;line-height:1.9;margin:22px 0 0}.result{padding:22px 18px;border-radius:14px;border:1px solid #b3cbb0;background:#f0f6e9;margin-top:24px;font-size:14px;line-height:1.9;overflow-wrap:anywhere}.result.error{background:#fff4ec;border-color:#e6c3a6;color:#71472e}.result h2{font-size:20px;margin:0 0 8px}.result p{margin:0}.result .names{font-weight:600;margin-top:12px}.secondary{background:#eaf0e4;color:#305c43;margin-top:20px;min-height:48px}.footer{text-align:center;margin:27px 0 0;font-size:11px;color:#80907b;letter-spacing:.05em}[hidden]{display:none!important}@media(max-width:360px){body{padding:25px 14px}.card{padding:24px 19px}h1{font-size:24px}}
</style>
</head>
<body><main>
<p class="event">小さな森のお茶会 · LOVOTオフ会</p>
<svg class="mark" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 54V29M32 37C17 37 12 25 13 12c14-1 23 5 23 17M33 43c0-15 8-23 21-24 2 14-5 26-21 24Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m21 22 11 15m13-7-12 13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
<h1>ようこそ、お茶会へ。</h1>
<p class="intro">お申し込み時のお名前を選んで<br>チェックインをお願いします。</p>
<section class="card" aria-label="チェックイン">
<form id="checkin-form">
<div class="field"><label for="owner">オーナーのお名前</label><div class="select-wrap"><select id="owner" name="owner" required><option value="" disabled selected>お名前を選んでください</option>__OWNER_OPTIONS__</select></div><p class="hint">ご自身のオーナー名を選択してください。</p></div>
<button id="submit-button" type="submit">チェックインする</button>
</form>
<div id="result" class="result" role="status" aria-live="polite" tabindex="-1" hidden><h2 id="result-title"></h2><p id="result-message"></p><p id="result-names" class="names" hidden></p></div>
<button id="next-button" type="button" class="secondary" hidden>別のオーナーをチェックイン</button>
</section>
<p class="note">お名前が見つからないときや操作にお困りのときは<br>受付スタッフにお声がけください。</p>
<p class="footer">小さな森のお茶会</p>
</main>
<script>
(function(){
'use strict';
var token='__PAGE_TOKEN__';
var form=document.getElementById('checkin-form');
var submit=document.getElementById('submit-button');
var next=document.getElementById('next-button');
var result=document.getElementById('result');
var title=document.getElementById('result-title');
var message=document.getElementById('result-message');
var names=document.getElementById('result-names');
var owner=document.getElementById('owner');
var pending=false;
function show(data,submittedOwner){
  pending=false;submit.disabled=false;submit.textContent='チェックインする';
  var ok=data.status==='success'||data.status==='already';
  result.className='result'+(ok?'':' error');
  title.textContent=data.status==='success'?'チェックイン完了':data.status==='already'?'チェックイン済みです':'受付内容をご確認ください';
  message.textContent=data.message;
  names.hidden=!ok;names.textContent=ok?submittedOwner+' さん':'';
  result.hidden=false;form.hidden=ok;next.hidden=!ok;result.focus();
}
form.addEventListener('submit',function(event){
  event.preventDefault();if(pending||!form.reportValidity())return;
  if(!owner.value.trim()){
    show({status:'invalid',message:'オーナー名を選択してください。'},'');return;
  }
  if(!window.google||!google.script||!google.script.run){
    show({status:'preview',message:'これは画面プレビューです。公開後の受付ページからご利用ください。'},'');return;
  }
  pending=true;submit.disabled=true;submit.textContent='受付を確認しています…';result.hidden=true;
  var submittedOwner=owner.value.trim();
  google.script.run.withSuccessHandler(function(data){show(data,submittedOwner);})
    .withFailureHandler(function(){show({status:'error',message:'通信を確認できませんでした。電波のよい場所でもう一度送信してください。'},'');})
    .checkIn({owner:submittedOwner,token:token});
});
next.addEventListener('click',function(){form.hidden=false;result.hidden=true;next.hidden=true;owner.value='';owner.focus();});
})();
</script>
</body></html>`;

const CLOSED_HTML_ = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#f4f6ef;color:#243f33;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN",sans-serif;text-align:center;padding:70px 24px;line-height:2}main{max-width:520px;margin:auto}svg{width:64px;height:64px;stroke:#34634b;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}h1{font-size:27px;line-height:1.6;margin:14px 0 20px}p{font-size:14px;color:#607063}.event{font-size:12px;letter-spacing:.1em;margin-top:22px}
</style></head><body><main><svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 54V29M32 37C17 37 12 25 13 12c14-1 23 5 23 17M33 43c0-15 8-23 21-24 2 14-5 26-21 24Z"/><path d="m21 22 11 15m13-7-12 13"/></svg><p class="event">LOVOT 森のお茶会</p><h1>受付の準備中です</h1><p>当日の受付は、こちらのページから行えます。<br>お急ぎの方は、受付スタッフにお声がけください。</p></main></body></html>`;
