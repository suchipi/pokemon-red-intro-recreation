import {
  useType,
  Aseprite,
  useDraw,
  useNewComponent,
  useChild,
  useUpdate,
  Geometry,
  Polygon,
  Animation,
  AnimationFrame,
  useDestroy,
  Point,
  Timer,
  Label,
  SystemFont,
  useDebugOverlayDrawTime,
  useCallbackAsCurrent,
} from "@hex-engine/2d";
import introCopyright from "./intro-copyright.aseprite";
import introStar from "./intro-star.aseprite";
import gameFreakImage from "./game-freak-image.aseprite";
import gameFreakText from "./game-freak-text.aseprite";
import gameFreakStars from "./game-freak-stars.aseprite";
import screenSize from "../screen-size";
import palette from "../palette";
import useZIndex from "../useZIndex";

function Blank() {
  useType(Blank);

  const { destroy } = useDestroy();
  return { destroy };
}

function Copyright() {
  useType(Copyright);

  const screen = useNewComponent(() => Aseprite(introCopyright));

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(screenSize),
      position: screenSize.divide(2),
    })
  );

  useDraw((context) => {
    screen.draw(context);
  });

  const { destroy } = useDestroy();
  return { destroy };
}

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

function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

function Star() {
  useType(Star);

  useZIndex(2);

  const star = useNewComponent(() => Aseprite(introStar));

  const spawnTime = useNewComponent(Timer);

  const centerPos = screenSize.divide(2);

  const ensureOffscreen = star.size.divide(2);

  const startPos = centerPos
    .subtractY(screenSize.y / 2 + ensureOffscreen.y)
    .addX(screenSize.y / 2 + ensureOffscreen.x);
  const endPos = centerPos
    .addY(screenSize.y / 2 + ensureOffscreen.y)
    .subtractX(screenSize.y / 2 + ensureOffscreen.x);

  const position = startPos;

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(star.size),
      position,
    })
  );

  const { destroy } = useDestroy();

  const lifetime = 1000;

  useUpdate(() => {
    const elapsedTime = -spawnTime.distanceFromSetTime() / lifetime;

    const newX = lerp(startPos.x, endPos.x, elapsedTime);
    const newY = lerp(startPos.y, endPos.y, elapsedTime);

    position.mutateInto({ x: newX, y: newY });

    if (elapsedTime > 1) {
      destroy();
    }
  });

  useDraw(
    (context) => {
      star.draw(context);
    },
    { roundToNearestPixel: true }
  );
}

function GameFreakText() {
  useType(GameFreakText);

  const sprite = useNewComponent(() => Aseprite(gameFreakText));
  sprite.currentAnim.loop = false;
  sprite.currentAnim.play();

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(sprite.size),
      position: screenSize.divide(2).addYMutate(8),
    })
  );

  useDraw(
    (context) => {
      sprite.draw(context);
    },
    { roundToNearestPixel: true }
  );

  function starPos(tilesFromLeft: number) {
    return new Point(tilesFromLeft * 8 - 4, sprite.size.y + 4);
  }

  const starPositionTimer = useNewComponent(Timer);
  starPositionTimer.setToTimeFromNow(0);
  starPositionTimer.disable();

  sprite.currentAnim.frames[
    sprite.currentAnim.frames.length - 1
  ].onFrame = useCallbackAsCurrent(() => {
    starPositionTimer.enable();
  });

  let starPositionIndex = 0;
  const starPositions = [
    [1, 3, 6, 10],
    [2, 4, 7, 9],
    [1.5, 4.5, 5.5, 7.5],
    [2.5, 6.5, 8.5, 9.5],
  ];

  useUpdate(() => {
    if (starPositionTimer.isEnabled && starPositionTimer.hasReachedSetTime()) {
      const currentStarPositions = starPositions[starPositionIndex];

      if (currentStarPositions) {
        currentStarPositions.forEach((loc) =>
          useChild(() => GameFreakStars(starPos(loc)))
        );

        starPositionIndex++;
        starPositionTimer.setToTimeFromNow(700);
      }
    }
  });
}

function GameFreakStars(position: Point) {
  useType(GameFreakStars);

  const screen = Polygon.rectangle(screenSize);

  const sprite = useNewComponent(() => Aseprite(gameFreakStars));
  sprite.currentAnim.loop = false;
  sprite.currentAnim.play();

  sprite.currentAnim.frames[
    sprite.currentAnim.frames.length - 1
  ].onFrame = () => {
    sprite.currentAnim = sprite.animations.Loop;
    sprite.currentAnim.play();
  };

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(sprite.size),
      position,
    })
  );

  const moveDown = useNewComponent(Timer);
  moveDown.setToTimeFromNow(100);

  const { destroy } = useDestroy();

  useUpdate(() => {
    if (moveDown.hasReachedSetTime()) {
      geometry.position.addYMutate(1);
      moveDown.setToTimeFromNow(100);
    }

    if (!screen.containsPoint(geometry.position)) {
      destroy();
    }
  });

  useDraw(
    (context) => {
      sprite.draw(context);
    },
    { roundToNearestPixel: true }
  );
}

function GameFreakImage() {
  useType(GameFreakImage);

  const sprite = useNewComponent(() => Aseprite(gameFreakImage));
  sprite.currentAnim.loop = false;
  sprite.currentAnim.play();

  useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(sprite.size),
      position: screenSize.divide(2).subtractYMutate(8),
    })
  );

  useDraw(
    (context) => {
      sprite.draw(context);
    },
    { roundToNearestPixel: true }
  );
}

function WidescreenBlank() {
  useType(WidescreenBlank);

  useChild(() => WidescreenBar(new Point(screenSize.x / 2, 16)));
  useChild(() => WidescreenBar(new Point(screenSize.x / 2, screenSize.y - 16)));

  const { destroy } = useDestroy();
  return { destroy };
}

function WidescreenGameFreak() {
  useType(WidescreenGameFreak);

  useChild(() => WidescreenBar(new Point(screenSize.x / 2, 16)));
  useChild(() => WidescreenBar(new Point(screenSize.x / 2, screenSize.y - 16)));

  useChild(GameFreakImage);
  useChild(GameFreakText);
  useChild(Star);

  const { destroy } = useDestroy();
  return { destroy };
}

export default function Intro() {
  useType(Intro);

  const screens = useNewComponent(() =>
    Animation<() => { destroy: () => void }>(
      [
        new AnimationFrame(Blank, { duration: 1000 }),
        new AnimationFrame(Copyright, { duration: 3000 }),
        new AnimationFrame(WidescreenBlank, { duration: 1000 }),
        new AnimationFrame(WidescreenGameFreak, { duration: 3000 }),
      ],
      { loop: false }
    )
  );
  let currentScreen = useChild(() => screens.currentFrame.data());

  useUpdate(() => {
    if (currentScreen.rootComponent.type !== screens.currentFrame.data) {
      currentScreen.rootComponent.destroy();
      currentScreen = useChild(() => screens.currentFrame.data());
    }
  });

  screens.play();

  const font = useNewComponent(() =>
    SystemFont({ name: "Arial", size: 12, color: "red" })
  );
  const label = useNewComponent(() => Label({ text: "0", font }));
  const elapsedTime = useNewComponent(Timer);

  useUpdate(() => {
    const time = -elapsedTime.distanceFromSetTime();

    label.text = (time / 1000).toFixed(2);
  });

  useDebugOverlayDrawTime();
  useDraw((context) => {
    label.draw(context);
  });
}
