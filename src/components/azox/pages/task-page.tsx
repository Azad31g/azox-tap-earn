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
import { SOCIAL_TASKS, type SocialTask } from "@/lib/azox-data";
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

function TaskRow({ task }: { task: SocialTask }) {
  const { completedTasks, completeTask, addPoints } = useAzox();
  const [opened, setOpened] = useState(false);
  const claimed = completedTasks.has(task.id);

  const handleClaim = () => {
    if (claimed || !opened) return;
    completeTask(task.id);
    addPoints(task.points);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.label}</p>
        <p className="text-xs font-semibold text-gold">+{task.points}</p>
      </div>
      {claimed ? (
        <span className="flex items-center gap-1 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-semibold text-success">
          <Check className="size-4" aria-hidden="true" /> Done
        </span>
      ) : opened ? (
        <Button
          size="sm"
          onClick={handleClaim}
          className="rounded-lg bg-success font-semibold text-success-foreground hover:bg-success/90"
        >
          Claim
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpened(true)}
          className="rounded-lg border-accent/40 bg-transparent font-semibold text-accent hover:bg-accent/10"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Open
        </Button>
      )}
    </div>
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
          "glass flex items-center gap-3 rounded-2xl p-4",
          !dailyClaimed && "glow-gold",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15">
          <Gift className="size-6 text-gold" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Daily Gift</p>
          <p className="text-xs text-muted-foreground">
            +50 points for logging in today
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
          {dailyClaimed ? "Claimed" : "Claim +50"}
        </Button>
      </section>

      {/* Social tasks */}
      {SOCIAL_TASKS.map((group) => {
        const Icon = PLATFORM_ICONS[group.platform] ?? Send;
        return (
          <section key={group.platform} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <h2 className="text-sm font-bold">{group.platform}</h2>
            </div>
            <div className="flex flex-col gap-2">
              {group.tasks.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </div>
          </section>
        );
      })}

      <AzoxFooter />
    </div>
  );
}
