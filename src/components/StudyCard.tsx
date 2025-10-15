import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradientClass: string;
  onClick?: () => void;
}

const StudyCard = ({ title, description, icon: Icon, gradientClass, onClick }: StudyCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-6 rounded-2xl shadow-card text-left",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover",
        "active:translate-y-0 active:scale-[0.98]",
        "animate-breathe",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        "min-h-[140px]", // Prevent card from shrinking
        gradientClass
      )}
    >
      <div className="flex flex-col items-start gap-4">
        {/* Icon */}
        <div className="p-3 bg-white/80 dark:bg-white/80 rounded-xl backdrop-blur-sm">
          <Icon className="w-8 h-8 text-gray-700" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default StudyCard;
