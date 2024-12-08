import { onStopRecording, StartRecording } from "@/lib/recorder"
import { cn, videoRecordingTime } from "@/lib/utils"
import { Cast, Pause, Square } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function StudioTray() {
  const initialTime = new Date()
  const [onTimer, setOnTimer] = useState<string>('00:00:00')
  const [count, setCount] = useState(0)
  const [preview, setPreview] = useState(false)
  const [recording, setRecording] = useState(false)
  const [onSources, setOnSources] = useState<
  | {
    screen:string
    id:string
    audio:string
    preset: "HD" | "SD"
    plan: "PRO" | "FREE"
  } | undefined
  >(undefined)

  window.ipcRenderer.on('profile-received', (event, payload) => {
    console.log(event)
    setOnSources(payload)
  })

  const videoElement = useRef<HTMLVideoElement>(null)

  const clearTime = () => {
    setOnTimer('00:00:00')
    setCount(0)
  }

  useEffect(() => {
    if(!recording) return
    const recordTimeInterval = setInterval(() => {
      const time = count + ( new Date().getTime() - initialTime.getTime())
      setCount(time)
      const recordingTime = videoRecordingTime(time)
      if (onSources?.plan === 'FREE' && recordingTime.minute == '05') {
        setRecording(false)
        clearTime()
        onStopRecording()
      }
      setOnTimer(recordingTime.length)
      if (time <= 0) {
        setOnTimer('00:00:00')
        clearInterval(recordTimeInterval)
      }
    }, 1)
    return () => clearInterval(recordTimeInterval)
  }, [recording])

  return !onSources ? (
    <></>
  ) : (
    <div className="flex flex-col justify-end gap-y-5 h-screen">
        {preview && (
            <video
                ref={videoElement}
                autoPlay
                className={cn('w-6/12 border-2 self-end')}
            />
        )}
        <div className="rounded-full flex justify-center items-center h-20 w-full border-2
        bg-[#171717] draggable border-white/40">
            <div {...(onSources && {
                onClick: () => {
                    setRecording(!recording)
                    StartRecording(onSources)
                }
            })}
            className={cn(
                'non-draggable rounded-full cursor-pointer relative hover:opactity-80',
                recording ? 'bg-red-500 w-6 h-6' : 'bg-red-400 w-8 h-8' 
            )}
            >
              {recording && 
                <span className="absolute -righ-16 top-1/2 transform -translate-y-1/2 text-white">
                    {onTimer}
                </span>}
            </div>
            {!recording ? (
                <Pause 
                className="non-draggable opacity-50"
                size={32}
                fill="white"
                stroke="none"
                />
            ) : (
                <Square 
                    className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
                    size={32}
                    fill="white"
                    onClick={() => {
                        setRecording(false)
                        clearTime()
                        onStopRecording()
                    }}
                    stroke="white"
                />
            )}
            <Cast
              onClick={() => {
                setPreview((prev) => !prev)
              }}
              className="non-draggable cursor-pointer hover:opacity-60"
              size={32}
              fill="white"
              stroke="white"
            />
        </div>
    </div>
  )
}

export default StudioTray