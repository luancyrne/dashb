import { ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/theme";
import { useState, useEffect } from "react";

const CollapsibleSection = ({ 
    title, 
    icon: Icon, 
    children, 
    defaultOpen = false, 
    forceOpen = false,
    resetFilters, 
    setPageName, 
    pageName, 
    mainMenu 
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { isDark } = useTheme();

    useEffect(() => {
        if (forceOpen !== undefined) {
            setIsOpen(forceOpen);
        }
    }, [forceOpen]);

    const handleClick = () => {
        if (mainMenu) {
            setPageName(pageName);
        }
        if (!forceOpen) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="mb-4">
            <button
                onClick={handleClick}
                className={`flex items-center gap-2 w-full text-left text-sm font-medium mb-2 hover:text-green-500 transition-colors
                    ${isDark ? 'text-gray-300' : 'text-gray-700'}
                    ${forceOpen ? 'text-green-500' : ''}`}
            >
                {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
                {Icon && <Icon className="w-4 h-4" />}
                {title}
            </button>
            {isOpen && (
                <div className="pl-6">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleSection;