import { useTheme } from "../contexts/theme";
import { Moon, Sun } from 'lucide-react';
import '../styles/scrollbar.css';

const DashboardLayout = ({ children, sidebar }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className={`flex min-h-screen ${isDark ? 'bg-gray-900 text-gray-100 dark' : 'bg-white text-gray-900 light'}`}>
            <div className={`w-64 p-4 border-r h-screen overflow-y-auto custom-scrollbar ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-md transition-colors ${
                            isDark ? 'hover:bg-gray-700 text-yellow-500' : 'hover:bg-gray-200 text-gray-600'
                        }`}
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
                {sidebar}
            </div>
            <main className="flex-1 p-6">
                <div className={`rounded-lg shadow-sm border ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;