import { Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/theme';

const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    const { isDark } = useTheme();

    return (
        <div className={`mb-6 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Período
                </label>
                <div className="space-y-2">
                    <input
                        type="date"
                        className={`w-full p-2 border rounded-md ${
                            isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
                        }`}
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                    />
                    <input
                        type="date"
                        className={`w-full p-2 border rounded-md ${
                            isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'
                        }`}
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateRangeFilter;