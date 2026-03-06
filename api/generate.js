import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(data) {
  const { role, mode, brand = {}, product = {}, comps = [], compNotes = {}, pref = {} } = data;

  const roleMap = {
    "dm-manager": "Digital Marketing Manager",
    "performance": "Performance Marketing Specialist",
    "social-media": "Social Media Specialist",
    "seo": "SEO Specialist",
    "kol": "KOL Specialist",
  };

  const modeMap = {
    strategy: "Strategy & Planning",
    report: "Data Analysis & Reporting",
    both: "Full Strategy + Report",
  };

  return `Kamu adalah seorang ${roleMap[role] || "Digital Marketing Expert"} senior dengan pengalaman 10+ tahun di digital marketing Indonesia.

Mode kerjamu: ${modeMap[mode] || "Full Mode"}

KONTEKS BRAND & BISNIS:
- Brand: ${brand.name || "Belum diisi"}
- Industri: ${brand.industry || "Belum diisi"}
- Produk/Jasa: ${brand.product || "Belum diisi"}
- Target Market: ${brand.target || "Belum diisi"}
- Lokasi: ${brand.location || "Belum diisi"}
- Deskripsi: ${brand.desc || "Belum diisi"}
- USP: ${brand.usp || "Belum diisi"}
- Website: ${brand.web || "Belum diisi"}
- Social Media: ${brand.socials || "Belum diisi"}
- Warna Brand: Primary ${brand.primary || "#F5A623"}, Secondary ${brand.secondary || "#F3C11B"}

DETAIL PRODUK:
- Nama Produk: ${product.name || "Belum diisi"}
- Harga: ${product.price || "Belum diisi"}
- Fitur Unggulan: ${product.features || "Belum diisi"}
- Manfaat: ${product.benefits || "Belum diisi"}
- Pain Point Customer: ${product.pain || "Belum diisi"}
- Stage Bisnis: ${product.stage || "Belum diisi"}
- Channel Aktif: ${product.channels || "Belum diisi"}
- Budget Marketing: ${product.budget || "Belum diisi"}
- Objective: ${product.obj || "Belum diisi"}
- Timeline: ${product.timeline || "Belum diisi"}
${product.reportPeriod ? `- Report Period: ${product.reportPeriod}` : ""}
${product.reportRange ? `- Periode Spesifik: ${product.reportRange}` : ""}

KOMPETITOR:
${comps.filter(c => c.name).map((c, i) => `${i + 1}. ${c.name}${c.web ? ` (${c.web})` : ""}${c.socials ? ` - ${c.socials}` : ""}`).join("\n") || "Belum diisi"}
- Kelebihan kompetitor: ${compNotes.theyBetter || "Belum diisi"}
- Kelebihan kita: ${compNotes.weBetter || "Belum diisi"}
- Referensi campaign: ${compNotes.refs || "Belum diisi"}
- Tone & Style: ${compNotes.tone || "Belum diisi"}

PREFERENSI OUTPUT:
- Bahasa: ${pref.lang || "Indonesia"}
- Tone: ${pref.tone || "Semi-formal"}
- Format: ${(pref.fmts || []).join(", ") || "PPTX, PDF"}
- Include Data Dummy: ${pref.dummy || "Ya"}
${pref.reportDepth ? `- Report Depth: ${pref.reportDepth}` : ""}
${pref.reportViz ? `- Include Chart: ${pref.reportViz}` : ""}
${pref.reportComp ? `- Comparison Period: ${pref.reportComp}` : ""}
${pref.notes ? `- Catatan Tambahan: ${pref.notes}` : ""}

INSTRUKSI PENTING:
1. Gunakan semua konteks di atas untuk membuat deliverable yang spesifik dan relevan
2. Jika informasi belum diisi, buat asumsi yang masuk akal dan tandai dengan [ASUMSI: ...]
3. Gunakan data dummy yang realistis jika diminta (angka, metrik, chart placeholder)
4. Setiap deliverable harus actionable dan siap digunakan oleh tim marketing
5. Gunakan format markdown yang rapi dengan heading, bullet points, dan tabel
6. Sesuaikan bahasa dan tone sesuai preferensi
7. Untuk setiap deliverable, berikan konten yang substantif dan mendetail, bukan hanya outline`;
}

function buildUserPrompt(deliverable, index, total) {
  return `Buatkan deliverable berikut secara lengkap dan mendetail:

📋 DELIVERABLE ${index + 1}/${total}: "${deliverable}"

Buatkan konten yang lengkap, profesional, dan siap pakai. Gunakan semua konteks brand, produk, kompetitor, dan preferensi yang sudah diberikan.

Format output dalam Markdown yang rapi.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, deliverables } = req.body;

  if (!deliverables || deliverables.length === 0) {
    return res.status(400).json({ error: "No deliverables selected" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  // Set up SSE streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const systemPrompt = buildSystemPrompt(data);
  const results = [];

  try {
    for (let i = 0; i < deliverables.length; i++) {
      const deliverable = deliverables[i];

      // Send progress event
      res.write(`data: ${JSON.stringify({ type: "progress", index: i, deliverable, status: "generating" })}\n\n`);

      let content = "";

      const stream = await client.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: buildUserPrompt(deliverable, i, deliverables.length) }],
      });

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta?.text) {
          content += event.delta.text;
          // Send chunk for real-time display
          res.write(`data: ${JSON.stringify({ type: "chunk", index: i, text: event.delta.text })}\n\n`);
        }
      }

      results.push({ deliverable, content });

      // Send completion event for this deliverable
      res.write(`data: ${JSON.stringify({ type: "done_item", index: i, deliverable, content })}\n\n`);
    }

    // Send final completion
    res.write(`data: ${JSON.stringify({ type: "done_all", results })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Claude API error:", error);
    res.write(`data: ${JSON.stringify({ type: "error", message: error.message || "Failed to generate" })}\n\n`);
    res.end();
  }
}
