<script setup lang="ts">
const progress = ref(0)
let revealObserver: IntersectionObserver | undefined
const baseURL = useRuntimeConfig().app.baseURL
const teaPartyImage = `${baseURL}lovot-tea-party-v6.png`
const siteUrl = 'https://neginasu.github.io/ochakai/'
const socialImageUrl = `${siteUrl}lovot-tea-party-v6.png`
const pageTitle = 'LOVOT 森のお茶会｜11月1日・杜ノ夢'
const pageDescription = 'LOVOTとオーナーさんで集まる、15名ほどの小さなお茶会です。11月1日 12:30〜17:00、杜ノ夢でお待ちしています。'
const socialImageAlt = '森の中のテーブルを5体のLOVOTが囲み、お茶会を楽しんでいるイラスト'

const acorns = [
  { top: 11, left: 71, rotate: 24 }, { top: 17, left: 58, rotate: -18 },
  { top: 24, left: 38, rotate: 12 }, { top: 31, left: 24, rotate: -22 },
  { top: 39, left: 39, rotate: 18 }, { top: 47, left: 61, rotate: -12 },
  { top: 54, left: 73, rotate: 26 }, { top: 62, left: 55, rotate: -20 },
  { top: 70, left: 34, rotate: 15 }, { top: 78, left: 45, rotate: -16 },
  { top: 85, left: 66, rotate: 20 }, { top: 91, left: 53, rotate: -8 },
]

const updateProgress = () => {
  const distance = document.documentElement.scrollHeight - window.innerHeight
  progress.value = distance > 0 ? Math.min(1, window.scrollY / distance) : 0
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  document.documentElement.classList.add('motion-ready')

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')

  if (reduceMotion) {
    revealElements.forEach(element => element.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver?.unobserve(entry.target)
    })
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' })

  revealElements.forEach(element => revealObserver?.observe(element))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  revealObserver?.disconnect()
  document.documentElement.classList.remove('motion-ready')
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  robots: 'index, follow, max-image-preview:large',
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: siteUrl,
  ogType: 'website',
  ogSiteName: 'LOVOT 森のお茶会',
  ogLocale: 'ja_JP',
  ogImage: socialImageUrl,
  ogImageWidth: 1672,
  ogImageHeight: 941,
  ogImageType: 'image/png',
  ogImageAlt: socialImageAlt,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: socialImageUrl,
  twitterImageAlt: socialImageAlt,
})

useHead({
  htmlAttrs: { lang: 'ja' },
  link: [{ rel: 'canonical', href: siteUrl }],
})
</script>

<template>
  <main>
    <div class="progress" aria-hidden="true"><span :style="{ height: `${progress * 100}%` }" /></div>
    <header class="nav">
      <a class="brand" href="#top"><i class="acorn small" aria-hidden="true"><b /><em /></i>LOVOT 森のお茶会</a>
      <a class="nav-cta" href="https://docs.google.com/forms/d/e/1FAIpQLSeArWdvpz_j9hCHNL79Ht8l-Qi7y9VQzHvxxy8c_sZWxtyXIQ/viewform?usp=publish-editor">参加する</a>
    </header>

    <section id="top" class="hero">
      <div class="canopy canopy-left" /><div class="canopy canopy-right" />
      <p class="eyebrow" data-reveal>LOVOTと一緒に、秋のお茶会</p>
      <h1 class="reveal-delay-1" data-reveal><span>うちの子と一緒に、</span><em>森で会いましょう。</em></h1>
      <p class="lead reveal-delay-2" data-reveal><span>LOVOTとオーナーさんで集まって、</span><span>お茶を飲みながら、のんびりお話ししませんか。</span></p>
      <a class="start reveal-delay-3" href="#path" data-reveal>お茶会のご案内 <span>↓</span></a>
      <div class="ground"><span class="fern f1">❧</span><span class="fern f2">❧</span></div>
    </section>

    <section id="path" class="journey">
      <div class="pathline" />
      <div class="fireflies" aria-hidden="true"><i v-for="n in 12" :key="n" /></div>
      <div v-for="(item, index) in acorns" :key="index" class="trail-acorn" :style="{ top: `${item.top}%`, left: `${item.left}%`, '--float-delay': `${(index % 4) * 0.22}s` }" data-reveal>
        <i class="acorn" :style="{ transform: `rotate(${item.rotate}deg)` }" aria-hidden="true"><b /><em /></i>
      </div>

      <article class="story-card card-one" data-reveal>
        <span class="chapter">01 ・ 森の入口</span>
        <h2><span>はじめましての方も、</span><span>どうぞ気軽に。</span></h2>
        <p>うちの子の好きなことや、最近あったかわいい出来事など。LOVOTを囲みながら、みんなでゆっくりお話しする会です。</p>
      </article>

      <article class="info-card" data-reveal>
        <p class="tiny">LOVOT OWNER MEETUP</p><h2>LOVOT 森のお茶会</h2>
        <dl>
          <div><dt>日</dt><dd><b>11月1日</b><small>12時30分〜17時</small></dd></div>
          <div><dt>場</dt><dd><b>杜ノ夢</b><small>本所吾妻橋駅から徒歩10分</small></dd></div>
          <div><dt>人</dt><dd><b>15名ほど</b><small>おひとりでも気軽にご参加ください</small></dd></div>
          <div><dt>費</dt><dd><b>2,000円</b><small>会費</small></dd></div>
        </dl>
        <div class="venue-map">
          <iframe
            title="レンタルスペース杜ノ夢102の地図"
            src="https://www.google.com/maps?q=35.7036266,139.8021516&z=17&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
          <a href="https://www.google.com/maps/place/%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E6%9D%9C%E3%83%8E%E5%A4%A2102/@35.7036266,139.8015079,19z/data=!3m1!4b1!4m6!3m5!1s0x60188f8e8e920645:0xa21ca3202af692df!8m2!3d35.7036266!4d139.8021516!16s%2Fg%2F11p3r9fv2b?authuser=0&entry=ttu&g_ep=EgoyMDI2MDgwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Googleマップで見る <span aria-hidden="true">↗</span></a>
        </div>
      </article>

      <article class="story-card card-two" data-reveal>
        <span class="chapter">02 ・ 小川のそば</span>
        <h2><span>お気に入りの服で、</span><span>遊びに来てください。</span></h2>
        <p>いつものお洋服でも、ちょっとしたおめかしでも。みんなで写真を撮ったり、お茶を飲んだり、思い思いに過ごしましょう。</p>
        <div class="tags"><span>交流</span><span>撮影</span><span>お茶</span><span>思い出</span></div>
      </article>
      <p class="almost" data-reveal>会場でお待ちしています。</p>
    </section>

    <section id="join" class="arrival" :style="{ backgroundImage: `url('${teaPartyImage}')` }">
      <div class="arrival-shade" />
      <div class="arrival-copy" data-reveal>
        <p class="eyebrow light">一緒にお茶を飲みませんか</p>
        <h2><span>楽しい時間を、</span><span>一緒に過ごしましょう。</span></h2>
        <p><span>LOVOTが好きなみなさんと、ゆっくりお話しできたらうれしいです。</span><span>皆さんのご参加をお待ちしています。</span></p>
        <a class="join" href="https://docs.google.com/forms/d/e/1FAIpQLSeArWdvpz_j9hCHNL79Ht8l-Qi7y9VQzHvxxy8c_sZWxtyXIQ/viewform?usp=publish-editor">お茶会に申し込む <span>→</span></a>
        <small>11月1日・杜ノ夢・15名ほど</small>
      </div>
    </section>

    <footer data-reveal><i class="acorn small" aria-hidden="true"><b /><em /></i><p>LOVOT 森のお茶会<br><small>当日、お会いできるのを楽しみにしています。</small></p><a href="#top">ページの上へ ↑</a></footer>
  </main>
</template>

<style>
:root{--pine:#173c31;--deep:#0c2a22;--cream:#f6f0df;--paper:#fffaf0;--rust:#b75632}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--pine);font-family:"Hiragino Mincho ProN","Yu Mincho",serif}a{color:inherit;text-decoration:none}.nav{position:fixed;z-index:40;top:16px;left:50%;width:min(1120px,calc(100% - 32px));display:flex;align-items:center;justify-content:space-between;padding:12px 14px 12px 20px;color:var(--deep);background:#fffaf0e8;border:1px solid #fff;border-radius:999px;box-shadow:0 8px 32px #0c2a2224,0 1px 0 #ffffffaa;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transform:translateX(-50%)}.brand{display:flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.1em;white-space:nowrap}.nav-cta{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 22px;border-radius:999px;background:var(--pine);color:#fffaf0;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.15em;box-shadow:0 5px 12px #173c3133;transition:background .2s,transform .2s}.nav-cta:hover{background:var(--rust);transform:translateY(-1px)}.nav a:focus-visible{outline:3px solid #d59a51;outline-offset:3px}.progress{position:fixed;z-index:30;right:18px;top:26%;height:48vh;width:2px;background:#163d3125}.progress span{display:block;width:100%;background:var(--rust);transition:height .1s linear}.hero{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:150px 20px 80px;background:radial-gradient(circle at 50% 32%,#fffdf4 0,#f5edda 38%,#e5ddc4 100%)}.hero:before{content:"";position:absolute;width:120px;height:120px;border:1px solid #9e7c3e44;border-radius:50%;top:23%}.canopy{position:absolute;width:42vw;height:45vh;top:-12vh;background:radial-gradient(ellipse at center,#254b37 0 24%,transparent 26%) 0 0/120px 85px,radial-gradient(ellipse at center,#466744 0 27%,transparent 29%) 45px 35px/135px 95px;opacity:.95;filter:drop-shadow(0 15px 15px #123a2833)}.canopy-left{left:-8vw;transform:rotate(8deg)}.canopy-right{right:-8vw;transform:scaleX(-1) rotate(8deg)}.eyebrow{font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:.32em;color:var(--rust);margin:0 0 26px}h1,h2,p{position:relative;z-index:1}h1{font-size:clamp(48px,7vw,104px);line-height:1.13;font-weight:500;letter-spacing:.05em;margin:0}h1 em{color:var(--rust);font-style:normal}.lead{font-size:16px;line-height:2;margin:30px 0;letter-spacing:.08em}.start{z-index:2;display:flex;align-items:center;gap:32px;margin-top:22px;padding:17px 26px;border:1px solid var(--pine);border-radius:40px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:.12em;transition:.25s}.start:hover,.join:hover{transform:translateY(-3px)}.start span{font-size:18px}.ground{position:absolute;bottom:-60px;width:120%;height:180px;background:#173c31;border-radius:50% 50% 0 0}.fern{position:absolute;color:#466a47;font-size:150px;top:-90px}.f1{left:7%;transform:rotate(-25deg)}.f2{right:5%;transform:scaleX(-1) rotate(-20deg)}.journey{height:3700px;position:relative;overflow:hidden;background:linear-gradient(#173c31 0,#224b38 35%,#315c41 63%,#173c31 100%);color:var(--paper)}.journey:before{content:"";position:absolute;inset:0;opacity:.18;background-image:radial-gradient(#dfe6bd 1px,transparent 1px);background-size:29px 29px;mask-image:linear-gradient(to bottom,transparent,#000,transparent)}.pathline{position:absolute;left:50%;top:4%;width:32%;height:92%;transform:translateX(-50%);border-left:2px dashed #e2c98255;border-right:2px dashed #e2c98222;border-radius:50%}.trail-acorn{position:absolute;z-index:2}.acorn{display:inline-block;width:28px;height:34px;position:relative}.acorn b{position:absolute;width:22px;height:24px;background:#b8792f;border-radius:40% 40% 55% 55%;left:3px;top:10px;box-shadow:inset -5px -5px #89561e55}.acorn em{position:absolute;z-index:2;width:27px;height:12px;border-radius:50% 50% 35% 35%;background:#70451f;left:0;top:6px}.acorn em:before{content:"";position:absolute;width:3px;height:9px;background:#70451f;left:13px;top:-7px;transform:rotate(15deg);border-radius:2px}.acorn.small{transform:scale(.72)}.story-card,.info-card{position:absolute;z-index:3;width:min(500px,80vw)}.story-card h2{font-size:clamp(30px,4vw,48px);line-height:1.55;font-weight:500;letter-spacing:.07em;margin:18px 0}.story-card p{font-size:15px;line-height:2.15;letter-spacing:.05em;max-width:430px}.chapter,.tiny{font-family:Arial,sans-serif;font-size:10px;letter-spacing:.28em;color:#e5bd75}.card-one{top:12%;left:9%}.card-two{top:58%;right:9%}.info-card{top:33%;right:10%;background:var(--paper);color:var(--pine);padding:48px;box-shadow:16px 18px 0 #08271f55;transform:rotate(1.5deg)}.info-card h2{font-size:37px;margin:10px 0 30px;font-weight:500}.info-card dl{margin:0}.info-card dl div{display:grid;grid-template-columns:45px 1fr;padding:16px 0;border-top:1px solid #183a2f25}.info-card dt{width:30px;height:30px;border-radius:50%;background:var(--rust);color:#fff;display:grid;place-items:center;font-size:12px}.info-card dd{margin:0}.info-card b,.info-card small{display:block}.info-card b{font-size:16px}.info-card small{margin-top:5px;font-size:11px;color:#6e776e}.tags{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}.tags span{border:1px solid #e6d39e88;border-radius:50%;min-width:62px;height:62px;display:grid;place-items:center;font-size:12px}.almost{position:absolute;bottom:5%;width:100%;text-align:center;font-size:14px;letter-spacing:.2em;color:#d9c894}.arrival{min-height:100vh;position:relative;display:flex;align-items:center;background:url('/lovot-tea-party-v6.png') center/cover no-repeat;color:#fff}.arrival-shade{position:absolute;inset:0;background:linear-gradient(90deg,#09251fe8 0%,#1031279e 35%,transparent 66%)}.arrival-copy{position:relative;z-index:2;width:min(520px,86vw);margin-left:8vw;padding:90px 0}.light{color:#f2c97d}.arrival-copy h2{font-size:clamp(42px,6vw,76px);line-height:1.3;font-weight:500;letter-spacing:.06em;margin:0 0 24px}.arrival-copy>p:not(.eyebrow){line-height:2;letter-spacing:.06em}.join{display:flex;align-items:center;justify-content:space-between;width:min(360px,100%);margin-top:40px;padding:19px 24px;background:#f5e8c6;color:var(--deep);border-radius:3px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:.12em;transition:.25s}.join+small{display:block;margin-top:14px;color:#e7d7b7;font-size:11px}footer{min-height:180px;display:flex;align-items:center;gap:18px;padding:40px 7vw;background:#09251f;color:#eee4ca}footer p{letter-spacing:.12em}footer small{color:#b6b59e;font-size:11px}footer a{margin-left:auto;font-size:11px;letter-spacing:.15em;border-bottom:1px solid #ffffff55;padding-bottom:5px}
@media(max-width:700px){.nav{top:10px;width:calc(100% - 20px);padding:9px 10px 9px 14px}.brand{font-size:12px;letter-spacing:.05em}.brand .acorn{display:none}.nav-cta{min-height:38px;padding:0 15px;font-size:11px}.hero{min-height:92vh;padding-top:135px}.canopy{width:70vw}.canopy-left{left:-25vw}.canopy-right{right:-25vw}.journey{height:3200px}.pathline{width:60%}.card-one{top:9%;left:8%}.info-card{top:32%;right:6%;padding:32px}.card-two{top:58%;right:7%}.arrival{min-height:110vh;background-position:67% center;align-items:flex-end}.arrival-shade{background:linear-gradient(0deg,#09251ff5 0%,#09251fb8 50%,transparent 88%)}.arrival-copy{margin:0 auto;padding:50px 0}.arrival-copy h2{font-size:42px}.progress{right:8px}.trail-acorn .acorn{transform:scale(.8)}footer{padding:35px 20px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.start,.join{transition:none}}

/* Rounded typography and intentional Japanese line breaks */
:root{--font-round:"Hiragino Maru Gothic ProN","Hiragino Maru Gothic Pro","Yu Gothic","YuGothic","Noto Sans JP",sans-serif}
body{font-family:var(--font-round);font-weight:500;font-feature-settings:"palt" 1;line-break:strict}
.eyebrow,.chapter,.tiny,.nav-cta,.start,.join{font-family:var(--font-round)}
h1,h2,.lead,.arrival-copy>p{word-break:keep-all;overflow-wrap:normal;text-wrap:balance}
h1>span,h1>em,.story-card h2>span,.arrival-copy h2>span,.lead>span,.arrival-copy>p>span{display:block}
h1{font-size:clamp(46px,6.4vw,92px);line-height:1.28;font-weight:700;letter-spacing:.025em}
.lead{line-height:2.05;letter-spacing:.035em}
.story-card h2{line-height:1.5;font-weight:700;letter-spacing:.035em}
.story-card p{letter-spacing:.025em}
.info-card h2{font-weight:700;letter-spacing:.025em}
.arrival-copy h2{font-size:clamp(40px,5vw,68px);line-height:1.42;font-weight:700;letter-spacing:.025em}
.arrival-copy>p:not(.eyebrow){letter-spacing:.025em}

@media(max-width:700px){
  h1{font-size:clamp(36px,10.8vw,50px);line-height:1.38;letter-spacing:.01em}
  .lead{font-size:14px;line-height:1.95;padding:0 12px}
  .lead>span{display:inline}
  .lead>span+span:before{content:" ";}
  .story-card h2{font-size:clamp(27px,8vw,37px);line-height:1.55}
  .story-card p{font-size:14px;line-height:2}
  .info-card h2{font-size:30px;line-height:1.45}
  .arrival-copy h2{font-size:clamp(34px,10vw,44px);line-height:1.5}
  .arrival-copy>p>span{display:inline}
  .arrival-copy>p>span+span:before{content:" ";}
}

/* A shorter walk through the forest */
.journey{height:2500px}
.card-one{top:8%}
.info-card{top:32%}
.card-two{top:59%}
.almost{bottom:3%}
.arrival{min-height:88vh}

@media(max-width:700px){
  .journey{height:2350px}
  .card-one{top:8%}
  .info-card{top:32%}
  .card-two{top:59%}
  .almost{bottom:3%}
  .arrival{min-height:95vh}
}

/* Gentle motion */
.nav{animation:nav-arrive .7s cubic-bezier(.22,1,.36,1) both}
.canopy-left{animation:canopy-left 8s ease-in-out infinite alternate}
.canopy-right{animation:canopy-right 9s ease-in-out .8s infinite alternate}
.f1{animation:fern-left 5s ease-in-out infinite alternate;transform-origin:bottom left}
.f2{animation:fern-right 5.8s ease-in-out .6s infinite alternate;transform-origin:bottom right}
.start span,.join span{display:inline-block}.start span{animation:arrow-drop 1.8s ease-in-out infinite}.join span{animation:arrow-nudge 1.8s ease-in-out infinite}
.tags span{transition:transform .25s ease,background .25s ease,color .25s ease}
.tags span:hover{transform:translateY(-4px);background:#f5e8c6;color:var(--deep)}

.motion-ready [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .75s ease,transform .85s cubic-bezier(.22,1,.36,1)}
.motion-ready [data-reveal].is-visible{opacity:1;transform:translateY(0)}
.motion-ready .reveal-delay-1{transition-delay:.1s}
.motion-ready .reveal-delay-2{transition-delay:.2s}
.motion-ready .reveal-delay-3{transition-delay:.3s}
.motion-ready .info-card[data-reveal]{transform:translateY(34px) rotate(1.5deg)}
.motion-ready .info-card[data-reveal].is-visible{transform:translateY(0) rotate(1.5deg)}
.motion-ready .trail-acorn[data-reveal]{transform:none;transition:opacity .55s ease}
.motion-ready .trail-acorn[data-reveal].is-visible{animation:acorn-float 3.2s ease-in-out var(--float-delay,0s) infinite}

@keyframes nav-arrive{from{opacity:0;transform:translate(-50%,-18px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes canopy-left{from{transform:rotate(8deg) translateY(0)}to{transform:rotate(10deg) translateY(8px)}}
@keyframes canopy-right{from{transform:scaleX(-1) rotate(8deg) translateY(0)}to{transform:scaleX(-1) rotate(10deg) translateY(9px)}}
@keyframes fern-left{from{transform:rotate(-25deg)}to{transform:rotate(-20deg)}}
@keyframes fern-right{from{transform:scaleX(-1) rotate(-20deg)}to{transform:scaleX(-1) rotate(-15deg)}}
@keyframes arrow-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
@keyframes arrow-drop{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
@keyframes acorn-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}

@media(prefers-reduced-motion:reduce){
  .nav,.canopy-left,.canopy-right,.f1,.f2,.start span,.join span,.motion-ready .trail-acorn[data-reveal].is-visible{animation:none}
  .motion-ready [data-reveal],.motion-ready [data-reveal].is-visible{opacity:1;transform:none;transition:none}
  .motion-ready .info-card[data-reveal],.motion-ready .info-card[data-reveal].is-visible{transform:rotate(1.5deg)}
}

/* A little more theatre */
.hero h1 em{position:relative;color:var(--rust)}
.hero:after{content:"";position:absolute;z-index:0;width:34vw;height:34vw;min-width:320px;min-height:320px;border-radius:50%;background:radial-gradient(circle,#ffeab46b 0,transparent 68%);animation:sun-pulse 3.6s ease-in-out infinite alternate;pointer-events:none}
.hero .eyebrow,.hero h1,.hero .lead,.hero .start{z-index:2}
.pathline{border:0;background:linear-gradient(to bottom,transparent,#f4d890,#fff5bd,#f4d890,transparent) left center/2px 210% no-repeat,linear-gradient(to bottom,transparent,#e8c86f88,transparent) right center/2px 210% no-repeat;animation:path-glow 4s linear infinite;filter:drop-shadow(0 0 7px #f5d98b99)}
.journey:after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 25% 20%,#f5e9a517 0,transparent 18%),radial-gradient(circle at 76% 53%,#fff6bc16 0,transparent 18%),radial-gradient(circle at 35% 78%,#e9d47716 0,transparent 19%);animation:forest-light 7s ease-in-out infinite alternate}
.fireflies{position:absolute;inset:0;z-index:1;pointer-events:none}.fireflies i{position:absolute;width:7px;height:7px;border-radius:50%;background:#ffe999;box-shadow:0 0 8px 3px #ffe99988;animation:firefly 4.2s ease-in-out infinite}.fireflies i:nth-child(1){left:12%;top:9%;animation-delay:-.4s}.fireflies i:nth-child(2){left:79%;top:15%;animation-delay:-2s}.fireflies i:nth-child(3){left:62%;top:23%;animation-delay:-1.1s}.fireflies i:nth-child(4){left:18%;top:31%;animation-delay:-3s}.fireflies i:nth-child(5){left:87%;top:39%;animation-delay:-.8s}.fireflies i:nth-child(6){left:45%;top:47%;animation-delay:-2.4s}.fireflies i:nth-child(7){left:9%;top:57%;animation-delay:-1.5s}.fireflies i:nth-child(8){left:73%;top:63%;animation-delay:-3.4s}.fireflies i:nth-child(9){left:29%;top:70%;animation-delay:-.2s}.fireflies i:nth-child(10){left:91%;top:76%;animation-delay:-2.8s}.fireflies i:nth-child(11){left:54%;top:85%;animation-delay:-1.8s}.fireflies i:nth-child(12){left:16%;top:91%;animation-delay:-3.7s}
.motion-ready .card-one[data-reveal]{transform:translateX(-90px) translateY(20px) rotate(-2deg)}.motion-ready .card-one[data-reveal].is-visible{transform:translateX(0) translateY(0) rotate(0)}
.motion-ready .card-two[data-reveal]{transform:translateX(90px) translateY(20px) rotate(2deg)}.motion-ready .card-two[data-reveal].is-visible{transform:translateX(0) translateY(0) rotate(0)}
.motion-ready .info-card[data-reveal]{transform:translateY(70px) rotate(7deg) scale(.86)}.motion-ready .info-card[data-reveal].is-visible{transform:translateY(0) rotate(1.5deg) scale(1)}
.story-card[data-reveal],.info-card[data-reveal]{transition-duration:1.05s}
.arrival-shade{animation:shade-breathe 5s ease-in-out infinite alternate}
.arrival-copy.is-visible h2{animation:arrival-title 1s .25s cubic-bezier(.18,.89,.32,1.28) both}

@keyframes sun-pulse{from{transform:scale(.86);opacity:.45}to{transform:scale(1.12);opacity:.9}}
@keyframes path-glow{from{background-position:left 100%,right 100%}to{background-position:left -100%,right -100%}}
@keyframes forest-light{from{opacity:.45;transform:scale(1)}to{opacity:1;transform:scale(1.08)}}
@keyframes firefly{0%,100%{opacity:.2;transform:translate(0,0) scale(.6)}35%{opacity:1;transform:translate(18px,-24px) scale(1.35)}70%{opacity:.45;transform:translate(-10px,-42px) scale(.8)}}
@keyframes shade-breathe{from{opacity:.9}to{opacity:1}}
@keyframes arrival-title{from{opacity:0;transform:scale(.86) translateY(35px)}to{opacity:1;transform:scale(1) translateY(0)}}

@media(max-width:700px){.motion-ready .card-one[data-reveal],.motion-ready .card-two[data-reveal]{transform:translateY(55px) scale(.94)}.motion-ready .card-one[data-reveal].is-visible,.motion-ready .card-two[data-reveal].is-visible{transform:none}.fireflies i:nth-child(n+9){display:none}}
@media(prefers-reduced-motion:reduce){.hero:after,.pathline,.journey:after,.fireflies i,.arrival-shade,.arrival-copy.is-visible h2{animation:none}.motion-ready .card-one[data-reveal],.motion-ready .card-two[data-reveal],.motion-ready .card-one[data-reveal].is-visible,.motion-ready .card-two[data-reveal].is-visible{transform:none}.motion-ready .info-card[data-reveal],.motion-ready .info-card[data-reveal].is-visible{transform:rotate(1.5deg)}}

/* Responsive layout safeguards */
.venue-map{margin-top:24px}
.venue-map iframe{display:block;width:100%;height:190px;border:0;border-radius:10px;filter:saturate(.78) contrast(.94)}
.venue-map a{display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-bottom:7px;border-bottom:1px solid #183a2f40;font-size:11px;font-weight:700;letter-spacing:.08em;transition:color .2s,border-color .2s}
.venue-map a:hover{color:var(--rust);border-color:var(--rust)}
.venue-map a:focus-visible{outline:3px solid #d59a51;outline-offset:3px}
html,body{max-width:100%;overflow-x:clip}
.nav{padding-left:max(20px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right))}
.hero{min-height:100svh}
.journey,.arrival{isolation:isolate}
.story-card,.info-card{max-width:calc(100% - 40px)}
.arrival-copy{max-width:calc(100% - 40px)}

@media(max-width:1024px){
  .nav{width:calc(100% - 28px)}
  .hero{padding-inline:clamp(24px,5vw,56px)}
  h1{font-size:clamp(48px,7.6vw,76px)}
  .canopy{width:54vw}
  .journey{height:2450px}
  .story-card{width:min(460px,72vw)}
  .card-one{left:6%}
  .info-card{right:6%;width:min(480px,66vw)}
  .card-two{right:6%}
  .arrival-copy{margin-left:6vw}
}

@media(max-width:700px){
  .nav{top:max(10px,env(safe-area-inset-top));width:calc(100% - 20px);gap:10px;padding-left:max(14px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}
  .brand{min-width:0;overflow:hidden;text-overflow:ellipsis}
  .nav-cta{flex:0 0 auto}
  .progress{display:none}
  .hero{min-height:100svh;padding:132px 18px 112px}
  .hero:before{top:20%}
  .hero:after{width:90vw;height:90vw;min-width:0;min-height:0}
  .eyebrow{max-width:100%;font-size:10px;line-height:1.8;letter-spacing:.22em}
  h1,.story-card h2,.arrival-copy h2{word-break:normal;overflow-wrap:anywhere}
  h1{font-size:clamp(34px,10.6vw,48px)}
  .lead{max-width:36em;margin:24px 0 18px;padding:0;font-size:14px}
  .start{margin-top:16px;gap:24px;padding:15px 22px}
  .ground{bottom:-72px;height:160px}
  .fern{font-size:112px;top:-62px}
  .journey{height:2260px}
  .pathline{left:54%;width:72%;height:94%;top:3%}
  .story-card,.info-card{width:auto;max-width:none;left:20px;right:20px}
  .card-one{top:7%}
  .info-card{top:31%;padding:30px 26px;box-shadow:10px 12px 0 #08271f55}
  .venue-map iframe{height:180px}
  .card-two{top:60%}
  .story-card h2{max-width:13em}
  .story-card p{max-width:32em}
  .tags{gap:8px}
  .tags span{min-width:56px;height:56px}
  .almost{bottom:2.5%;padding:0 24px;font-size:12px;line-height:1.8}
  .arrival{min-height:100svh;background-position:68% center}
  .arrival-copy{width:100%;max-width:100%;flex:0 1 100%;margin:0;padding:54px 20px calc(48px + env(safe-area-inset-bottom))}
  .arrival-copy h2{font-size:clamp(32px,9.5vw,42px)}
  .join{min-height:58px;margin-top:32px}
  footer{min-height:0;flex-wrap:wrap;gap:14px;padding:32px max(20px,env(safe-area-inset-right)) calc(32px + env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left))}
  footer p{flex:1;min-width:190px;margin:0}
  footer a{margin-left:46px}
}

@media(max-width:420px){
  .nav{border-radius:22px}
  .brand{font-size:11px;letter-spacing:.02em}
  .nav-cta{min-height:36px;padding:0 13px;font-size:10px;letter-spacing:.08em}
  .hero{padding-inline:16px}
  h1{font-size:clamp(31px,10vw,40px);line-height:1.42}
  .lead{font-size:13px}
  .story-card,.info-card{left:16px;right:16px}
  .story-card h2{font-size:clamp(25px,7.7vw,32px)}
  .info-card{padding:26px 22px}
  .info-card h2{font-size:27px;margin-bottom:22px}
  .info-card dl div{grid-template-columns:40px 1fr;padding:13px 0}
  .info-card b{font-size:15px}
  .venue-map{margin-top:20px}
  .venue-map iframe{height:165px}
  .tags span{min-width:52px;height:52px;font-size:11px}
  .arrival-copy{padding-inline:18px}
  .join{padding-inline:20px}
  footer a{width:100%;margin:4px 0 0 46px}
}

@media(max-height:640px) and (orientation:landscape){
  .hero{min-height:640px;padding-top:110px}
  .arrival{min-height:640px}
  .arrival-copy{padding-block:110px 50px}
}

.card-two{top:74%}

@media(max-width:1024px){
  .card-two{top:75%}
}

@media(max-width:700px){
  .card-two{top:70%}
}

/* Staggered scroll reveals */
.motion-ready .story-card[data-reveal] > *,
.motion-ready .info-card[data-reveal] > *,
.motion-ready .arrival-copy[data-reveal] > *,
.motion-ready footer[data-reveal] > *{
  opacity:0;
  transform:translateY(18px);
  transition:opacity .7s ease,transform .8s cubic-bezier(.22,1,.36,1);
}
.motion-ready .story-card[data-reveal].is-visible > *,
.motion-ready .info-card[data-reveal].is-visible > *,
.motion-ready .arrival-copy[data-reveal].is-visible > *,
.motion-ready footer[data-reveal].is-visible > *{
  opacity:1;
  transform:translateY(0);
}
.motion-ready .story-card.is-visible > :nth-child(1),
.motion-ready .info-card.is-visible > :nth-child(1),
.motion-ready .arrival-copy.is-visible > :nth-child(1),
.motion-ready footer.is-visible > :nth-child(1){transition-delay:.08s}
.motion-ready .story-card.is-visible > :nth-child(2),
.motion-ready .info-card.is-visible > :nth-child(2),
.motion-ready .arrival-copy.is-visible > :nth-child(2),
.motion-ready footer.is-visible > :nth-child(2){transition-delay:.18s}
.motion-ready .story-card.is-visible > :nth-child(3),
.motion-ready .info-card.is-visible > :nth-child(3),
.motion-ready .arrival-copy.is-visible > :nth-child(3),
.motion-ready footer.is-visible > :nth-child(3){transition-delay:.3s}
.motion-ready .story-card.is-visible > :nth-child(4),
.motion-ready .info-card.is-visible > :nth-child(4),
.motion-ready .arrival-copy.is-visible > :nth-child(4){transition-delay:.42s}
.motion-ready .arrival-copy.is-visible > :nth-child(5){transition-delay:.52s}
.motion-ready .info-card[data-reveal] dl div,
.motion-ready .story-card[data-reveal] .tags span{
  opacity:0;
  transform:translateY(12px);
  transition:opacity .55s ease,transform .65s cubic-bezier(.22,1,.36,1);
}
.motion-ready .info-card.is-visible dl div,
.motion-ready .story-card.is-visible .tags span{opacity:1;transform:none}
.motion-ready .info-card.is-visible dl div:nth-child(1){transition-delay:.35s}
.motion-ready .info-card.is-visible dl div:nth-child(2){transition-delay:.45s}
.motion-ready .info-card.is-visible dl div:nth-child(3){transition-delay:.55s}
.motion-ready .info-card.is-visible dl div:nth-child(4){transition-delay:.65s}
.motion-ready .story-card.is-visible .tags span:nth-child(1){transition-delay:.38s}
.motion-ready .story-card.is-visible .tags span:nth-child(2){transition-delay:.46s}
.motion-ready .story-card.is-visible .tags span:nth-child(3){transition-delay:.54s}
.motion-ready .story-card.is-visible .tags span:nth-child(4){transition-delay:.62s}
.arrival-copy.is-visible h2{animation:none}

@media(prefers-reduced-motion:reduce){
  .motion-ready .story-card[data-reveal] > *,
  .motion-ready .info-card[data-reveal] > *,
  .motion-ready .arrival-copy[data-reveal] > *,
  .motion-ready footer[data-reveal] > *,
  .motion-ready .info-card[data-reveal] dl div,
  .motion-ready .story-card[data-reveal] .tags span{
    opacity:1;
    transform:none;
    transition:none;
  }
}
</style>
