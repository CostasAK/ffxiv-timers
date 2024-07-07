export default function Header() {
  return (
    <header className="flex items-center justify-center gap-2 bg-neutral-900 p-2 sm:gap-4 sm:p-4">
      <img src="/android-chrome-72x72.png" alt="" className="h-8 sm:h-14"></img>
      <h1 className="text-4xl font-bold leading-none sm:text-6xl">
        FFXIV Buddy
      </h1>
    </header>
  );
}
