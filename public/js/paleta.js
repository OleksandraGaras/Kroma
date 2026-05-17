document.addEventListener('DOMContentLoaded', () => {
  const colorPicker = document.getElementById('base-color-picker');
  const pickerHex = document.querySelector('.picker-hex');
  const harmonyBtns = document.querySelectorAll('.harmony-btn');
  const unlockedItems = document.querySelectorAll('.color-item:not(.locked)');
  
  const bars = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'), // Base
    document.getElementById('bar-3'),
    document.getElementById('bar-4'),
    document.getElementById('bar-5')
  ];

  let currentHarmony = 'analogous';

  // --- Utility Functions: HEX <-> RGB <-> HSL ---
  const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // --- Harmony Math ---
  const generatePalette = (baseHex, harmony) => {
    const rgb = hexToRgb(baseHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let h = hsl.h, s = hsl.s, l = hsl.l;
    
    let palette = [];
    
    // Helper to ensure values wrap or clamp correctly
    const wrapHue = (hue) => (hue + 360) % 360;
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    switch (harmony) {
      case 'analogous':
        // Shift hue slightly
        palette = [
          hslToHex(wrapHue(h - 30), s, l),
          baseHex,
          hslToHex(wrapHue(h + 30), s, l),
          hslToHex(wrapHue(h + 60), s, l),
          hslToHex(wrapHue(h + 90), s, l)
        ];
        break;
      case 'monochromatic':
        // Shift lightness
        palette = [
          hslToHex(h, s, clamp(l - 30, 0, 100)),
          baseHex,
          hslToHex(h, clamp(s - 20, 0, 100), clamp(l + 20, 0, 100)),
          hslToHex(h, s, clamp(l + 40, 0, 100)),
          hslToHex(h, clamp(s - 40, 0, 100), clamp(l + 60, 0, 100))
        ];
        break;
      case 'triadic':
        // 120 degree shifts
        palette = [
          hslToHex(wrapHue(h - 120), s, clamp(l - 10, 0, 100)),
          baseHex,
          hslToHex(wrapHue(h + 120), s, l),
          hslToHex(wrapHue(h + 120), clamp(s - 20, 0, 100), clamp(l + 20, 0, 100)),
          hslToHex(wrapHue(h - 120), s, clamp(l + 20, 0, 100))
        ];
        break;
      case 'complementary':
        // 180 degree shift
        palette = [
          hslToHex(h, s, clamp(l - 20, 0, 100)),
          baseHex,
          hslToHex(wrapHue(h + 180), s, l),
          hslToHex(wrapHue(h + 180), clamp(s - 20, 0, 100), clamp(l + 20, 0, 100)),
          hslToHex(wrapHue(h + 180), s, clamp(l - 20, 0, 100))
        ];
        break;
      case 'split-complementary':
        // 150 and 210 degree shifts
        palette = [
          hslToHex(h, s, clamp(l - 20, 0, 100)),
          baseHex,
          hslToHex(wrapHue(h + 150), s, l),
          hslToHex(wrapHue(h + 210), s, l),
          hslToHex(wrapHue(h + 210), clamp(s - 20, 0, 100), clamp(l + 20, 0, 100))
        ];
        break;
      default:
        palette = [baseHex, baseHex, baseHex, baseHex, baseHex];
    }
    
    // Ensure the Base is always at index 1 (Column 2) for our UI layout
    // We already positioned baseHex at index 1 in the arrays above.
    return palette;
  };

  const updateUI = () => {
    const baseHex = colorPicker.value.toUpperCase();
    pickerHex.textContent = baseHex;
    
    const newPalette = generatePalette(baseHex, currentHarmony);
    
    newPalette.forEach((color, index) => {
      const bar = bars[index];
      const colorDiv = bar.querySelector('.bar-color');
      const hexSpan = bar.querySelector('.bar-hex');
      
      colorDiv.style.backgroundColor = color;
      hexSpan.textContent = color;
    });
  };

  // --- Event Listeners ---
  colorPicker.addEventListener('input', updateUI);

  harmonyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      harmonyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentHarmony = btn.getAttribute('data-harmony');
      updateUI();
    });
  });

  unlockedItems.forEach(item => {
    item.addEventListener('click', () => {
      const hex = item.getAttribute('data-hex');
      colorPicker.value = hex;
      updateUI();
    });
  });

  // Copy individual hex codes
  document.querySelectorAll('.btn-copy-hex').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hex = e.target.parentElement.querySelector('.bar-hex').textContent;
      navigator.clipboard.writeText(hex).then(() => {
        const original = e.target.textContent;
        e.target.textContent = '✔️';
        setTimeout(() => e.target.textContent = original, 1500);
      });
    });
  });

  // Export entire palette
  const btnCopyPalette = document.getElementById('btn-copy-palette');
  const cssOutputContainer = document.querySelector('.css-output-container');
  const paletteCssOutput = document.getElementById('palette-css-output');

  btnCopyPalette.addEventListener('click', () => {
    const pColors = bars.map(bar => bar.querySelector('.bar-hex').textContent);
    const cssString = `:root {\n  --color-1: ${pColors[0]};\n  --color-base: ${pColors[1]};\n  --color-3: ${pColors[2]};\n  --color-4: ${pColors[3]};\n  --color-5: ${pColors[4]};\n}`;
    
    paletteCssOutput.textContent = cssString;
    cssOutputContainer.classList.remove('hidden');
    
    navigator.clipboard.writeText(cssString).then(() => {
      const original = btnCopyPalette.textContent;
      btnCopyPalette.textContent = 'Copiat a la porta-retalls!';
      setTimeout(() => btnCopyPalette.textContent = original, 2000);
    });
  });

  // Initial render
  updateUI();
});
