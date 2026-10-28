<script setup lang="ts">
const config = useRuntimeConfig()
const configuredUrl = String(config.public.checkinWebAppUrl || '').trim()
// 設定ミスや別サイトの埋め込みを防ぎ、本番のApps Script URLだけを使用します。
const checkinUrl = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(configuredUrl)
  ? configuredUrl
  : ''

useSeoMeta({
  title: '当日チェックイン｜LOVOT 森のお茶会',
  description: 'お申し込み時のオーナー名を選んで、当日のチェックインをお願いします。',
  robots: 'noindex, nofollow'
})

useHead({ htmlAttrs: { lang: 'ja' } })
</script>

<template>
  <main class="checkin-page">
    <header class="checkin-header">
      <NuxtLink to="/" class="checkin-home">← お茶会のご案内</NuxtLink>
      <span>当日受付</span>
    </header>

    <template v-if="checkinUrl">
      <h1 class="checkin-sr-only">LOVOT 森のお茶会 チェックイン</h1>
      <iframe
        :src="checkinUrl"
        class="checkin-frame"
        title="オーナー名を選んでチェックイン"
        referrerpolicy="no-referrer"
      />
      <p class="checkin-help">
        フォームが表示されない場合は、
        <a :href="checkinUrl" target="_blank" rel="noopener noreferrer">別の画面で受付を開く ↗</a>
      </p>
    </template>

    <section v-else class="checkin-waiting" aria-labelledby="checkin-title">
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 54V29M32 37C17 37 12 25 13 12c14-1 23 5 23 17M33 43c0-15 8-23 21-24 2 14-5 26-21 24Z" />
        <path d="m21 22 11 15m13-7-12 13" />
      </svg>
      <p class="checkin-event">LOVOT 森のお茶会</p>
      <h1 id="checkin-title">受付の準備中です</h1>
      <p>当日の受付は、こちらのページから行えます。<br>お急ぎの方は、受付スタッフにお声がけください。</p>
    </section>
  </main>
</template>

<style scoped>
.checkin-page{min-height:100vh;min-height:100svh;background:#f4f6ef;color:#243f33;font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;line-height:1.8}
.checkin-header{display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:720px;margin:auto;padding:17px 20px;font-size:12px;color:#607063}
.checkin-home{color:#305c43;text-decoration:none;padding:6px 0}
.checkin-home:focus-visible,.checkin-help a:focus-visible{outline:3px solid #a9c78c;outline-offset:4px}
.checkin-frame{display:block;width:100%;height:780px;height:max(780px,calc(100svh - 130px));border:0;background:#f4f6ef}
.checkin-help{margin:0;padding:18px 20px 28px;text-align:center;font-size:12px;color:#607063}
.checkin-help a{color:#305c43;text-decoration:underline;text-underline-offset:4px;display:inline-block}
.checkin-waiting{max-width:520px;margin:auto;padding:70px 24px;text-align:center}
.checkin-waiting svg{width:64px;height:64px;stroke:#34634b;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.checkin-event{font-size:12px;letter-spacing:.1em;margin:22px 0 14px}
.checkin-waiting h1{font-size:clamp(23px,6vw,30px);line-height:1.6;letter-spacing:.03em;margin:0 0 20px;color:#243f33;font-weight:700}
.checkin-waiting p:last-child{font-size:14px;line-height:2;color:#607063}
.checkin-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>
