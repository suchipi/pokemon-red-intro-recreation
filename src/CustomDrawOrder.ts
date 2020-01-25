import { useType, useNewComponent, Canvas } from "@hex-engine/2d";
import { getZIndex } from "./useZIndex";

const { DrawOrder } = Canvas;

export default function CustomDrawOrder() {
  useType(CustomDrawOrder);

  useNewComponent(() =>
    DrawOrder((ents) => {
      const normal = DrawOrder.defaultSort(ents);
      return normal.sort((compA, compB) => {
        if (DrawOrder.isDebugOverlay(compA)) return 1;
        if (DrawOrder.isDebugOverlay(compB)) return -1;

        const zIndexA = getZIndex(compA);
        const zIndexB = getZIndex(compB);

        return zIndexA - zIndexB;
      });
    })
  );
}
