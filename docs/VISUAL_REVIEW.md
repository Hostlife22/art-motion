# Visual review

The reference was inspected through half-second frames and two-second contact sheets. The implementation was reviewed in Chromium at 1920 × 1080 using paused comparison URLs. Screenshots in `docs/review` are captures of the live Canvas renderer, not video frames.

## Reconstructed

- All twenty works, their order, year labels, captions and distinct environments.
- Reference desktop grid geometry, poster scale, gutters and large-scene framing.
- Red card backs, staggered arrivals and flips, opening title, strip camera and return to overview.
- Multiple articulated figures and distinct keyframe sequences for each work.
- Dance partner, teacher, students, boxers, referee, supporting fighters and mirror reflections.
- Dragon, newspaper ring, ship motion, birds, chalk and notebook annotations, bag swing, comic impacts, TV interference and subtitles, particles, box-office counter, sign damage, arcade health/K.O., mirror cracks, bronze statue, rain and fireworks.
- The original AAC soundtrack follows the visual clock through pause and seek.

## Differences that still prevent a one-to-one match

- Figures use a newly drawn articulated rig. Facial silhouette, body contours, clothing folds and hand shapes differ from the reference.
- Keyframe poses reproduce action categories and broad order. Contact timing and all intermediate movements have not been traced at 60 fps.
- Camera entries are hand-transcribed estimates. A shared world-space protagonist crossing the gutter has not been reconstructed; actors enter and exit individual masks.
- Architectural geometry, wave foam, the dragon silhouette, vintage type, mosaic pattern and Hong Kong skyline remain simplified.
- Cormorant Garamond is a chosen substitute, not an identified original typeface. Newspaper masthead and poster typography also differ.
- Dance steps and partner contacts, two-finger push-ups, furniture deformation and multi-opponent combat remain approximations.
- Some environment elements are still static, including laundry and the basic lantern cords.
- Reflections repeat transformed rig poses; there is no ray-traced mirror simulation.
- The mobile two-column grid is an adaptation. The video provides a desktop reference only.

## Review artifacts

- [Overview](review/overview.png)
- [Paper cut](review/dragon.png)
- [Boxing](review/boxing.png)
- [School](review/school.png)
- [Arcade](review/arcade.png)
- [Mirrors](review/mirror.png)
- [Legend](review/legend.png)

The browser tests establish functional rendering, determinism and interaction. They are not evidence of pixel equivalence to the source video.
