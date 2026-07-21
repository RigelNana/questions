export function runAppearanceTransition(
  update: () => void,
  reduceMotion: boolean,
) {
  if (reduceMotion || typeof document.startViewTransition !== 'function') {
    update();
    return;
  }

  document.startViewTransition(update);
}
