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
} from "@hex-engine/2d";
import introCopyright from "./intro-copyright.aseprite";
import introStar from "./intro-star.aseprite";
import gameFreakImage from "./game-freak-image.aseprite";
import gameFreakText from "./game-freak-text.aseprite";
import gameFreakStars from "./game-freak-stars.aseprite";
import screenSize from "../../screen-size";
import useZIndex from "../../useZIndex";
import Widescreen from "../Widescreen";
import lerp from "../../lerp";

export function Blank() {
  useType(Blank);
}

export function Copyright() {
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

  const position = startPos.clone();

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

export function WidescreenBlank() {
  useType(WidescreenBlank);
  useChild(Widescreen);
}

export function WidescreenGameFreak() {
  useType(WidescreenGameFreak);
  useChild(Widescreen);

  useChild(GameFreakImage);
  useChild(GameFreakText);
  useChild(Star);
}
