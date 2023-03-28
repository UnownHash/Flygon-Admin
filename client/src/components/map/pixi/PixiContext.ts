import { createContext, useContext } from 'react';
import * as PIXI from 'pixi.js';
import { Map } from 'leaflet';

export interface PixiUtils {
  getContainer: () => PIXI.Container<PIXI.Graphics>;
  getRenderer: () => PIXI.AbstractRenderer;
  latLngToLayerPoint: Map['latLngToLayerPoint'];
  getScale: () => number;
}

export interface PixiOverlayInterface {
  utils: PixiUtils;
}

export interface PixiContextInterface {
  pixiOverlay: PixiOverlayInterface | null;
  render: undefined | (() => void);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const createCtx = <A extends {} | null>() => {
  const context = createContext<A | undefined>(undefined);

  const useMyContext = () => {
    const ctx = useContext(context);

    if (ctx === undefined) {
      throw new Error('useCtx must be inside a Provider with a value');
    }

    return ctx;
  };

  return [useMyContext, context.Provider] as const;
};

export const [usePixiContext, PixiContextProvider] = createCtx<PixiContextInterface>();
