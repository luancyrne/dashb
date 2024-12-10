import { Search } from 'lucide-react';
import { useTheme } from '../../contexts/theme';

const SearchFilter = ({ label, value, onChange, icon: Icon }) => {
    const { isDark } = useTheme();

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full p-2 border rounded-md ${Icon ? 'pl-8' : ''} ${
                        isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
                    }`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {Icon && (
                    <Icon className={`w-4 h-4 absolute left-2 top-3 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                )}
            </div>
        </div>
    );
};

export default SearchFilter;