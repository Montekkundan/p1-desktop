import { hidePluginWindow } from "./utils"
import { v4 as uuid } from 'uuid'
import { io } from 'socket.io-client'

let videoTransferFilename :string | undefined
let mediaRecorder : MediaRecorder
let userId : string

const socket = io(process.env.VITE_SOCKET_URL as string)

export const StartRecording = (_onSources : {
    screen:string
    id:string
    audio:string
}) => {
    hidePluginWindow(true)
    videoTransferFilename = `${uuid()}-${_onSources?.id.slice(0,8)}.webm`
    mediaRecorder.start(1000)
}

export const onStopRecording = () => mediaRecorder.stop()

const stopRecording = () => {
    hidePluginWindow(false)
    socket.emit('process-video', {
        filename: videoTransferFilename,
        userId
    })
}

export const onDataAvailable = (event: BlobEvent) => {
    socket.emit('video-chunks', {
        chunks: event.data,
        filename: videoTransferFilename
    })
}

export const selectSources = async (_onSources:{
    screen:string
    id:string
    audio:string
    preset: 'HD' | 'SD'
}, videoElement:React.RefObject<HTMLVideoElement>) => {
   if(_onSources && _onSources.screen && _onSources.id && _onSources.audio ) {
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const constraints : any = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: _onSources?.screen,
                minWidth: _onSources.preset === 'HD' ? 1920 : 1280,
                maxWidth: _onSources.preset === 'HD' ? 1920 : 1280,
                minHeight: _onSources.preset === 'HD' ? 1080 : 720,
                maxHeight: _onSources.preset === 'HD' ? 1080 : 720,
                frameRate: 30
            }
        }
     }
     userId = _onSources.id
     // Create the stream
     const stream = await navigator.mediaDevices.getUserMedia(constraints)

     // Audio and webcam stream
     const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: _onSources.audio
         ? { deviceId : {exact: _onSources.audio}}
         : false
     })

     if (videoElement && videoElement.current) {
        videoElement.current.srcObject = stream
        await videoElement.current.play()
     }

     const combinedStream = new MediaStream([...stream.getTracks(), ...audioStream.getTracks()])

     mediaRecorder = new MediaRecorder(combinedStream , {
        mimeType: 'video/webm; codecs=vp9'
     })

     mediaRecorder.ondataavailable = onDataAvailable
     mediaRecorder.onstop = stopRecording
   }
}