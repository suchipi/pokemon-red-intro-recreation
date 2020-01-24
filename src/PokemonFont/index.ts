import { useType, useNewComponent, BMFont } from "@hex-engine/2d";
import pokemonFnt from "./pokemon.fnt";

export default function PokemonFont() {
  useType(PokemonFont);

  return useNewComponent(() => BMFont(pokemonFnt));
}
