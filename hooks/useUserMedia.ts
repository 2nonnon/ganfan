import { useEffect, useState } from 'react'

export default function useUserMedia(constraints?: MediaStreamConstraints) {
  const [active, setActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (active) {
      navigator.mediaDevices.getUserMedia(constraints).then(setStream).catch(setError)
    }
    else {
      stream?.getTracks().forEach(track => track.stop())
      setStream(null)
      setError(null)
    }
  }, [constraints, active])

  return [stream, error, setActive] as const
}
