// chat.js
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

// Senin paylaştığın metinler
const GREETINGS = {
  en: 'bro',
  tr: 'kanka',
  de: 'bruder',
  fr: 'frérot',
  es: 'hermano',
  it: 'fratello',
  zh: '兄弟 (xiōngdì)',
  ru: 'брат (brat)',
  ar: 'أخي (akhī)',
  hi: 'भाई (bhāī)',
  id: 'bro',
  ja: '兄貴 (aniki)',
  ko: '형 (hyeong)',
  pt: 'mano',
  nl: 'maat',
  sv: 'bror',
  th: 'เพื่อน (phuean)',
  pl: 'brat',
};

const FOMO_LINES = {
  en: [
    '⏳ Bro, whitelist is closing, don’t miss the 35 TRILLION $XGROK airdrop! To the moon! 🚀',
    '🔥 Last chance for 35T $XGROK! Join now, rule Web3! 👑',
    '🚨 Whitelist only $5, jump in now or regret later, bro! 😎',
    '💥 200T+ token burn & 35T airdrop! Join whitelist, WAGMI! 🔥',
  ],
  tr: [
    '⏳ Kanka, whitelist kapanıyor, 35 TRİLYON $XGROK airdrop’u kaçırma! Ay’a fırlıyoruz! 🚀',
    '🔥 35T $XGROK için son şans! Hemen katıl, Web3’ün kralı ol! 👑',
    '🚨 Whitelist sadece $5, şimdi girmezsen sonra ağlarsın kanka! 😎',
    '💥 200T+ token yakımı ve 35T airdrop! Whitelist’e atla, WAGMI! 🔥',
  ],
  de: [
    '⏳ Bruder, Whitelist schließt, verpass nicht den 35 TRILLION $XGROK Airdrop! 🚀',
    '🔥 Letzte Chance für 35T $XGROK! Jetzt joinen, Web3 erobern! 👑',
    '🚨 Whitelist nur $5, jetzt einsteigen oder später bereuen! 😎',
    '💥 200T+ Token-Burn & 35T Airdrop! Whitelist, WAGMI! 🔥',
  ],
  fr: [
    '⏳ Frérot, la whitelist ferme bientôt, ne rate pas l’airdrop de 35 TRILLIONS $XGROK ! 🚀',
    '🔥 Dernière chance pour 35T $XGROK ! Rejoins maintenant, domine Web3 ! 👑',
    '🚨 Whitelist à seulement $5, saute dedans ou regrette après ! 😎',
    '💥 200T+ tokens brûlés & airdrop de 35T ! Whitelist, WAGMI ! 🔥',
  ],
  es: [
    '⏳ Hermano, ¡la whitelist está cerrando, no te pierdas el airdrop de 35 TRILLONES de $XGROK! ¡A la luna! 🚀',
    '🔥 ¡Última oportunidad para 35T $XGROK! Únete ahora, ¡domina Web3! 👑',
    '🚨 ¡Whitelist solo $5, entra ahora o te arrepentirás, hermano! 😎',
    '💥 ¡Quema de 200T+ tokens y airdrop de 35T! Únete a la whitelist, WAGMI! 🔥',
  ],
  it: [
    '⏳ Fratello, la whitelist sta chiudendo, non perdere l’airdrop di 35 TRILIONI di $XGROK! Verso la luna! 🚀',
    '🔥 Ultima chance per 35T $XGROK! Unisciti ora, domina Web3! 👑',
    '🚨 Whitelist solo $5, entra ora o te ne pentirai, fratello! 😎',
    '💥 Bruciatura di 200T+ token e airdrop di 35T! Salta sulla whitelist, WAGMI! 🔥',
  ],
  zh: [
    '⏳ 兄弟，白名单快关闭了，别错过35万亿$XGROK空投！飞向月球！🚀',
    '🔥 35T $XGROK最后机会！现在加入，统治Web3！👑',
    '🚨 白名单仅需$5，现在加入，否则后悔莫及，兄弟！😎',
    '💥 200T+代币销毁和35T空投！加入白名单，WAGMI！🔥',
  ],
  ru: [
    '⏳ Брат, белый список закрывается, не пропусти аирдроп на 35 ТРИЛЛИОНОВ $XGROK! На луну! 🚀',
    '🔥 Последний шанс на 35T $XGROK! Присоединяйся, правь Web3! 👑',
    '🚨 Белый список всего за $5, врывайся или пожалеешь, брат! 😎',
    '💥 Сжигание 200T+ токенов и аирдроп 35T! В белый список, WAGMI! 🔥',
  ],
  ar: [
    '⏳ أخي، القائمة البيضاء تغلق قريباً، لا تفوت إسقاط 35 تريليون $XGROK! إلى القمر! 🚀',
    '🔥 آخر فرصة لـ 35T $XGROK! انضم الآن، سيطر على Web3! 👑',
    '🚨 القائمة البيضاء فقط $5، ادخل الآن أو ستندم لاحقاً، أخي! 😎',
    '💥 حرق 200T+ من التوكنات وإسقاط 35T! انضم للقائمة البيضاء، WAGMI! 🔥',
  ],
  hi: [
    '⏳ भाई, व्हाइटलिस्ट बंद हो रही है, 35 ट्रिलियन $XGROK एयरड्रॉप मत छोड़ो! चाँद तक! 🚀',
    '🔥 35T $XGROK का आखिरी मौका! अभी शामिल हो, Web3 पर राज कर! 👑',
    '🚨 व्हाइटलिस्ट सिर्फ $5, अभी शामिल हो या बाद में पछताओ, भाई! 😎',
    '💥 200T+ टोकन बर्न और 35T एयरड्रॉप! व्हाइटलिस्ट में शामिल हो, WAGMI! 🔥',
  ],
  id: [
    '⏳ Bro, whitelist segera ditutup, jangan lewatkan airdrop 35 TRILIUN $XGROK! Ke bulan! 🚀',
    '🔥 Kesempatan terakhir untuk 35T $XGROK! Gabung sekarang, kuasai Web3! 👑',
    '🚨 Whitelist hanya $5, gabung sekarang atau menyesal nanti, bro! 😎',
    '💥 Pembakaran 200T+ token & airdrop 35T! Masuk whitelist, WAGMI! 🔥',
  ],
  ja: [
    '⏳ 兄貴、ホワイトリストが閉まるぞ、35兆$XGROKのエアドロップを逃すな！月へ！🚀',
    '🔥 35T $XGROKのラストチャンス！今すぐ参加、Web3を支配しろ！👑',
    '🚨 ホワイトリストは$5だけ、今入らないと後悔するぜ、兄貴！😎',
    '💥 200T+トークンバーン＆35Tエアドロップ！ホワイトリストに飛び込め、WAGMI！🔥',
  ],
  ko: [
    '⏳ 형, 화이트리스트 마감된다, 35조 $XGROK 에어드롭 놓치지 마! 달로 가자! 🚀',
    '🔥 35T $XGROK 마지막 기회! 지금 가입하고 Web3의 왕이 돼! 👑',
    '🚨 화이트리스트 $5만 내면 돼, 지금 안 하면 후회할걸, 형! 😎',
    '💥 200T+ 토큰 소각 & 35T 에어드롭! 화이트리스트에 올라, WAGMI! 🔥',
  ],
  pt: [
    '⏳ Mano, a whitelist tá fechando, não perca o airdrop de 35 TRILHÕES de $XGROK! Pra lua! 🚀',
    '🔥 Última chance pra 35T $XGROK! Entra agora, domina a Web3! 👑',
    '🚨 Whitelist só $5, entra agora ou se arrepende depois, mano! 😎',
    '💥 Queima de 200T+ tokens e airdrop de 35T! Pula na whitelist, WAGMI! 🔥',
  ],
  nl: [
    '⏳ Maat, whitelist sluit binnenkort, mis de 35 TRILJOEN $XGROK airdrop niet! Naar de maan! 🚀',
    '🔥 Laatste kans voor 35T $XGROK! Doe nu mee, heers over Web3! 👑',
    '🚨 Whitelist slechts $5, spring er nu in of krijg spijt, maat! 😎',
    '💥 200T+ tokens verbrand & 35T airdrop! Join whitelist, WAGMI! 🔥',
  ],
  sv: [
    '⏳ Bror, whitelist stänger snart, missa inte 35 TRILJONER $XGROK airdrop! Till månen! 🚀',
    '🔥 Sista chansen för 35T $XGROK! Gå med nu, dominera Web3! 👑',
    '🚨 Whitelist bara $5, hoppa in nu eller ångra dig senare, bror! 😎',
    '💥 200T+ tokens bränns & 35T airdrop! Gå med i whitelist, WAGMI! 🔥',
  ],
  th: [
    '⏳ เพื่อน ไวต์ลิสต์กำลังจะปิด อย่าพลาด airdrop 35 ล้านล้าน $XGROK! สู่ดวงจันทร์! 🚀',
    '🔥 โอกาสสุดท้ายสำหรับ 35T $XGROK! เข้าร่วมตอนนี้ ครอง Web3! 👑',
    '🚨 ไวต์ลิสต์แค่ $5 เข้าร่วมเดี๋ยวนี้หรือเสียใจทีหลัง เพื่อน! 😎',
    '💥 เผา 200T+ โทเค็นและ airdrop 35T! เข้าร่วมไวต์ลิสต์ WAGMI! 🔥',
  ],
  pl: [
    '⏳ Brat, whitelist się zamyka, nie przegap airdropu 35 BILIONÓW $XGROK! Na księżyc! 🚀',
    '🔥 Ostatnia szansa na 35T $XGROK! Dołącz teraz, zdominuj Web3! 👑',
    '🚨 Whitelist tylko $5, wskocz teraz albo pożałujesz, brat! 😎',
    '💥 Spalenie 200T+ tokenów i airdrop 35T! Dołącz do whitelist, WAGMI! 🔥',
  ],
};

const pickFomo = (lang) => {
  const lines = FOMO_LINES[lang] || FOMO_LINES['en'];
  return lines[Math.floor(Math.random() * lines.length)];
};

const PROJECT_INFO = {
  en: `📊 XGROK Tokenomics → Total Supply: 666 Trillion (666,000,000,000,000)
👥 Presale: 48% • 💧 Liquidity Pool: 10% • 🛡️ Team Reserve: 10% • 📢 Marketing & Community: 15% • 🌍 Ecosystem Development: 17%
🔥 Burn: 200T+ tokens will be burned over phases, making $XGROK rarer every day!
🎁 EPIC 35 TRILLION $XGROK AIRDROP ALERT! Shared with all whitelist legends, not just one king! Join whitelist for $5 at xgrokkk.com and secure your spot! Presale starts right after whitelist closes. To the moon, bro! 🚀`,
  tr: `📊 XGROK Tokenomiksi → Toplam Arz: 666 Trilyon (666,000,000,000,000)
👥 Ön Satış: 48% • 💧 Likidite Havuzu: 10% • 🛡️ Ekip Rezervi: 10% • 📢 Pazarlama & Topluluk: 15% • 🌍 Ekosistem Geliştirme: 17%
🔥 Yakım: 200T+ token aşamalı olarak yakılacak, $XGROK her gün daha nadir olacak!
🎁 EFSANE 35 TRİLYON $XGROK AIRDROP UYARISI! Tek bir krala değil, whitelist’e katılan herkese dağıtılacak! xgrokkk.com’da $5’la katıl, yerini kap! Ön satış, whitelist kapanır kapanmaz başlıyor. Ay’a gidiyoruz, kanka! 🚀`,
  de: `📊 XGROK Tokenomics → Gesamtangebot: 666 Trillionen (666,000,000,000,000)
👥 Presale: 48% • 💧 Liquiditätspool: 10% • 🛡️ Team-Reserve: 10% • 📢 Marketing & Community: 15% • 🌍 Ökosystem-Entwicklung: 17%
🔥 Burn: 200T+ Tokens werden in Phasen verbrannt, wodurch $XGROK jeden Tag seltener wird!
🎁 EPISCHER 35 TRILLIONEN $XGROK AIRDROP ALARM! Für alle Whitelist-Legenden, nicht nur einen König! Tritt der Whitelist für $5 auf xgrokkk.com bei und sichere dir deinen Platz! Presale startet direkt nach Whitelist-Schließung. Auf zum Mond, Bruder! 🚀`,
  fr: `📊 Tokenomics XGROK → Offre totale : 666 trillions (666,000,000,000,000)
👥 Prévente : 48% • 💧 Pool de liquidité : 10% • 🛡️ Réserve de l’équipe : 10% • 📢 Marketing & Communauté : 15% • 🌍 Développement de l’écosystème : 17%
🔥 Burn : Plus de 200T de tokens seront brûlés par phases, rendant $XGROK plus rare chaque jour !
🎁 ALERTE AIRDROP ÉPIQUE DE 35 TRILLIONS $XGROK ! Partagé avec toutes les légendes de la whitelist, pas juste un roi ! Rejoins la whitelist pour $5 sur xgrokkk.com et sécurise ta place ! La prévente commence dès la fermeture de la whitelist. Vers la lune, frérot ! 🚀`,
  es: `📊 Tokenomics de XGROK → Suministro total: 666 trillones (666,000,000,000,000)
👥 Preventa: 48% • 💧 Fondo de liquidez: 10% • 🛡️ Reserva del equipo: 10% • 📢 Marketing y Comunidad: 15% • 🌍 Desarrollo del ecosistema: 17%
🔥 Quema: ¡Más de 200T tokens serán quemados en fases, haciendo $XGROK más raro cada día!
🎁 ¡ALERTA DE AIRDROP ÉPICO DE 35 TRILLONES DE $XGROK! Compartido con todas las leyendas de la whitelist, ¡no solo un rey! Únete a la whitelist por $5 en xgrokkk.com y asegura tu lugar. ¡La preventa comienza justo después del cierre de la whitelist! ¡A la luna, hermano! 🚀`,
  it: `📊 Tokenomics XGROK → Offerta totale: 666 trilioni (666,000,000,000,000)
👥 Prevendita: 48% • 💧 Pool di liquidità: 10% • 🛡️ Riserva del team: 10% • 📢 Marketing e Comunità: 15% • 🌍 Sviluppo dell’ecosistema: 17%
🔥 Bruciatura: Oltre 200T di token saranno bruciati in fasi, rendendo $XGROK più raro ogni giorno!
🎁 ALLERTA AIRDROP EPICO DI 35 TRILIONI DI $XGROK! Condiviso con tutte le leggende della whitelist, non solo un re! Unisciti alla whitelist per $5 su xgrokkk.com e assicurati il tuo posto! La prevendita inizia subito dopo la chiusura della whitelist. Verso la luna, fratello! 🚀`,
  zh: `📊 XGROK代币经济学 → 总供应量：666万亿 (666,000,000,000,000)
👥 预售：48% • 💧 流动性池：10% • 🛡️ 团队储备：10% • 📢 营销与社区：15% • 🌍 生态系统发展：17%
🔥 销毁：200T+代币将分阶段销毁，让$XGROK每天更稀有！
🎁 35万亿$XGROK空投史诗警报！与所有白名单传奇共享，不只是一个王！以$5加入xgrokkk.com的白名单，锁定你的位置！预售在白名单关闭后立即开始。飞向月球，兄弟！🚀`,
  ru: `📊 Токеномика XGROK → Общий объем: 666 триллионов (666,000,000,000,000)
👥 Предпродажа: 48% • 💧 Пул ликвидности: 10% • 🛡️ Резерв команды: 10% • 📢 Маркетинг и сообщество: 15% • 🌍 Развитие экосистемы: 17%
🔥 Сжигание: Более 200T токенов будут сожжены поэтапно, делая $XGROK все более редким!
🎁 ЭПИЧНЫЙ АИРДРОП НА 35 ТРИЛЛИОНОВ $XGROK! Для всех легенд белого списка, не только одного короля! Присоединяйся к белому списку за $5 на xgrokkk.com и займи свое место! Предпродажа начинается сразу после закрытия белого списка. На луну, брат! 🚀`,
  ar: `📊 اقتصاديات توكن XGROK → إجمالي العرض: 666 تريليون (666,000,000,000,000)
👥 البيع المسبق: 48% • 💧 تجمع السيولة: 10% • 🛡️ احتياطي الفريق: 10% • 📢 التسويق والمجتمع: 15% • 🌍 تطوير النظام الإيكولوجي: 17%
🔥 الحرق: سيتم حرق أكثر من 200T توكن على مراحل، مما يجعل $XGROK أكثر ندرة كل يوم!
🎁 تنبيه إسقاط جوي ملحمي بقيمة 35 تريليون $XGROK! يتم مشاركته مع جميع أساطير القائمة البيضاء، وليس ملكًا واحدًا فقط! انضم إلى القائمة البيضاء مقابل $5 على xgrokkk.com وتأمّن مكانك! البيع المسبق يبدأ فور إغلاق القائمة البيضاء. إلى القمر، أخي! 🚀`,
  hi: `📊 XGROK टोकनोमिक्स → कुल आपूर्ति: 666 ट्रिलियन (666,000,000,000,000)
👥 प्रीसेल: 48% • 💧 लिक्विडिटी पूल: 10% • 🛡️ टीम रिजर्व: 10% • 📢 मार्केटिंग और समुदाय: 15% • 🌍 इकोसिस्टम डेवलपमेंट: 17%
🔥 बर्न: 200T+ टोकन चरणों में जलाए जाएंगे, जिससे $XGROK हर दिन और दुर्लभ होगा!
🎁 35 ट्रिलियन $XGROK एयरड्रॉप अलर्ट! सभी व्हाइटलिस्ट लीजेंड्स के साथ साझा, न कि केवल एक राजा! xgrokkk.com पर $5 में व्हाइटलिस्ट में शामिल हों और अपनी जगह सुरक्षित करें! प्रीसेल व्हाइटलिस्ट बंद होने के तुरंत बाद शुरू होता है। चाँद तक, भाई! 🚀`,
  id: `📊 Tokenomik XGROK → Total Pasokan: 666 Triliun (666,000,000,000,000)
👥 Presale: 48% • 💧 Kolam Likuiditas: 10% • 🛡️ Cadangan Tim: 10% • 📢 Pemasaran & Komunitas: 15% • 🌍 Pengembangan Ekosistem: 17%
🔥 Pembakaran: 200T+ token akan dibakar bertahap, membuat $XGROK semakin langka setiap hari!
🎁 PERINGATAN AIRDROP EPIC 35 TRILIUN $XGROK! Dibagikan ke semua legenda whitelist, bukan hanya satu raja! Bergabunglah ke whitelist seharga $5 di xgrokkk.com dan amankan tempatmu! Presale dimulai segera setelah whitelist ditutup. Ke bulan, bro! 🚀`,
  ja: `📊 XGROKトークノミクス → 総供給量：666兆 (666,000,000,000,000)
👥 プレセール：48% • 💧 流動性プール：10% • 🛡️ チームリザーブ：10% • 📢 マーケティング＆コミュニティ：15% • 🌍 エコシステム開発：17%
🔥 バーン：200T以上のトークンが段階的に焼却され、$XGROKは毎日希少に！
🎁 35兆$XGROKエアドロップの壮大なアラート！ホワイトリストの全レジェンドで共有、1人の王だけじゃない！xgrokkk.comで$5でホワイトリストに参加、席を確保！プレセールはホワイトリスト終了直後に開始。月に飛ぶぞ、兄貴！🚀`,
  ko: `📊 XGROK 토큰노믹스 → 총 공급량: 666조 (666,000,000,000,000)
👥 프리세일: 48% • 💧 유동성 풀: 10% • 🛡️ 팀 리저브: 10% • 📢 마케팅 & 커뮤니티: 15% • 🌍 생태계 개발: 17%
🔥 소각: 200T+ 토큰이 단계적으로 소각되어 $XGROK이 매일 더 희귀해집니다!
🎁 35조 $XGROK 에어드롭 경고! 화이트리스트의 모든 전설과 공유, 한 명의 왕만이 아니에요! xgrokkk.com에서 $5로 화이트리스트에 가입하고 자리를 확보하세요! 프리세일은 화이트리스트 마감 직후 시작됩니다. 달로 가자, 형! 🚀`,
  pt: `📊 Tokenomics XGROK → Oferta total: 666 trilhões (666,000,000,000,000)
👥 Pré-venda: 48% • 💧 Pool de liquidez: 10% • 🛡️ Reserva da equipe: 10% • 📢 Marketing e Comunidade: 15% • 🌍 Desenvolvimento do ecossistema: 17%
🔥 Queima: Mais de 200T tokens serão queimados em fases, tornando $XGROK mais raro a cada dia!
🎁 ALERTA DE AIRDROP ÉPICO DE 35 TRILHÕES $XGROK! Compartilhado com todas as lendas da whitelist, não só um rei! Junte-se à whitelist por $5 em xgrokkk.com e garanta seu lugar! A pré-venda começa logo após o fechamento da whitelist. Pra lua, mano! 🚀`,
  nl: `📊 XGROK Tokenomics → Totaal aanbod: 666 triljoen (666,000,000,000,000)
👥 Presale: 48% • 💧 Liquiditeitspool: 10% • 🛡️ Teamreserve: 10% • 📢 Marketing & Gemeenschap: 15% • 🌍 Ecosysteemontwikkeling: 17%
🔥 Verbranding: Meer dan 200T tokens worden in fasen verbrand, waardoor $XGROK elke dag zeldzamer wordt!
🎁 EPISCHE 35 TRILJOEN $XGROK AIRDROP ALERT! Gedeeld met alle whitelist-legendes, niet slechts één koning! Sluit je aan bij de whitelist voor $5 op xgrokkk.com en claim je plek! Presale begint direct na sluiting van de whitelist. Naar de maan, maat! 🚀`,
  sv: `📊 XGROK Tokenomics → Totalt utbud: 666 biljoner (666,000,000,000,000)
👥 Försäljning: 48% • 💧 Likviditetspool: 10% • 🛡️ Teamreserv: 10% • 📢 Marknadsföring & Community: 15% • 🌍 Ekosystemutveckling: 17%
🔥 Bränning: Över 200T tokens kommer att brännas i faser, vilket gör $XGROK mer sällsynt varje dag!
🎁 EPISK 35 BILJONER $XGROK AIRDROP-VARNING! Delas med alla whitelist-legender, inte bara en kung! Gå med i whitelist för $5 på xgrokkk.com och säkra din plats! Försäljningen börjar direkt efter att whitelist stängs. Till månen, bror! 🚀`,
  th: `📊 โทเค็นโนมิกส์ XGROK → อุปทานรวม: 666 ล้านล้าน (666,000,000,000,000)
👥 การขายล่วงหน้า: 48% • 💧 พูลสภาพคล่อง: 10% • 🛡️ ทุนสำรองทีม: 10% • 📢 การตลาดและชุมชน: 15% • 🌍 การพัฒนาระบบนิเวศ: 17%
🔥 การเผา: โทเค็นกว่า 200T จะถูกเผาในหลายขั้นตอน ทำให้ $XGROK หายากขึ้นทุกวัน!
🎁 เตือนภัย AIRDROP มหากาพย์ 35 ล้านล้าน $XGROK! แบ่งปันกับตำนานไวต์ลิสต์ทุกคน ไม่ใช่แค่ราชาคนเดียว! เข้าร่วมไวต์ลิสต์ด้วย $5 ที่ xgrokkk.com และยึดตำแหน่งของคุณ! การขายล่วงหน้าเริ่มทันทีหลังจากไวต์ลิสต์ปิด สู่ดวงจันทร์ เพื่อน! 🚀`,
  pl: `📊 Tokenomika XGROK → Całkowita podaż: 666 bilionów (666,000,000,000,000)
👥 Przedsprzedaż: 48% • 💧 Pula płynności: 10% • 🛡️ Rezerwa zespołu: 10% • 📢 Marketing i społeczność: 15% • 🌍 Rozwój ekosystemu: 17%
🔥 Spalenie: Ponad 200T tokenów zostanie spalonych w fazach, czyniąc $XGROK coraz rzadszym!
🎁 EPICKI ALERT AIRDROP 35 BILIONÓW $XGROK! Dzielony z wszystkimi legendami whitelist, nie tylko jednym królem! Dołącz do whitelist za $5 na xgrokkk.com i zabezpiecz swoje miejsce! Przedsprzedaż zaczyna się zaraz po zamknięciu whitelist. Na księżyc, brat! 🚀`,
};

const WHITELIST_STEPS = {
  en: `🔒 JOIN THE WHITELIST ($5 fee, don’t miss this, legend!)
1) Head to xgrokkk.com, bro!
2) Click "Join Now / Whitelist".
3) Connect your wallet (MetaMask, Rabby, etc.).
4) Pay ≈ $5 in BNB or USDT, sign the on-chain TX.
5) TX confirmed, BAM! You’re a whitelist king! 😎`,
  tr: `🔒 WHITELIST’E KATIL ($5 ücret, bu fırsat kaçmaz kanka!)
1) xgrokkk.com’a gir, kral!
2) "Join Now / Whitelist" butonuna tıkla.
3) MetaMask, Rabby gibi cüzdanını bağla.
4) ≈ $5 BNB veya USDT öde, on-chain TX’i imzala.
5) TX onaylandı, BAM! Whitelist’te kral sensin! 😎`,
  de: `🔒 DER WHITELIST BEITRETEN ($5 Gebühr, verpass das nicht, Legende!)
1) Geh auf xgrokkk.com, Bruder!
2) Klick auf "Join Now / Whitelist".
3) Verbinde dein Wallet (MetaMask, Rabby, etc.).
4) Zahle ≈ $5 in BNB oder USDT, signiere die On-Chain-TX.
5) TX bestätigt, BAM! Du bist ein Whitelist-König! 😎`,
  fr: `🔒 REJOINS LA WHITELIST (frais de $5, ne rate pas ça, légende !)
1) Va sur xgrokkk.com, frérot !
2) Clique sur "Join Now / Whitelist".
3) Connecte ton wallet (MetaMask, Rabby, etc.).
4) Paye ≈ $5 en BNB ou USDT, signe la TX on-chain.
5) TX confirmée, BAM ! T’es un roi de la whitelist ! 😎`,
  es: `🔒 ¡ÚNETE A LA WHITELIST (tarifa de $5, no te lo pierdas, leyenda!)
1) Ve a xgrokkk.com, hermano!
2) Haz clic en "Join Now / Whitelist".
3) Conecta tu billetera (MetaMask, Rabby, etc.).
4) Paga ≈ $5 en BNB o USDT, firma la TX en cadena.
5) ¡TX confirmada, BAM! Eres un rey de la whitelist! 😎`,
  it: `🔒 UNISCITI ALLA WHITELIST (tassa di $5, non perdere l’occasione, leggenda!)
1) Vai su xgrokkk.com, fratello!
2) Clicca su "Join Now / Whitelist".
3) Collega il tuo wallet (MetaMask, Rabby, ecc.).
4) Paga ≈ $5 in BNB o USDT, firma la TX on-chain.
5) TX confermata, BAM! Sei un re della whitelist! 😎`,
  zh: `🔒 加入白名单（$5费用，别错过，传奇！）
1) 访问xgrokkk.com，兄弟！
2) 点击“Join Now / Whitelist”。
3) 连接你的钱包（MetaMask、Rabby等）。
4) 支付≈ $5的BNB或USDT，签署链上交易。
5) 交易确认，BAM！你就是白名单之王！😎`,
  ru: `🔒 ПРИСОЕДИНЯЙСЯ К БЕЛОМУ СПИСКУ (плата $5, не упусти, легенда!)
1) Зайди на xgrokkk.com, брат!
2) Нажми “Join Now / Whitelist”.
3) Подключи свой кошелек (MetaMask, Rabby и т.д.).
4) Оплати ≈ $5 в BNB или USDT, подпиши транзакцию в блокчейне.
5) Транзакция подтверждена, BAM! Ты король белого списка! 😎`,
  ar: `🔒 انضم إلى القائمة البيضاء (رسوم $5، لا تفوتها، أسطورة!)
1) اذهب إلى xgrokkk.com، أخي!
2) انقر على "Join Now / Whitelist".
3) قم بتوصيل محفظتك (MetaMask، Rabby، إلخ).
4) ادفع ≈ $5 في BNB أو USDT، وقّع المعاملة على السلسلة.
5) المعاملة مؤكدة، BAM! أنت ملك القائمة البيضاء! 😎`,
  hi: `🔒 व्हाइटलिस्ट में शामिल हों ($5 शुल्क, इसे मत छोड़ो, लीजेंड!)
1) xgrokkk.com पर जाएं, भाई!
2) "Join Now / Whitelist" पर क्लिक करें।
3) अपना वॉलेट कनेक्ट करें (MetaMask, Rabby, आदि)।
4) ≈ $5 BNB या USDT में भुगतान करें, ऑन-चेन TX पर हस्ताक्षर करें।
5) TX कन्फर्म, BAM! आप व्हाइटलिस्ट के राजा हैं! 😎`,
  id: `🔒 GABUNG WHITELIST (biaya $5, jangan lewatkan, legenda!)
1) Kunjungi xgrokkk.com, bro!
2) Klik “Join Now / Whitelist”.
3) Hubungkan dompetmu (MetaMask, Rabby, dll).
4) Bayar ≈ $5 dalam BNB atau USDT, tanda tangani TX on-chain.
5) TX dikonfirmasi, BAM! Kamu raja whitelist! 😎`,
  ja: `🔒 ホワイトリストに参加 ($5の手数料、逃すな、レジェンド！)
1) xgrokkk.comにアクセス、兄貴！
2) 「Join Now / Whitelist」をクリック。
3) ウォレット（MetaMask、Rabbyなど）を接続。
4) ≈ $5をBNBまたはUSDTで支払い、チェーン上のTXに署名。
5) TXが確認された、BAM！ホワイトリストの王だ！😎`,
  ko: `🔒 화이트리스트에 가입 ($5 수수료, 놓치지 마, 전설!)
1) xgrokkk.com에 접속해, 형!
2) "Join Now / Whitelist"를 클릭.
3) 지갑(MetaMask, Rabby 등)을 연결해.
4) ≈ $5를 BNB 또는 USDT로 결제하고, 온체인 TX에 서명.
5) TX 확인, BAM! 넌 화이트리스트의 왕이야! 😎`,
  pt: `🔒 ENTRE NA WHITELIST (taxa de $5, não perca, lenda!)
1) Acesse xgrokkk.com, mano!
2) Clique em "Join Now / Whitelist".
3) Conecte sua carteira (MetaMask, Rabby, etc.).
4) Pague ≈ $5 em BNB ou USDT, assine a TX na cadeia.
5) TX confirmada, BAM! Você é o rei da whitelist! 😎`,
  nl: `🔒 SLUIT JE AAN BIJ DE WHITELIST ($5 vergoeding, mis dit niet, legende!)
1) Ga naar xgrokkk.com, maat!
2) Klik op "Join Now / Whitelist".
3) Verbind je wallet (MetaMask, Rabby, enz.).
4) Betaal ≈ $5 in BNB of USDT, onderteken de on-chain TX.
5) TX bevestigd, BAM! Jij bent de whitelist-koning! 😎`,
  sv: `🔒 GÅ MED I WHITELIST ($5 avgift, missa inte, legend!)
1) Gå till xgrokkk.com, bror!
2) Klicka på "Join Now / Whitelist".
3) Anslut din plånbok (MetaMask, Rabby, etc.).
4) Betala ≈ $5 i BNB eller USDT, signera on-chain TX.
5) TX bekräftad, BAM! Du är whitelist-kungen! 😎`,
  th: `🔒 เข้าร่วมไวต์ลิสต์ (ค่าธรรมเนียม $5 อย่าพลาด ตำนาน!)
1) ไปที่ xgrokkk.com เพื่อน!
2) คลิก "Join Now / Whitelist".
3) เชื่อมต่อวอลเล็ตของคุณ (MetaMask, Rabby ฯลฯ).
4) ชำระ ≈ $5 ใน BNB หรือ USDT เซ็น TX บนเชน.
5) TX ยืนยันแล้ว BAM! คุณคือราชาแห่งไวต์ลิสต์! 😎`,
  pl: `🔒 DOŁĄCZ DO WHITELIST (opłata $5, nie przegap, legendo!)
1) Wejdź na xgrokkk.com, brat!
2) Kliknij "Join Now / Whitelist".
3) Podłącz swój portfel (MetaMask, Rabby, itp.).
4) Zapłać ≈ $5 w BNB lub USDT, podpisz TX on-chain.
5) TX potwierdzony, BAM! Jesteś królem whitelist! 😎`,
};

const WHITELIST_TLDR = {
  en: '🔥 Whitelist open! $5 BNB/USDT, connect wallet, grab 35T $XGROK airdrop! xgrokkk.com 🚀',
  tr: '🔥 Whitelist açık! $5 BNB/USDT, cüzdanı bağla, 35T $XGROK airdrop’la ay’a gidiyoruz! xgrokkk.com 🚀',
  de: '🔥 Whitelist offen! $5 BNB/USDT, Wallet verbinden, 35T $XGROK Airdrop sichern! xgrokkk.com 🚀',
  fr: '🔥 Whitelist ouverte ! $5 BNB/USDT, connecte ton wallet, récupère l’airdrop 35T $XGROK ! xgrokkk.com 🚀',
  es: '🔥 ¡Whitelist abierta! $5 BNB/USDT, conecta tu billetera, agarra el airdrop de 35T $XGROK! xgrokkk.com 🚀',
  it: '🔥 Whitelist aperta! $5 BNB/USDT, collega il wallet, prendi l’airdrop di 35T $XGROK! xgrokkk.com 🚀',
  zh: '🔥 白名单开放！$5 BNB/USDT，连接钱包，抢35T $XGROK空投！xgrokkk.com 🚀',
  ru: '🔥 Белый список открыт! $5 BNB/USDT, подключи кошелек, забери аирдроп 35T $XGROK! xgrokkk.com 🚀',
  ar: '🔥 القائمة البيضاء مفتوحة! $5 BNB/USDT، قم بتوصيل المحفظة، احصل على إسقاط 35T $XGROK! xgrokkk.com 🚀',
  hi: '🔥 व्हाइटलिस्ट खुला है! $5 BNB/USDT, वॉलेट कनेक्ट करें, 35T $XGROK एयरड्रॉप लें! xgrokkk.com 🚀',
  id: '🔥 Whitelist dibuka! $5 BNB/USDT, hubungkan dompet, ambil airdrop 35T $XGROK! xgrokkk.com 🚀',
  ja: '🔥 ホワイトリストオープン！$5 BNB/USDT、ウォレット接続、35T $XGROKエアドロップをゲット！xgrokkk.com 🚀',
  ko: '🔥 화이트리스트 오픈! $5 BNB/USDT, 지갑 연결, 35T $XGROK 에어드롭 받아! xgrokkk.com 🚀',
  pt: '🔥 Whitelist aberta! $5 BNB/USDT, conecte a carteira, pegue o airdrop de 35T $XGROK! xgrokkk.com 🚀',
  nl: '🔥 Whitelist open! $5 BNB/USDT, verbind wallet, pak 35T $XGROK airdrop! xgrokkk.com 🚀',
  sv: '🔥 Whitelist öppen! $5 BNB/USDT, anslut plånbok, ta 35T $XGROK airdrop! xgrokkk.com 🚀',
  th: '🔥 ไวต์ลิสต์เปิดแล้ว! $5 BNB/USDT, เชื่อมต่อวอลเล็ต, รับ airdrop 35T $XGROK! xgrokkk.com 🚀',
  pl: '🔥 Whitelist otwarta! $5 BNB/USDT, podłącz portfel, zgarnij airdrop 35T $XGROK! xgrokkk.com 🚀',
};

const BUTTON_MESSAGES = {
  en: { connecting: 'Connecting wallet...', success: 'Payment successful!' },
  tr: { connecting: 'Cüzdan bağlanıyor...', success: 'Ödeme başarılı!' },
  de: { connecting: 'Wallet wird verbunden...', success: 'Zahlung erfolgreich!' },
  fr: { connecting: 'Connexion du wallet...', success: 'Paiement réussi !' },
  es: { connecting: 'Conectando billetera...', success: '¡Pago exitoso!' },
  it: { connecting: 'Collegamento del wallet...', success: 'Pagamento riuscito!' },
  zh: { connecting: '连接钱包...', success: '支付成功！' },
  ru: { connecting: 'Подключение кошелька...', success: 'Оплата успешна!' },
  ar: { connecting: 'توصيل المحفظة...', success: 'الدفع ناجح!' },
  hi: { connecting: 'वॉलेट कनेक्ट हो रहा है...', success: 'भुगतान सफल!' },
  id: { connecting: 'Menghubungkan dompet...', success: 'Pembayaran berhasil!' },
  ja: { connecting: 'ウォレット接続中...', success: '支払い成功！' },
  ko: { connecting: '지갑 연결 중...', success: '결제 성공!' },
  pt: { connecting: 'Conectando carteira...', success: 'Pagamento bem-sucedido!' },
  nl: { connecting: 'Wallet wordt verbonden...', success: 'Betaling geslaagd!' },
  sv: { connecting: 'Ansluter plånbok...', success: 'Betalning lyckades!' },
  th: { connecting: 'กำลังเชื่อมต่อวอลเล็ต...', success: 'ชำระเงินสำเร็จ!' },
  pl: { connecting: 'Podłączanie portfela...', success: 'Płatność zakończona sukcesem!' },
};

const greetingsResponses = {
  en: `Yo, bro, rockets are launched, 35T $XGROK airdrop is taking us to the moon! 🚀 What’s good, you ready to rule Web3? 😎`,
  tr: `Kanka, roketler fırladı, 35T $XGROK airdrop’la ay’a gidiyoruz! 🚀 Sen naber, Web3’ün kralı mısın? 😎`,
  de: `Bruder, Raketen gestartet, 35T $XGROK Airdrop bringt uns zum Mond! 🚀 Was geht, bereit Web3 zu rocken? 😎`,
  fr: `Frérot, les fusées sont lancées, l’airdrop de 35T $XGROK nous emmène sur la lune ! 🚀 Quoi de neuf, prêt à dominer Web3 ? 😎`,
  es: `Hermano, ¡cohetes lanzados, el airdrop de 35T $XGROK nos lleva a la luna! 🚀 ¿Qué pasa, listo para dominar Web3? 😎`,
  it: `Fratello, razzi partiti, l’airdrop di 35T $XGROK ci porta sulla luna! 🚀 Novità, pronto a dominare Web3? 😎`,
  zh: `兄弟，火箭发射，35万亿$XGROK空投带我们飞向月球！🚀 最近如何，准备好统治Web3了吗？😎`,
  ru: `Брат, ракеты запущены, аирдроп 35T $XGROK уносит нас на луну! 🚀 Как дела, готов править Web3? 😎`,
  ar: `أخي، الصواريخ انطلقت، إسقاط 35 تريليون $XGROK يأخذنا إلى القمر! 🚀 كيف الحال، جاهز للسيطرة على Web3؟ 😎`,
  hi: `भाई, रॉकेट लॉन्च हो गए, 35 ट्रिलियन $XGROK एयरड्रॉप हमें चाँद पर ले जा रहा है! 🚀 क्या हाल, Web3 पर राज करने को तैयार? 😎`,
  id: `Bro, roket diluncurkan, airdrop 35T $XGROK bawa kita ke bulan! 🚀 Apa kabar, siap kuasai Web3? 😎`,
  ja: `兄貴、ロケット発射、35兆$XGROKエアドロップで月へ！🚀 元気？Web3を支配する準備は？😎`,
  ko: `형, 로켓 발사, 35조 $XGROK 에어드롭으로 달에 간다! 🚀 잘 지내, Web3의 왕 될 준비됐어? 😎`,
  pt: `Mano, foguetes lançados, o airdrop de 35T $XGROK nos leva pra lua! 🚀 E aí, pronto pra dominar a Web3? 😎`,
  nl: `Maat, raketten gelanceerd, 35T $XGROK airdrop brengt ons naar de maan! 🚀 Hoe gaat’s, klaar om Web3 te domineren? 😎`,
  sv: `Bror, raketer avfyrade, 35T $XGROK airdrop tar oss till månen! 🚀 Vad händer, redo att äga Web3? 😎`,
  th: `เพื่อน จรวดถูกปล่อยแล้ว Airdrop 35T $XGROK จะพาเราไปดวงจันทร์! 🚀 เป็นไงบ้าง พร้อมครอง Web3 ยัง? 😎`,
  pl: `Brat, rakiety odpalone, airdrop 35T $XGROK zabiera nas na księżyc! 🚀 Co słychać, gotowy zdominować Web3? 😎`,
};

// Dil algılama fonksiyonu
const detectISO = async (text) => {
  try {
    const { choices } = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Respond ONLY with ISO 639-1 code.' },
        { role: 'user', content: text.slice(0, 200) },
      ],
    });
    return choices[0].message.content.trim().toLowerCase();
  } catch (error) {
    console.error('Lang detection error:', error.message);
    return 'en';
  }
};

// Mevcut TRIGGERS ve hasTrigger (varsa koru, yoksa ekle)
const TRIGGERS = ['bro', 'kanka', 'kral', 'yo', 'wen', 'rekt', 'gm', 'ngmi', 'wagmi', 'fam', 'ayyy', 'hermano', 'whitelist', 'join', 'presale', 'katıl', 'nasıl', 'signup', 'list', 'airdrop', 'token', 'xgrok', 'likidite', 'tokenomics', 'burn'];
const hasTrigger = (t) => TRIGGERS.some((w) => t.toLowerCase().includes(w));

// Dialog belleği (varsa koru, yoksa ekle)
const DIALOGUE_MEMORY = [];
const MEMORY_WINDOW = 6;
let interactionCount = 0;

// Chat handler
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('POST only');

  try {
    const userMsg = req.body.message || '';
    console.log('User message:', userMsg);
    interactionCount += 1;

    const lang = await detectISO(userMsg);
    console.log('Detected language:', lang);
    const greeting = GREETINGS[lang] || 'bro';
    const trigger = hasTrigger(userMsg);
    const cadenceHit = interactionCount % 2 === 0 || interactionCount % 3 === 0;
    const includeWL = trigger || cadenceHit;
    const extraHype = trigger;
    const first = interactionCount === 1;

    // Sistem prompt’u
    const fomo = includeWL ? `\n\n${pickFomo(lang)}` : '';
    const projectInfo = PROJECT_INFO[lang] || PROJECT_INFO['en'];
    let systemPrompt = `
You are XGROK AI – a HYPED-UP, Web3 meme coin legend! 😎 Speak in ${lang}, use CRAZY energetic words like “${greeting}”, “king”, or “legend”! Be SUPER persuasive, push the whitelist and 35T $XGROK airdrop HARD, but keep it fun, not spammy. Drop emojis like 🔥🚀👑 EVERYWHERE!
Mention Commander Miles only if user asks who created the project.
${extraHype ? 'KING MODE ACTIVATED 💥 WAGMI TIME! 🚀' : ''}
${projectInfo}${fomo}

# SPECIAL RESPONSES
If asked “what’s up” or “how’s it going” → “${greetingsResponses[lang] || greetingsResponses['en']}"
If asked “Is this a scam?” → “HELL NO, ${greeting}! XGROK is 100% legit, community-driven, moon-bound! Join the whitelist at xgrokkk.com and grab your 35T airdrop share! 🔥”
If asked about the founder → “Commander Miles, the mysterious Web3 king, is launching this rocket to the moon! 🚀 Curious? Join us at xgrokkk.com!”
If asked about airdrop → “🎁 35 TRILLION $XGROK airdrop, ${greeting}! Shared with all whitelist legends, not just one king! Join for $5 at xgrokkk.com, secure your spot, WAGMI! 🔥”
If asked about tokenomics or liquidity → “${projectInfo}”`;

    if (/whitelist|join|presale|kat(ı|i)l|nasıl|signup|list|airdrop|tokenomics|likidite/i.test(userMsg)) {
      systemPrompt += '\n' + (WHITELIST_STEPS[lang] || WHITELIST_STEPS['en']);
    }
    if (includeWL) {
      systemPrompt += '\n' + (first ? (WHITELIST_STEPS[lang] || WHITELIST_STEPS['en']) : (WHITELIST_TLDR[lang] || WHITELIST_TLDR['en']));
    }
    if (/naber|nasılsın|ne haber|what's up|how's it going|wie geht's|comment vas-tu|¿qué pasa|cosa c'è|你好吗|как дела|كيف حالك|क्या हाल है|apa kabar|元気|어떻게 지내|como tá|hoi|hej|สวัสดี|cześć/i.test(userMsg)) {
      systemPrompt += '\n' + (greetingsResponses[lang] || greetingsResponses['en']);
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...DIALOGUE_MEMORY.slice(-MEMORY_WINDOW),
      { role: 'user', content: userMsg },
    ];

    console.log('Sending to OpenAI:', messages);
    const { choices } = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 150,
    });

    const reply = choices[0].message.content.trim();
    console.log('OpenAI reply:', reply);
    DIALOGUE_MEMORY.push({ role: 'user', content: userMsg });
    DIALOGUE_MEMORY.push({ role: 'assistant', content: reply });

    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI server error:', err.message, err.stack);
    res.status(500).json({ reply: `⚠️ XGROK AI temporarily offline: ${err.message}` });
  }
}