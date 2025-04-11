
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shadow-lg bg-background hover:shadow-xl transition-all duration-300 border-opacity-50"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[8rem] backdrop-blur-sm">
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Sun className="h-[1rem] w-[1rem]" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Moon className="h-[1rem] w-[1rem]" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="h-[1rem] w-[1rem] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-current" />
            </span>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
