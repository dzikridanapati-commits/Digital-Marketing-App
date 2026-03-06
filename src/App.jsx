import { useState, useEffect, useRef, useCallback } from "react";

// ===== DATA =====
const ROLES = [
  { id: "dm-manager", icon: "🎯", title: "Digital Marketing Manager", desc: "Menyusun strategi, KPI & mengoordinasi seluruh channel digital" },
  { id: "performance", icon: "📊", title: "Performance Marketing Specialist", desc: "Mengelola paid ads, marketplace ads & optimasi ROAS" },
  { id: "social-media", icon: "📱", title: "Social Media Specialist", desc: "Membuat konten, mengelola engagement & brand voice di sosmed" },
  { id: "seo", icon: "🔍", title: "SEO Specialist", desc: "Meningkatkan organic traffic melalui keyword strategy & technical SEO" },
  { id: "kol", icon: "🤝", title: "KOL Specialist", desc: "Mengelola kolaborasi brand dengan kreator & influencer" },
];

const MODES = [
  { id: "strategy", icon: "🗺️", title: "Strategy Mode", desc: "Buat strategi, planning, creative brief & dokumen marketing", color: "#F5A623" },
  { id: "report", icon: "📊", title: "Report Mode", desc: "Analisa data dashboard, buat report dengan insight & rekomendasi", color: "#8b5cf6" },
  { id: "both", icon: "⚡", title: "Full Mode", desc: "Strategy + Report sekaligus — paling lengkap", color: "#1a1a1a" },
];

const SHARED = {
  "Foundation & Research": [
    "Executive Summary", "Business Insight & Landscape", "Marketing Insight & Landscape",
    "Competitor Benchmarking & Competitive Landscape", "Target Audience (Detail) & Buyer Persona"],
  "Product Marketing": [
    "Unique Selling Proposition (USP) Statement", "Value Proposition Canvas", "Product Positioning Map",
    "Product Messaging Framework", "Feature-Benefit Matrix", "Go-to-Market (GTM) Strategy",
    "Product Launch Plan", "Sales Enablement / Battlecard", "Pricing Strategy & Competitive Pricing Analysis",
    "Product-Market Fit Analysis"],
  "Creative Brief": [
    "Creative Brief — Visual", "Creative Brief — Copy", "Creative Brief — Video", "Creative Brief — Campaign"],
};

const ROLE_DELIVERABLES = {
  "dm-manager": {
    "Strategy & Planning": ["Full Digital Marketing Strategy", "Campaign Planning & Campaign Brief", "Marketing Calendar (Master)", "Media Buy Plan & Budget Allocation", "Brand Positioning Statement", "Brand Voice Guide", "Conversion Funnel Architecture", "Customer Journey Mapping", "Omnichannel Strategy", "Tripwire & Lead Magnet Strategy"],
    "Product Marketing Extended": ["Go-to-Market Playbook (Full Version)", "Product Launch Campaign Brief (Multi-channel)", "Market Segmentation & Prioritization Matrix", "Brand Architecture", "Positioning Workshop Framework"],
    "Creative Brief Extended": ["Master Creative Brief (Umbrella)", "Channel-Specific Brief Pack", "Brand Guideline Brief for Vendor/Freelancer", "Pitch Deck Creative Brief"],
    "Analytics & Measurement": ["KPI Dashboard Design & Setup", "Attribution Model Design", "Analytics Setup Guide (GA4, GTM, Pixel)", "A/B Test Plan", "Benchmarking Report", "Marketing Performance Report", "Conversion Funnel Analysis", "Ad Spend Calculator / Budget Forecasting", "Customer Lifetime Value Analysis", "ROI & ROAS Projection", "Data Collection Plan", "Data Dashboard Design"],
    "Client & Team Management": ["Client Onboarding Document", "Consulting Framework", "Pitching Deck / Proposal", "Monthly/Quarterly Report Template", "SOP & Workflow Documentation", "Agency Onboarding System"],
  },
  "performance": {
    "Paid Ads Campaign": ["Google Ads Campaign Plan (Search, Display, Shopping, PMax)", "Facebook / Meta Ad Campaign Plan", "TikTok Ads Campaign Plan", "LinkedIn Ad Campaign Plan", "YouTube Ads Campaign Plan", "Programmatic / Display Ads Plan"],
    "Marketplace — Shopee": ["Shopee GMV Max Campaign Plan", "Shopee GMV Max Performance Report", "Shopee GMV Max A/B Test Plan", "Shopee GMV Max Budget Scaling Strategy"],
    "Marketplace — TikTok Shop": ["TikTok Shop GMV Max Campaign Plan", "TikTok Shop GMV Auto ROAS Campaign Plan", "TikTok Shop LIVE Shopping Ads Plan", "TikTok Shop Video Shopping Ads Plan", "TikTok Shop GMV Max vs Auto ROAS Comparison", "TikTok Shop Performance Report", "TikTok Shop Affiliate Ads Strategy"],
    "Marketplace — Tokopedia & Lazada": ["Tokopedia TopAds Campaign Plan", "Tokopedia TopAds Performance Report", "Tokopedia TopAds Budget Optimization", "Lazada Sponsored Campaign Plan", "Lazada Ads Performance Report"],
    "Marketplace — Cross Platform": ["Product Listing / PDP Optimization", "Marketplace Storefront Optimization", "Marketplace Promo & Campaign Calendar", "Marketplace Pricing Strategy", "Marketplace Review & Rating Strategy", "Marketplace Voucher & Promo Strategy", "Marketplace Fee Structure Analysis", "Marketplace Competitor Price Monitoring", "Live Shopping Strategy & Script", "Affiliate Marketplace Strategy", "Marketplace Budget Allocation Strategy", "Marketplace Analytics Dashboard", "Marketplace A/B Test Plan", "Marketplace Monthly Report", "Marketplace vs Paid Ads ROI Comparison"],
    "Ad Creative & Copy": ["Ad Copy Multi-Platform (Meta, Google, TikTok, LinkedIn)", "Ad Creative Brief per Platform", "TikTok Ad Script (Native, UGC-style)", "YouTube Ad Script (Pre-roll, Mid-roll, Bumper)", "Podcast Ad Script", "High-Ticket Sales Page Copy", "Landing Page Copy & CRO"],
    "Product Marketing Extended": ["Product-Led Ad Campaign", "USP-Driven Ad Copy Variations", "Feature Highlight Ad Series", "Pricing / Promo Ad Strategy", "Competitor Comparison Ad", "Product Demo Video Ad Script", "Testimonial / Social Proof Ad Framework"],
    "Creative Brief Extended": ["Static Ad Brief", "Carousel Ad Brief", "Video Ad Brief", "Dynamic Creative Brief", "Landing Page Design Brief", "Retargeting Creative Brief", "Marketplace Product Photo Brief", "Marketplace Video Listing Brief", "Marketplace A+ Content Brief", "Marketplace Storefront Banner Brief", "Live Shopping Brief (Rundown)", "Marketplace Campaign Asset Brief"],
    "Targeting & Audience": ["Lookalike Audience Strategy", "Retargeting Strategy (by funnel stage)", "Custom Audience Segmentation Plan", "Audience Exclusion & Layering Strategy", "Marketplace Audience Targeting"],
    "Optimization & Reporting": ["Ad Performance Report (per platform)", "Ad Spend Calculator & Budget Allocation", "A/B Test Plan", "Conversion Funnel Analysis", "Attribution Model", "Media Buy Plan & Pacing Report", "ROAS & CPA Optimization Report", "Landing Page A/B Test Report", "Marketplace Performance Dashboard", "Marketplace vs Paid Ads ROI Report", "Marketplace Monthly Report (per platform)"],
  },
  "social-media": {
    "Strategy & Audit": ["Social Media Strategy (per platform)", "Social Media Audit", "Brand Voice Guide (Social Media)", "Hashtag Strategy", "Viral Content Formula & Framework", "UGC Strategy", "Community Management Plan"],
    "Content Planning": ["Social Media Calendar (Weekly/Monthly)", "Content Pillar & Theme Framework", "Short-form Video Plan (30 hari)", "Content Repurposing Plan", "Seasonal & Trending Content Plan"],
    "Content Creation": ["Instagram Carousel (slide-by-slide)", "TikTok Script (hook, transition, CTA)", "Reels / Shorts Script", "YouTube Video Script (long-form)", "Video Script (tutorial, testimonial, BTS)", "Caption Writing (per platform)", "Stories Template & Script", "Thread / Twitter/X Script", "LinkedIn Post Script", "Pinterest Pin Copy & Strategy"],
    "Product Marketing Extended": ["Product Launch Social Media Campaign", "USP-Based Content Series", "Value Proposition Carousel", "Product Feature Spotlight Series", "Customer Testimonial Content Plan", "Competitor Comparison Content", "Product FAQ Content Series", "Pricing / Offer Announcement Content", "Behind-the-Product Content"],
    "Creative Brief Extended": ["Instagram Feed Post Brief", "Instagram Carousel Brief (per slide)", "Instagram Stories Brief", "TikTok / Reels Video Brief", "YouTube Thumbnail & Title Brief", "Social Media Campaign Asset Pack Brief", "UGC Brief for Creator / Customer", "Meme / Trending Content Brief"],
    "Reporting & Growth": ["Social Media Performance Report", "Content Performance Analysis", "Best Performing Content Report", "Follower Growth & Engagement Tracking", "Sentiment Analysis"],
  },
  "seo": {
    "SEO Audit & Technical": ["Full SEO Audit (on-page, off-page, technical)", "Technical SEO Audit", "Core Web Vitals Analysis", "Site Architecture & Internal Linking Strategy", "Schema Markup Plan", "Mobile SEO Audit", "International SEO / Hreflang Strategy"],
    "Keyword & Content Strategy": ["Keyword Research & Mapping", "Content Strategy (Pillar-Cluster Model)", "Content Calendar (SEO-driven)", "Blog Post / Article Writing (SEO-optimized)", "Landing Page SEO Copywriting", "Content Gap Analysis", "Search Intent Mapping", "Featured Snippet Optimization Plan"],
    "Off-Page & Link Building": ["Link Building Strategy", "Digital PR & Outreach Plan", "Guest Posting Strategy", "Local SEO Plan (GMB, citations)", "Brand Mention & Unlinked Mention Strategy"],
    "Product Marketing Extended": ["Product Page SEO Optimization", "Product Category Page Strategy", "Product Comparison Landing Page (SEO)", "USP-Driven Keyword Mapping", "Product FAQ Schema & Content", "Product Review & Testimonial SEO", "Product Launch SEO Checklist", "Pricing Page SEO Strategy", "Feature-Specific Long-tail Keyword Plan"],
    "Creative Brief Extended": ["Blog Article Brief", "Landing Page Brief (SEO-focused)", "Infographic Brief", "Pillar Page Brief", "Product Page Brief (SEO)", "Local SEO Content Brief", "Link Building Outreach Brief"],
    "Analytics & Reporting": ["SEO Performance Report", "Analytics Setup Guide (GA4, Search Console)", "Organic Traffic Forecasting", "Keyword Ranking Tracker", "Competitor SEO Benchmarking", "Page-by-Page SEO Score Report", "CRO for Organic Landing Pages"],
  },
  "kol": {
    "Campaign Strategy & Planning": ["KOL / Influencer Campaign Strategy", "Co-Marketing Plan (Brand x KOL)", "Campaign Brief & KOL Brief Template", "KOL Selection & Shortlist Criteria", "Campaign Timeline & Activation Plan", "Budget Allocation (per KOL tier)", "Affiliate / Ambassador Program Design"],
    "Content & Creative Direction": ["Content Brief for KOL", "TikTok Script for KOL", "Instagram Carousel Brief for KOL Collab", "YouTube Video Brief / Script for KOL", "Reels / Shorts Brief for KOL", "UGC Content Guidelines", "Product Seeding & Unboxing Brief", "Event / Live Activation Brief", "Hashtag & Campaign Tag Strategy"],
    "Product Marketing Extended": ["Product Storytelling Brief for KOL", "Value Proposition Talking Points per KOL Tier", "Product Comparison Review Brief", "Feature Demo Brief for KOL", "Product Launch KOL Activation Plan", "Testimonial Script Framework", "Pricing / Promo Announcement Brief for KOL", "Product Bundling / Collab Brief", "KOL x Product Co-Creation Campaign"],
    "Creative Brief Extended": ["KOL Campaign Brief Pack", "KOL Video Brief", "KOL Photo Brief", "KOL Stories/Reels Brief", "Unboxing Experience Brief", "KOL Event / Live Brief (rundown)", "Paid Amplification Brief", "UGC Repurpose Brief"],
    "Negotiation & Management": ["KOL Rate Card & Negotiation Framework", "Contract / Agreement Template Points", "KOL Communication & Follow-up SOP", "Content Approval Workflow", "Whitelisting & Paid Amplification Plan"],
    "Reporting & Measurement": ["KOL Campaign Performance Report", "Earned Media Value (EMV) Calculation", "Cost-per-Engagement & CPV Analysis", "KOL Comparison & ROI Report", "Sentiment & Comment Analysis (KOL content)", "Benchmarking Report (KOL vs Paid Ads)"],
  },
};

const REPORT_DELIVERABLES = {
  "dm-manager": {
    "Executive Report": ["Monthly Digital Marketing Performance Report", "Quarterly Business Review (QBR)", "Campaign ROI Summary Report", "Channel Performance Comparison Report", "Budget vs Actual Spending Report", "YoY / MoM Growth Analysis Report"],
    "Deep Analysis Report": ["Marketing Funnel Analysis (TOFU-MOFU-BOFU)", "Customer Acquisition Cost (CAC) Analysis", "Customer Lifetime Value (CLV) Report", "Attribution Model Performance Report", "Cross-Channel Synergy Analysis", "Market Share & SOV Analysis"],
    "Strategic Insight Report": ["Competitive Landscape Intelligence Report", "Industry Trend & Opportunity Report", "Audience Behavior Shift Report", "Channel Saturation & New Channel Recommendation", "Budget Reallocation Recommendation", "Growth Opportunity Mapping Report"],
  },
  "performance": {
    "Platform Performance Report": ["Meta Ads Performance Report (with Analysis & Recommendation)", "Google Ads Performance Report (Search, Display, PMax)", "TikTok Ads Performance Report", "LinkedIn Ads Performance Report", "YouTube Ads Performance Report", "Cross-Platform Ads Comparison Report"],
    "Marketplace Performance Report": ["Shopee GMV Max Performance Report (with ROAS Analysis)", "TikTok Shop Performance Report (GMV Max & Auto ROAS)", "Tokopedia TopAds Performance Report", "Lazada Ads Performance Report", "Cross-Marketplace Performance Comparison", "Marketplace vs Paid Ads ROI Comparison Report"],
    "Deep Analysis Report": ["Ad Creative Performance Analysis (which creative wins & why)", "Audience Segment Performance Analysis", "Landing Page Conversion Analysis", "Funnel Drop-off Analysis per Platform", "Budget Pacing & Spend Efficiency Report", "ROAS Trend Analysis & Forecasting", "CPA Optimization Report", "A/B Test Results & Insights Report"],
    "Strategic Recommendation Report": ["Budget Reallocation Recommendation (across platforms)", "Scaling Strategy Report (when & how to scale)", "New Platform / Channel Expansion Recommendation", "Creative Fatigue Detection & Refresh Recommendation", "Audience Expansion Strategy Report", "Seasonal Campaign Performance Prediction"],
  },
  "social-media": {
    "Content Performance Report": ["Monthly Social Media Performance Report", "Content Type Performance Analysis (carousel, reels, static, story)", "Best Performing Content Report (Top 10 with analysis)", "Content Pillar Performance Analysis", "Posting Time & Frequency Optimization Report", "Hashtag Performance Analysis"],
    "Audience & Engagement Report": ["Audience Growth & Demographics Report", "Engagement Rate Analysis by Platform", "Community Sentiment Analysis", "Follower Behavior & Activity Pattern Report", "DM & Comment Response Analysis", "UGC Performance & Impact Report"],
    "Strategic Insight Report": ["Competitor Social Media Benchmarking Report", "Trending Topic & Opportunity Report", "Content Gap Analysis Report", "Platform Algorithm Change Impact Report", "Influencer/Creator Collab Performance Analysis", "Social Commerce Conversion Report"],
  },
  "seo": {
    "SEO Performance Report": ["Monthly SEO Performance Report", "Keyword Ranking Movement Report", "Organic Traffic Analysis Report", "Page-by-Page SEO Performance Report", "Core Web Vitals Performance Report", "Crawl Health & Indexation Report"],
    "Content & Link Report": ["Content Performance Report (traffic, engagement, conversion)", "Backlink Profile Analysis Report", "Link Building Campaign Report", "Content Decay & Refresh Priority Report", "Featured Snippet Tracking Report", "Internal Linking Health Report"],
    "Strategic Insight Report": ["Competitor SEO Gap Analysis", "Search Intent Shift Report", "SERP Feature Opportunity Report", "Technical SEO Audit Summary", "Local SEO Performance Report", "SEO Forecast & Growth Projection"],
  },
  "kol": {
    "Campaign Performance Report": ["KOL Campaign Performance Report", "Per-KOL Performance Comparison Report", "Content Performance Analysis (per KOL)", "Earned Media Value (EMV) Report", "Campaign Timeline vs Results Report", "Cost-per-Engagement & CPV Analysis"],
    "ROI & Value Report": ["KOL ROI Comparison Report", "KOL vs Paid Ads Performance Comparison", "Affiliate Revenue Attribution Report", "Brand Lift & Awareness Impact Report", "Audience Quality & Overlap Analysis", "Long-term Brand Ambassador Value Report"],
    "Strategic Recommendation Report": ["KOL Tier Performance Analysis (nano/micro/macro/mega)", "Content Format Recommendation per KOL", "New KOL Discovery & Recommendation Report", "KOL Rate Negotiation Data Report", "Campaign Optimization Recommendation", "Seasonal KOL Planning Report"],
  },
};

const STRATEGY_UPLOADS = [
  { icon: "📄", title: "Company Profile / Pitch Deck", accept: ".pdf,.pptx,.docx", desc: "PDF, PPTX, DOCX", multi: true },
  { icon: "🎨", title: "Brand Guidelines / Logo Kit", accept: ".png,.jpg,.svg,.pdf", desc: "PNG, JPG, SVG, PDF", multi: true },
  { icon: "📝", title: "Brief Document / Notes", accept: ".pdf,.docx,.txt", desc: "PDF, DOCX, TXT", multi: true },
  { icon: "📸", title: "Competitor Reference / Screenshot", accept: ".png,.jpg,.webp", desc: "PNG, JPG, WEBP", multi: true, screenshot: true },
];

const REPORT_UPLOADS = [
  { icon: "📊", title: "Meta Ads Dashboard", accept: ".csv,.xlsx,.pdf,.png,.jpg", desc: "CSV, XLSX, PDF, Screenshot", multi: true, screenshot: true },
  { icon: "🛒", title: "Shopee Seller Center / GMV Max Data", accept: ".csv,.xlsx,.pdf,.png,.jpg", desc: "CSV, XLSX, PDF, Screenshot", multi: true, screenshot: true },
  { icon: "🔍", title: "Google Ads / Analytics Dashboard", accept: ".csv,.xlsx,.pdf,.png,.jpg", desc: "CSV, XLSX, PDF, Screenshot", multi: true, screenshot: true },
  { icon: "🎵", title: "TikTok Ads / TikTok Shop Data", accept: ".csv,.xlsx,.pdf,.png,.jpg", desc: "CSV, XLSX, PDF, Screenshot", multi: true, screenshot: true },
  { icon: "📱", title: "Social Media Analytics Export", accept: ".csv,.xlsx,.pdf,.png,.jpg", desc: "CSV, XLSX, PDF, Screenshot", multi: true, screenshot: true },
  { icon: "🔗", title: "Tokopedia / Lazada / Marketplace Lain", accept: ".csv,.xlsx,.pdf,.png,.jpg", desc: "CSV, XLSX, PDF, Screenshot", multi: true, screenshot: true },
  { icon: "📈", title: "Data Lainnya (Custom)", accept: ".csv,.xlsx,.pdf,.png,.jpg,.docx,.txt", desc: "Semua format data", multi: true, screenshot: true },
];

const STEPS = ["Role & Mode", "Upload File", "Info Brand", "Product Detail", "Competitor", "Deliverables", "Preferensi", "Review"];

// ===== HELPER COMPONENTS =====
const Pill = ({ label, selected, onClick }) => (
  <button onClick={onClick} className={`inline-block px-4 py-2 rounded-full text-xs transition-all cursor-pointer ${selected ? "border-2 border-gray-900 bg-amber-50 font-semibold" : "border border-gray-200 bg-white font-normal"}`}>{label}</button>
);

const Field = ({ label, opt, placeholder, type = "text", value, onChange }) => {
  const cls = "w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all";
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-1.5">{label} {opt && <span className="font-normal text-gray-400 text-xs">opsional</span>}</div>
      {type === "textarea"
        ? <textarea placeholder={placeholder} value={value || ""} onChange={e => onChange(e.target.value)} className={cls} style={{ resize: "vertical", minHeight: 80, fontFamily: "inherit" }} />
        : <input type={type} placeholder={placeholder} value={value || ""} onChange={e => onChange(e.target.value)} className={cls} style={{ fontFamily: "inherit" }} />
      }
    </div>
  );
};

const Nav = ({ page, setPage, ok = true }) => (
  <div className="flex gap-3 mt-7">
    {page > 1 && <button onClick={() => setPage(page - 1)} className="px-6 py-3 border border-gray-200 rounded-xl bg-white cursor-pointer text-sm font-medium">← Kembali</button>}
    <button onClick={() => ok && setPage(page + 1)} className={`flex-1 px-6 py-3 border-none rounded-xl text-sm font-bold tracking-wide ${ok ? "bg-gray-900 text-amber-300 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-default"}`}>
      {page === 8 ? "🚀 Generate Deliverables" : "Lanjut →"}
    </button>
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">{children}</div>
);

const Title = ({ text, sub }) => (
  <div className="mb-5">
    <h2 className="text-xl font-extrabold tracking-tight">{text}</h2>
    {sub && <p className="text-gray-500 text-sm mt-1">{sub}</p>}
  </div>
);

// ===== FILE UPLOAD =====
const FileUploadZone = ({ cat, files, setFiles, idx }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles);
    setFiles(prev => ({ ...prev, [idx]: [...(prev[idx] || []), ...arr.map(f => ({ name: f.name, size: f.size, type: f.type }))] }));
  };
  const removeFile = (fi) => setFiles(prev => ({ ...prev, [idx]: (prev[idx] || []).filter((_, i) => i !== fi) }));
  const handlePaste = useCallback(e => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) setFiles(prev => ({ ...prev, [idx]: [...(prev[idx] || []), { name: `screenshot-${Date.now()}.png`, size: file.size, type: file.type }] }));
      }
    }
  }, [idx, setFiles]);
  const cur = files[idx] || [];

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-2.5 bg-gray-50">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="text-2xl">{cat.icon}</span>
        <div className="flex-1">
          <div className="font-semibold text-sm">{cat.title}</div>
          <div className="text-xs text-gray-400">{cat.desc}</div>
        </div>
        {cur.length > 0 && <span className="bg-green-50 text-green-500 text-xs font-bold px-2.5 py-0.5 rounded-full">{cur.length} file</span>}
      </div>
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${dragOver ? "border-amber-500 bg-amber-50" : "border-gray-300"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onPaste={cat.screenshot ? handlePaste : undefined}
        tabIndex={cat.screenshot ? 0 : undefined}
      >
        <input ref={inputRef} type="file" accept={cat.accept} multiple={cat.multi} className="hidden" onChange={e => addFiles(e.target.files)} />
        <div className="text-xs text-gray-500">
          <span className="text-xl">📎</span><br />
          <strong>Klik upload</strong> atau drag & drop<br />
          {cat.screenshot && <span className="text-amber-500 font-semibold">📷 Paste screenshot (Ctrl+V)</span>}
          {cat.screenshot && <br />}
          <span className="text-gray-400 text-xs">Multi-file supported</span>
        </div>
      </div>
      {cur.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {cur.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs">
              {f.type?.startsWith("image/") ? "🖼️" : "📄"} {f.name.length > 25 ? f.name.slice(0, 22) + "..." : f.name}
              <span className="cursor-pointer text-red-500 font-bold text-sm" onClick={() => removeFile(i)}>×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== PAGES =====
const P1 = ({ data, set, setPage }) => (
  <Card>
    <Title text="Pilih Role & Mode" sub="Kamu berperan sebagai apa, dan mau bikin apa?" />
    <div className="mb-6">
      <div className="text-sm font-bold mb-2.5">🎮 Mode</div>
      <div className="grid grid-cols-3 gap-2.5">
        {MODES.map(m => (
          <div key={m.id} onClick={() => set({ ...data, mode: m.id })} className={`border-2 rounded-2xl p-5 cursor-pointer text-center transition-all ${data.mode === m.id ? "border-gray-900 bg-amber-50" : "border-gray-200 bg-white hover:border-amber-400"}`}>
            <div className="text-3xl mb-1.5">{m.icon}</div>
            <div className="font-bold text-sm mb-1">{m.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{m.desc}</div>
            {data.mode === m.id && <div className="mt-2 text-white text-xs font-bold px-2.5 py-0.5 rounded-full inline-block" style={{ background: m.color }}>SELECTED</div>}
          </div>
        ))}
      </div>
    </div>
    <div className="text-sm font-bold mb-2.5">👤 Role</div>
    <div className="flex flex-col gap-2.5">
      {ROLES.map(r => {
        const sel = data.role === r.id;
        return (
          <div key={r.id} onClick={() => set({ ...data, role: r.id })} className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all ${sel ? "border-2 border-gray-900 bg-amber-50" : "border border-gray-200 bg-white"}`}>
            <div className={`text-3xl w-11 h-11 flex items-center justify-center rounded-lg ${sel ? "bg-white" : "bg-gray-50"}`}>{r.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{r.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
            </div>
            {sel && <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#F5A623,#F3C11B)" }}>✓</div>}
          </div>
        );
      })}
    </div>
    <Nav page={1} setPage={setPage} ok={!!data.role && !!data.mode} />
  </Card>
);

const P2 = ({ data, setPage }) => {
  const [files, setFiles] = useState({});
  const mode = data.mode;
  const totalFiles = Object.values(files).flat().length;
  return (
    <Card>
      <Title text="Upload File & Data" sub={mode === "report" ? "Upload data mentahan dari dashboard — multi-file & screenshot" : mode === "both" ? "Upload semua: brand asset + dashboard data" : "Upload file brand & referensi (opsional)"} />
      {(mode === "report" || mode === "both") && (
        <div className="bg-amber-50 border border-amber-400 rounded-xl p-3.5 mb-4 text-xs leading-relaxed">
          <strong className="text-amber-600">💡 Tips Upload Dashboard:</strong><br />
          • Export data dari Meta Ads Manager, Shopee Seller Center, Google Ads, dll<br />
          • Format CSV/XLSX paling ideal — bisa langsung dianalisa AI<br />
          • Screenshot juga OK — AI bisa baca data dari gambar<br />
          • Upload sebanyak mungkin — makin banyak data, makin akurat report-nya
        </div>
      )}
      {totalFiles > 0 && (
        <div className="flex items-center gap-2 mb-3.5 px-4 py-2.5 bg-green-50 rounded-xl border border-green-200">
          <span className="text-lg">✅</span>
          <span className="text-sm font-semibold text-green-500">{totalFiles} file uploaded</span>
        </div>
      )}
      {mode === "both" && <div className="text-sm font-bold mb-2 text-amber-500">📁 Brand & Strategy Files</div>}
      {(mode === "strategy" || mode === "both") && STRATEGY_UPLOADS.map((cat, i) => <FileUploadZone key={"s" + i} cat={cat} files={files} setFiles={setFiles} idx={"s" + i} />)}
      {mode === "both" && <hr className="my-4 border-gray-200" />}
      {mode === "both" && <div className="text-sm font-bold mb-2 text-purple-600">📊 Dashboard & Report Data</div>}
      {(mode === "report" || mode === "both") && REPORT_UPLOADS.map((cat, i) => <FileUploadZone key={"r" + i} cat={cat} files={files} setFiles={setFiles} idx={"r" + i} />)}
      <div className="bg-gray-50 p-3 rounded-lg mt-3.5 text-center text-xs text-gray-400">Belum ada file? Skip dan isi form manual</div>
      <Nav page={2} setPage={setPage} />
    </Card>
  );
};

const P3 = ({ data, set, setPage }) => {
  const b = data.brand || {};
  const u = (k, v) => set({ ...data, brand: { ...b, [k]: v } });
  return (
    <Card>
      <Title text="Informasi Brand & Bisnis" sub="Isi sebisanya — AI otomatis lengkapi yang kosong" />
      <Field label="Nama Brand / Perusahaan" placeholder="PT Contoh Maju Bersama" value={b.name} onChange={v => u("name", v)} />
      <Field label="Industri / Bidang" placeholder="F&B, Fashion, SaaS, Logistik..." value={b.industry} onChange={v => u("industry", v)} />
      <Field label="Produk / Jasa Utama" placeholder="Apa yang dijual?" value={b.product} onChange={v => u("product", v)} />
      <Field label="Target Market" opt placeholder="B2B, B2C, health-conscious millennials..." value={b.target} onChange={v => u("target", v)} />
      <Field label="Lokasi / Coverage Area" opt placeholder="Jakarta, Indonesia" value={b.location} onChange={v => u("location", v)} />
      <Field label="Deskripsi Bisnis" opt type="textarea" placeholder="Jelaskan singkat tentang bisnis client..." value={b.desc} onChange={v => u("desc", v)} />
      <Field label="Pembeda / USP" opt placeholder="Keunggulan unik, sertifikasi, pengalaman" value={b.usp} onChange={v => u("usp", v)} />
      <Field label="Website URL" opt placeholder="https://brand.com" value={b.web} onChange={v => u("web", v)} />
      <Field label="Social Media Links" opt placeholder="@brand di IG, TikTok, LinkedIn..." value={b.socials} onChange={v => u("socials", v)} />
      <div className="mb-4">
        <div className="text-sm font-semibold mb-2">Warna Brand</div>
        <div className="flex gap-6">
          {["primary", "secondary"].map(c => (
            <div key={c} className="flex items-center gap-2.5">
              <input type="color" value={b[c] || (c === "primary" ? "#F5A623" : "#F3C11B")} onChange={e => u(c, e.target.value)} className="w-10 h-10 border-2 border-gray-200 rounded-lg cursor-pointer" style={{ padding: 2 }} />
              <div><div className="text-xs font-semibold capitalize">{c}</div><div className="text-xs text-gray-400 font-mono">{b[c] || (c === "primary" ? "#F5A623" : "#F3C11B")}</div></div>
            </div>
          ))}
        </div>
      </div>
      <Nav page={3} setPage={setPage} />
    </Card>
  );
};

const P4 = ({ data, set, setPage }) => {
  const p = data.product || {};
  const u = (k, v) => set({ ...data, product: { ...p, [k]: v } });
  return (
    <Card>
      <Title text="Product & Market Detail" sub="Biar kita bikin USP, VP, positioning yang tajam" />
      <Field label="Nama Produk / Service Utama" placeholder="Healthy Snack Bar Premium" value={p.name} onChange={v => u("name", v)} />
      <Field label="Harga / Range Harga" placeholder="Rp 25.000 - Rp 50.000" value={p.price} onChange={v => u("price", v)} />
      <Field label="Fitur Unggulan" type="textarea" placeholder="Tanpa gula tambahan, organic certified..." value={p.features} onChange={v => u("features", v)} />
      <Field label="Manfaat Utama" opt type="textarea" placeholder="Snack sehat yang praktis..." value={p.benefits} onChange={v => u("benefits", v)} />
      <Field label="Pain Point Customer" opt type="textarea" placeholder="Susah cari snack sehat yang enak..." value={p.pain} onChange={v => u("pain", v)} />
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Stage Bisnis</div><div className="flex gap-2 flex-wrap">{["Baru Launch", "Growing", "Mature", "Pivot / Rebrand"].map(s => <Pill key={s} label={s} selected={p.stage === s} onClick={() => u("stage", s)} />)}</div></div>
      <Field label="Channel yang Sudah Jalan" opt placeholder="Instagram, TikTok Ads, Shopee..." value={p.channels} onChange={v => u("channels", v)} />
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Budget Marketing</div><div className="flex gap-2 flex-wrap">{["< 5 juta", "5-20 juta", "20-50 juta", "50-100 juta", "100 juta+"].map(s => <Pill key={s} label={s} selected={p.budget === s} onClick={() => u("budget", s)} />)}</div></div>
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Objective Utama</div><div className="flex gap-2 flex-wrap">{["Awareness", "Traffic", "Leads", "Sales / Conversion", "Retention"].map(s => <Pill key={s} label={s} selected={p.obj === s} onClick={() => u("obj", s)} />)}</div></div>
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Timeline Campaign</div><div className="flex gap-2 flex-wrap">{["1 bulan", "3 bulan", "6 bulan", "12 bulan"].map(s => <Pill key={s} label={s} selected={p.timeline === s} onClick={() => u("timeline", s)} />)}</div></div>
      {(data.mode === "report" || data.mode === "both") && (
        <div className="border border-purple-400 rounded-xl p-4 bg-purple-50">
          <div className="text-sm font-bold text-purple-600 mb-2">📊 Report Period</div>
          <div className="flex gap-2 flex-wrap mb-2.5">{["Weekly", "Monthly", "Quarterly", "Custom"].map(s => <Pill key={s} label={s} selected={p.reportPeriod === s} onClick={() => u("reportPeriod", s)} />)}</div>
          <Field label="Periode Spesifik" opt placeholder="Contoh: Januari 2026, Q4 2025" value={p.reportRange} onChange={v => u("reportRange", v)} />
        </div>
      )}
      <Nav page={4} setPage={setPage} />
    </Card>
  );
};

const P5 = ({ data, set, setPage }) => {
  const comps = data.comps || [{}, {}, {}];
  const notes = data.compNotes || {};
  const uc = (i, k, v) => { const c = [...comps]; c[i] = { ...c[i], [k]: v }; set({ ...data, comps: c }); };
  const un = (k, v) => set({ ...data, compNotes: { ...notes, [k]: v } });
  return (
    <Card>
      <Title text="Competitor & Benchmark" sub="Siapa kompetitor yang harus kita kalahkan?" />
      {[0, 1, 2].map(i => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50">
          <div className="text-sm font-bold mb-2.5 text-amber-500">Kompetitor {i + 1} {i > 0 && <span className="font-normal text-gray-400 text-xs">opsional</span>}</div>
          <Field label="Nama" placeholder="Brand XYZ" value={comps[i]?.name} onChange={v => uc(i, "name", v)} />
          <Field label="Website" opt placeholder="https://competitor.com" value={comps[i]?.web} onChange={v => uc(i, "web", v)} />
          <Field label="Social Media" opt placeholder="@competitor di IG, TikTok..." value={comps[i]?.socials} onChange={v => uc(i, "socials", v)} />
        </div>
      ))}
      <Field label="Yang kompetitor lakukan lebih baik?" opt type="textarea" placeholder="Content lebih konsisten..." value={notes.theyBetter} onChange={v => un("theyBetter", v)} />
      <Field label="Yang client lakukan lebih baik?" opt type="textarea" placeholder="Kualitas produk lebih bagus..." value={notes.weBetter} onChange={v => un("weBetter", v)} />
      <Field label="Referensi campaign yang disukai" opt type="textarea" placeholder="Link atau deskripsi..." value={notes.refs} onChange={v => un("refs", v)} />
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Tone & Style</div><div className="flex gap-2 flex-wrap">{["Professional", "Casual", "Playful", "Bold", "Premium", "Friendly", "Edgy"].map(t => <Pill key={t} label={t} selected={notes.tone === t} onClick={() => un("tone", t)} />)}</div></div>
      <Nav page={5} setPage={setPage} />
    </Card>
  );
};

const P6 = ({ data, set, setPage }) => {
  const sel = data.dels || [];
  const mode = data.mode;
  const rd = ROLE_DELIVERABLES[data.role] || {};
  const rpt = REPORT_DELIVERABLES[data.role] || {};
  const roleName = ROLES.find(r => r.id === data.role)?.title || "";
  const showStrategy = mode === "strategy" || mode === "both";
  const showReport = mode === "report" || mode === "both";
  const strategyItems = showStrategy ? [...Object.values(SHARED).flat(), ...Object.values(rd).flat()] : [];
  const reportItems = showReport ? Object.values(rpt).flat() : [];
  const allItems = [...strategyItems, ...reportItems];
  const [open, setOpen] = useState({});

  const toggle = item => set({ ...data, dels: sel.includes(item) ? sel.filter(d => d !== item) : [...sel, item] });
  const toggleCat = cat => setOpen({ ...open, [cat]: !open[cat] });
  const selectPack = id => {
    if (id === "all") { set({ ...data, dels: allItems }); return; }
    if (id === "clear") { set({ ...data, dels: [] }); return; }
    const shared = Object.values(SHARED).flat();
    if (id === "essential" && showStrategy) { set({ ...data, dels: [...SHARED["Foundation & Research"], ...SHARED["Product Marketing"].slice(0, 5), ...SHARED["Creative Brief"]] }); return; }
    if (id === "strategy" && showStrategy) { set({ ...data, dels: [...shared, ...(rd[Object.keys(rd)[0]] || [])] }); return; }
    if (id === "content" && showStrategy) { const ck = Object.keys(rd).filter(k => /(content|creative|copy|script)/i.test(k)); set({ ...data, dels: [...shared, ...ck.flatMap(k => rd[k])] }); return; }
    if (id === "report" && showReport) { set({ ...data, dels: [...reportItems] }); return; }
  };

  const renderCat = (cat, items, accent, icon) => {
    const isOpen = open[cat] !== false;
    const count = items.filter(it => sel.includes(it)).length;
    const allSel = items.length > 0 && items.every(it => sel.includes(it));
    const toggleAll = () => { if (allSel) set({ ...data, dels: sel.filter(d => !items.includes(d)) }); else set({ ...data, dels: [...new Set([...sel, ...items])] }); };
    return (
      <div key={cat} className="mb-1.5">
        <div onClick={() => toggleCat(cat)} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg cursor-pointer select-none ${accent || "bg-gray-50"}`}>
          <span className={`text-xs text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
          {icon && <span className="text-xs">{icon}</span>}
          <span className="flex-1 font-semibold text-sm">{cat}</span>
          <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full">{count}/{items.length}</span>
          <button onClick={e => { e.stopPropagation(); toggleAll(); }} className="text-xs px-2.5 py-1 rounded-md border border-gray-200 bg-white cursor-pointer font-medium">{allSel ? "Deselect" : "Select All"}</button>
        </div>
        {isOpen && <div className="py-1 pl-2">
          {items.map(item => (
            <label key={item} className="flex items-center gap-2.5 py-1.5 px-2.5 cursor-pointer rounded-md text-sm hover:bg-gray-50">
              <input type="checkbox" checked={sel.includes(item)} onChange={() => toggle(item)} className="accent-amber-500 w-4 h-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>}
      </div>
    );
  };

  return (
    <Card>
      <Title text="Pilih Deliverables" sub={<>Role: <strong>{roleName}</strong> — Mode: <strong>{mode === "both" ? "Full" : mode === "report" ? "Report" : "Strategy"}</strong></>} />
      <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border border-amber-400" style={{ background: "linear-gradient(135deg,#fffbf0,#fff)" }}>
        <span className="text-xl">📋</span>
        <span className="text-base font-bold text-amber-500">{sel.length}</span>
        <span className="text-sm text-gray-500">deliverable dipilih dari {allItems.length} tersedia</span>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {showStrategy && [{id:"essential",l:"Essential",c:"#F5A623"},{id:"strategy",l:"Strategy",c:"#22c55e"},{id:"content",l:"Content",c:"#3b82f6"}].map(p => (
          <button key={p.id} onClick={() => selectPack(p.id)} className="px-3.5 py-1.5 rounded-full bg-white cursor-pointer text-xs font-semibold" style={{ border: `1.5px solid ${p.c}`, color: p.c }}>{p.l}</button>
        ))}
        {showReport && <button onClick={() => selectPack("report")} className="px-3.5 py-1.5 rounded-full bg-white cursor-pointer text-xs font-semibold border-purple-500 text-purple-500" style={{ border: "1.5px solid #8b5cf6", color: "#8b5cf6" }}>📊 All Reports</button>}
        <button onClick={() => selectPack("all")} className="px-3.5 py-1.5 rounded-full bg-white cursor-pointer text-xs font-semibold" style={{ border: "1.5px solid #1a1a1a" }}>Select All</button>
        {sel.length > 0 && <button onClick={() => selectPack("clear")} className="px-3.5 py-1.5 rounded-full bg-white cursor-pointer text-xs font-semibold" style={{ border: "1.5px solid #ef4444", color: "#ef4444" }}>Clear</button>}
      </div>

      {showStrategy && <>
        <div className="text-sm font-bold mb-1.5 text-amber-500">📌 Shared Deliverables</div>
        {Object.entries(SHARED).map(([c, items]) => renderCat(c, items, "bg-amber-50"))}
        <hr className="my-4 border-gray-200" />
        <div className="text-sm font-bold mb-1.5">🎯 {roleName} — Strategy</div>
        {Object.entries(rd).map(([c, items]) => renderCat(c, items))}
      </>}

      {showReport && <>
        {showStrategy && <hr className="my-4 border-gray-200" />}
        <div className="text-sm font-bold mb-1.5 text-purple-600">📊 {roleName} — Report & Analysis</div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-2.5 text-xs text-purple-800 leading-relaxed">
          Setiap report include: <strong>Executive Summary → Data & Performance → Deep Analysis → Insights → Recommendations & Action Plan</strong>
        </div>
        {Object.entries(rpt).map(([c, items]) => renderCat(c, items, "bg-purple-50", "📊"))}
      </>}
      <Nav page={6} setPage={setPage} ok={sel.length > 0} />
    </Card>
  );
};

const P7 = ({ data, set, setPage }) => {
  const pref = data.pref || {};
  const u = (k, v) => set({ ...data, pref: { ...pref, [k]: v } });
  const toggleFmt = f => { const fmts = pref.fmts || []; u("fmts", fmts.includes(f) ? fmts.filter(x => x !== f) : [...fmts, f]); };
  return (
    <Card>
      <Title text="Catatan & Preferensi" sub="Request khusus sebelum generate?" />
      <Field label="Catatan Tambahan" opt type="textarea" placeholder="Fokus ke market Jakarta, gunakan data Q4 2025..." value={pref.notes} onChange={v => u("notes", v)} />
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Bahasa Output</div><div className="flex gap-2">{["Indonesia", "English", "Bilingual"].map(l => <Pill key={l} label={l} selected={pref.lang === l} onClick={() => u("lang", l)} />)}</div></div>
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Format Output <span className="font-normal text-gray-400 text-xs">bisa pilih lebih dari satu</span></div><div className="flex gap-2 flex-wrap">{["PPTX (Slide Deck)", "PDF (Report)", "XLSX (Spreadsheet)", "DOCX (Document)"].map(f => <Pill key={f} label={f} selected={(pref.fmts || []).includes(f)} onClick={() => toggleFmt(f)} />)}</div></div>
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Tone of Voice</div><div className="flex gap-2 flex-wrap">{["Formal", "Semi-formal", "Casual", "Bold"].map(t => <Pill key={t} label={t} selected={pref.tone === t} onClick={() => u("tone", t)} />)}</div></div>
      <div className="mb-4"><div className="text-sm font-semibold mb-2">Include Data Dummy?</div><div className="flex gap-2">{["Ya", "Tidak"].map(o => <Pill key={o} label={o} selected={pref.dummy === o} onClick={() => u("dummy", o)} />)}</div></div>
      {(data.mode === "report" || data.mode === "both") && (
        <div className="border border-purple-400 rounded-xl p-4 bg-purple-50">
          <div className="text-sm font-bold text-purple-600 mb-2.5">📊 Report Preferences</div>
          <div className="mb-3"><div className="text-xs font-semibold mb-1.5">Report Depth</div><div className="flex gap-2 flex-wrap">{["Summary (1-2 pages)", "Standard (3-5 pages)", "Comprehensive (6+ pages)"].map(d => <Pill key={d} label={d} selected={pref.reportDepth === d} onClick={() => u("reportDepth", d)} />)}</div></div>
          <div className="mb-3"><div className="text-xs font-semibold mb-1.5">Include Chart?</div><div className="flex gap-2">{["Ya, lengkap", "Minimal", "Tidak"].map(o => <Pill key={o} label={o} selected={pref.reportViz === o} onClick={() => u("reportViz", o)} />)}</div></div>
          <div><div className="text-xs font-semibold mb-1.5">Comparison Period</div><div className="flex gap-2 flex-wrap">{["WoW", "MoM", "QoQ", "YoY", "Custom"].map(c => <Pill key={c} label={c} selected={pref.reportComp === c} onClick={() => u("reportComp", c)} />)}</div></div>
        </div>
      )}
      <Nav page={7} setPage={setPage} />
    </Card>
  );
};

const P8 = ({ data, setPage }) => {
  const [gen, setGen] = useState(false);
  const [prog, setProg] = useState(0);
  const [done, setDone] = useState(false);
  const [genItems, setGenItems] = useState([]);
  const [results, setResults] = useState([]);
  const [currentChunk, setCurrentChunk] = useState("");
  const [error, setError] = useState(null);
  const [viewIdx, setViewIdx] = useState(null);
  const sel = data.dels || [];
  const roleName = ROLES.find(r => r.id === data.role)?.title || "";
  const modeName = data.mode === "both" ? "Full Mode" : data.mode === "report" ? "Report Mode" : "Strategy Mode";
  const b = data.brand || {}; const p = data.product || {}; const pref = data.pref || {};

  const startGen = async () => {
    setGen(true); setProg(0); setDone(false); setGenItems([]); setResults([]); setError(null); setCurrentChunk("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, deliverables: sel }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "progress") {
              setProg((event.index / sel.length) * 100);
              setCurrentChunk("");
            } else if (event.type === "chunk") {
              setCurrentChunk(prev => prev + event.text);
            } else if (event.type === "done_item") {
              setGenItems(prev => [...prev, event.deliverable]);
              setResults(prev => [...prev, { deliverable: event.deliverable, content: event.content }]);
              setProg(((event.index + 1) / sel.length) * 100);
              setCurrentChunk("");
            } else if (event.type === "done_all") {
              setDone(true);
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          } catch (e) {
            if (e.message && !e.message.includes("JSON")) throw e;
          }
        }
      }

      setDone(true);
    } catch (err) {
      setError(err.message);
      setGen(false);
    }
  };

  const downloadMarkdown = () => {
    const content = results.map(r => `# ${r.deliverable}\n\n${r.content}\n\n---\n`).join("\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deliverables-${(b.name || "project").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify({ meta: { role: roleName, mode: modeName, brand: b.name, date: new Date().toISOString() }, deliverables: results }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deliverables-${(b.name || "project").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySingle = (content) => {
    navigator.clipboard.writeText(content);
  };

  if (done && viewIdx !== null) {
    const r = results[viewIdx];
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setViewIdx(null)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-white cursor-pointer">← Kembali</button>
          <span className="flex-1 text-sm font-bold truncate">{r?.deliverable}</span>
          <button onClick={() => copySingle(r?.content || "")} className="text-xs px-3 py-1.5 border border-amber-400 rounded-lg bg-amber-50 cursor-pointer text-amber-600 font-semibold">📋 Copy</button>
        </div>
        <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap border border-gray-200 rounded-xl p-5 max-h-[70vh] overflow-auto bg-gray-50">{r?.content}</div>
      </Card>
    );
  }

  if (done) return (
    <Card>
      <div className="text-center py-4">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-extrabold mb-1.5">Deliverables Siap!</h2>
        <p className="text-gray-500 text-sm mb-5">{results.length} deliverable berhasil di-generate untuk <strong>{roleName}</strong></p>
      </div>
      <div className="flex gap-2 mb-5">
        <button onClick={downloadMarkdown} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white cursor-pointer text-sm font-semibold" style={{ border: "2px solid #F5A623", color: "#F5A623" }}>
          <span>📄</span> Download Markdown
        </button>
        <button onClick={downloadJSON} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white cursor-pointer text-sm font-semibold" style={{ border: "2px solid #22c55e", color: "#22c55e" }}>
          <span>📋</span> Download JSON
        </button>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {results.map((r, i) => (
          <div key={i} onClick={() => setViewIdx(i)} className={`flex items-center gap-2.5 px-4 py-3 cursor-pointer hover:bg-amber-50 transition-all ${i < results.length - 1 ? "border-b border-gray-100" : ""}`}>
            <span className="text-sm">✅</span>
            <span className="flex-1 text-sm font-medium">{r.deliverable}</span>
            <span className="text-xs text-gray-400">{r.content.length} chars</span>
            <span className="text-xs text-amber-500 font-semibold">Lihat →</span>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center">
        <button onClick={() => { setDone(false); setGen(false); setResults([]); setPage(1); }} className="px-6 py-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer text-sm font-medium">← Mulai Project Baru</button>
      </div>
    </Card>
  );

  if (error) return (
    <Card>
      <div className="text-center py-6">
        <div className="text-5xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-red-500">Generation Error</h2>
        <p className="text-gray-500 text-sm mb-2">{error}</p>
        <p className="text-xs text-gray-400 mb-5">Pastikan ANTHROPIC_API_KEY sudah di-set di Vercel Environment Variables</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setError(null); }} className="px-5 py-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer text-sm">← Kembali</button>
          <button onClick={() => { setError(null); startGen(); }} className="px-5 py-2.5 border-none rounded-lg bg-gray-900 text-amber-300 cursor-pointer text-sm font-bold">🔄 Coba Lagi</button>
        </div>
      </div>
    </Card>
  );

  if (gen) return (
    <Card>
      <div className="text-center py-4">
        <div className="text-4xl mb-2">🚀</div>
        <h2 className="text-xl font-bold mb-1">Generating Deliverables...</h2>
        <p className="text-gray-500 text-sm mb-5">Claude AI sedang memproses {sel.length} deliverable</p>
        <div className="bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ background: "linear-gradient(90deg,#F5A623,#F3C11B)", width: prog + "%" }} />
        </div>
        <div className="text-xs text-gray-500 mb-3">{Math.round(prog)}% — {genItems.length}/{sel.length} selesai</div>
        {currentChunk && (
          <div className="text-left bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-3 max-h-32 overflow-auto">
            <div className="text-xs text-gray-400 font-semibold mb-1">✍️ Sedang menulis...</div>
            <div className="text-xs text-gray-600 whitespace-pre-wrap">{currentChunk.slice(-500)}</div>
          </div>
        )}
        <div className="text-left max-h-52 overflow-auto border border-gray-200 rounded-xl p-3.5">
          {sel.map((item, i) => {
            const isDone = genItems.includes(item);
            const isCur = i === genItems.length;
            return (
              <div key={item} className={`flex items-center gap-2 py-1 text-xs ${isDone ? "text-gray-900" : isCur ? "text-amber-500" : "text-gray-300"}`}>
                <span className="text-sm">{isDone ? "✅" : isCur ? "🔄" : "⏳"}</span>
                <span className={`flex-1 ${isCur ? "font-semibold" : ""}`}>{item}</span>
                {isDone && <span className="text-green-500 text-xs font-semibold">done</span>}
                {isCur && <span className="text-amber-500 text-xs font-semibold pulse">generating...</span>}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );

  const rows = [
    { t: "Role", v: roleName, pg: 1 }, { t: "Mode", v: modeName, pg: 1 }, { t: "Brand", v: b.name || "—", pg: 3 }, { t: "Industri", v: b.industry || "—", pg: 3 },
    { t: "Produk", v: p.name || "—", pg: 4 }, { t: "Objective", v: p.obj || "—", pg: 4 }, { t: "Budget", v: p.budget || "—", pg: 4 }, { t: "Timeline", v: p.timeline || "—", pg: 4 },
    { t: "Kompetitor", v: (data.comps || []).filter(c => c.name).map(c => c.name).join(", ") || "—", pg: 5 },
    { t: "Deliverables", v: sel.length + " item", pg: 6 }, { t: "Bahasa", v: pref.lang || "—", pg: 7 }, { t: "Format", v: (pref.fmts || []).join(", ") || "—", pg: 7 }, { t: "Tone", v: pref.tone || "—", pg: 7 },
  ];
  if (data.mode === "report" || data.mode === "both") {
    rows.push({ t: "Report Depth", v: pref.reportDepth || "—", pg: 7 }, { t: "Comparison", v: pref.reportComp || "—", pg: 7 });
  }

  return (
    <Card>
      <Title text="Review & Generate" sub="Cek semua data sebelum generate" />
      <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
        {rows.map((r, i) => (
          <div key={i} className={`flex items-center px-4 py-2.5 ${i < rows.length - 1 ? "border-b border-gray-100" : ""} ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <div className="w-28 text-xs text-gray-500 font-medium">{r.t}</div>
            <div className={`flex-1 text-sm ${r.v === "—" ? "text-gray-300" : "text-gray-900 font-semibold"}`}>{r.v}</div>
            <button onClick={() => setPage(r.pg)} className="text-xs text-amber-500 bg-transparent border-none cursor-pointer font-semibold">Edit</button>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-400 rounded-xl p-4 mb-1">
        <div className="text-sm font-bold mb-1.5">📋 Deliverables ({sel.length})</div>
        <div className="text-xs text-gray-500 max-h-24 overflow-auto leading-loose">{sel.join("  •  ")}</div>
      </div>
      <div className="text-center text-xs text-gray-400 my-3">Estimasi: ~{Math.max(1, Math.ceil(sel.length * 0.35 / 60))} menit</div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => setPage(7)} className="px-6 py-3.5 border border-gray-200 rounded-xl bg-white cursor-pointer text-sm">← Kembali</button>
        <button onClick={startGen} disabled={sel.length === 0} className={`flex-1 px-6 py-3.5 border-none rounded-xl text-base font-extrabold tracking-wide ${sel.length > 0 ? "bg-gray-900 text-amber-300 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-default"}`}>
          🚀 Generate Deliverables
        </button>
      </div>
    </Card>
  );
};

// ===== MAIN APP =====
export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    role: null, mode: null,
    brand: { primary: "#F5A623", secondary: "#F3C11B" },
    product: {}, comps: [{}, {}, {}], compNotes: {},
    dels: [],
    pref: { lang: "Indonesia", tone: "Semi-formal", dummy: "Ya", fmts: ["PPTX (Slide Deck)", "PDF (Report)"] },
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      {/* HEADER */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-6 py-3.5" style={{ background: "#1a1a1a" }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-base" style={{ background: "linear-gradient(135deg,#F5A623,#F3C11B)", color: "#1a1a1a" }}>D</div>
        <div>
          <div className="text-white font-bold text-sm tracking-wide">Digital Marketing Playground</div>
          <div className="text-gray-500 text-xs tracking-widest uppercase">Banana Digital Boost</div>
        </div>
        <div className="ml-auto text-xs text-gray-600">v2.0</div>
      </div>

      {/* PROGRESS */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 px-5 py-3.5">
        <div className="flex max-w-2xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-0.5 rounded-full mb-1.5 transition-all" style={{ background: i + 1 < page ? "#F5A623" : i + 1 === page ? "linear-gradient(90deg,#F5A623,#F3C11B)" : "#e5e7eb" }} />
              <div className={`text-xs ${i + 1 === page ? "font-bold text-gray-900" : i + 1 < page ? "text-amber-500" : "text-gray-400"}`}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {page === 1 && <P1 data={data} set={setData} setPage={setPage} />}
        {page === 2 && <P2 data={data} setPage={setPage} />}
        {page === 3 && <P3 data={data} set={setData} setPage={setPage} />}
        {page === 4 && <P4 data={data} set={setData} setPage={setPage} />}
        {page === 5 && <P5 data={data} set={setData} setPage={setPage} />}
        {page === 6 && <P6 data={data} set={setData} setPage={setPage} />}
        {page === 7 && <P7 data={data} set={setData} setPage={setPage} />}
        {page === 8 && <P8 data={data} setPage={setPage} />}
      </div>

      {/* FOOTER */}
      <div className="text-center py-6 pb-12 text-xs text-gray-400">© 2026 Banana Digital Boost — Digital Marketing Playground v2.0</div>
    </div>
  );
}
