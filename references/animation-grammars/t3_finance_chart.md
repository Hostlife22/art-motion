# t3_finance_chart · Financial data chart animation

> One-sentence grammar: **establish the axes, grow the data into view, then annotate one thing. Give the main subject one color and gray out the rest. Keep values honest: bars start at zero, with units and sources on the chart. Animation changes how data appears, never what it measures.**
>
> Demo: `scripts/engine/demos/t3_finance_chart/` (render with `render.py --film demos/t3_finance_chart`), 8s, 3 shots, entirely fictional data, marked “Illustrative data” at lower right in each shot. Overview: `assets/animation-grammars/t3_finance_chart_overview.jpg`. Code: `scripts/engine/demos/t3_finance_chart/`.

## ① Applicable scenarios

- **Use for**: revenue/profit/user growth, stock prices, changing market-share rankings (bar chart race), regional comparisons (choropleth maps), and turning points around events. Choose it when narration includes **specific numbers, times, or comparisons**, such as “grew 8.7× in five years” or “after March 2023”.
- **Use for**: passages where credibility matters and viewers may screenshot, share, or scrutinize the figures.
- **Avoid for**: a single number (use t2's large count-up), unreliable or unsourced data (omit the chart), or explaining principles (use t1).

## ② Screen composition

| item | value | basis |
|---|---|---|
| Background | White `#FFFFFF` (Economist web charts), or FT salmon `#FFF1E5` | Economist 2017 chart style guide; FT o-colors source |
| Layout | **Top thin red line (8px) + upper left red flag (96×22) + bold title (one sentence conclusion) + subtitle (indicator, unit) + lower left source** | Economist style guide layout example |
| Main color palette | ECON RED `#E3120B`, blue `#006BA2`, cyan `#3EBCD2`, green `#379A8B`, yellow `#EBB434`, gray `#758D99`, black `#0C0C0C` | Economist chart color palette |
| Emphasis method | **One color represents the protagonist, and the rest become lighter gray** (This film: the last column remains blue, and the rest transition to `#C6D2D8`) | Datawrapper "Use gray to suppress the secondary data" |
| Grid | Only horizontal grid, fine gray (this film α0.13, 1.5px); **Only the zero baseline is a solid black line** (3px); The y-axis scale value is placed above the right grid line | Economist Style Guide |
| Font | The Economist uses Econ Sans (Cnd); this film uses Roboto Condensed (digital) + Inter (English labels). Title 700, subtitle/axis 400; axis font is smallest, source is smallest and lightest (75% black) | Same as above |
| Rising and falling colors | **Mainland China A shares: red rising, green falling** (this film); Hong Kong and Europe and the United States: green rising, red falling. For Chinese audiences, "red rises, green falls" must be written on the picture; color blindness friendly alternative: blue/orange + ▲▼ symbol | Jiang et al. 2014 (JBDM); Bloomberg terminal color blindness mode |
| Line width | Main data line 5px (this film), moving average 4px; mark lead 2px | — |
| Shape language | Rectangular column, polyline + end dot, K-line entity + shadow line, small dot + leader label | — |

## ③ Motion paths

- **Staging**: layout 0–0.5s → grid drawn left to right (lag 0.12, easeOutQuint) → x-axis labels fade upward in sequence → data → accent-color change → annotation. Allow about 0.5–1.3s per stage. Heer & Robertson 2007 recommend staging complex changes, easing both ends, and allowing roughly 1s or as long as each step requires. Axes before data is an industry convention rather than an empirically established rule; it establishes the ruler before the quantity.
- **Bars**: grow from the zero baseline using easeOutQuint, staggered at lag 0.22 over 1.3s; value labels track bar tops and count in sync (`CH.bars`).
- **Lines**: draw by **x (time)**, rather than arc length. Time advances steadily and steep sections draw faster, making rapid growth readable. A 9px leading dot and tabular price label follow the line; area-gradient alpha fades 0.14→0. Here use 1.5s, smooth, with the final price settling on the point. D3's official example uses 5000ms linear, suited to standalone charts; compress to 1.5–2s for video.
- **Annotations**: trigger when the leading point **passes** the event (`tHit` calculated with inverse easing): pop the point (spring d0.45 bounce0.25) and pulse a ring → draw the leader after 0.12s → fade the text after 0.3s. **Annotate one thing per shot**.
- **Candlesticks**: reveal sequentially (lag 0.06, 0.2–1.3s); grow the body from open to close, then extend the wicks; synchronize volume bars. The upper-right price tracks the latest visible candle, colored by change relative to the interval start.
- **Numbers**: count up with easeOutExpo (CountUp.js defaults to 2s; use 0.9–1.3s in video). Use tabular digits for all rolling numbers to prevent jitter.
- **Camera/continuous motion**: a steady 1→1.03 push per chart shot, without shake or sway. Continue vector camera rendering during zoom transitions rather than enlarging a bitmap.
- **Bar chart race (unused here)**: D3's official example uses 250ms per keyframe, 10 linearly interpolated frames between keyframes, and 12 bars. Allow about 0.5s for rank swaps and stagger changes to avoid simultaneous vertical jumps.

## ④ Transition (5 commonly used types)

1. **Panel slide (slidePush)**: the new panel enters from the right and pushes the old one left, led by a vertical brand-red strip; 0.5s, `cubic-bezier(.7,0,.2,1)`. Here, shot 1→2. Start the new layout during the slide: grow the red rule and reveal the title.
2. **Zoom into a detail (zoomThrough, live + bScale0)**: push 6× around the latest data point while the old shot redraws vectors; dissolve the next view (the latest 20 daily candles) from 0.6×, aligning its latest candle to the zoom focus. Here, shot 2→3. Set `bScale0` when there is no circular opening, or the next view appears as a small floating card.
3. **Chart morph**: change the representation of the same data (bars → points → line), first repositioning, then changing shape. Heer & Robertson: scatter → bars moves horizontally before morphing; stacked → grouped changes width before lowering. **Do not morph between different measures**: revenue bars becoming a stock-price line would imply common units.
4. **Rescale axes**: when the data range changes, change the ticks first (fade old ticks out and new ticks in), then move the data.
5. **Hard cut with fixed layout**: keep red-rule/title positions and swap only chart content, a frequent Economist video technique.

## ⑤ Rhythm and text

- **Shot duration**: 2.5–6s per chart. This demo's 2.8/2.7/2.5s shots are compressed; allow one or two narration sentences per chart in production. Narrative structure: Establisher → Trigger → Peak → Resolution (Amini et al. 2015, 50 professional data videos).
- **Counterpoint with the narration**: The number** settled exactly when it was spoken** - the moment when the column is finished and the label stops at 107.9, it matches "10.79 billion yuan"; the label pops up when the line passes through the event, which matches "after the release of the large model in March 2023". So first set the time point for the narration, and then move backwards to the starting point of the animation.
- **Text**: Write the conclusion in the title ("Revenue has increased to nearly 9 times in five years" -** "Rise to" does not "increase"**: 8.7 times is an increase to 8.7 times of the original = an increase of 7.7 times, which was caught in the film review), and the subtitle writes the indicator and unit ("Annual revenue, 100 million yuan"); the multiple must be calculated from the figures on the chart (107.9÷12.4=8.70); the axis does not start from 0 The time is written in the subtitle ("The vertical axis does not start from 0"); the source line is at the bottom left; the "indicative data" corner mark at the bottom right of the fictitious data is in every shot.

## ⑥ Key points of code implementation

> Since integration into the skill (2026-10-04 v0.4), reusable functions listed here have moved into `scripts/engine/lib/`, using the shared MO / CAM / DG / TY / CH / UI / CL / TOON namespaces. Film-specific code lives in `scripts/engine/demos/t3_finance_chart/`. See `references/09-video-animation-grammars.md` for the library guide and narration-to-grammar selection.

- Reusable skills: `engine.js`, `render.py`, `U.rng` (all seeds of fictitious data are generated and can be reproduced), `PAINT.hex`.
- Newly written `lib/chart.js` (`window.CH`): `lin` (scale, with `inv`), `ticks` (1/2/2.5/5 × 10ᵏ scale), `grid` (grid drawn one by one, zero line thickened, scale value set to the right), `xLabels`, `bars` (from 0 Grow out + sync count + highlight/grey), `line` (press x to advance, head point, area), `yAt`, `candles` (root by root K Line, rising and falling colors can be matched), `callout` (point → lead → text), `tag` (red flag), `demoBadge` (indicating data corner mark), `mixHex`.
- `lib/motion.js`: `lagged`, `quintOut/expoOut` (called easeOutQuint/easeOutExpo during the experiment), `spring` (marked with dots); `TY.count/tabular/fmt`.
- Transition (`transitions.js` entered): `slidePush`, `zoomThrough` (live, bScale0, focus).
- Event triggering moment: `tHit = starting point + duration × smooth⁻¹(proportion of event

## ⑦ Representative works and first-hand references

- Representative works: The Economist web charts and videos; FT charts; Bloomberg Originals/Quicktake data segments; Flourish's bar chart race.
- Economist Chart Style Guide 2017 (mirror): https://sa.ipaa.org.au/wp-content/uploads/2026/02/Economist-CHARTstyleguide_20170505.pdf
- FT color palette source code: https://unpkg.com/@financial-times/o-colors/src/scss/_palette.scss
- Heer & Robertson 2007, Animated Transitions in Statistical Data Graphics:https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf
- D3 bar chart race:https://observablehq.com/@d3/bar-chart-race-explained
- Correll et al. 2020 (the exaggerated effect of truncated coordinate axes cannot be saved even by broken axis markers): https://arxiv.org/abs/1907.02035
- Datawrapper: Column from zero https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero; dual axis https://www.datawrapper.de/blog/dualaxis; color blind https://www.datawrapper.de/blog/colorblindness-part2
- Cultural differences between rising red and falling green: https://onlinelibrary.wiley.com/doi/10.1002/bdm.1800
- CountUp.js(easeOutExpo,2s):https://github.com/inorganik/countUp.js

## ⑧ The 3 most common things to do wrong

1. **Truncate the coordinate axis.**  Histograms always start from 0; polylines and K-lines do not need to start from 0, but it must be written on the chart. Tufte's Lie Factor (graph effect ÷ data effect) exceeding 0.95–1.05 is considered distortion.
2. **There are too many colors, and they are all the protagonists.**  One color tells a story, and the others turn gray; the meaning of red and green must be written clearly (A shares are rising in red, Europe and the United States are falling in red).
3. **The animation is too fancy to read.**  Do not use bouncing columns, 3D columns, or rotating pie charts; use stages, slow in and out, and take about 1 second per step; pause for at least 0.5 seconds after the numbers are settled for people to read.

## qa number (skill `scripts/qa.py`, 2026-10-04, before review)

| Shots | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Deterministic |
|---|---|---|---|---|---|
| t3_s1 | 1.39 | 0.0 | 3 | 1.3/1.9 | ✓ |
| t3_s2 | 2.37 | 4.7 | 0 | 1.9/2.8 | ✓ |
| t3_s3 | 0.96 | 0.0 | 0 | 1.6/2.3 | ✓ |

Explanation: The three "jumps" of t3_s1 are at lt 2.10/2.20/2.27s, which are the frames where the four columns change from blue to gray at the same time (highlighting the main character) and the label pops up - an intentional large-area change, not a distraction.

## Revision (independent review → revised round, 2026-10-04)

| Review Opinions | Law Reform |
|---|---|
| 🔴 The title "Rising nearly 9 times" is wrong with the caliber stated as 8.7 times (it should be "rising to") | Changed to "Revenue has risen nearly 9 times in five years"; the stock price page has the same caliber "Rising 7.5 times the original" |
| 🔴 Monthly-line endpoint ¥268 did not match the daily-candle endpoint 286.40, which the camera zooms into | Set the monthly endpoint to the latest price 286.4 and the previous monthly close to the daily-series start 242; **values must agree across the two shots** |
| 🟡 5.6s "¥268" and the two big red numbers superimposed on the price | The stock price header label is closed within 0.2s of the start of the advancement transition |
| 🟡 "Trading volume" presses the K line, and the top of the volume bar reaches the 240 grid line | The label is moved to the lower right space; the volume bar is normalized according to the maximum amount, leaving a 6px gap |
| 🟡 Daily K page cannot be read in 2 seconds | Delete 5-day moving average; K line 1.3s to complete, bracket 1.75s to settle, stop 0.75s |
| ⚪ Red rises, green falls, and the brand red contrasts | Reserved (for A-share audiences), the subtitle reads "Red rises, green falls (A-share convention)"; for overseas versions, change to green rise or blue/orange |

Revised qa:

| Shots | Motion % | Still Frame Pairs % | Jumps | Avg/Peak ms | Deterministic |
|---|---|---|---|---|---|
| t3_s1 | 1.44 | 0.0 | 3 | 1.3/1.7 | ✓ |
| t3_s2 | 2.45 | 4.7 | 0 | 1.9/2.6 | ✓ |
| t3_s3 | 0.91 | 0.0 | 0 | 1.7/2.9 | ✓ |
