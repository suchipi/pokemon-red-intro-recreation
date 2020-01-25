import {
  useType,
  useDraw,
  useNewComponent,
  useChild,
  Geometry,
  Polygon,
  Point,
} from "@hex-engine/2d";
import screenSize from "../../screen-size";
import palette from "../../palette";
import useZIndex from "../../useZIndex";

export const WIDESCREEN_BAR_HEIGHT = 32;

function WidescreenBar(position: Point) {
  useType(WidescreenBar);

  useZIndex(1);

  const size = new Point(screenSize.x, WIDESCREEN_BAR_HEIGHT);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(size),
      position,
    })
  );

  useDraw((context) => {
    context.fillStyle = palette.BLACK;
    geometry.shape.draw(context, "fill");
  });
}

export default function Widescreen() {
  useType(Widescreen);

  useChild(() =>
    WidescreenBar(new Point(screenSize.x / 2, WIDESCREEN_BAR_HEIGHT / 2))
  );
  useChild(() =>
    WidescreenBar(
      new Point(screenSize.x / 2, screenSize.y - WIDESCREEN_BAR_HEIGHT / 2)
    )
  );
}
