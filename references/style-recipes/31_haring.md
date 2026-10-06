# 31_haring · 1982 Keith Haring

> Source: Migration Test C (independent agent implementation of read-only skill, 2026-10-04). The scene code was integrated and transplanted to `scripts/engine/scenes/31_haring.js`.

The file name during the experiment: `scenes/k5_haring.js` (line 109). Each frame takes about 4ms and the frame difference is 11.5%.

**Technology**
- Solid color base: yellow wall `#ffd51c`, green space `#16a54a`, 14px black horizon.
- Everything is 13px round black line + flat painting, use `X.girl / X.cat` to "fill → trace" part by part.
- **Dancing man**: Use the modified version of `X.limb` capsule to make 7 limbs + round head.** First draw 2×LW black for all, and then fill them in uniform color** to get the union outline. 4 postures (local key points, origin at the soles of the feet)** 8fps hard cutting, no interpolation**, this is Harlin's jumping method; add action arcs next to the hands.
- **Radial Action Line**: n short straight lines on the ellipse around the object (length 22–34, line width 7–9), 8fps angle change. Use it on cats, girl heads, cups, teapots, red hearts, and the little people on the right side.
- **All follow-up**: `bounce=|sin(t·128/60·π)|^0.6`. Girl dy=−12·bb, the cat missed half a beat. The table is squeezed and stretched with the sole of the foot as the axis (sy 1−0.07(1−bb), sx 1+0.05(1−bb)), the table legs are bent; the teapot jumps 26px; the window frame shakes ±0.025rad; the length of the "jumping" horizontal line on the ground changes with the shot.

**motif animation**:
- The light baby in the window: white merged silhouette, two frames crawling alternately; 14 rays, long and short 8fps alternating.
- 3 dancing figures on the wall (red/blue/pink, different phases, with a mirror image).
- Red heart above the table, beating and radiating.

**characters**: 1980s New York girl. A large red sweater (with a ribbed line at the hem), a denim blue skirt, and white high-top sneakers. Only an eye spot and a red lip are left on the face (Haring's characters originally had no facial features, and this was left for recognition). The thick black circles on the ears look like Walkman headphones, which is perfect for the era.
**Pit**: The reverse end cap of `RIG.limb` will leave holes at the joints under the thick stroke (see ②-1). The window rails should be drawn under the baby. RIG's hairLines are thin lines, which violated the "equal-thickness lines" in Haring, and would pass through the face when raising one's head while drinking tea, so they were removed.

---
