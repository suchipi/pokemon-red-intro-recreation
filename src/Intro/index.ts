import {
  useType,
  useDraw,
  useNewComponent,
  useChild,
  useUpdate,
  Animation,
  AnimationFrame,
  Timer,
  Label,
  SystemFont,
  useDebugOverlayDrawTime,
} from "@hex-engine/2d";

import {
  Blank,
  Copyright,
  WidescreenBlank,
  WidescreenGameFreak,
} from "./CopyrightAndGameFreak";
import Fight from "./Fight";

export default function Intro() {
  useType(Intro);

  const screens = useNewComponent(() =>
    Animation<() => { destroy: () => void }>(
      [
        new AnimationFrame(Blank, { duration: 1000 }),
        new AnimationFrame(Copyright, { duration: 3000 }),
        new AnimationFrame(WidescreenBlank, { duration: 1000 }),
        new AnimationFrame(WidescreenGameFreak, { duration: 7000 }),
        new AnimationFrame(Fight, { duration: 1000 }),
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
