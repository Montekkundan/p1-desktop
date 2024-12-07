import { getMediaSources } from "@/lib/utils";
import { useReducer } from "react";

export type SourceDeviceStateProps = {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInput?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending: boolean;
};

type DisplayDeviceActionProps = {
  type: "GET_DEVICES";
  payload: SourceDeviceStateProps;
};

export const useMediaSources = () => {
  const [state, dispatch] = useReducer(
    (
      state: SourceDeviceStateProps,
      action: DisplayDeviceActionProps
    ): SourceDeviceStateProps => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };
        default:
          return state;
      }
    },
    {
      displays: [],
      audioInput: [],
      error: null,
      isPending: false,
    } as SourceDeviceStateProps
  );

  const fetchMediaResources = async () => {
    dispatch({
      type: "GET_DEVICES",
      payload: { isPending: true } as SourceDeviceStateProps,
    });
    getMediaSources().then((sources) => {
      dispatch({
        type: "GET_DEVICES",
        payload: {
          displays: sources.displays,
          audioInput: sources.audio,
          isPending: false,
        },
      });
    });
  };

  return { state, fetchMediaResources };
};
