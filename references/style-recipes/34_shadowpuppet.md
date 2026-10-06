# 34_shadowpuppet · Chinese shadow puppetry

> Source: Migration test D (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/34_shadowpuppet.js`.

The file name during the experiment: `scenes/r3_piying.js`, each frame takes about 121ms (each piece of leather is off-screen separately, and the number of multiples is high).

**Pipeline**: Shadow window (the radial warm light of the oil lamp behind the scenes + screen wick hotspot + 3px cloth texture, cloth texture cache) → Props layer (window lattice, table, vase flowers, square-backed chair, cache) → butterfly → cat → girl, one off-screen layer for each group → first print a layer of offset soft shadow for each layer, and then multiply the body → rivet → joystick → wooden frame.

**Key Parameters**
- Leather goods function `piece(g, path, col, carve)`:
  - Coloring.
  - Use destination-out to engrave the clip.
  - Draw a 2×edge wide "leather edge" of the same color inside the clip to ensure that the engraving will not carve through the outer contour.
  - Trace 2.6px dark brown border #3a160a.
- Engraving library:
  - Caviar dots: s14–22, r3–3.5.
  - Tuanhua flowers: 5-petal ellipse, s36–46.
  - Clouds: Archimedean spiral, linewidth 3.4, s24–40.
  - Checkered lattice: s26–32.
  - Graduation lines: line width 3–7.
- Print to the curtain: `stamp(layer)` First multiply α0.28, blur 6px, and offset (7,5) to represent the ghost when the leather item is not completely attached to the curtain; then multiply the body. Translucency = curtain color × leather color, overlapping leather items will naturally become darker.
- Colors: Red #c0352a, Green #2f7d4c, Amber #d99a2e (blonde = amber skin), Yellow #e2bd4a, Blue #2c5a8a, Orange #d9782a (cat).
- Curtain: radial #fff6d6 → #f2d7a0 → #cf9a58 → #7a4a20; flame disturbance `fl = 0.5·noise(3ts) + 0.3·noise(9ts)`, ts steps by 15fps. Optical center drift ±26/±18px, hot spot radius 260+40·fl.
- "Empty face" in the female corner: After finishing the hair, destination-out the entire face, only trace the outline of the face, then fill in the phoenix eyes (long upward line + lower lash line + eye dots), willow-leaf eyebrows, and lip dots.
- Mapping of orange and white cats: orange = orange peel; white chest, white muzzle, white legs and white claws = **The entire piece is hollowed out leaving only the skin edge**; Tabby = carved lines. This applies to all "silhouette/hollow" styles: the white part is directly hollowed out.
- Action:
  - The whole girl swings ±0.012rad around (1260,930); the head swings ±0.06 around the rivet on the neck.
  - Hold the cup in 10fps steps.
  - Loose wrist: dangle = 0.35·sin(11·ls)·(1 − 0.6·cup), the cup is thrown with the hand.
  - The cat nods its head around its neck 0.1·sin(6ts) + 0.05.
  - The tail has 4 hinge sections, each section rotates 0.3·sin(7ts − 0.9i) + 0.38 relative to the previous section, and the whip tip lags behind each section.
  - Swing the bead string step by step.
- Rod: 5px dark brown line, blur 1.2px multiply, from the neck, wrist, cat's back, cat head, butterfly to the bottom of the picture.

**Motif Animation**: The lamp flame makes the light spots on the entire curtain dance, butterfly (the wings are turned over with scaleX at 12fps, with a pole), wrist flick, cat nods and tail whip, and steps shake. Movement area 6.8%.

**pit**
- The table legs press on the skirt: after multiply, the red × green is close to black, turning into a black trapezoid. It is right to overlap and deepen the shadow puppets, but don’t put the overlap as the visual focus, just move the table legs away.
- The first version of the cat's front legs is a whole orange rectangle, covering the white chest. After changing it to two white legs that are almost completely hollow, it can be read as "orange white".
- It will be messy if the pole crosses the main body: the pole goes down and out from the leather piece, and does not cross other characters.
