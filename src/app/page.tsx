import { GameBoard } from "@/components/game-board";
import { seedWords } from "@/lib/words";

export default function HomePage() {
  return <GameBoard initialWords={seedWords} />;
}
