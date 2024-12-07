import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const onCloseApp = () => window.ipcRenderer.send("closeApp")

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const fetchUserProfile = async (clerkid: string) => {
  const res = await httpClient.get(`/auth/${clerkid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.data
}

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke('getSources')
  const enumerateDevices = await window.navigator.mediaDevices.enumerateDevices()
  const audioInputs = enumerateDevices.filter(device => device.kind === 'audioinput')
  return {displays, audio: audioInputs}
}

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  const res = await httpClient.put(`/studio/${id}`, {screen, audio, preset}, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.data
}