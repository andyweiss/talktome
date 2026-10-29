export type AndroidSafeArea = { paddingTop?: number; paddingBottom?: number };

/**
 * Padding for the Android status and navigation bars (RN SafeAreaView only
 * insets iOS). The bottom follows the real navigation bar: the thin gesture
 * handle or the taller 3-button bar, which a fixed margin let cover Reply.
 */
export function androidSafeAreaStyle(
  platform: string,
  insets: { top: number; bottom: number },
  statusBarHeight: number | undefined,
): AndroidSafeArea {
  if (platform !== 'android') {
    return {};
  }
  return {
    paddingTop: Math.max(insets.top, statusBarHeight ?? 24) + 8,
    paddingBottom: Math.max(insets.bottom + 4, 8),
  };
}
