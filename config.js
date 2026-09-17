/* Everything editable lives here. One file, shared by every page. */

const CONFIG = {

  contact: {
    phone: '0424 054 581',           // spaces are fine, they're stripped for the sms link
    email: 'hello@cleanedbyrell.com',
    instagram: 'cleanedbyrell'
  },

  /* ---- LANDING PAGE COPY ---------------------------------------------- */
  hero: {
    locationLabel: 'Located in',
    location:      'Chester Hill / Fairfield',
    experience:    'Since 2022',
    headline:      "South West Sydney's",
    accent:        'Premium Sneaker Cleaner',
    sub:           'Hand cleaned with precision, patience and no compromise.'
  },

  /* ---- THE THREE FACTS UNDER THE HERO ---------------------------------- */
  facts: [
    { k: '2022',
      title: 'Nearly half a decade of experience',
      desc:  'Continuously refining, determined to give you the best result.' },

    { k: '500+',
      title: 'Pairs cleaned',
      desc:  'From your ASICS, TNs and Air Maxes to LV Trainers, B27s and Hermès — your pairs are in the right hands.' },

    { k: '1M+',
      title: 'Organic views on TikTok and Instagram',
      desc:  "Plenty of good cleaners in Sydney. I'm just glad this many people watch mine." }
  ],

  serviceAreas: ['Fairfield','Cabramatta','Chester Hill','Bankstown','Liverpool','Pickup & return'],

  /* ---- THE CLEAN -------------------------------------------------------- */
  packagesIntro: {
    heading: 'One clean. No guesswork.',
    sub: 'It keeps getting your pairs cleaned simple. One detailed package, covering the full exterior and the insoles.'
  },

  packages: [
    {
      id: 'standard',
      name: "Rell's Standard Clean",
      price: 50,
      for: 'Detailed Exterior Clean + Insoles (Scrub & Steam)',
      // each entry can be a plain string, or a name with its own detail line
      includes: [
        { id:'uppers', name:'Uppers (Scrub & Steam)',
          desc:'Deep cleaned with stain treatment included, and a steam disinfection to finish off.' },
        { id:'midsole', name:'Midsole',
          desc:'Scuffs, embedded dirt and general marking treated.' },
        { id:'sole', name:'Sole',
          desc:'Deep cleaned into every groove — gum, rocks and embedded objects removed.' },
        { id:'insole', name:'Insole (Scrub & Steam)',
          desc:'Hand scrubbed and steamed for disinfection.' },
        { id:'laces', name:'Laces',
          desc:'Removed, cleaned and re-laced. Lacing preferences welcome.' }
      ],
    }
  ],

  /* ---- TURNAROUND -------------------------------------------------------
     Bigger jobs take longer, so the estimate moves with the pair count. */
  turnaround: {
    base:  [2, 3],       // days, for up to `upTo` pairs
    upTo:  5,
    extra: [1, 2],       // added on top beyond that
    note:  'Guaranteed turnaround times will be provided once dropped off as demand fluctuates.'
  },

  /* ---- ADD-ONS  (a quantity, in pairs) ---------------------------------
     includedIn: package ids that already bundle this, so it can't be
     double-charged. Nothing is bundled right now. */
  addons: [
    { id:'waterproof', name:'Waterproofing', price:20,
      desc:'Fabric and leather protection, lasting 3–6 months.' }
  ],

  /* ---- WHY THE STANDARD EXISTS ----------------------------------------- */
  creed: {
    heading: 'Brand new is a skewed term',
    lead: 'The Standard clean is for anyone chasing "they\'re brand new again".',
    body: [
      "A couple of years in, I've realised how skewed that phrase is. People will say a pair looks brand new when the soles were never detailed, or when one area clearly got more attention than the rest.",
      "With the Standard clean, your pair gets worked to the best of my ability. I set a high bar so everyone gets the same result — and if chasing that takes more time and more resources, so be it. I don't compromise."
    ]
  },

  /* ---- MATERIAL QUESTIONS ----------------------------------------------
     Asked rather than offered. A surcharge nobody volunteers for is a
     surcharge you end up collecting in person, so this is framed as a
     disclosure the customer can answer about their own shoes. */
  surcharges: [
    {
      id: 'textile',
      name: 'Textiles surcharge',
      price: 15,
      question: 'Any pairs with materials such as suede, denim, or anything other than leather or mesh?',
      sub:  'As these materials require specific treatments, the process involves increased care and labour.',
      no:  'No — leather or mesh only',
      yes: 'Yes, some of them',
      note: '',
      countLabel: 'How many of them?'
    }
  ],

  /* ---- LOGISTICS ------------------------------------------------------- */
  logistics: {
    modes: [
      { id:'store', name:'Dropoff to Me',
        desc:'Located in Chester Hill, address provided once booking confirmed.' },
      { id:'local', name:'Pickup & Dropoff Service',
        desc:'Collected and Returned from Collection Point' },
      // soon:true renders it greyed out and unselectable
      { id:'mail',  name:'Interstate Postage',
        desc:'Prepaid Shipping Label provided', soon:true }
    ],

    /* Pickup & return is priced by region, not by distance — these come
       from a year of real jobs, so they account for traffic and parking,
       not just kilometres. The zone list and the suburb-to-zone mapping
       both live in suburbs.js. One fee covers collection AND return. */
    travelDays: 1,        // added to the turnaround estimate

    // AusPost prices already cover sending AND return
    mail: {
      options: [
        { id:'post-std', name:'Standard (AusPost)', price:25, days:6 },
        { id:'post-exp', name:'Express (AusPost)',  price:30, days:3 }
      ],
      maxPairs: 5,
      states: 'NSW, VIC, ACT, QLD, WA, NT and SA',
      note: 'Covers sending and return. Shipping insurance is available — message me for a figure.'
    }
  },

  /* ---- PRIORITY SERVICE ------------------------------------------------- */
  rush: [
    { id:'std', name:'Standard', desc:'Normal queue', perPair:0, fixedEta:null },
    { id:'pri', name:'Priority service', desc:'24–48 hour turnaround',
      perPair:20, fixedEta:'24–48 hours' }
  ],

  /* ---- MULTI-PAIR DISCOUNT ----------------------------------------------
     A flat amount off every pair once the job hits a tier. Tiers do not
     stack — the highest one the job qualifies for is the one that applies. */
  /* percent comes off the cleans only — not add-ons, surcharge, travel or
     priority. At $50 a pair that is $5 off each, same as before, but it now
     scales by itself if you ever change the price of a clean. */
  bulk: {
    tiers: [
      { from: 5, percent: 10 }
    ]
  },

  maxPairs: 20,

  /* ---- BOOKING & PAYMENT --------------------------------------------- */
  booking: {
    // Paste your Square Appointments (or other) booking link here.
    // While this is empty the button falls back to opening your Instagram.
    url: '',
    /* The deposit is whatever the travel or postage comes to, taken at
       booking so a no-show doesn't leave you out of pocket for the drive.
       Nothing to pay up front when they come to you. */
    depositIsDelivery: true,
    balanceNote: 'on collection',
    quoteNote: 'NOTE: This quote is a reference only. If a pair is inspected and found to contain fabrics or textiles requiring specific treatments, a Textile Surcharge of $15 will be added.'
  },

  /* ---- WHAT COMES OUT, AND WHAT DOESN'T --------------------------------
     Two levels of stain, plus a third category that isn't a stain at all.
     The distinction is soiling vs staining: soiling sits on the fibre,
     staining is when a coloured compound bonds to it ionically or
     covalently and starts behaving like a dye. */
  scope: {
    heading: 'What comes out,\nand what doesn\'t',
    intro: 'Most messages I get ask whether a stain will lift. The honest answer depends on which of two things it is, and you can usually work that out before you hand them over.',

    levels: [
      {
        id: 'surface',
        name: 'Surface level',
        verdict: 'Usually comes out',
        good: true,
        body: 'The stain is sitting on the thread, not in it. Nothing has attached, and the fibre underneath is still its original colour. With the right treatment on the first attempt, this either lightens a long way or disappears completely.',
        examples: [
          'Everyday dirt, dust and mud',
          'Scuffs on midsoles and outsoles',
          'Yellowed and oxidised soles',
          'Grass and fresh spills on mesh',
          'Odour and dirty insoles',
          'Dingy, discoloured laces'
        ]
      },
      {
        id: 'material',
        name: 'Material level',
        verdict: 'Stays, whatever I use',
        good: false,
        body: 'The colour has bonded to the thread itself. Once that happens it behaves like a dye — the fibre is not stained, the fibre is that colour. Pulling it out means pulling the fabric\'s own colour out with it, which is why I will not try.',
        examples: [
          'Set-in oil, grease and paint',
          'Heavy dye transfer on white mesh',
          'Old spills that were never treated',
          'Anything a bleach-based remover has been used on'
        ]
      }
    ],

    notes: [
      { t: 'Time is the part you control',
        b: 'Bonding is not instant. It happens gradually, and both heat and pH speed it up. A spill brought to me the same week is usually still surface level. The same spill six months on has generally crossed over. Nothing else you do matters as much as how quickly it gets treated.' },

      { t: 'Why white mesh is the worst case',
        b: 'Mesh uppers are usually nylon, and nylon carries bonding sites that acidic colours latch straight onto — red soft drink, wine, sauces. On white mesh those cross from surface to material far faster than the same spill on leather.' },

      { t: 'Why supermarket removers make it worse',
        b: 'Most of them work by bleaching. They lift the colour out of the stain and the colour out of the fabric at the same time, and that part does not come back. Rubbing is the other one — it drives the substance deeper into the weave instead of lifting it out. If you have already tried something on it, tell me what, because it changes what I can safely use.' },

      { t: 'What waterproofing actually does',
        b: 'A protective coating works by occupying the sites on the fibre that a stain would otherwise bond to. It does not make a pair bulletproof, but it buys you time — it keeps a spill at surface level for longer, which is the difference between a stain that lifts and one that does not.' }
    ],

    damage: {
      t: 'Some things are not stains at all',
      b: 'These are damage rather than dirt, so no amount of cleaning touches them. I will tell you if I see any of it before I start.',
      examples: [
        'Cracked, peeling or flaking leather',
        'Heat damage, burns and melted material',
        'Deep permanent creasing',
        'Sole separation — that is a repair, not a clean'
      ]
    },

    outText: 'Genuinely not sure which one yours is? Send one photo and I will tell you straight before you book. That is the only thing I need to see in advance — everything else is priced above.'
  },

  /* ---- WHAT CUSTOMERS SAID ---------------------------------------------
     Quotes from the feedback texts, word for word. Do not tidy the
     grammar — texts that read like texts are the ones people believe.

     `highlightUrl` points at the Instagram Highlight holding the actual
     screenshots. That link is what makes this section credible: anyone
     who doubts a quote can go and check it. Without it these are just
     words you wrote about yourself.

     Fill in what you have. `place` and `pair` both help — a first name
     alone reads generic, a first name from Cabramatta with an Air Max
     Plus reads like a person. Leave `when` off if you'd rather not date
     them, but recency is one of the things people weigh most. */
  reviews: {
    heading: 'What people actually said',
    sub: 'Straight out of the messages, word for word. The screenshots are pinned on my Instagram if you want to see them.',
    highlightUrl: 'https://www.instagram.com/stories/highlights/18076124141256769/',
    ctaLabel: 'See the screenshots',

    /* Verbatim. Spelling, slang and emoji left exactly as sent — that is
       what makes them read as real. Add name / place / pair / when as you
       get them; anything left blank simply is not shown. */
    items: [
      { text: "hahaha yeh had them for ages and wore it to hella raves, but holy it looks hectic as now",
        name: '', place: '', pair: '', when: '' },

      { text: "They look absolutely spotless. Thank you so much",
        name: '', place: '', pair: '', when: '' },

      { text: "Wtf you're a legend was not expecting that \u{1F44C}\u{1F3FD}\u{1F44C}\u{1F3FD}\u{1F44C}\u{1F3FD}\u{1F602}\u{1F602}",
        name: '', place: '', pair: '', when: '' },

      { text: "Shot my brother kicks looks better than new , haven't seen em this white since I bought em \u{1F602}\u2764\uFE0F",
        name: '', place: '', pair: '', when: '' },

      { text: "Thank you again bro ur work never disappoints the shoes look fresh as \u2764\uFE0F",
        name: '', place: '', pair: '', when: '' }
    ]
  },

  /* ---- THE FIVE POINT PROOF --------------------------------------------
     One pair, photographed against each of the five things the card claims.
     Labels and captions come from the service card itself, so they cannot
     drift. Fill in a before and after URL per point — any point left empty
     still shows, with a note about which slot to fill. */
  proof: {
    heading: 'Every claim, photographed.',
    sub: 'Each line on the card, shown before and after — including the parts nobody photographs.',
    /* Each point is one before/after shot. `ids` lists which lines on the
       service card that shot proves — one photo can cover more than one,
       the way a side profile shows the upper and the midsole together.
       Labels and captions are pulled from the card, so they can't drift.
       `label` sits under the caption — name the shoe, or explain the shot
       when it comes from a different pair. Leave it blank to hide it.
       Paths are relative to index.html; a file that isn't uploaded yet
       shows a note naming the one it's waiting on. */
    points: [
      { ids:['uppers','midsole'], label:'ASICS Gel-Quantum',
        before:'Photos/uppers-before.webp', after:'Photos/uppers-after.webp' },

      { ids:['sole'], label:'ASICS Gel-Quantum',
        before:'Photos/sole-before.webp', after:'Photos/sole-after.webp' },

      /* A point can hold a silent looping clip instead of a photo pair —
         swap the line above for this once you've sent me footage:
         { ids:['sole'], label:'ASICS Gel-Quantum',
           video:'Photos/sole-clean.mp4', poster:'Photos/sole-after.webp' }, */

      // `image` instead of before/after: one frame that already shows both
      // states, so the toggle is hidden rather than doing nothing
      { ids:['insole'], image:'Photos/insole-sidebyside.webp',
        label:'A different pair to the ASICS above. Left as it came in, right after the clean — same insoles, same light, same minute.' }
    ]
  },

  /* ---- FAQ  (swap these for your real ones) ---------------------------- */
  faq: [
    { q:'How long does a clean take?',
      a:'Usually 2–3 days. Priority service guarantees them back within 12–24 hours.' },
    { q:'Do you clean every brand?',
      a:'Yes. ASICS, Nike, New Balance, adidas and designer pairs are all fine. If it\'s something rare or fragile, message me first and I\'ll tell you honestly whether I\'d touch it.' },
    { q:'What if the stain doesn\'t come out?',
      a:'Some damage is permanent — deep dye transfer, burns, cracked leather. I\'ll tell you what I think is achievable before I start rather than after.' },
    { q:'Where do I drop them off?',
      a:'Chester Hill. I send the exact address once your booking is confirmed.' },
    { q:'Why is there only one package?',
      a:'Because it simplifies the whole thing. One detailed package covering the full exterior and the insoles means you are not weighing up tiers or guessing which one your pair needs — and nobody ends up paying for a clean that skipped the part they cared about.' },
    { q:'Do you do discounts?',
      a:'The prices on this page are the prices. There is one clean and one price, so there is nothing to haggle over and nobody gets a better deal than you by asking. If a job turns out easier than quoted, I charge you less without being asked.' },
    { q:'How do I pay?',
      a:'A deposit locks in your slot and comes off the total. The rest is due when you collect. Cash or transfer, whichever suits.' },
    { q:'REPLACE ME — add your real questions',
      a:'Send Claude your full FAQ list and these get swapped out.' }
  ],

  /* ---- HOURS ----------------------------------------------------------- */
  hours: [
    ['Monday','Closed'], ['Tuesday','3pm – 8pm'], ['Wednesday','3pm – 8pm'],
    ['Thursday','3pm – 8pm'], ['Friday','3pm – 9pm'],
    ['Saturday','10am – 6pm'], ['Sunday','10am – 4pm']
  ]
};