import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
    return (
        <div className="flex flex-row justify-between items-center p-4 sticky top-0 border-b border-gray-400/30 transition-colors duration-300 bg-bg-1 z-1">
            {/* logo */}
            <div className="text-2xl font-bold text-primary">LearnLink</div>
            {/* nav links */}
            <div>
                <ThemeToggle/>
            </div>
        </div>
    );
};

export default Header;