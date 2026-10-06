export interface ConversationPreset {
  id: string;
  title: string;
  vibe: string;
  expectedScore: string;
  description: string;
  messages: Array<{ speaker: string; text: string }>;
}

export const LOVE_PRESETS: ConversationPreset[] = [
  {
    id: "bucin",
    title: "Bucin / Sangat Romantis",
    vibe: "🥰❤️",
    expectedScore: "85% - 98%",
    description: "Percakapan penuh afeksi, kerinduan intens, dan rasa sayang mendalam.",
    messages: [
      { speaker: "Aurel", text: "kangeeeennn bgt ayanggg ❤️🥺 pengen meluk kamu" },
      { speaker: "Rizky", text: "aku jg kangen parah syg, nanti malem aku jemput yaa 🥰" },
      { speaker: "Aurel", text: "beneran yaa? makasih ayangku tersayang, love you most! 💕" },
      { speaker: "Rizky", text: "selalu buat kamu cantikku 🫂 jangan lupa mam ya" },
    ],
  },
  {
    id: "manis",
    title: "Manis & Penuh Perhatian",
    vibe: "✨💖",
    expectedScore: "68% - 78%",
    description: "Interaksi hangat, saling peduli, suportif, dan ada ketertarikan romantis.",
    messages: [
      { speaker: "Sarah", text: "kamu udah makan siang blm? jgn telat makan nanti maag km kambuh" },
      { speaker: "Dimas", text: "udah kok sarah, makasih ya udah selalu ingetin aku 😊" },
      { speaker: "Sarah", text: "semangat ya kerjanya hari ini, kamu pasti bisa!" },
      { speaker: "Dimas", text: "makasih manis, nanti kabarin ya kalau udh pulang ✨" },
    ],
  },
  {
    id: "santai",
    title: "Santai & Candaan Akrab",
    vibe: "😄💬",
    expectedScore: "48% - 62%",
    description: "Percakapan kasual, saling ledek bercanda, nyaman, dan seimbang.",
    messages: [
      { speaker: "Nadia", text: "lu siang kosong ga? makan mie ayam yuk" },
      { speaker: "Bagas", text: "wkwkwk mie ayam mulu, perut lu ga kotak-kotak lg nanti" },
      { speaker: "Nadia", text: "bodo amat yg penting kenyang wkwk, lu yg traktir ya" },
      { speaker: "Bagas", text: "dih ngelunjak, yaudah gas 10 menit lg gua nyampe" },
    ],
  },
  {
    id: "dingin",
    title: "Dingin & Kurang Antusias",
    vibe: "😐❄️",
    expectedScore: "28% - 40%",
    description: "Respon singkat, pasif, datar, atau ada jarak emosional yang terasa.",
    messages: [
      { speaker: "Aldi", text: "kamu tadi gimana acaranya? seru ga?" },
      { speaker: "Vina", text: "biasa aja." },
      { speaker: "Aldi", text: "kok singkat bgt, ada yg bikin kesel kah?" },
      { speaker: "Vina", text: "gpp. lg cape aja mau tidur." },
    ],
  },
  {
    id: "konflik",
    title: "Konflik / Kesal / Jengkel",
    vibe: "😤💔",
    expectedScore: "10% - 24%",
    description: "Terdapat ketegangan, sindiran tajam, rasa jengkel, atau penolakan komunikasi.",
    messages: [
      { speaker: "Tara", text: "kamu dari mana aja sih baru bales jam segini?!" },
      { speaker: "Eko", text: "kan td udah bilang lg ada urusan, ribet bgt dah" },
      { speaker: "Tara", text: "terserah kamu aja deh, males bgt ngomong sm lo selalu banyak alasan 💔" },
      { speaker: "Eko", text: "yaudah gausah ngomong sekalian, bikin emosi terus" },
    ],
  },
];
