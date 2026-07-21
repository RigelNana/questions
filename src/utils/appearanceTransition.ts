interface ViewTransitionDocument extends Document {
  startViewTransition?: (update: () => void | Promise<void>) => unknown;
}

export function runAppearanceTransition(
  update: () => void,
  reduceMotion: boolean,
) {
  const viewTransitionDocument = document as ViewTransitionDocument;
  if (reduceMotion || !viewTransitionDocument.startViewTransition) {
    update();
    return;
  }

  viewTransitionDocument.startViewTransition(update);
}
