# Visual review

Scene artwork now uses the original 830 × 830 image samples encoded as lossless WebP. This preserves facial features, line work, lettering, gradients and background details from the supplied recording. Palette reduction and polygon approximation previously changed those details.

## Rendering and timing

- Camera positions follow the measured pans and exact stationary card centres. Desktop poster geometry remains 830 × 830 at x=545, y=40, with 885px pitch.
- Each scene samples the reference at 30fps and stores frames in independently loadable one-second chunks. Seeking selects an absolute sample, making repeated seeks deterministic.
- Native image samples are decoded and resized in three background workers, with a single high-quality resize to the physical display size and a browser decoder fallback. The old 640px cache was enlarged to 830px on desktop and 1660px on Retina, introducing extra blur.
- Preview images use the original central poses. The animated bitmap cache has a 96 MiB budget; current neighbouring samples remain available while older samples are released. Under decode load, playback can briefly retain the nearest prepared sample. Paused comparisons wait for the exact sample.
- The browser draws prepared artwork into Canvas; it does not download or play the source MP4. Visual time and audio suspend together while a required chunk loads.

## Remaining differences

The source is approximately 60fps; the site samples motion at 30fps. Opening flips, captions outside the artwork and overview transitions have independent implementations. Content crossing card boundaries is clipped. Mobile remains an adaptation of a desktop recording. These differences mean the whole site is not a frame-exact replica.

The character animations are source-derived image sequences rather than editable skeletal rigs. Changing a gesture requires rebuilding its artwork. The lossless artwork currently occupies 1.25 GB (1.17 GiB) across 252 files; nearby chunk loading limits the cost of a particular scene, not the download for viewing every scene.

## Verification

Browser comparisons were inspected at the same paused moment, 36.5 seconds, at 1920 × 1080 CSS pixels with DPR 1 and DPR 2. Desktop scenes, the overview and mobile layouts were also inspected. Temporary comparison captures are not retained in the repository.

The [current overview](review/overview.png) is the retained preview. Functional tests establish rendering, interaction, native lossless asset integrity, physical cache resolution and deterministic seeking. They do not establish whole-site frame equivalence.
