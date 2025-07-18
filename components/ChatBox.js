import React, { useState, useEffect, useRef } from 'react';

// BUTTON_MESSAGES ve PLACEHOLDERS (sadece istediğin diller)
const BUTTON_MESSAGES = {
  en: { send: 'Send', sending: 'Sending...' },
  tr: { send: 'Gönder', sending: 'Gönderiliyor...' },
  ru: { send: 'Отправить', sending: 'Отправка...' },
  fr: { send: 'Envoyer', sending: 'Envoi en cours...' },
  id: { send: 'Kirim', sending: 'Mengirim...' },
  ko: { send: '보내기', sending: '보내는 중...' },
  ja: { send: '送信', sending: '送信中...' },
  de: { send: 'Senden', sending: 'Wird gesendet...' },
  ar: { send: 'إرسال', sending: 'جارٍ الإرسال...' },
  hi: { send: 'भेजें', sending: 'भेजा जा रहा है...' },
};

const PLACEHOLDERS = {
  en: 'Type your message, bro...',
  tr: 'Mesajını yaz kanka...',
  ru: 'Напиши сообщение, брат...',
  fr: 'Écris ton message, frérot...',
  id: 'Ketik pesanmu, bro...',
  ko: '메시지를 입력해, 형...',
  ja: 'メッセージを入力、兄貴...',
  de: 'Schreib deine Nachricht, Bruder...',
  ar: 'اكتب رسالتك، أخي...',
  hi: 'अपना संदेश लिखें, भाई...',
};

const INITIAL_MESSAGES = {
  en: 'Yo bro 👋 I’m XGROK AI. What’s up, ready to talk Web3? 😎',
  tr: 'Merhaba kanka 👋 Ben XGROK AI. Bugün ne konuşalım? 😎',
  ru: 'Привет, брат 👋 Я XGROK AI. Как дела, готов говорить о Web3? 😎',
  fr: 'Salut frérot 👋 Je suis XGROK AI. Quoi de neuf, prêt à parler Web3 ? 😎',
  id: 'Hai bro 👋 Saya XGROK AI. Apa kabar, siap ngobrol Web3? 😎',
  ko: '안녕, 형 👋 난 XGROK AI야. 잘 지내, Web3 얘기할 준비됐어? 😎',
  ja: 'よ、兄貴 👋 俺はXGROK AIだ。元気？Web3の話する？ 😎',
  de: 'Hey Bruder 👋 Ich bin XGROK AI. Was geht, bereit für Web3? 😎',
  ar: 'مرحبًا أخي 👋 أنا XGROK AI. كيف الحال، جاهز للحديث عن Web3؟ 😎',
  hi: 'हाय भाई 👋 मैं XGROK AI हूँ। क्या हाल, Web3 की बात करने को तैयार? 😎',
};

const ERROR_MESSAGES = {
  en: 'Bro, XGROK AI is taking a quick break! 🚀 Try again or check xgrokkk.com!',
  tr: 'Kanka, XGROK AI biraz mola verdi! 🚀 Tekrar dene veya xgrokkk.com’a bak!',
  ru: 'Брат, XGROK AI взял перерыв! 🚀 Попробуй снова или загляни на xgrokkk.com!',
  fr: 'Frérot, XGROK AI fait une petite pause ! 🚀 Réessaie ou check xgrokkk.com !',
  id: 'Bro, XGROK AI sedang istirahat sebentar! 🚀 Coba lagi atau kunjungi xgrokkk.com!',
  ko: '형, XGROK AI가 잠시 쉬고 있어! 🚀 다시 시도하거나 xgrokkk.com을 확인해!',
  ja: '兄貴、XGROK AIがちょっと休憩中！🚀 もう一度試すか、xgrokkk.comをチェック！',
  de: 'Bruder, XGROK AI macht ’ne kurze Pause! 🚀 Versuch’s nochmal oder schau auf xgrokkk.com!',
  ar: 'أخي، XGROK AI يأخذ استراحة قصيرة! 🚀 حاول مرة أخرى أو تحقق من xgrokkk.com!',
  hi: 'भाई, XGROK AI थोड़ा ब्रेक ले रहा है! 🚀 फिर से कोशिश करें या xgrokkk.com देखें!',
};

// Tarayıcı dilini algıla
const getUserLanguage = () => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('tr')) return 'tr';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('id')) return 'id';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('ar')) return 'ar';
  if (lang.startsWith('hi')) return 'hi';
  return 'en'; // Varsayılan İngilizce
};

async function getAIResponse(userInput) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    if (!response.ok) throw new Error('API isteği başarısız');
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Chat API hatası:', error);
    const lang = getUserLanguage();
    return ERROR_MESSAGES[lang];
  }
}

function ChatBox() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: INITIAL_MESSAGES[getUserLanguage()] },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const lang = getUserLanguage(); // Kullanıcı dilini al

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);

    const aiResponse = await getAIResponse(input);
    setMessages([...newMessages, { from: 'ai', text: aiResponse }]);
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="xgrok-ai-chat-window" data-nosnippet>
      <div className="chat-header">
        <img src="/xgrok_ai_logo.png" alt="XGROK AI" className="chat-logo" />
        <span>XGROK AI</span>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, i) => (
          <p key={i} className={msg.from}>
            {msg.text}
          </p>
        ))}
        {isLoading && (
          <div className="loading">
            {BUTTON_MESSAGES[lang].sending} <span className="spinner"></span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={PLACEHOLDERS[lang]}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? BUTTON_MESSAGES[lang].sending : BUTTON_MESSAGES[lang].send}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;