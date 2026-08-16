// Geometric ATN monogram redrawn as vector paths with stroke weights tuned
// for tiny sizes (the raster logo's hairline strokes vanish below ~100px).
// Letters interlock: the T's arm starts at the A's apex, the N's stem closes
// the row. viewBox 0 0 104 64 includes the horizontal margins for centering.

export function monogramSvg(size, color, strokeWidth = 7) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round((size * 64) / 104)}" viewBox="0 0 104 64">
  <g fill="none" stroke="${color}" stroke-width="${strokeWidth}">
    <!-- A -->
    <polyline points="16,58 29,7 42,58"/>
    <line x1="21.5" y1="41" x2="36.5" y2="41"/>
    <!-- T: arm begins at the A apex -->
    <line x1="29" y1="7" x2="70" y2="7"/>
    <line x1="52" y1="7" x2="52" y2="58"/>
    <!-- N -->
    <line x1="70" y1="7" x2="70" y2="58"/>
    <line x1="70" y1="58" x2="93" y2="7"/>
    <line x1="93" y1="7" x2="93" y2="58"/>
  </g>
</svg>`;
}
