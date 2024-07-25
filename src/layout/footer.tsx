import { SimpleIconsDiscord } from "@/assets/icons/discord";
import { SimpleIconsGithub } from "@/assets/icons/github";
import { SimpleIconsKofi } from "@/assets/icons/kofi";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { MINUTE } from "@/constants/time";
import { useSyncedInterval } from "@/hooks/use-synced-interval";
import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/format-time";
import { PropsWithChildren } from "react";

interface SubFooterProps extends PropsWithChildren {
  className: string | string[];
}

function SubFooter({ className, children }: SubFooterProps) {
  return (
    <div
      className={cn(
        [
          "flex",
          "flex-row",
          "flex-wrap",
          "justify-center",
          "align-middle",
          "text-center",
          "gap-y-1",
          "gap-x-6",
          "p-2",
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface LabeledTimeProps extends PropsWithChildren {
  label: string;
  pad: boolean;
}

function LabeledTime({ children, label = "", pad = false }: LabeledTimeProps) {
  const time = String(children);

  if (!/^\d{1,2}:\d{2}$/.test(time)) return null;

  return (
    <div className="tabular-nums">
      {label && (
        <>
          <b>{label}</b>{" "}
        </>
      )}
      {pad && time.length < 5 && "0"}
      {children}
    </div>
  );
}

const EorzeanTime = () => {
  const eorzeanTimeFactor = 144 / 7;

  const eorzeanTime = formatTime(
    useSyncedInterval(MINUTE / eorzeanTimeFactor) * eorzeanTimeFactor,
    true,
  );

  return (
    <LabeledTime label="ET" pad>
      {eorzeanTime}
    </LabeledTime>
  );
};

const LocalTime = () => {
  const localTime = formatTime(useSyncedInterval(MINUTE));

  return (
    <LabeledTime label="LT" pad>
      {localTime}
    </LabeledTime>
  );
};

export default function Footer() {
  return (
    <footer className="flex flex-col">
      <SubFooter className="bg-neutral-600">
        <EorzeanTime />
        <LocalTime />
      </SubFooter>
      <SubFooter className="bg-neutral-700">
        {[
          { label: "Made by CostasAK", href: "https://github.com/CostasAK" },
          {
            label: (
              <>
                <SimpleIconsKofi className="text-xl leading-6" />
                Support me
              </>
            ),
            href: "https://ko-fi.com/costasak",
          },
          {
            label: (
              <>
                <SimpleIconsDiscord className="text-lg leading-6" />
                Discord
              </>
            ),
            href: "https://discord.com/invite/Rs5hdN86wJ",
          },
          {
            label: (
              <>
                <SimpleIconsGithub />
                Source
              </>
            ),
            href: "https://github.com/CostasAK/ffxiv-buddy",
          },
        ].map((x, i) => (
          <Button key={i} variant="ghost" asChild>
            <Link variant="ghost" href={x.href}>
              {x.label}
            </Link>
          </Button>
        ))}
      </SubFooter>
      <SubFooter className="bg-neutral-725 text-xs text-neutral-400">
        <div>© SQUARE ENIX CO., LTD. All Rights Reserved.</div>
        <div>
          FINAL FANTASY is a registered trademark of Square Enix Holdings Co.,
          Ltd.
        </div>
        <div>All material used under license.</div>
      </SubFooter>
    </footer>
  );
}