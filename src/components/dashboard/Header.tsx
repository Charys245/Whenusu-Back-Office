import { useState } from "react";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    // {/* BANNIÈRE DE CONTRÔLES SUPÉRIEURE (HEADER FLOTTANT) */}
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F9F7F5]/80 dark:bg-[#1A1512]/80 border-b border-[#E5DDD3] dark:border-[#3A3027] px-6 py-4 flex justify-between items-center transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#C6922E] to-[#FFB82B] flex items-center justify-center text-white shadow-md font-bold text-lg">
          W
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight bg-linear-to-r from-[#C6922E] to-[#8E651D] dark:from-[#D4A43A] dark:to-[#EED8A1] bg-clip-text text-transparent">
            WHENUSU
          </span>
          <span className="text-[10px] block font-semibold tracking-widest text-[#C6922E] dark:text-[#D4A43A] uppercase">
            Patrimoine Culturel Africain
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Indicateur de rôle admin */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C6922E]/10 text-[#C6922E] border border-[#C6922E]/20">
          <span className="w-2 h-2 rounded-full bg-[#C6922E] animate-pulse"></span>
          Super Admin
        </span>

        {/* Toggle Mode Sombre */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-white dark:bg-[#242019] border border-[#E5DDD3] dark:border-[#3A3027] hover:border-[#C6922E] dark:hover:border-[#D4A43A] text-[#3D2E1F] dark:text-[#F9F7F5] transition-all shadow-sm"
          aria-label="Changer le thème"
        >
          {darkMode ? (
            <Sun size={18} className="text-[#D4A43A]" />
          ) : (
            <Moon size={18} className="text-[#3D2E1F]" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
