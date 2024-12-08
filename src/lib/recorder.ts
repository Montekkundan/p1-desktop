import { hidePluginWindow } from "./utils"
import { v4 as uuid } from 'uuid'

let videoTransferFilename :string | undefined
let mediaRecorder : MediaRecorder

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
