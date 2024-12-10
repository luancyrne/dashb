import { useTheme } from "../../contexts/theme";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx/xlsx.mjs';

const ExportButton = ({ data, disabled }) => {
    const { isDark } = useTheme();

    const handleExport = () => {
        if (!data || data.length === 0) return;

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Chamados");

        const colWidths = Object.keys(data[0]).map(key => ({
            wch: Math.max(
                key.length,
                ...data.map(row => String(row[key]).length)
            )
        }));
        ws['!cols'] = colWidths;

        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        const fileName = `chamados_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    return (
        <button
            onClick={handleExport}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isDark
                ? disabled
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                : disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
        >
            <Download className="w-4 h-4" />
            Exportar Excel
        </button>
    );
};

export default ExportButton;