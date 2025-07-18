// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="Whitelist for unbelievable rewards before presale begins!" />
        <meta name="theme-color" content="#000000" />

        {/* 🔍 Plausible Analytics */}
        <script
          defer
          data-domain="xgrokkk.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
