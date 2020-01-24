import { useType, useNewComponent, useChild, Canvas } from "@hex-engine/2d";
import screenSize from "./screen-size";
import Intro from "./Intro";

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() => Canvas({ backgroundColor: "white" }));
  canvas.element.width = screenSize.x;
  canvas.element.height = screenSize.y;
  canvas.element.style.height = "100vh";

  useChild(Intro);
}
