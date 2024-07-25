import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DAY, HOUR, MINUTE, WEEK, YEAR } from "@/constants/time";
import { useSyncedInterval } from "@/hooks/use-synced-interval";
import Page from "@/layout/page";
import { cn } from "@/utils/cn";
import { humanizeDuration } from "@/utils/humanize-duration";
import { nextTime } from "@/utils/next-time";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

const icons = {
  collectables:
    "https://xivapi.com/img-misc/chat_messengericon_treasurehunt.png",
  raid: "https://xivapi.com/img-misc/chat_messengericon_raids.png",
  roulette: "https://xivapi.com/img-misc/chat_messengericon_dutyroulette.png",
  hunts: "https://xivapi.com/img-misc/chat_messengericon_thehunt.png",
  goldsaucer: "https://xivapi.com/img-misc/chat_messengericon_goldsaucer.png",
  others: "https://xivapi.com/img-misc/chat_messengericon_weeklybingo.png",
};

const resets = {
  weekly: {
    period: WEEK,
    start: new Date("28 December 2021 8:00 GMT").getTime(),
  },
  daily: {
    period: DAY,
    start: new Date("28 December 2021 15:00 GMT").getTime(),
  },
  "grand company": {
    period: DAY,
    start: new Date("27 December 2021 20:00 GMT").getTime(),
  },
  "fashion report": {
    period: WEEK,
    start: new Date("31 December 2021 8:00 GMT").getTime(),
  },
  "jumbo cactpot": {
    period: WEEK,
    start: new Date("1 January 2022 19:00 GMT").getTime(),
  },
};

interface TodoProps {
  name: string;
  reset?: keyof typeof resets;
  period?: number;
}
interface TodoCategoryProps {
  title: string;
  icon: keyof typeof icons;
  todos: TodoProps[];
  className?: string;
}

const todos = [
  {
    title: "Collectables",
    icon: icons.collectables,
    todos: [
      // {
      //   name: "Allagan Tomestones of Astronomy",
      //   reset: "weekly",
      // },
      {
        name: "Treasure Map",
        period: 18 * HOUR,
      },
    ],
  },
  {
    title: "Gold Saucer",
    icon: icons.goldsaucer,
    todos: [
      {
        name: "Fashion Report",
        reset: "fashion report",
      },
      {
        name: "Jumbo Cactpot",
        reset: "jumbo cactpot",
      },
      {
        name: "Mini Cactpot",
        reset: "daily",
      },
      {
        name: "Triple Triad / Verminion Tournament",
        reset: "weekly",
      },
    ],
  },
  {
    title: "Grand Company and Hunts",
    icon: icons.hunts,
    todos: [
      {
        name: "Grand Company Turn-ins",
        reset: "grand company",
      },
      {
        name: "Squadron Priority Mission",
        reset: "weekly",
      },
      {
        name: "Squadron Mission",
        period: 18 * HOUR,
      },
      {
        name: "Elite Mark Bills",
        reset: "weekly",
      },
      {
        name: "Regular Mark Bills",
        reset: "daily",
      },
    ],
  },
  {
    title: "Raids",
    icon: icons.raid,
    todos: [
      {
        name: "AAC Light-heavyweight M1 (Normal)",
        reset: "weekly",
      },
      {
        name: "AAC Light-heavyweight M2 (Normal)",
        reset: "weekly",
      },
      {
        name: "AAC Light-heavyweight M3 (Normal)",
        reset: "weekly",
      },
      {
        name: "AAC Light-heavyweight M4 (Normal)",
        reset: "weekly",
      },
      {
        name: "Unsung Blade of Abyssos",
        reset: "weekly",
      },
      // {
      //   name: "Abyssos: The Fifth Circle (Savage)",
      //   reset: "weekly",
      // },
      // {
      //   name: "Abyssos: The Sixth Circle (Savage)",
      //   reset: "weekly",
      // },
      // {
      //   name: "Abyssos: The Seventh Circle (Savage)",
      //   reset: "weekly",
      // },
      // {
      //   name: "Abyssos: The Eighth Circle (Savage)",
      //   reset: "weekly",
      // },
      // {
      //   name: "Containment Bay S1T7 (Unreal)",
      //   reset: "weekly",
      // },
      // {
      //   name: "Alliance Raid: Aglaia",
      //   reset: "weekly",
      // },
    ],
  },
  {
    title: "Roulettes",
    icon: icons.roulette,
    todos: [
      {
        name: "Expert",
        reset: "daily",
      },
      {
        name: "High-level Dungeons",
        reset: "daily",
      },
      {
        name: "Leveling",
        reset: "daily",
      },
      {
        name: "Trials",
        reset: "daily",
      },
      {
        name: "Main Scenario",
        reset: "daily",
      },
      {
        name: "Guildhests",
        reset: "daily",
      },
      {
        name: "Alliance Raids",
        reset: "daily",
      },
      {
        name: "Normal Raids",
        reset: "daily",
      },
      {
        name: "Mentor",
        reset: "daily",
      },
      {
        name: "Frontline",
        reset: "daily",
      },
    ],
  },
  {
    title: "Others",
    icon: icons.others,
    todos: [
      {
        name: "Beast Tribe Quests",
        reset: "daily",
      },
      {
        name: "Challenge Log",
        reset: "weekly",
      },
      {
        name: "Custom Deliveries",
        reset: "weekly",
      },
      {
        name: "Doman Enclave Reconstruction Effort",
        reset: "weekly",
      },
      {
        name: "Masked Carnivale",
        reset: "weekly",
      },
      {
        name: "Wondrous Tails",
        reset: "weekly",
      },
    ],
  },
] as TodoCategoryProps[];

function Todo({ name, reset, period = 0 }: TodoProps) {
  const [completion, saveCompletion] = useLocalStorage(`ToDo - ${name}`, 0);

  const [nextReset, setNextReset] = useState(0);

  const now = useSyncedInterval(MINUTE);

  useEffect(() => {
    if (now >= nextReset && completion < nextReset) {
      saveCompletion(0);
    }

    if (reset) {
      const nextResetAfterCompletion = nextTime(
        resets[reset].start,
        resets[reset].period,
        completion,
      );
      const nextResetAfterNow = nextTime(
        resets[reset].start,
        resets[reset].period,
        now,
      );
      if (nextResetAfterCompletion !== nextResetAfterNow) saveCompletion(0);
      setNextReset(nextResetAfterNow);
    } else if (completion) {
      setNextReset(completion + period);
      if (nextReset && nextReset <= now) saveCompletion(0);
    } else {
      setNextReset(0);
    }
  }, [completion, nextReset, now, period, reset, saveCompletion]);

  const handleChange = () => {
    if (completion) {
      saveCompletion(0);
    } else {
      saveCompletion(Date.now());
    }
  };

  return (
    <Label
      key={name}
      htmlFor={name}
      className={cn(
        "flex cursor-pointer flex-row items-center gap-2 border-t border-t-neutral-725 p-4 transition-all hover:bg-neutral-750 active:transition-none",
        completion > 0 && "italic opacity-50",
      )}
      style={{ order: nextReset / MINUTE + (completion > 0 ? 10 * YEAR : 0) }}
    >
      <Checkbox
        id={name}
        onCheckedChange={handleChange}
        checked={completion > 0}
      />
      <span>{name}</span>
      <span className="mt-auto grow self-end text-right text-sm font-normal text-neutral-400">
        {nextReset - now > 0 ? humanizeDuration(nextReset - now, true) : "now"}
      </span>
    </Label>
  );
}

function TodoCategory({ title, icon, todos, className }: TodoCategoryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <img src={icon} alt="" className="h-[1.5em] w-[1.5em]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        {todos.map((todo) => (
          <Todo key={todo.name} {...todo} />
        ))}
      </CardContent>
    </Card>
  );
}

export function Component() {
  useEffect(() => {
    const todoNames = todos.reduce(
      (total, currentCategory) => [
        ...total,
        ...currentCategory.todos.reduce(
          (subtotal, currentTodo) => [...subtotal, currentTodo.name],
          [] as string[],
        ),
      ],
      [] as string[],
    );

    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith("ToDo - ")) continue;
      const todoName = key.replace(/^ToDo - /, "");
      if (!todoNames.includes(todoName)) localStorage.removeItem(key);
    }
  }, []);

  return (
    <Page className="columns-md gap-8">
      {todos.map((category, i) => (
        <TodoCategory key={i} {...category} className="mb-6" />
      ))}
    </Page>
  );
}

Component.displayName = "ChecklistRoute";
