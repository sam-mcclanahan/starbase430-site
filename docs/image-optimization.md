# Image processing

Use local Sharp processing, preserving archival masters outside source control.
Auto-orient, resize without enlargement, convert to sRGB, and strip identifying
metadata. Review at the intended display size. Avoid recompressing derivatives.
Keep explicit image dimensions, responsive caps, and useful text alternatives.

Pablo uses 480-pixel AVIF Q50 with 320-pixel WebP Q75 alternatives. About uses
480-pixel AVIF/WebP caricatures displayed up to 240 CSS pixels. The Apollo 11
insignia uses 320-pixel AVIF/WebP and a 240-CSS-pixel cap. Source ownership,
credits, sizes, and codec settings are recorded in image provenance.

`npm run review:pablo-images -- --input /path/to/private-master.png` creates a
local ignored comparison with 480/640-pixel JPEG, WebP, and AVIF candidates.
It must not overwrite masters. Results are not automatically copied into the
site. Review and approve selected assets before adding them to the source manifest.
Both alternatives count toward conservative page checks, though browsers normally
download only the supported/selected format.
