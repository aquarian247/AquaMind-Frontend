import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const supportsMM = typeof window.matchMedia === "function"
    const mql = supportsMM
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      : null

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    const hasMqlListener =
      !!mql &&
      "addEventListener" in mql &&
      typeof (mql as any).addEventListener === "function"
    const hasMqlRemove =
      !!mql &&
      "removeEventListener" in mql &&
      typeof (mql as any).removeEventListener === "function"

    if (hasMqlListener) {
      ;(mql as any).addEventListener("change", onChange)
    } else {
      window.addEventListener("resize", onChange)
    }

    // set initial value
    onChange()

    return () => {
      if (hasMqlRemove) {
        ;(mql as any).removeEventListener("change", onChange)
      } else {
        window.removeEventListener("resize", onChange)
      }
    }
  }, [])

  return !!isMobile
}
