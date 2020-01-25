import {
  useNewComponent,
  ImageFilter,
  Timer,
  useUpdate,
  useDraw,
} from "@hex-engine/2d";
import { parseToRgb } from "polished";
import palette from "./palette";
import useZIndex from "./useZIndex";

const parsedPalette = {
  WHITE: parseToRgb(palette.WHITE),
  LIGHT_GRAY: parseToRgb(palette.LIGHT_GRAY),
  DARK_GRAY: parseToRgb(palette.DARK_GRAY),
  BLACK: parseToRgb(palette.BLACK),
};

export default function useFadeToWhite(stepDuration: number = 200) {
  useZIndex(999);

  const step1 = useNewComponent(() =>
    ImageFilter((imageData) => {
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i + 0];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        if (
          r === parsedPalette.LIGHT_GRAY.red &&
          g === parsedPalette.LIGHT_GRAY.green &&
          b === parsedPalette.LIGHT_GRAY.blue
        ) {
          pixels[i + 0] = parsedPalette.WHITE.red;
          pixels[i + 1] = parsedPalette.WHITE.green;
          pixels[i + 2] = parsedPalette.WHITE.blue;
        }
      }
    })
  );

  const step2 = useNewComponent(() =>
    ImageFilter((imageData) => {
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i + 0];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        if (
          (r === parsedPalette.LIGHT_GRAY.red &&
            g === parsedPalette.LIGHT_GRAY.green &&
            b === parsedPalette.LIGHT_GRAY.blue) ||
          (r === parsedPalette.DARK_GRAY.red &&
            g === parsedPalette.DARK_GRAY.green &&
            b === parsedPalette.DARK_GRAY.blue)
        ) {
          pixels[i + 0] = parsedPalette.WHITE.red;
          pixels[i + 1] = parsedPalette.WHITE.green;
          pixels[i + 2] = parsedPalette.WHITE.blue;
        }
      }
    })
  );

  const step3 = useNewComponent(() =>
    ImageFilter((imageData) => {
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i + 0] = parsedPalette.WHITE.red;
        pixels[i + 1] = parsedPalette.WHITE.green;
        pixels[i + 2] = parsedPalette.WHITE.blue;
      }
    })
  );

  const stepTimer = useNewComponent(Timer);
  stepTimer.disable();

  const stepOrder = [step1, step2, step3];
  let currentStepIndex = -1;

  let onDone = () => {};
  useUpdate(() => {
    if (!stepTimer.isEnabled) return;
    if (stepTimer.hasReachedSetTime()) {
      currentStepIndex++;

      if (currentStepIndex === stepOrder.length) {
        onDone();
      } else {
        stepTimer.setToTimeFromNow(stepDuration);
      }
    }
  });

  useDraw((context) => {
    const currentStep = stepOrder[currentStepIndex];
    if (currentStep) {
      currentStep.apply(context, context);
    }
  });

  return {
    fade(newOnDone?: () => void) {
      if (newOnDone) {
        onDone = newOnDone;
      }

      stepTimer.setToTimeFromNow(stepDuration);
      stepTimer.enable();
    },
  };
}
