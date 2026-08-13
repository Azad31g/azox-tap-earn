import { useState } from "react";
import {
  Gift,
  Send,
  Twitter,
  Instagram,
  Music2,
  Youtube,
  MessagesSquare,
  ExternalLink,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAzox } from "@/components/azox/app-provider";
import {
  SOCIAL_TASKS,
  type SocialTask,
  type SocialTaskGroup,
} from "@/lib/azox-data";
import { AzoxFooter } from "@/components/azox/footer";
import { cn } from "@/lib/utils";

const PLATFORM_ICONS: Record<string, typeof Send> = {
  Telegram: Send,
  "X (Twitter)": Twitter,
  Instagram: Instagram,
  TikTok: Music2,
  YouTube: Youtube,
  Discord: MessagesSquare,
};

function TaskRow({ task, color }: { task: SocialTask; color: string }) {
  const { completedTasks, completeTask } = useAzox();
  const claimed = completedTasks.has(task.id);
  const [state, setState] = useState<"idle" | "claimable" | "done">("idle");
  const status = claimed ? "done" : state;

  const handleOpen = () => {
    window.open(task.url, "_blank", "noopener,noreferrer");
    setState("claimable");
  };

  const handleClaim = () => {
    completeTask(task.id);
    setState("done");
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.label}</p>
        <p className="text-xs font-semibold text-gold">+{task.points}</p>
      </div>
      {status === "done" ? (
        <span className="flex items-center gap-1 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-semibold text-success">
          <Check className="size-4" aria-hidden="true" /> Done
        </span>
      ) : status === "claimable" ? (
        <Button
          size="sm"
          onClick={handleClaim}
          className="rounded-lg bg-success font-semibold text-success-foreground hover:bg-success/90"
        >
          <Check className="size-4" aria-hidden="true" />
          Claim
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={handleOpen}
          className="rounded-lg bg-transparent font-semibold"
          style={{ borderColor: color, color }}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Open
        </Button>
      )}
    </div>
  );
}

function TaskGroup({ group }: { group: SocialTaskGroup }) {
  const Icon = PLATFORM_ICONS[group.platform] ?? Send;
  const iconColor = group.accent ?? group.color;

  return (
    <section className="flex flex-col gap-2">
      <div
        className="flex items-center gap-2 rounded-xl border-l-4 bg-secondary/30 px-3 py-2"
        style={{ borderLeftColor: iconColor }}
      >
        <span
          className="flex size-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${iconColor}26`, color: iconColor }}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-bold">{group.platform}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {group.tasks.map((t) => (
          <TaskRow key={t.id} task={t} color={iconColor} />
        ))}
      </div>
    </section>
  );
}

export function TaskPage() {
  const { dailyClaimed, claimDaily } = useAzox();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Complete tasks to earn AZOX points.
        </p>
      </div>

      {/* Daily gift */}
      <section
        className={cn(
          "glass flex items-center gap-3 rounded-2xl border border-gold/60 p-4",
          !dailyClaimed && "glow-gold",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15">
          <Gift className="size-6 text-gold" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Daily Gift</p>
          <p className="text-xs text-muted-foreground">
            +200 points for logging in today
          </p>
        </div>
        <Button
          onClick={claimDaily}
          disabled={dailyClaimed}
          className={cn(
            "rounded-xl font-semibold",
            dailyClaimed
              ? "bg-secondary text-muted-foreground"
              : "bg-success text-success-foreground hover:bg-success/90",
          )}
        >
          {dailyClaimed ? "Claimed" : "Claim +200"}
        </Button>
      </section>

      {/* Social tasks */}
      {SOCIAL_TASKS.map((group) => (
        <TaskGroup key={group.platform} group={group} />
      ))}

      <AzoxFooter />
    </div>
  );
}
