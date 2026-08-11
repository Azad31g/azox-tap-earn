import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  GAME_TITLES,
  GameScreen,
  resolveGameId,
} from "@/components/azox/games/game-screen";
import ShootGame from "@/components/azox/games/ShootGame";
import SnakeGame from "@/components/azox/games/SnakeGame";

import { useAzox } from "@/components/azox/app-provider";


export const Route = createFileRoute("/games/$game")({
  loader: ({ params }) => {
    const game = resolveGameId(params.game);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Game unavailable — AZOX" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${GAME_TITLES[loaderData.game]} — AZOX Gaming`;
    const description = `Play ${GAME_TITLES[loaderData.game]} in the AZOX mini app and earn points toward your next rank.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GameRoute,
});

function GameRoute() {
  const { game } = Route.useLoaderData();
  const { addPoints } = useAzox();
  if (game === "shoot") {
    return <ShootGame onGameOver={(score) => addPoints(score)} />;
  }
  if (game === "snake") {
    return <SnakeGame />;
  }

  return <GameScreen game={game} />;
}
