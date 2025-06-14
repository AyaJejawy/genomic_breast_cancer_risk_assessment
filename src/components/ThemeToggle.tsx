import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-accent transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-foreground transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Moon className="w-5 h-5 text-foreground transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;