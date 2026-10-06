// Demonstration · Financial chart (Economist/Financial Channel) "Deep Calculation Technology Revenue and Stock Price" (three shots in 8 seconds, the company and data are all fictitious, each shot is labeled "Indicative Data"). Grammar card: references/animation-grammars/t3_finance_chart.md
//   Preview index.html?film=demos/t3_finance_chart Render render.py --film demos/t3_finance_chart --out t3.mp4
// Lens 2→3: The camera moves closer around the latest point of the stock price line (the vector is redrawn, the screen position remains unchanged), and passes through the recent 20-day K-line.
window.PUNCH = 0;
window.SCENE_DIR = 'demos/t3_finance_chart';
window.ERAS = [
  { id: 't3_s1', dur: 2.8 },
  { id: 't3_s2', dur: 2.7, transition: { type: 'slidePush', dur: 0.5, bar: '#E3120B' } },
  { id: 't3_s3', dur: 2.5, transition: { type: 'zoomThrough', dur: 0.6, cx: 1530, cy: 297.65, zoom: 6, live: true, bScale0: 0.6, bg: '#FFFFFF',
      get focus() { return SCENES.t3_s3.focus; } } },                 // focus = the latest K line
];
