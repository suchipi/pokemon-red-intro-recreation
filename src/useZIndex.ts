import { useStateAccumulator, Component } from "@hex-engine/2d";

const sym = Symbol("Z_INDEX");

export default function useZIndex(value: number) {
  useStateAccumulator<number>(sym).add(value);
}

export function getZIndex(comp: Component): number {
  return comp.stateAccumulator<number>(sym).all()[0] || 0;
}
