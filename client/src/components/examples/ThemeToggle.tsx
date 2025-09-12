import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="flex items-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Theme Toggle:</h2>
      <ThemeToggle />
      <p className="text-muted-foreground text-sm">
        Click the button to switch between light and dark themes
      </p>
    </div>
  );
}