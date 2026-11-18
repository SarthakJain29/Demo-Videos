import React from "react";
import {Composition} from "remotion";
import {Diffwise, FPS, TOTAL} from "./Video";

export const Root: React.FC = () => (
  <>
    <Composition id="Diffwise" component={Diffwise} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{vertical: false}} />
    <Composition id="DiffwiseVertical" component={Diffwise} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{vertical: true}} />
  </>
);
