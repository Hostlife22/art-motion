# Native reconstruction review

The frame playback renderer has been replaced with native Canvas drawing in all twenty scenes. Runtime artwork contains no crops or extracted source frames. The video is used offline to study composition, movements and timing; its extracted soundtrack remains in the application.

## Implemented

- Twenty procedural backgrounds, costumes and separate scene performances.
- Joint interpolation, tapered limbs, head details, paper-cut decoration, chalk outlines, boxing gloves, Kato’s mask, tracksuit stripes and the giant’s bald head and sunglasses.
- Supporting actors, delayed pupil movements, dance steps, opponent attacks and reactions, push-ups, ship motion, broken props, mirror reflections, glass cracks, fireworks and the bronze statue.
- Numeric camera measurements retain the recorded pans and stationary holds. Desktop artwork is 830px square, with an 885px pitch.
- Static caches are created at physical screen resolution; foreground drawing uses the actual Canvas transform. The mosaic is intentionally tiled from our own native illustration.
- Playback uses absolute timestamps without frame sampling, image decoding or artwork buffering. Repeated seeking is deterministic.

## Remaining visual differences

This is not a 1:1 reproduction. The drawn anatomy and face silhouette are simpler than the original. Background architecture, ink strokes, wave foam, textures and typography still differ. Hand contacts, running between cards and some supporting-character timing need finer reconstruction. Turning is a simplified silhouette change, rather than a full anatomical rotation. Opening flips and mobile layout are independent implementations.

The current work establishes editable graphics and animations for every scene. Passing functional tests verifies rendering and controls, not visual fidelity. The retained [overview](review/overview.png) shows the native implementation.
