import {
  useType,
  Aseprite,
  useDraw,
  useNewComponent,
  useChild,
  useUpdate,
  Geometry,
  Polygon,
  useDestroy,
  Point,
  Timer,
  useCallbackAsCurrent,
  Animation,
  AnimationFrame,
} from "@hex-engine/2d";
import gengar from "./gengar.aseprite";
import nidorino from "./nidorino.aseprite";
import screenSize from "../../screen-size";
import useZIndex from "../../useZIndex";
import Widescreen from "../Widescreen";

function Gengar(position: Point) {
  const gengarSprite = useNewComponent(() => Aseprite(gengar));

  useZIndex(1);

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(gengarSprite.size),
      position,
    })
  );

  useDraw((context) => {
    gengarSprite.draw(context);
  });

  return {
    setFrame(frameNumber: number) {
      gengarSprite.currentAnim.goToFrame(frameNumber);
    },
  };
}

function Nidorino(position: Point) {
  const gengarSprite = useNewComponent(() => Aseprite(gengar));

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(gengarSprite.size),
      position,
    })
  );

  useDraw((context) => {
    gengarSprite.draw(context);
  });

  return {
    setFrame(frameNumber: number) {
      gengarSprite.currentAnim.goToFrame(frameNumber);
    },
  };
}

export default function Fight() {
  const anim = useNewComponent(() =>
    Animation(
      [
        new AnimationFrame(
          {
            gengar: {
              pos: new Point(0, 0),
              frame: 0,
            },
            nidorino: {
              pos: new Point(0, 0),
              frame: 0,
            },
          },
          { duration: 1000 }
        ),
      ],
      { loop: false }
    )
  );
  anim.play();

  const gengarPos = anim.currentFrame.data.gengar.pos.clone();
  const nidorinoPos = anim.currentFrame.data.nidorino.pos.clone();

  const gengar = useChild(() => Gengar(gengarPos));
  const nidorino = useChild(() => Gengar(nidorinoPos));

  useUpdate(() => {
    const frameData = anim.currentFrame.data;

    gengar.rootComponent.setFrame(frameData.gengar.frame);
    gengarPos.mutateInto(frameData.gengar.pos);

    nidorino.rootComponent.setFrame(frameData.nidorino.frame);
    nidorinoPos.mutateInto(frameData.nidorino.pos);
  });

  const { destroy } = useDestroy();
  return { destroy };
}
