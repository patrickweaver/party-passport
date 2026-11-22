/*
 * Station definitions.
 *
 * Each station needs:
 *   id            unique key used for storage
 *   name          shown in the passport
 *   instructions  shown on the camera screen
 *   question      (optional) asked after the photo; the answer renders under the photo
 *   stampCorner   which corner of the photo the stamp lands on: "tl" | "tr" | "bl" | "br"
 *   stampSize     stamp width as a fraction of the photo width
 *   stamp()       returns the stamp SVG markup. Draw with `currentColor` so the
 *                 holder's ink color applies, and wrap it in filter="url(#ink)".
 */
window.STATIONS = [
  {
    id: 'balloons',
    name: 'Balloons',
    instructions: 'Grab a balloon and snap a selfie!',
    stampCorner: 'br',
    stampSize: 0.56,
    stamp: () => `
      <svg viewBox="0 0 200 200" class="stamp-svg" aria-hidden="true">
        <defs>
          <path id="bl-top" d="M 37,100 A 63,63 0 0 1 163,100"/>
          <path id="bl-bot" d="M 23,100 A 77,77 0 0 0 177,100"/>
          <mask id="bl-shine">
            <rect width="200" height="200" fill="#fff"/>
            <ellipse cx="78" cy="83" rx="3" ry="6" fill="#000" transform="rotate(25 78 83)"/>
            <ellipse cx="94" cy="72" rx="3.5" ry="7" fill="#000" transform="rotate(25 94 72)"/>
            <ellipse cx="114" cy="81" rx="3" ry="6" fill="#000" transform="rotate(25 114 81)"/>
          </mask>
        </defs>
        <g filter="url(#ink)" fill="currentColor" stroke="currentColor">
          <circle cx="100" cy="100" r="93" fill="none" stroke-width="7"/>
          <circle cx="100" cy="100" r="85" fill="none" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="55" fill="none" stroke-width="3"/>
          <text class="stamp-text" font-size="25" letter-spacing="4" stroke="none">
            <textPath href="#bl-top" startOffset="50%" text-anchor="middle">BALLOONS</textPath>
          </text>
          <text class="stamp-text" font-size="15" letter-spacing="3" stroke="none">
            <textPath href="#bl-bot" startOffset="50%" text-anchor="middle">CHRISTMAS · 2026</textPath>
          </text>
          <path d="M14 100 l4 -4 l4 4 l-4 4z M178 100 l4 -4 l4 4 l-4 4z" stroke="none"/>
          <!-- strings -->
          <path d="M82 104 Q86 120 100 138 M100 96 Q96 116 100 138 M118 102 Q112 122 100 138"
                fill="none" stroke-width="2"/>
          <!-- balloons -->
          <g mask="url(#bl-shine)" stroke="none">
            <ellipse cx="82" cy="88" rx="13" ry="16"/>
            <path d="M79 103 h6 l-3 5z"/>
            <ellipse cx="118" cy="86" rx="13" ry="16"/>
            <path d="M115 101 h6 l-3 5z"/>
            <ellipse cx="100" cy="78" rx="15" ry="18"/>
            <path d="M97 95 h6 l-3 5z"/>
          </g>
          <path d="M94 136 l6 4 l6 -4 l-2 7 l-4 -2 l-4 2z" stroke="none"/>
        </g>
      </svg>`,
  },
  {
    id: 'animal-farm',
    name: 'Animal Farm',
    instructions: 'Take a selfie with the alpaca!',
    question: 'What animal did you take a selfie with?',
    stampCorner: 'tr',
    stampSize: 0.66,
    stamp: () => `
      <svg viewBox="0 0 240 170" class="stamp-svg" aria-hidden="true">
        <g filter="url(#ink)" fill="currentColor" stroke="currentColor">
          <rect x="5" y="5" width="230" height="160" rx="16" fill="none" stroke-width="7"/>
          <rect x="15" y="15" width="210" height="140" rx="9" fill="none" stroke-width="2"/>
          <text class="stamp-text" x="120" y="47" font-size="27" letter-spacing="3" text-anchor="middle" stroke="none">ANIMAL FARM</text>
          <line x1="26" y1="58" x2="214" y2="58" stroke-width="2.5"/>
          <!-- alpaca -->
          <g stroke="none">
            <circle cx="44" cy="110" r="6"/>
            <ellipse cx="72" cy="114" rx="29" ry="16"/>
            <circle cx="52" cy="101" r="8"/>
            <circle cx="64" cy="98" r="8"/>
            <circle cx="77" cy="98" r="8"/>
            <circle cx="89" cy="101" r="8"/>
            <rect x="86" y="70" width="15" height="46" rx="7"/>
            <circle cx="90" cy="82" r="5.5"/>
            <circle cx="91" cy="94" r="5.5"/>
            <ellipse cx="98" cy="70" rx="11" ry="9"/>
            <ellipse cx="107" cy="73" rx="6.5" ry="5.5"/>
            <path d="M90 64 L92 50 L96 63z M97 63 L101 49 L104 63z"/>
            <rect x="51" y="120" width="6" height="28" rx="3"/>
            <rect x="60" y="122" width="6" height="26" rx="3"/>
            <rect x="80" y="122" width="6" height="26" rx="3"/>
            <rect x="89" y="120" width="6" height="28" rx="3"/>
          </g>
          <line x1="124" y1="70" x2="124" y2="146" stroke-width="2"/>
          <text class="stamp-text" x="176" y="98" font-size="25" letter-spacing="2" text-anchor="middle" stroke="none">VISITED</text>
          <path d="M146 110 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1z
                   M176 110 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1z
                   M206 110 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1z" stroke="none"/>
          <text class="stamp-text" x="176" y="146" font-size="13" letter-spacing="3" text-anchor="middle" stroke="none">DEC · 2026</text>
        </g>
      </svg>`,
  },
];
