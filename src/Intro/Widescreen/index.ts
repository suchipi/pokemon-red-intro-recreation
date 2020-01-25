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

function WidescreenBar(position: Point) {
  useType(WidescreenBar);

  useZIndex(1);

  const size = new Point(screenSize.x, 32);

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

  useChild(() => WidescreenBar(new Point(screenSize.x / 2, 16)));
  useChild(() => WidescreenBar(new Point(screenSize.x / 2, screenSize.y - 16)));
}
