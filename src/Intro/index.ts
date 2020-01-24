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
} from "@hex-engine/2d";
import introCopyright from "./intro-copyright.aseprite";
import introStar from "./intro-star.aseprite";
// import gameFreakImage from "./game-freak-image.aseprite";
// import gameFreakText from "./game-freak-text.aseprite";
import screenSize from "../screen-size";

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

  const size = new Point(screenSize.x, 32);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(size),
      position,
    })
  );

  useDraw((context) => {
    context.fillStyle = "black";
    geometry.shape.draw(context, "fill");
  });
}

function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

function Star() {
  useType(Star);

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

// function GameFreakLogo() {
//   useType(GameFreakLogo);
// }

function Widescreen() {
  useType(Widescreen);

  useChild(() => WidescreenBar(new Point(screenSize.x / 2, 16)));
  useChild(() => WidescreenBar(new Point(screenSize.x / 2, screenSize.y - 16)));

  const starAppear = useNewComponent(Timer);
  starAppear.setToTimeFromNow(1000);

  let hasSpawnedStar = false;
  useUpdate(() => {
    if (!hasSpawnedStar && starAppear.hasReachedSetTime()) {
      useChild(Star);
      hasSpawnedStar = true;
    }
  });

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
        new AnimationFrame(Widescreen, { duration: 3000 }),
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
