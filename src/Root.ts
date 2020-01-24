import {
  useType,
  useNewComponent,
  // useChild,
  Canvas,
  TextBox,
  useDraw,
  Point,
} from "@hex-engine/2d";
import screenSize from "./screen-size";
import PokemonFont from "./PokemonFont";
// import Intro from "./Intro";

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() => Canvas({ backgroundColor: "white" }));
  canvas.element.width = screenSize.x;
  canvas.element.height = screenSize.y;
  canvas.element.style.height = "100vh";

  // useChild(Intro);

  const textBoxSize = new Point(144, 32);

  const font = useNewComponent(PokemonFont);
  const textBox = useNewComponent(() =>
    TextBox({
      font,
      size: textBoxSize,
      lineHeight: font.data.common.lineHeight,
      // lineHeight: 8,
    })
  );

  useDraw((context) => {
    textBox.drawText(context, "Hello there!\nWelcome to the ▼");
  });

  return { textBoxSize };
}
