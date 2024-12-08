import { updateStudioSettingsSchema } from "@/schemas/studio-settings.schema";
import { useZodForm } from "./useZodForm";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD",
  plan?: "PRO" | "FREE"
) => {
  const [onPreset, setOnPreset] = useState<"HD" | "SD" | undefined>();
  const { register, watch } = useZodForm(updateStudioSettingsSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data: { status: number; message: string }) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
  });

  useEffect(() => {
    if (screen && audio) {
      window.ipcRenderer.send("media-sources", {
        id:id,
        screen,
        audio,
        preset,
        plan,
      });
    }
  }, [audio, screen]);

  useEffect(() => {
    const subscribe = watch((values) => {
      setOnPreset(values.preset);
      mutate({
        screen: values.screen!,
        audio: values.audio!,
        preset: values.preset!,
        id,
      });
      window.ipcRenderer.send("media-sources", {
        id: id,
        screen: values.screen!,
        audio: values.audio!,
        preset: values.preset!,
        plan,
      });
    });
    return () => subscribe.unsubscribe();
  }, [id, mutate, plan, watch]);

  return { register, isPending, onPreset };
};
