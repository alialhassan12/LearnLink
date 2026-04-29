import { useTheme } from "../providers/theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-primary text-text"
        >
            Switch to {theme === "light" ? "Dark" : "Light"}
        </button>
    );
}