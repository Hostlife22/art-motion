# Accessibility

art-motion aims to make its documentation, preview controls and animation output usable by people with different visual, hearing, motor and cognitive needs. [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) is the reference for improvements to web content and controls. This is a development goal; the current demos have not undergone a complete conformance audit.

## Current support and limitations

- Documentation uses headings, descriptive links and text descriptions. Showcase images have alternative text, but it does not replace a full description of each animation.
- The film preview starts paused and offers a play button and timeline slider. The clip preview offers a slider for stepping through frames. These native controls still need clearer accessible names, playback-state announcements and a full keyboard/assistive-technology review.
- Scene text and objects are drawn into Canvas pixels and are not exposed as structured content to screen readers. Narration, transcripts, chart data and scene descriptions must be supplied separately when needed.
- README GIFs loop without an in-page pause control. Browser motion preferences do not automatically stop GIFs or change the demos' motion. Some styles use rapid transitions, camera moves or deliberate flicker.
- Overview sheets and still exports provide ways to inspect the artwork without playing an animation. Some decorative or small text may be difficult to read at reduced display sizes.
- QA checks text framing and motion, but does not establish contrast compliance, caption quality, keyboard access or screen-reader support.

## Viewing without animation

Use the [style overview](assets/all-styles-overview.jpg) or [Milo comparison](assets/characters/milo-character-comparison.jpg) for still views. In the local film preview, leave playback paused and use the timeline to inspect a frame. Export a PNG at a chosen timestamp:

```sh
uv run --with playwright python scripts/engine/render.py --film demos/milo_pixel_adventure --stills 2 --out renders/milo-still
```

For narration and data-driven explanations, provide a transcript and the underlying information alongside the video. A decorative GIF or chart image alone cannot communicate that information to every viewer.

## Contribution guidance

- Provide descriptive alternative text for informative images and a text equivalent for essential scene actions or data. Use semantic HTML for controls and explanations around Canvas.
- Make preview controls usable with a keyboard, with accessible names and visible focus. Keep focus order predictable and expose playback state in text.
- Provide pause/stop controls for ongoing motion and respect `prefers-reduced-motion` in web previews. Offer stills or a reduced-motion presentation when movement is not essential to the explanation.
- Avoid flashing effects. Review transitions against the [WCAG flash criteria](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold).
- Use readable type and sufficient contrast for information-bearing text: at least 4.5:1 for normal text and 3:1 for large text as defined by [WCAG contrast guidance](https://www.w3.org/TR/WCAG22/#contrast-minimum). Review text over every changing background where it appears.
- Communicate chart series, status and emphasis through labels or shapes as well as color. Supply the data in text or a table.
- Provide synchronized captions for spoken audio and meaningful sounds. Include a transcript, and describe important visual information that the audio does not convey.
- Keep captions and essential graphics clear of each other. Inspect output at its intended size, including portrait layouts; do not infer readability from a full-size render alone.

When changing preview controls, review keyboard navigation, focus, zoom, reduced-motion behavior and a screen reader. When changing a film, review caption timing, contrast, visual descriptions and motion separately from the existing QA report.

## Report an accessibility issue

Open an [issue](https://github.com/Hostlife22/art-motion/issues) with **Accessibility:** in the title. Include the page, demo or file; the barrier you encountered; expected behavior; and your browser, operating system and assistive technology when relevant. A timestamp helps identify a problem within a film.

Include only information you are comfortable sharing publicly; no medical details are needed. Improvements can be submitted through the [contribution process](CONTRIBUTING.md).
