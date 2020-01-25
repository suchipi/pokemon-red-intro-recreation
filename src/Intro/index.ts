import {
  useType,
  useNewComponent,
  useChild,
  useUpdate,
  Animation,
  AnimationFrame,
} from "@hex-engine/2d";

import {
  Blank,
  Copyright,
  WidescreenBlank,
  WidescreenGameFreak,
} from "./CopyrightAndGameFreak";
import Fight from "./Fight";
import useFadeToWhite from "../useFadeToWhite";

export default function Intro(onDone: () => void) {
  useType(Intro);

  const fadeToWhite = useFadeToWhite(400);

  const screens = useNewComponent(() =>
    Animation<[Function, Function]>(
      [
        new AnimationFrame([Blank, Blank], { duration: 1000 }),
        new AnimationFrame([Copyright, Copyright], { duration: 3000 }),
        new AnimationFrame([WidescreenBlank, WidescreenBlank], {
          duration: 1000,
        }),
        new AnimationFrame([WidescreenGameFreak, WidescreenGameFreak], {
          duration: 7000,
        }),
        new AnimationFrame(
          [
            Fight,
            () =>
              Fight(() => {
                fadeToWhite.fade(onDone);
              }),
          ],
          { duration: 1000 }
        ),
      ],
      { loop: false }
    )
  );
  let currentScreen = useChild(() => screens.currentFrame.data[1]());

  useUpdate(() => {
    if (currentScreen.rootComponent.type !== screens.currentFrame.data[0]) {
      currentScreen.destroy();
      currentScreen = useChild(() => screens.currentFrame.data[1]());
    }
  });

  screens.play();
}
