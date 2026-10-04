# Native reconstruction review

The frame playback renderer has been replaced with native Canvas drawing in all twenty scenes. Runtime artwork contains no crops or extracted source frames. The video is used offline to study composition, movements and timing; its extracted soundtrack remains in the application.

## Implemented

- Twenty procedural backgrounds, costumes and separate scene performances.
- Joint interpolation with authored elbow/knee targets, curved limb contours, narrower waist profiles, enlarged heads and frontal face transitions. Shoes rotate with lifted legs; the child wears shorts; Kato has a hat and mask.
- Scene action order revised against eight stabilized source samples per scene. Pupils face Bruce and stand at different depths. Dance partners have separate synchronized arm targets. One-arm finger push-ups keep the other hand behind the back and blend continuously into standing poses. The giant raises his arms and is launched upward before landing. The bronze statue forms near the end of the final scene.
- Numeric camera measurements retain the recorded pans and stationary holds. Desktop artwork is 830px square, with an 885px pitch.
- Static caches are created at physical screen resolution; foreground drawing uses the actual Canvas transform. The mosaic is intentionally tiled from our own native illustration.
- Playback uses absolute timestamps without frame sampling, image decoding or artwork buffering. Repeated seeking is deterministic.

## Remaining visual differences

This is not a 1:1 reproduction. The native drawing now follows more of the observed anatomy and facial profiles, but it is still an approximation. Background architecture, ink strokes, wave foam, textures and typography still differ. Some hand contacts, running between cards and supporting-character timing still need finer reconstruction. Turning is a simplified silhouette change, rather than a full anatomical rotation. Opening flips and mobile layout are independent implementations.

The current work establishes editable graphics and animations for every scene. Passing functional tests verifies rendering and controls, not visual fidelity. The retained [overview](review/overview.png) shows the native implementation.
