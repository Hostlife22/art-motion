// S03 → S04 enters the transition (Vox "Pull out from a single photo → reveal the entire collage"):
// The old picture becomes a dot photo on the table - when p=0, the inner frame of the photo just fills the screen (= the old picture remains as it is), the long tail of the camera is pulled out, and the tabletop, newspaper clippings, and red lines are exposed;
// The old picture is passed through 45° dots and old paper colors frame by frame. When p=1, it is consistent with the photo cached in the s04 segment pixel by pixel. The camera and outlets are at spacex/scenes/s04.js (S04X).
TRANSITIONS.deskPullOut = (c, A, B, p, o) => { c.drawImage(B, 0, 0); S04X.photoLive(c, A, o.lt, p); };
