let Haptics = null

export async function initHaptics() {
  try {
    if (window.Capacitor) {
      const mod = await import('@capacitor/haptics')
      Haptics = mod.Haptics
    }
  } catch (e) {}
}

export function useHaptics() {
  const light = () => Haptics?.impact({ style: 'light' }).catch(() => {})
  const medium = () => Haptics?.impact({ style: 'medium' }).catch(() => {})
  const error = () => Haptics?.notification({ type: 'error' }).catch(() => {})
  const success = () => Haptics?.notification({ type: 'success' }).catch(() => {})
  return { light, medium, error, success }
}
