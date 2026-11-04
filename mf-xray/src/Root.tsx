import React from "react";
import { Composition } from "remotion";
import { MFXray, TOTAL_FRAMES } from "./Video";
import { FPS } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="MFXrayWide" component={MFXray} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="MFXrayVertical" component={MFXray} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
