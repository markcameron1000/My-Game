/*
 * Parallel Futures — story data.
 * Source of truth for the text: SCRIPT.md. Structure and logic: STORY_OUTLINE.md.
 *
 * Kept as a .js file (window.STORY) rather than .json so the game works when
 * index.html is opened directly from disk (browsers block fetch() on file://).
 *
 * Conditions ("if"): { all:[flags], any:[flags], none:[flags], min:{dim:n}, max:{dim:n} }
 * Text "parts": a string, { variants:[{if,text,effects,flags}] } (first match),
 *               or { collect:[{if,text}], limit, fallback } (all matches, up to limit).
 * Markup: *text* = italics. A blank line ("\n\n") inside a string = new paragraph.
 */
window.STORY = {
  dims: ["sec", "con", "gro", "wel", "imp"],
  dimNames: { sec: "Security", con: "Connection", gro: "Growth", wel: "Wellbeing", imp: "Impact" },
  totalDecisions: 12,

  steps: [
    // ───────────────────────── PROLOGUE ─────────────────────────
    { type: "chapter", id: "c0", kicker: "Prologue", title: "The Night Before" },
    {
      type: "decision", id: "p1", chapter: "Prologue", title: "The Night Before",
      parts: [
        "11:47 pm. Two job offers glow on your laptop, and both want an answer by morning. On the doormat lies a folded note you didn't hear arrive: *“Not every road is one you'll walk. Choose anyway. — A.”*",
        "Your phone buzzes. It's Sam. You haven't spoken since school. *“Random, but I'm in town next week. Coffee?”*"
      ],
      hint: "A small thing. Or is it?",
      choices: [
        { label: "Yes! Let's do it.", effects: { con: 1 }, flags: ["sam_coffee"],
          ripple: "Sent. Sam replies with eleven exclamation marks.",
          ghost: "In another timeline, one quick reply changed everything." },
        { label: "I'll reply tomorrow.", flags: ["sam_ignored"],
          ripple: "Tomorrow comes. The message sinks beneath a hundred others.",
          ghost: "In another timeline, a neighbour's stories about Lisbon were waiting." }
      ]
    },

    // ───────────────────────── CHAPTER ONE ─────────────────────────
    { type: "chapter", id: "c1", kicker: "Chapter One", title: "Today" },
    {
      type: "decision", id: "1.1", chapter: "Today", title: "The Offer",
      parts: [
        "Northgate Logistics is offering a steady salary, a pension and a desk by the window. Loop, a six-person start-up building an app for local repair shops, is offering shares, a beanbag and no promises.",
        "And there's the third option, the one you haven't told anyone about: a one-way ticket."
      ],
      choices: [
        { label: "Take the steady job at Northgate.", effects: { sec: 2 }, flags: ["job_safe"],
          ripple: "Your parents sound relieved. You sound… fine.",
          ghost: "In another timeline, a steady job built a steady life… or a quiet cage." },
        { label: "Bet on Loop.", effects: { gro: 2, sec: -1 }, flags: ["job_startup"],
          ripple: "Day one: the founder hands you a laptop and a fire extinguisher. “Just in case.”",
          ghost: "In another timeline, a beanbag and a fire extinguisher led somewhere wild." },
        { label: "Turn them both down. Travel.", effects: { gro: 1, wel: 1, sec: -2 }, flags: ["gap_year"],
          ripple: "You click “decline” twice and book a flight before you can change your mind.",
          ghost: "In another timeline, a one-way ticket became a whole life." }
      ]
    },
    {
      type: "decision", id: "1.2", chapter: "Today", title: "The Windfall",
      parts: [
        "A solicitor's letter: your great-aunt Vera, whom you met twice, has left you £3,000. Tucked inside is a note in shaky ink: *“Spend it on something that outlives me.”*"
      ],
      choices: [
        { label: "Save it. Future me will thank me.", effects: { sec: 2 }, flags: ["saved_windfall"],
          ripple: "The number in your savings account looks surprisingly calm.",
          ghost: "In another timeline, Vera's money grew quietly in the dark." },
        { label: "Learn to code. Finally.", effects: { gro: 2 }, flags: ["learned_skill"],
          ripple: "Week three: you build an app that does absolutely nothing. You've never been prouder.",
          ghost: "In another timeline, an app that did nothing became an app that did everything." },
        { label: "Book a trip with friends.", effects: { con: 1, wel: 1 }, flags: ["friends_trip"],
          ripple: "Four friends, one tiny car, and a playlist nobody agrees on.",
          ghost: "In another timeline, a terrible playlist became a lifeline." }
      ]
    },
    {
      type: "decision", id: "1.3a", chapter: "Today", title: "Coffee with Sam",
      if: { all: ["sam_coffee"] },
      parts: [
        "Sam hasn't changed: same laugh, same terrible jokes, same habit of stealing your chips. Sam now runs a food bank and is one Saturday driver short.",
        "“No pressure,” says Sam, applying enormous pressure."
      ],
      choices: [
        { label: "Count me in.", effects: { imp: 2, wel: -1 }, flags: ["volunteer"],
          ripple: "First Saturday: forty deliveries and one very grateful pensioner called Mo.",
          ghost: "In another timeline, Saturdays meant forty deliveries and a man called Mo." },
        { label: "I'd love to, but I can't.", effects: { wel: 1 },
          ripple: "Sam shrugs, smiling. “Offer stands. Forever, probably.”",
          ghost: "In another timeline, your Saturdays stayed your own." }
      ]
    },
    {
      type: "decision", id: "1.3b", chapter: "Today", title: "The Neighbour",
      if: { all: ["sam_ignored"] },
      parts: [
        "Saturday morning. Your neighbour Rosa, eighty-something and fiercely independent, is halfway up the stairs with four bags of shopping.",
        "Her face says she'd rather die than ask for help."
      ],
      choices: [
        { label: "Take the bags. Stay for tea.", effects: { imp: 1, con: 1 }, flags: ["helped_rosa"],
          ripple: "Her tea is terrible. Her stories about 1970s Lisbon are not.",
          ghost: "In another timeline, terrible tea led to a surprising friendship." },
        { label: "Headphones in. Keep walking.",
          ripple: "She makes it to the top. She always does.",
          ghost: "In another timeline, you kept walking. Rosa made it anyway." }
      ]
    },

    // ───────────────────────── CHAPTER TWO ─────────────────────────
    { type: "chapter", id: "c2", kicker: "Chapter Two", title: "One Year Later" },
    {
      type: "decision", id: "2.1", chapter: "One Year Later", title: "The Move",
      parts: [
        { variants: [
          { if: { all: ["job_safe"] }, text: "Northgate's lanyard has started to feel like a collar. The work is fine. The canteen is fine. Everything is *fine*." },
          { if: { all: ["job_startup"] }, text: "Loop has run out of chairs and is running low on sleep. There are twelve of you now, and three are called Alex." },
          { if: { all: ["gap_year"] }, text: "Your backpack is held together with tape and stories. Eleven countries in, your money is thinner than the soles of your shoes." }
        ] },
        { variants: [
          { if: { all: ["job_safe"] }, text: "Your manager calls you in. There's a promotion, a real one, but it's at head office, two hundred miles from everyone you know." },
          { if: { all: ["job_startup"] }, text: "Loop has just raised £4 million. The founder wants someone she trusts to open the new Lisbon office, and she's looking at you." },
          { if: { all: ["gap_year"] }, text: "In Lisbon, a hostel owner called Inês watches you fix her booking system. “Stay,” she says. “I'll pay you. Badly, but I'll pay you.”" }
        ] }
      ],
      choices: [
        { label: "Pack the boxes. Go.", effects: { gro: 1, con: -1 }, flags: ["moved"],
          ripple: "New city, new streets, new everything. The group chat goes quiet.",
          rippleExtra: [{ if: { all: ["helped_rosa"], any: ["job_startup", "gap_year"] }, text: "Rosa was right about the light here." }],
          ghost: "In another timeline, you moved, and different people became your people." },
        { label: "Stay where my people are.", effects: { con: 1 }, flags: ["stayed"],
          ripple: "Sunday roasts, familiar faces, and a small “what if” you keep in a drawer.",
          ghost: "In another timeline, you stayed, and the old streets kept their hold on you." }
      ]
    },
    {
      type: "decision", id: "2.2", chapter: "One Year Later", title: "The Warning Light",
      parts: [
        "3:04 am. You're on the night bus with forty unread messages and a heartbeat doing something new and unwelcome.",
        "The stranger opposite, in a grey coat, with eyes you can't quite place, leans in. *“You'll want to remember tonight.”* At the next stop, the seat is empty."
      ],
      choices: [
        { label: "Push through. This is my moment.", effects: { sec: 1, gro: 1, wel: -2 }, flags: ["pushed_through"],
          ripple: "You answer all forty before sunrise. Your body files a formal complaint.",
          ghost: "In another timeline, you pushed through, and the night bus kept running." },
        { label: "Step back. Start saying no.", effects: { wel: 2, gro: -1 }, flags: ["stepped_back"],
          ripple: "The first “no” is terrifying. The tenth feels like breathing.",
          ghost: "In another timeline, you learned to say no years earlier." }
      ]
    },
    {
      type: "decision", id: "2.3", chapter: "One Year Later", title: "The Scruffy Dog",
      parts: [
        "A rescue-shelter van is parked outside the supermarket. Most of the dogs are asleep.",
        "One of them (lopsided ears, at least partly mop) hasn't taken his eyes off you."
      ],
      choices: [
        { label: "Adopt him. He's called Biscuit.", effects: { wel: 1, con: 1, sec: -1 }, flags: ["dog_biscuit"],
          ripple: "Biscuit eats a shoe on the first night. You forgive him instantly.",
          ghost: "In another timeline, a scruffy dog changed who you met." },
        { label: "Not now. Life's too busy.",
          ripple: "You walk away without looking back. (You look back.)",
          ghost: "In another timeline, your life stayed tidy, and your shoes stayed intact." }
      ]
    },

    // ───────────────────────── CHAPTER THREE ─────────────────────────
    { type: "chapter", id: "c3", kicker: "Chapter Three", title: "Five Years Later" },
    {
      type: "beat", id: "3.0", chapter: "Five Years Later",
      parts: [
        { variants: [
          { if: { all: ["job_startup", "pushed_through", "learned_skill"] }, title: "The Rocket", effects: { sec: 3 }, flags: ["rocket"],
            text: "The email subject line just says *Congratulations*. A tech giant has bought Loop, and your shares are suddenly worth more than your parents' house.\n\nSome of the code you taught yourself with Vera's money is still in there." },
          { if: { all: ["job_startup"] }, title: "The Wreckage", effects: { sec: -2 }, flags: ["hit_bottom"],
            text: "Loop dies on a Tuesday: one all-hands meeting, one apologetic founder, one cardboard box.\n\nFive years of your life fit inside it with room to spare." },
          { if: { all: ["job_safe"] }, title: "The Climb",
            text: "You manage a team of nine at Northgate now, and there's a parking space with your name on it.\n\nSome mornings you sit in the car a little too long before going in." },
          { if: { all: ["gap_year"] }, title: "The Drifter",
            text: "Three countries, two languages, one laptop. You freelance from wherever the wifi is good.\n\nFree, mostly happy, and never quite sure where home is." }
        ] }
      ]
    },
    {
      type: "decision", id: "3.1", chapter: "Five Years Later", title: "The Clash",
      parts: [
        "The offer arrives on a Monday: a six-month project in Singapore, the kind that changes careers. It starts in ten days, which is exactly when someone you love needs you there.",
        { variants: [
          { if: { all: ["dog_biscuit"] }, text: "Jordan, whom you met when Biscuit stole their sandwich in the park, opens their first art exhibition that week. They've been painting for it for three years." },
          { if: { all: ["sam_coffee"] }, text: "Sam is getting married, and you're the best person. The speech is already half written." },
          { text: "Your sister's first baby is due, and she's asked you to be there." }
        ] }
      ],
      choices: [
        { label: "Take Singapore.", effects: { sec: 2, gro: 1, con: -2 }, flags: ["chose_career"],
          ripple: "The view from the fortieth floor is spectacular. The video call is pixelated.",
          ghost: "In another timeline, you took the flight. The view was spectacular." },
        { label: "Be there.", effects: { con: 2 }, flags: ["showed_up"],
          ripple: "You're there. Some moments only happen once.",
          ghost: "In another timeline, you were there. Someone still remembers." }
      ]
    },
    {
      type: "decision", id: "3.2", chapter: "Five Years Later", title: "The Side Project",
      parts: [
        { variants: [
          { if: { all: ["learned_skill"] }, text: "Fixit, the little app you built to help neighbours swap and repair things, now has 20,000 users and a server bill that keeps you up at night." },
          { if: { all: ["volunteer"] }, text: "The food bank has grown into a community kitchen: three hundred meals a week, run by volunteers and, somehow, by you." },
          { text: "Your sourdough, a hobby that turned into an obsession, sells out at the Saturday market by 9 am. People queue. People *queue*." }
        ] }
      ],
      choices: [
        { label: "Go all in. Grow it.", effects: { gro: 1, imp: 1, wel: -1 }, flags: ["project_grew"],
          ripple: "Investors, spreadsheets, a logo. Your weekends belong to it now.",
          ghost: "In another timeline, the side project became your whole life." },
        { label: "Let it go. It served its purpose.", effects: { wel: 1 },
          ripple: "You feel lighter, and a little sad. Both are allowed.",
          ghost: "In another timeline, you set it down and felt lighter." },
        { label: "Give it away to the community.", effects: { imp: 2 }, flags: ["gave_it_away"],
          ripple: "You hand over the keys. It grows faster without you, which stings and delights in equal measure.",
          ghost: "In another timeline, you gave it away, and it outgrew you." }
      ]
    },
    {
      type: "decision", id: "3.3", chapter: "Five Years Later", title: "Roots",
      parts: [
        { variants: [
          { if: { min: { sec: 6 } }, text: "Your landlord is selling up. For the first time you could actually buy somewhere: a small flat with a balcony just big enough for one chair." },
          { text: "Your landlord is selling up, and rents have gone mad. You could sign a long lease on somewhere smaller, or swallow your pride and move back home for a while." }
        ] }
      ],
      choices: [
        { labelVariants: [{ if: { min: { sec: 6 } }, text: "Buy the flat. Put down roots." }, { text: "Sign the lease. Commit to here." }],
          effects: { sec: 2, gro: -1 }, flags: ["settled"],
          ripple: "The keys are heavier than they look.",
          ghost: "In another timeline, you put down roots, and they held." },
        { labelVariants: [{ if: { min: { sec: 6 } }, text: "Keep renting. Stay light." }, { text: "Move home. Regroup." }],
          effects: { gro: 1, wel: 1 }, flags: ["flexible"],
          ripple: "No anchor, no mortgage, and the world stays wide open.",
          ghost: "In another timeline, you travelled light, and kept every door open." }
      ]
    },

    // ───────────────────────── CHAPTER FOUR ─────────────────────────
    { type: "chapter", id: "c4", kicker: "Chapter Four", title: "Fifteen Years Later" },
    {
      type: "beat", id: "4.0", chapter: "Fifteen Years Later",
      parts: [
        "You're older now. There are mornings when your knees have opinions.",
        { variants: [
          { if: { max: { wel: 3 } }, title: "The Crisis", flags: ["crisis_health"],
            text: "It starts as tiredness and ends in a hospital corridor. The doctor is kind and very clear: something has to change, and it has to change now." },
          { if: { all: ["job_safe"], none: ["learned_skill"] }, title: "The Crisis", flags: ["crisis_automation"],
            text: "Northgate announces “Project Horizon”. By the end of the slideshow you understand: software will be doing your job by spring, and you helped train it." },
          { if: { any: ["job_startup", "gap_year"] }, title: "The Crisis", flags: ["crisis_shift"],
            text: "Overnight, your whole industry reinvents itself. The skills that paid your bills for fifteen years are suddenly a museum exhibit." },
          { title: "The Crisis", flags: ["crisis_family"],
            text: "The call comes at 6 am. Your dad has had a fall and can't live alone any more. Someone has to step up." }
        ] }
      ]
    },
    {
      type: "beat", id: "4.0b", chapter: "Fifteen Years Later", title: "Who Shows Up",
      parts: [
        "You brace yourself to face it alone. Then the doorbell rings.",
        { limit: 2,
          collect: [
            { if: { all: ["sam_coffee"] }, text: "It's Sam, older and greyer, holding a pot of soup and a spreadsheet. *“You replied to my text once, at 11:47 pm. I never forgot.”*" },
            { if: { all: ["helped_rosa"] }, text: "It's a young man in a nurse's uniform. *“You won't remember me. I'm Rosa's grandson. Nan talked about you until the very end: the neighbour who carried her bags. Let me help.”*" },
            { if: { all: ["volunteer"] }, text: "It's the food-bank crew, with Mo, now ninety, leading the charge. They've already drawn up a rota." },
            { if: { all: ["dog_biscuit", "showed_up"] }, text: "Biscuit, grey-muzzled and slow now, pads over and rests his head on your knee. Jordan sits down beside you. *“We've got this.”*" },
            { if: { all: ["dog_biscuit"] }, text: "Biscuit, grey-muzzled and slow now, pads over and rests his head on your knee." },
            { if: { all: ["friends_trip"] }, text: "Your phone lights up. The road-trip group chat, silent for years, is suddenly full of messages. *“We're coming.”*" }
          ],
          fallback: "There's no one there, just a folded note on the doormat in handwriting you almost recognise: *“You're not as alone as you think. — A.”*",
          // dog variants are mutually exclusive: if the first dog line matches, skip the second
          exclusiveGroups: [[3, 4]]
        }
      ]
    },
    {
      type: "decision", id: "4.1", chapter: "Fifteen Years Later", title: "The Response",
      parts: ["So. What now?"],
      choices: [
        { label: "Rebuild. Learn something new.", effects: { gro: 2 }, flags: ["rebuilt"],
          ripple: "At your age? Yes. At your age.",
          ghost: "In another timeline, you started again from scratch, and loved it." },
        { label: "Let people help me.", effects: { con: 2, wel: 1 }, flags: ["leaned_in"],
          ripple: "Accepting help, it turns out, is its own kind of strength.",
          ghost: "In another timeline, you let them carry you for a while." },
        { label: "Turn this into something for others.", effects: { imp: 2 }, flags: ["paid_forward"],
          ripple: "What happened to you won't happen to them. Not if you can help it.",
          ghost: "In another timeline, your worst year became someone else's lifeline." }
      ]
    },
    {
      type: "decision", id: "4.2", chapter: "Fifteen Years Later", title: "The Letter",
      parts: [
        "That evening, the stranger in the grey coat is sitting on your doorstep, not a day older than on the night bus. Their face is hard to look at directly, like a word on the tip of your tongue.",
        "*“I can deliver one sentence,”* they say, *“to the night before all this began. Choose carefully.”*"
      ],
      choices: [
        { label: "“Reply to Sam.”", flags: ["letter_sam"],
          ripple: "The stranger nods, folds your words into a note, and is gone.",
          ghost: "In another timeline, your note said “Reply to Sam.”" },
        { label: "“Take the risk.”", flags: ["letter_risk"],
          ripple: "The stranger nods, folds your words into a note, and is gone.",
          ghost: "In another timeline, your note said “Take the risk.”" },
        { label: "“Rest more. Really.”", flags: ["letter_rest"],
          ripple: "The stranger nods, folds your words into a note, and is gone.",
          ghost: "In another timeline, your note said “Rest more. Really.”" },
        { label: "“Don't change a thing.”", flags: ["letter_nothing"],
          ripple: "The stranger smiles, as if they knew you'd say that.",
          ghost: "In another timeline, the grey coat fits.", sealedUntil: "unexpected" }
      ]
    }
  ],

  // ───────────────────────── ENDINGS ─────────────────────────
  endings: {
    builder: {
      name: "The Builder", card: "You built the road as you walked it.",
      open: ["Twenty years on, you've built something solid: a career people respect, a home with your name on the door, and a safety net strong enough to catch other people too. You plan, you deliver, you rarely panic."],
      tradeoff: "Some quiet evenings you wonder what the other road looked like. Then you check your pension and sleep soundly anyway."
    },
    anchor: {
      name: "The Anchor", card: "You were someone's home.",
      open: ["Twenty years on, your kitchen table is where everyone ends up: birthdays, break-ups, and Sunday lunches that run until dark. You're the person people call first."],
      tradeoff: "The big adventure never quite happened. It's a postcard on the fridge. But every chair at that table is full."
    },
    wanderer: {
      name: "The Wanderer", card: "You collected horizons.",
      open: ["Twenty years on, you've filled your passport twice. Five cities, three careers, and a thousand stories you tell differently every time."],
      tradeoff: "Home is still a feeling you're chasing rather than an address. But what a chase it's been."
    },
    hero: {
      name: "The Quiet Hero", card: "You made the world kinder, quietly.",
      open: ["Twenty years on, there are people whose lives are better because of you, and most of them will never know your name. You built things and gave them away. You showed up."],
      tradeoff: "You gave a great deal. The question you're still learning to answer is whether you saved any for yourself."
    },
    cage: {
      name: "The Golden Cage", card: "You got everything you wanted. Was it what you needed?",
      open: ["Twenty years on, you have everything you planned for: the title, the house, the numbers. Everything is exactly where you put it."],
      tradeoff: "The house is very quiet. Some nights you scroll through old photos, trying to remember the last time you laughed until it hurt."
    },
    phoenix: {
      name: "The Phoenix", card: "You fell, and rose different.",
      open: ["Twenty years on, people assume you always had it together. They didn't see the bottom, or the long, unglamorous climb back."],
      tradeoff: "What you built afterwards was smaller, truer and entirely yours. The scars are part of the map now."
    },
    balanced: {
      name: "The Balanced Life", card: "You held it all, and held it well.",
      open: ["Twenty years on, there are no headlines about you: no fortune, no scandal, no burnout. Just a good life, evenly held. Work that matters enough, people who matter more, and enough sleep."],
      tradeoff: "It sounds simple. Hardly anyone manages it. You did."
    },
    unexpected: {
      name: "The Unexpected", card: "You were guiding you all along.", secret: true,
      open: [
        "Twenty years on, a grey coat hangs in your hallway. You don't remember buying it.",
        "One night there's a sheet of paper and a pen on your desk, and the words are already in your head. You write them slowly, in handwriting you've seen before: *“Not every road is one you'll walk. Choose anyway.”*",
        "You sign it: *— A.* For Archivist. For Always. For you."
      ],
      tradeoff: null,
      final: "Somewhere, at 11:47 pm, a note lands softly on a doormat."
    }
  },

  // Endings shown in this order in the "futures discovered" collection
  endingOrder: ["builder", "anchor", "wanderer", "hero", "cage", "phoenix", "balanced", "unexpected"],

  // Epilogue callback lines — the first two that match are used
  callbacks: [
    { if: { all: ["sam_coffee"] }, text: "Sam still teases you about that 11:47 pm text. “Best decision you ever made.”" },
    { if: { all: ["helped_rosa"] }, text: "A photo of Rosa hangs on your fridge. She's laughing at something just out of frame." },
    { if: { all: ["dog_biscuit"] }, text: "Biscuit's old lead still hangs by the door. You've never had the heart to move it." },
    { if: { all: ["volunteer"] }, text: "On Saturdays you still drive the food-bank van. Some habits are worth keeping." },
    { if: { all: ["gave_it_away"] }, text: "The thing you gave away is still growing. Strangers use it every day." },
    { if: { all: ["showed_up"] }, text: "You were there when it mattered. They remember. So do you." },
    { if: { all: ["chose_career"] }, text: "A photo of the Singapore skyline still hangs on your office wall." },
    { if: { all: ["learned_skill"] }, text: "Vera's £3,000 outlived everyone's expectations, just as she asked." },
    { if: { all: ["saved_windfall"] }, text: "Somewhere in a spreadsheet, Vera's £3,000 has quietly tripled." },
    { if: { all: ["friends_trip"] }, text: "The road-trip playlist still plays at every birthday. Nobody agrees on it." },
    { if: { all: ["stepped_back"] }, text: "You learned to say no at twenty-three. It's the best skill you ever had." },
    { if: { all: ["pushed_through"] }, text: "Every year your doctor asks the same question: “Are you sleeping?”" },
    { if: { all: ["moved"] }, text: "You still dream in two cities." },
    { if: { all: ["stayed"] }, text: "You know the name of every barista on your street." }
  ],

  letters: [
    { if: { all: ["letter_sam"] }, text: "Somewhere, in another timeline, a phone buzzes at 11:47 pm, and someone replies straight away." },
    { if: { all: ["letter_risk"] }, text: "Somewhere, in another timeline, a younger you reads a note that says *Take the risk*, and smiles." },
    { if: { all: ["letter_rest"] }, text: "Somewhere, in another timeline, a younger you closes the laptop and goes to bed. It's a start." },
    { if: { all: ["letter_nothing"] }, text: "Somewhere, a younger you reads a note that says *Don't change a thing*, and changes everything anyway." }
  ]
};
