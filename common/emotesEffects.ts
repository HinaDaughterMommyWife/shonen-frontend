export const effectClassMap: Record<string, string> = {
  BW: 'grayscale',
  BLUR: 'blur-sm',
  SEPIA: 'sepia',
  INVERT: 'invert',
  HUE: 'hue-rotate-60',
  OPACITY: 'opacity-50',
};

export const effectTextMap: Record<string, string> = {
  BW: 'Gris',
  BLUR: 'Blur',
  SEPIA: 'Sepia',
  INVERT: 'Invertir Color',
  HUE: 'Hue',
  OPACITY: 'Opacidad',
  MIRROR: 'Espejo',
  ROTATE: 'Rotar',
  SPIN: 'Spin',
  SPINR: 'Spin Reverse',
  RAINBOW: 'Rainbow',
  BOUNCE: 'Bounce',
  TADA: 'Tadan',
  WOBBLE: 'Wobble',
  SIDER: 'Rotar Derecha',
  SIDE: 'Rotar Izquierda',
};

export const wrapperClassMap: Record<string, string> = {
  MIRROR: 'scale-x-[-1]',
  ROTATE: 'rotate-180',
  SIDE: '-rotate-90',
  SIDER: 'rotate-90',
};

export const effectAnimationMap: Record<string, string> = {
  SPIN: 'spin-orbit 1s linear infinite',
  SPINR: 'spin-reverse 1s linear infinite',
  RAINBOW: 'rainbow 3s linear infinite',
  BOUNCE: 'bounce-emote 1s linear infinite',
  TADA: 'tada-emote 1s linear infinite',
  WOBBLE: 'wobble-emote 1s linear infinite',
};

export const effectClassArray = Object.values(effectClassMap).concat(
  Object.values(wrapperClassMap),
);
