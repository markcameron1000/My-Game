# Parallel Futures — Full Script

| | |
|---|---|
| **Status** | Draft v1.0 |
| **Date** | 3 November 2026 |
| **Builds on** | [STORY_OUTLINE.md](STORY_OUTLINE.md) (structure, effects, logic) |

**How to read this script**
- **Scene text** is what the player reads. Each scene is 2–4 sentences.
- **Choices** are button labels of 8 words or fewer. Each choice has a **↳ ripple** line, shown briefly after the player picks it.
- `[effects · flags]` repeat the outline so this file can be turned straight into `story.json`.
- *Italics in quotes* are notes, texts or spoken lines shown inside the scene.
- `{if flag}` marks text that only appears when that condition is met.

---

## 0. Landing screen

> # Parallel Futures
> **Every choice splits the timeline.**
> 12 choices. One life. Many futures.
>
> **[ Begin ]**

*Returning player:* **[ Continue your journey ]** · **[ Start a new life ]** · "3 of 8 futures discovered"

---

## PROLOGUE: The Night Before

**P.1**
11:47 pm. Two job offers glow on your laptop, and both want an answer by morning. On the doormat lies a folded note you didn't hear arrive: *"Not every road is one you'll walk. Choose anyway. — A."*
Your phone buzzes. It's Sam. You haven't spoken since school. *"Random, but I'm in town next week. Coffee?"*

| Choice | Ripple | Data |
|---|---|---|
| **Yes! Let's do it.** | ↳ Sent. Sam replies with eleven exclamation marks. | Con +1 · `sam_coffee` |
| **I'll reply tomorrow.** | ↳ Tomorrow comes. The message sinks beneath a hundred others. | `sam_ignored` |

> *Ripple hint (fades in):* A small thing. Or is it?

---

## CHAPTER ONE: Today

**1.1 The Offer**
Northgate Logistics is offering a steady salary, a pension and a desk by the window. Loop, a six-person start-up building an app for local repair shops, is offering shares, a beanbag and no promises. And there's the third option, the one you haven't told anyone about: a one-way ticket.

| Choice | Ripple | Data |
|---|---|---|
| **Take the steady job at Northgate.** | ↳ Your parents sound relieved. You sound… fine. | Sec +2 · `job_safe` |
| **Bet on Loop.** | ↳ Day one: the founder hands you a laptop and a fire extinguisher. "Just in case." | Gro +2, Sec −1 · `job_startup` |
| **Turn them both down. Travel.** | ↳ You click "decline" twice and book a flight before you can change your mind. | Gro +1, Wel +1, Sec −2 · `gap_year` |

**1.2 The Windfall**
A solicitor's letter: your great-aunt Vera, whom you met twice, has left you £3,000. Tucked inside is a note in shaky ink: *"Spend it on something that outlives me."*

| Choice | Ripple | Data |
|---|---|---|
| **Save it. Future me will thank me.** | ↳ The number in your savings account looks surprisingly calm. | Sec +2 · `saved_windfall` |
| **Learn to code. Finally.** | ↳ Week three: you build an app that does absolutely nothing. You've never been prouder. | Gro +2 · `learned_skill` |
| **Book a trip with friends.** | ↳ Four friends, one tiny car, and a playlist nobody agrees on. | Con +1, Wel +1 · `friends_trip` |

**1.3a Coffee with Sam** `{if sam_coffee}`
Sam hasn't changed: same laugh, same terrible jokes, same habit of stealing your chips. Sam now runs a food bank and is one Saturday driver short. "No pressure," says Sam, applying enormous pressure.

| Choice | Ripple | Data |
|---|---|---|
| **Count me in.** | ↳ First Saturday: forty deliveries and one very grateful pensioner called Mo. | Imp +2, Wel −1 · `volunteer` |
| **I'd love to, but I can't.** | ↳ Sam shrugs, smiling. "Offer stands. Forever, probably." | Wel +1 |

**1.3b The Neighbour** `{if sam_ignored}`
Saturday morning. Your neighbour Rosa, eighty-something and fiercely independent, is halfway up the stairs with four bags of shopping. Her face says she'd rather die than ask for help.

| Choice | Ripple | Data |
|---|---|---|
| **Take the bags. Stay for tea.** | ↳ Her tea is terrible. Her stories about 1970s Lisbon are not. | Imp +1, Con +1 · `helped_rosa` |
| **Headphones in. Keep walking.** | ↳ She makes it to the top. She always does. | none |

---

## CHAPTER TWO: One Year Later

**Chapter opening** (one line, depending on the job)
- `{job_safe}` Northgate's lanyard has started to feel like a collar. The work is fine. The canteen is fine. Everything is *fine*.
- `{job_startup}` Loop has run out of chairs and is running low on sleep. There are twelve of you now, and three are called Alex.
- `{gap_year}` Your backpack is held together with tape and stories. Eleven countries in, your money is thinner than the soles of your shoes.

**2.1 The Move**
- `{job_safe}` Your manager calls you in. There's a promotion, a real one, but it's at head office, two hundred miles from everyone you know.
- `{job_startup}` Loop has just raised £4 million. The founder wants someone she trusts to open the new Lisbon office, and she's looking at you.
- `{gap_year}` In Lisbon, a hostel owner called Inês watches you fix her booking system. "Stay," she says. "I'll pay you. Badly, but I'll pay you."

| Choice | Ripple | Data |
|---|---|---|
| **Pack the boxes. Go.** | ↳ New city, new streets, new everything. The group chat goes quiet. `{+helped_rosa & Lisbon}` Rosa was right about the light here. | Gro +1, Con −1 · `moved` |
| **Stay where my people are.** | ↳ Sunday roasts, familiar faces, and a small "what if" you keep in a drawer. | Con +1 · `stayed` |

**2.2 The Warning Light**
3:04 am. You're on the night bus with forty unread messages and a heartbeat doing something new and unwelcome. The stranger opposite, in a grey coat, with eyes you can't quite place, leans in. *"You'll want to remember tonight."* At the next stop, the seat is empty.

| Choice | Ripple | Data |
|---|---|---|
| **Push through. This is my moment.** | ↳ You answer all forty before sunrise. Your body files a formal complaint. | Sec +1, Gro +1, Wel −2 · `pushed_through` |
| **Step back. Start saying no.** | ↳ The first "no" is terrifying. The tenth feels like breathing. | Wel +2, Gro −1 · `stepped_back` |

**2.3 The Scruffy Dog**
A rescue-shelter van is parked outside the supermarket. Most of the dogs are asleep. One of them (lopsided ears, at least partly mop) hasn't taken his eyes off you.

| Choice | Ripple | Data |
|---|---|---|
| **Adopt him. He's called Biscuit.** | ↳ Biscuit eats a shoe on the first night. You forgive him instantly. | Wel +1, Con +1, Sec −1 · `dog_biscuit` |
| **Not now. Life's too busy.** | ↳ You walk away without looking back. (You look back.) | none |

---

## CHAPTER THREE: Five Years Later

**Chapter opening** (the first match wins)
- **The Rocket** `{job_startup & pushed_through & learned_skill}` The email subject line just says *Congratulations*. A tech giant has bought Loop, and your shares are suddenly worth more than your parents' house. Some of the code you taught yourself with Vera's money is still in there. `[Sec +3]`
- **The Wreckage** `{job_startup}` Loop dies on a Tuesday: one all-hands meeting, one apologetic founder, one cardboard box. Five years of your life fit inside it with room to spare. `[Sec −2 · hit_bottom]`
- **The Climb** `{job_safe}` You manage a team of nine at Northgate now, and there's a parking space with your name on it. Some mornings you sit in the car a little too long before going in.
- **The Drifter** `{gap_year}` Three countries, two languages, one laptop. You freelance from wherever the wifi is good: free, mostly happy, and never quite sure where home is.

**3.1 The Clash**
The offer arrives on a Monday: a six-month project in Singapore, the kind that changes careers. It starts in ten days, which is exactly when someone you love needs you there.
- `{dog_biscuit}` Jordan, whom you met when Biscuit stole their sandwich in the park, opens their first art exhibition that week. They've been painting for it for three years.
- `{else sam_coffee}` Sam is getting married, and you're the best person. The speech is already half written.
- `{else}` Your sister's first baby is due, and she's asked you to be there.

| Choice | Ripple | Data |
|---|---|---|
| **Take Singapore.** | ↳ The view from the fortieth floor is spectacular. The video call is pixelated. | Sec +2, Gro +1, Con −2 · `chose_career` |
| **Be there.** | ↳ You're there. Some moments only happen once. | Con +2 · `showed_up` |

**3.2 The Side Project**
- `{learned_skill}` Fixit, the little app you built to help neighbours swap and repair things, now has 20,000 users and a server bill that keeps you up at night.
- `{else volunteer}` The food bank has grown into a community kitchen: three hundred meals a week, run by volunteers and, somehow, by you.
- `{else}` Your sourdough, a hobby that turned into an obsession, sells out at the Saturday market by 9 am. People queue. People *queue*.

| Choice | Ripple | Data |
|---|---|---|
| **Go all in. Grow it.** | ↳ Investors, spreadsheets, a logo. Your weekends belong to it now. | Gro +1, Imp +1, Wel −1 · `project_grew` |
| **Let it go. It served its purpose.** | ↳ You feel lighter, and a little sad. Both are allowed. | Wel +1 |
| **Give it away to the community.** | ↳ You hand over the keys. It grows faster without you, which stings and delights in equal measure. | Imp +2 · `gave_it_away` |

**3.3 Roots**
- `{Sec ≥ 6}` Your landlord is selling up. For the first time you could actually buy somewhere: a small flat with a balcony just big enough for one chair.
- `{Sec ≤ 5}` Your landlord is selling up, and rents have gone mad. You could sign a long lease on somewhere smaller, or swallow your pride and move back home for a while.

| Choice (Sec ≥ 6) | Choice (Sec ≤ 5) | Ripple | Data |
|---|---|---|---|
| **Buy the flat. Put down roots.** | **Sign the lease. Commit to here.** | ↳ The keys are heavier than they look. | Sec +2, Gro −1 · `settled` |
| **Keep renting. Stay light.** | **Move home. Regroup.** | ↳ No anchor, no mortgage, and the world stays wide open. | Gro +1, Wel +1 · `flexible` |

---

## CHAPTER FOUR: Fifteen Years Later

**Chapter opening:** You're older now. There are mornings when your knees have opinions.

**4.0 The Crisis** (the first match wins)
- **Health scare** `{Wel ≤ 3}` It starts as tiredness and ends in a hospital corridor. The doctor is kind and very clear: something has to change, and it has to change now.
- **Automation** `{job_safe & !learned_skill}` Northgate announces "Project Horizon". By the end of the slideshow you understand: software will be doing your job by spring, and you helped train it.
- **Industry shift** `{job_startup | gap_year}` Overnight, your whole industry reinvents itself. The skills that paid your bills for fifteen years are suddenly a museum exhibit.
- **Family illness** `{else}` The call comes at 6 am. Your dad has had a fall and can't live alone any more. Someone has to step up.

**4.0b Who Shows Up?** (shows up to two matching callbacks, in this order)
You brace yourself to face it alone. Then the doorbell rings.
1. `{sam_coffee}` It's Sam, older and greyer, holding a pot of soup and a spreadsheet. *"You replied to my text once, at 11:47 pm. I never forgot."*
2. `{helped_rosa}` It's a young man in a nurse's uniform. *"You won't remember me. I'm Rosa's grandson. Nan talked about you until the very end: the neighbour who carried her bags. Let me help."*
3. `{volunteer}` It's the food-bank crew, with Mo, now ninety, leading the charge. They've already drawn up a rota.
4. `{dog_biscuit}` Biscuit, grey-muzzled and slow now, pads over and rests his head on your knee. `{+showed_up}` Jordan sits down beside you. *"We've got this."*
5. `{friends_trip}` Your phone lights up. The road-trip group chat, silent for years, is suddenly full of messages. *"We're coming."*
6. `{none of the above}` There's no one there, just a folded note on the doormat in handwriting you almost recognise: *"You're not as alone as you think. — A."*

**4.1 The Response**
So. What now?

| Choice | Ripple | Data |
|---|---|---|
| **Rebuild. Learn something new.** | ↳ At your age? Yes. At your age. | Gro +2 · `rebuilt` |
| **Let people help me.** | ↳ Accepting help, it turns out, is its own kind of strength. | Con +2, Wel +1 · `leaned_in` |
| **Turn this into something for others.** | ↳ What happened to you won't happen to them. Not if you can help it. | Imp +2 · `paid_forward` |

**4.2 The Letter**
That evening, the stranger in the grey coat is sitting on your doorstep, not a day older than on the night bus. Their face is hard to look at directly, like a word on the tip of your tongue. *"I can deliver one sentence,"* they say, *"to the night before all this began. Choose carefully."*

| Choice | Ripple | Data |
|---|---|---|
| **"Reply to Sam."** | ↳ The stranger nods, folds your words into a note, and is gone. | `letter_sam` |
| **"Take the risk."** | ↳ *(same)* | `letter_risk` |
| **"Rest more. Really."** | ↳ *(same)* | `letter_rest` |
| **"Don't change a thing."** | ↳ The stranger smiles, as if they knew you'd say that. | `letter_nothing` |

---

## EPILOGUE: Twenty Years Later

Each epilogue is put together like this: **Archetype opening** → **2 callback lines** → **Trade-off line** → **Letter line**.

### Archetype text

**The Builder**
> Twenty years on, you've built something solid: a career people respect, a home with your name on the door, and a safety net strong enough to catch other people too. You plan, you deliver, you rarely panic.
> `[callbacks]`
> Some quiet evenings you wonder what the other road looked like. Then you check your pension and sleep soundly anyway.

**The Anchor**
> Twenty years on, your kitchen table is where everyone ends up: birthdays, break-ups, and Sunday lunches that run until dark. You're the person people call first.
> `[callbacks]`
> The big adventure never quite happened. It's a postcard on the fridge. But every chair at that table is full.

**The Wanderer**
> Twenty years on, you've filled your passport twice. Five cities, three careers, and a thousand stories you tell differently every time.
> `[callbacks]`
> Home is still a feeling you're chasing rather than an address. But what a chase it's been.

**The Quiet Hero**
> Twenty years on, there are people whose lives are better because of you, and most of them will never know your name. You built things and gave them away. You showed up.
> `[callbacks]`
> You gave a great deal. The question you're still learning to answer is whether you saved any for yourself.

**The Golden Cage**
> Twenty years on, you have everything you planned for: the title, the house, the numbers. Everything is exactly where you put it.
> `[callbacks]`
> The house is very quiet. Some nights you scroll through old photos, trying to remember the last time you laughed until it hurt.

**The Phoenix**
> Twenty years on, people assume you always had it together. They didn't see the bottom, or the long, unglamorous climb back. *(Made generic in the prototype: the original line mentioned both the cardboard box and the hospital corridor, but a player only experiences one of them.)*
> `[callbacks]`
> What you built afterwards was smaller, truer and entirely yours. The scars are part of the map now.

**The Balanced Life**
> Twenty years on, there are no headlines about you: no fortune, no scandal, no burnout. Just a good life, evenly held. Work that matters enough, people who matter more, and enough sleep.
> `[callbacks]`
> It sounds simple. Hardly anyone manages it. You did.

**The Unexpected** *(secret)*
> Twenty years on, a grey coat hangs in your hallway. You don't remember buying it.
> One night there's a sheet of paper and a pen on your desk, and the words are already in your head. You write them slowly, in handwriting you've seen before: *"Not every road is one you'll walk. Choose anyway."*
> You sign it: *— A.* For Archivist. For Always. For you.
> `[callbacks]`
> *(Replaces the letter line:)* Somewhere, at 11:47 pm, a note lands softly on a doormat.

### Callback lines (pick the first 2 that match, top to bottom)

| Flag | Line |
|---|---|
| `sam_coffee` | Sam still teases you about that 11:47 pm text. "Best decision you ever made." |
| `helped_rosa` | A photo of Rosa hangs on your fridge. She's laughing at something just out of frame. |
| `dog_biscuit` | Biscuit's old lead still hangs by the door. You've never had the heart to move it. |
| `volunteer` | On Saturdays you still drive the food-bank van. Some habits are worth keeping. |
| `gave_it_away` | The thing you gave away is still growing. Strangers use it every day. |
| `showed_up` | You were there when it mattered. They remember. So do you. |
| `chose_career` | A photo of the Singapore skyline still hangs on your office wall. |
| `learned_skill` | Vera's £3,000 outlived everyone's expectations, just as she asked. |
| `saved_windfall` | Somewhere in a spreadsheet, Vera's £3,000 has quietly tripled. |
| `friends_trip` | The road-trip playlist still plays at every birthday. Nobody agrees on it. |
| `stepped_back` | You learned to say no at twenty-three. It's the best skill you ever had. |
| `pushed_through` | Every year your doctor asks the same question: "Are you sleeping?" |
| `moved` | You still dream in two cities. |
| `stayed` | You know the name of every barista on your street. |

### Letter lines (the last line of every epilogue except The Unexpected)

| Flag | Line |
|---|---|
| `letter_sam` | Somewhere, in another timeline, a phone buzzes at 11:47 pm, and someone replies straight away. |
| `letter_risk` | Somewhere, in another timeline, a younger you reads a note that says *Take the risk*, and smiles. |
| `letter_rest` | Somewhere, in another timeline, a younger you closes the laptop and goes to bed. It's a start. |
| `letter_nothing` | Somewhere, a younger you reads a note that says *Don't change a thing*, and changes everything anyway. |

---

## FUTURE CARD (shareable summary)

| Archetype | Card line |
|---|---|
| The Builder | You built the road as you walked it. |
| The Anchor | You were someone's home. |
| The Wanderer | You collected horizons. |
| The Quiet Hero | You made the world kinder, quietly. |
| The Golden Cage | You got everything you wanted. Was it what you needed? |
| The Phoenix | You fell, and rose different. |
| The Balanced Life | You held it all, and held it well. |
| The Unexpected | You were guiding you all along. |

Card layout: **archetype name** · illustration · 5-point radar chart · card line · "Discover your parallel future → [link]"

---

## PARALLEL MAP: ghost-branch teasers

These are shown when the player taps a branch they didn't take.

| Untaken choice | Teaser |
|---|---|
| Replied to Sam | In another timeline, one quick reply changed everything. |
| Left Sam till tomorrow | In another timeline, a neighbour's stories about Lisbon were waiting. |
| Northgate | In another timeline, a steady job built a steady life… or a quiet cage. |
| Loop | In another timeline, a beanbag and a fire extinguisher led somewhere wild. |
| Travel | In another timeline, a one-way ticket became a whole life. |
| Saved the windfall | In another timeline, Vera's money grew quietly in the dark. |
| Learned to code | In another timeline, an app that did nothing became an app that did everything. |
| Trip with friends | In another timeline, a terrible playlist became a lifeline. |
| Moved / Stayed | In another timeline, you chose the other city, and different people became your people. |
| Adopted Biscuit | In another timeline, a scruffy dog changed who you met. |
| Singapore / Be there | In another timeline, you made the other choice. Someone still remembers. |
| "Don't change a thing." | In another timeline, the grey coat fits. *(Shown only after The Unexpected is discovered; otherwise "This timeline is still sealed.")* |

---

## UI MICROCOPY

| Element | Text |
|---|---|
| Chapter cards | Prologue · The Night Before / One · Today / Two · One Year Later / Three · Five Years Later / Four · Fifteen Years Later / Epilogue · Twenty Years Later |
| Ending screen buttons | **[ See your parallel futures ]** · **[ Share your Future Card ]** |
| Parallel Map header | The roads you walked, and the ones you didn't. |
| Rewind button | Rewind to here |
| Rewind confirm | Go back? Everything after this moment will unravel. **[ Rewind ]** **[ Stay ]** |
| Endings collection | {n} of 8 futures discovered |
| All endings found | You've seen every future. Except, perhaps, the one you'll live. |
| Sound toggle | Sound on / Sound off |
