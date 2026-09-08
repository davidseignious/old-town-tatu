(()=>{
  const css=`
  .pricingWrap{margin-top:18px}.pricingIntro{margin-bottom:12px}.pricingIntro h3{margin:0 0 5px;font-size:22px}.pricingGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.planCard{position:relative;padding:18px;border:1px solid rgba(255,255,255,.10);border-radius:22px;background:linear-gradient(180deg,rgba(34,25,42,.96),rgba(19,14,24,.96));overflow:hidden}.planCard.featured{border-color:rgba(242,122,157,.45);box-shadow:0 18px 45px rgba(202,82,144,.14)}.planCard.best{border-color:rgba(115,230,171,.34);background:linear-gradient(180deg,rgba(28,34,38,.96),rgba(17,20,24,.96))}.planBadge{display:inline-flex;padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.06);font-size:9px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#c9bdcf;margin-bottom:11px}.planCard.featured .planBadge{background:rgba(242,122,157,.12);color:#ffabc0}.planCard.best .planBadge{background:rgba(115,230,171,.10);color:#aef0cc}.planName{font-size:16px;font-weight:950;margin-bottom:5px}.planPrice{display:flex;align-items:flex-end;gap:5px;margin-bottom:13px}.planPrice strong{font-size:38px;line-height:.95;letter-spacing:-.06em}.planPrice span{font-size:11px;color:#9f94a6;padding-bottom:4px}.planFeatures{display:grid;gap:8px;margin:12px 0 16px}.planFeatures div{font-size:10px;color:#c8bdcc;line-height:1.35}.planFeatures div:before{content:'✓';color:#76dfaa;margin-right:7px;font-weight:950}.planSave{font-size:10px;color:#aef0cc;margin-top:-5px;margin-bottom:10px}.planBtn{width:100%}@media(max-width:780px){.pricingGrid{grid-template-columns:1fr}.planCard{padding:17px}.planPrice strong{font-size:34px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const profile=document.querySelector('#profile');
  if(!profile)return;
  const settings=[...profile.querySelectorAll('.card.stack')].find(x=>x.textContent.includes('Settings & account'));
  const wrap=document.createElement('section');wrap.className='pricingWrap';wrap.innerHTML=`
    <div class="pricingIntro"><div class="eyebrow">Membership</div><h3>Choose how you want to date.</h3><div class="mini">Free members keep 10 likes per day. Upgrade when you want more control and visibility.</div></div>
    <div class="pricingGrid">
      <article class="planCard"><span class="planBadge">Plus</span><div class="planName">VERAMOR Plus</div><div class="planPrice"><strong>$15</strong><span>/ month</span></div><div class="planFeatures"><div>Unlimited likes</div><div>See who liked you</div><div>Profile Passport</div><div>Advanced discovery filters</div></div><button class="btn secondary planBtn" data-plan="plus_monthly">Choose Plus</button></article>
      <article class="planCard featured"><span class="planBadge">Premium</span><div class="planName">VERAMOR Premium</div><div class="planPrice"><strong>$25</strong><span>/ month</span></div><div class="planFeatures"><div>Everything in Plus</div><div>Priority profile placement</div><div>Incognito mode</div><div>Weekly profile boost</div><div>Read receipts</div></div><button class="btn primary planBtn" data-plan="premium_monthly">Choose Premium</button></article>
      <article class="planCard best"><span class="planBadge">Best value</span><div class="planName">VERAMOR Annual</div><div class="planPrice"><strong>$120</strong><span>/ year</span></div><div class="planSave">Equivalent to $10/month</div><div class="planFeatures"><div>Everything in Premium</div><div>12 months of access</div><div>Annual member badge</div><div>Best overall value</div></div><button class="btn secondary planBtn" data-plan="annual">Choose Annual</button></article>
    </div>`;
  if(settings)profile.insertBefore(wrap,settings);else profile.appendChild(wrap);
  wrap.querySelectorAll('[data-plan]').forEach(btn=>btn.addEventListener('click',()=>{
    const label=btn.dataset.plan==='plus_monthly'?'VERAMOR Plus — $15/month':btn.dataset.plan==='premium_monthly'?'VERAMOR Premium — $25/month':'VERAMOR Annual — $120/year';
    toast(label+' selected. Secure checkout is being connected.');
  }));
})();
