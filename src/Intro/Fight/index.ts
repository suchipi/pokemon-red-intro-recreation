import {
  useType,
  Aseprite,
  useDraw,
  useNewComponent,
  useChild,
  useUpdate,
  Geometry,
  Polygon,
  Point,
  Animation,
  AnimationFrame,
} from "@hex-engine/2d";
import gengar from "./gengar.aseprite";
import nidorino from "./nidorino.aseprite";
import screenSize from "../../screen-size";
import useZIndex from "../../useZIndex";
import Widescreen, { WIDESCREEN_BAR_HEIGHT } from "../Widescreen";
import lerp from "../../lerp";

function Gengar(position: Point) {
  useType(Gengar);

  const gengarSprite = useNewComponent(() => Aseprite(gengar));

  useZIndex(1);

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(gengarSprite.size),
      position,
    })
  );

  useDraw(
    (context) => {
      gengarSprite.draw(context);
    },
    { roundToNearestPixel: true }
  );

  return {
    sprite: gengarSprite,
    setFrame(frameNumber: number) {
      gengarSprite.currentAnim.goToFrame(frameNumber);
    },
  };
}

function Nidorino(position: Point) {
  useType(Nidorino);

  const nidorinoSprite = useNewComponent(() => Aseprite(nidorino));

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(nidorinoSprite.size),
      position,
    })
  );

  useDraw(
    (context) => {
      nidorinoSprite.draw(context);
    },
    { roundToNearestPixel: true }
  );

  return {
    sprite: nidorinoSprite,
    setFrame(frameNumber: number) {
      nidorinoSprite.currentAnim.goToFrame(frameNumber);
    },
  };
}

export default function Fight(onAnimationEnd: () => void) {
  useType(Fight);

  useChild(Widescreen);

  const gengarPos = new Point(0, 0);
  const nidorinoPos = new Point(0, 0);

  const gengar = useChild(() => Gengar(gengarPos)).rootComponent;
  const nidorino = useChild(() => Nidorino(nidorinoPos)).rootComponent;

  const referencePoints: { [name: string]: Point } = {
    gengarStart: new Point(
      screenSize.x - gengar.sprite.size.x / 2,
      screenSize.y - WIDESCREEN_BAR_HEIGHT - gengar.sprite.size.y / 2
    ),
    nidorinoStart: new Point(
      nidorino.sprite.size.x / 2,
      screenSize.y - WIDESCREEN_BAR_HEIGHT - nidorino.sprite.size.y / 2 + 8
    ),
  };

  referencePoints.gengarHome = referencePoints.gengarStart.subtractX(80);
  referencePoints.nidorinoHome = referencePoints.nidorinoStart.addX(70);

  const anim = useNewComponent(() =>
    Animation(
      [
        // Offscreen on opposite sides
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarStart.addX(
                /* start offscreen */ gengar.sprite.size.x
              ),
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoStart.subtractX(
                /* start offscreen */ nidorino.sprite.size.x
              ),
              frame: 0,
            },
          },
          { duration: 2000 }
        ),

        // Move in to home positions
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 100 }
        ),

        // Nidorino bounces side to side
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(4).subtractY(4),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(4).subtractY(4),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 400 }
        ),

        // Nidorino bounces side to side again
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(4).subtractY(4),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(4).subtractY(4),
              frame: 0,
            },
          },
          { duration: 100 }
        ),

        // Gengar readies his slash
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 1,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.subtractX(8),
              frame: 1,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 100 }
        ),

        // Slash hand comes down
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.subtractX(8),
              frame: 2,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 100 }
        ),

        // Gengar zooms forward
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.addX(8),
              frame: 2,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 50 }
        ),

        // Nidorino is hit
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.addX(8),
              frame: 2,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 1,
            },
          },
          { duration: 200 }
        ),

        // Nidorino goes flying up...
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.addX(8),
              frame: 2,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8).subtractY(20),
              frame: 1,
            },
          },
          { duration: 200 }
        ),

        // ...and back
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.addX(8),
              frame: 2,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 1,
            },
          },
          { duration: 300 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome.addX(8),
              frame: 2,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 1,
            },
          },
          { duration: 100 }
        ),

        // Gengar lowers hand and returns to home
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 1,
            },
          },
          { duration: 300 }
        ),

        // Nidorino picks itself up
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 0,
            },
          },
          { duration: 1000 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        // Nidorino jumps side to side, bigger this time
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8).subtractY(16),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome,
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(8).subtractY(16),
              frame: 0,
            },
          },
          { duration: 200 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 0,
            },
          },
          { duration: 400 }
        ),

        // End Nidorino jumping side to side

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 0,
            },
          },
          { duration: 400 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16),
              frame: 0,
            },
          },
          { duration: 100 }
        ),

        // Nidorino lowers down and readies his horn
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16).addY(16),
              frame: 2,
            },
          },
          { duration: 600 }
        ),

        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.addX(16).addY(16),
              frame: 2,
            },
          },
          { duration: 300 }
        ),

        // Nidorino goes flying towards Gengar's face
        new AnimationFrame(
          {
            gengar: {
              pos: referencePoints.gengarHome,
              frame: 0,
            },
            nidorino: {
              pos: referencePoints.nidorinoHome.subtractX(16).subtractY(16),
              frame: 2,
            },
          },
          { duration: 0, onFrame: onAnimationEnd }
        ),
      ],
      { loop: false }
    )
  );
  anim.play();

  gengarPos.mutateInto(anim.currentFrame.data.gengar.pos);
  nidorinoPos.mutateInto(anim.currentFrame.data.nidorino.pos);

  useUpdate(() => {
    const frameData = anim.currentFrame.data;

    gengar.setFrame(frameData.gengar.frame);
    nidorino.setFrame(frameData.nidorino.frame);

    const nextFrame = anim.frames[anim.currentFrameIndex + 1];
    if (nextFrame) {
      gengarPos.x = lerp(
        frameData.gengar.pos.x,
        nextFrame.data.gengar.pos.x,
        anim.currentFrameCompletion
      );
      gengarPos.y = lerp(
        frameData.gengar.pos.y,
        nextFrame.data.gengar.pos.y,
        anim.currentFrameCompletion
      );

      nidorinoPos.x = lerp(
        frameData.nidorino.pos.x,
        nextFrame.data.nidorino.pos.x,
        anim.currentFrameCompletion
      );
      nidorinoPos.y = lerp(
        frameData.nidorino.pos.y,
        nextFrame.data.nidorino.pos.y,
        anim.currentFrameCompletion
      );
    } else {
      gengarPos.mutateInto(frameData.gengar.pos);
      nidorinoPos.mutateInto(frameData.nidorino.pos);
    }
  });
}
