import { useType, useNewComponent, useChild, Canvas } from "@hex-engine/2d";
import screenSize from "./screen-size";
import palette from "./palette";
import Intro from "./Intro";
import CustomDrawOrder from "./CustomDrawOrder";

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() =>
    Canvas({ backgroundColor: palette.WHITE })
  );
  canvas.element.width = screenSize.x;
  canvas.element.height = screenSize.y;
  canvas.element.style.height = "100vh";

  useNewComponent(CustomDrawOrder);

  const intro = useChild(() =>
    Intro(() => {
      intro.destroy();
    })
  );
}
