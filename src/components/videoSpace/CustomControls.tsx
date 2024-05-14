import { supportsScreenSharing } from "@livekit/components-core";
import {
  MediaDeviceMenu,
  TrackToggleProps,
  useLocalParticipantPermissions,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import * as React from "react";

import type { ToggleSource } from "@livekit/components-core";
import { Icons } from "../ui";

/** @public */
export type ControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  screenShare?: boolean;
  leave?: boolean;
};

/** @public */
export type ControlBarProps = React.HTMLAttributes<HTMLDivElement> & {
  controls?: ControlBarControls;
};

/**
 * The ControlBar prefab component gives the user the basic user interface
 * to control their media devices and leave the room.
 *
 * @remarks
 * This component is build with other LiveKit components like `TrackToggle`,
 * `DeviceSelectorButton`, `DisconnectButton` and `StartAudio`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <ControlBar />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function CustomControls({ controls, ...props }: ControlBarProps) {
  const visibleControls = { leave: true, ...controls };

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
  }

  const browserSupportsScreenSharing = supportsScreenSharing();

  return (
    <>
      <style global jsx>
        {`
          .lk-button.lk-button-menu {
            --lk-control-hover-bg: hsl(var(--background));
            --lk-control-active-bg: hsl(var(--background));
            --lk-control-active-hover-bg: hsl(var(--background));

            color: hsl(var(--primary));
          }

          .lk-device-menu {
            --lk-bg3: hsl(var(--foreground));

            background-color: hsl(var(--background));
            top: -152px;
          }

          .lk-button {
            --lk-control-bg: hsl(var(--background));
            --lk-border-radius: 0.5rem;
            --lk-control-hover-bg: hsl(var(--foreground));
            --lk-control-active-bg: hsl(var(--background));
            --lk-control-active-hover-bg: hsl(var(--foreground));
          }

          .lk-button[data-lk-source="screen_share"][data-lk-enabled="true"] {
            background-color: hsl(var(--primary));
          }
        `}
      </style>
      <div className="lk-control-bar" {...props}>
        {visibleControls.microphone && (
          <div className="bg-background flex items-center rounded-lg group group-hover:bg-foreground">
            <TrackToggle source={Track.Source.Microphone} initialState={false}></TrackToggle>
            <div className="lk-button-group-menu">
              <MediaDeviceMenu kind="audioinput" />
            </div>
          </div>
        )}
        {visibleControls.camera && (
          <div className="bg-background flex items-center rounded-lg">
            <TrackToggle source={Track.Source.Camera} initialState={false}></TrackToggle>
            <div className="lk-button-group-menu">
              <MediaDeviceMenu kind="videoinput" />
            </div>
          </div>
        )}
        {visibleControls.screenShare && browserSupportsScreenSharing && (
          <TrackToggle
            source={Track.Source.ScreenShare}
            captureOptions={{ audio: true, selfBrowserSurface: "include" }}
            className="!rounded-lg"
            initialState={false}
          ></TrackToggle>
        )}
        {/* <StartAudio label="Start Audio" className="" /> */}
      </div>
    </>
  );
}

export function getSourceIcon(source: Track.Source, enabled: boolean) {
  switch (source) {
    case Track.Source.Microphone:
      return enabled ? <Icons.mic className="w-6 h-6" /> : <Icons.micOff className="w-6 h-6" />;
    case Track.Source.Camera:
      return enabled ? <Icons.video className="w-6 h-6" /> : <Icons.videoOff className="w-6 h-6" />;
    case Track.Source.ScreenShare:
      return enabled ? <Icons.screenShareOff className="w-6 h-6" /> : <Icons.screenShare className="w-6 h-6" />;
    default:
      return undefined;
  }
}

function TrackToggle<T extends ToggleSource>({ ...props }: TrackToggleProps<T>) {
  const { buttonProps, enabled } = useTrackToggle(props);
  return (
    <button {...buttonProps}>
      {getSourceIcon(props.source, enabled)}
      {props.children}
    </button>
  );
}
