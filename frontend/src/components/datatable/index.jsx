import { useTheme } from "../../contexts/theme";
import ExportButton from "../exportbutton";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader } from 'lucide-react';

const DataTable = ({ 
  data: { data = [], pagination = { page: 1, pageSize: 30, total: 0, totalPages: 0 }, totalSales, totalCancellations }, 
  onPageChange,
  onPageSizeChange,
  loading = false
}) => {
    const { isDark } = useTheme();

    if (loading) {
        return (
            <div className={`min-h-[400px] flex flex-col items-center justify-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
                <Loader className="w-8 h-8 animate-spin mb-2" />
                <span>Carregando dados...</span>
            </div>
        );
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className={`p-4 rounded-md text-center ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
            }`}>
                Nenhum chamado encontrado.
            </div>
        );
    }

    // Pegar as colunas do primeiro item
    const columns = Object.keys(data[0]);

    const PaginationButton = ({ onClick, disabled, children }) => (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`px-3 py-1 rounded ${
                isDark
                    ? disabled || loading
                        ? 'bg-gray-800 text-gray-600'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : disabled || loading
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } disabled:cursor-not-allowed transition-colors`}
        >
            {children}
        </button>
    );

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Registros por página:
                        </span>
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            disabled={loading}
                            className={`px-2 py-1 rounded ${
                                isDark
                                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                                    : 'bg-white text-gray-700 border-gray-300'
                            } border disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    {totalSales !== undefined && (
                        <div className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            Total de Vendas no Período: {totalSales}
                        </div>
                    )}
                    {totalCancellations !== undefined && (
                        <div className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            Total de Cancelamentos no Período: {totalCancellations}
                        </div>
                    )}
                </div>
                <ExportButton data={data} disabled={!data.length || loading} />
            </div>

            <div className="overflow-x-auto relative">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                            {columns.map((header) => (
                                <th key={header} className={`px-4 py-2 text-left font-medium ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={loading ? 'opacity-50' : ''}>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className={
                                isDark
                                    ? rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                                    : rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }>
                                {columns.map((column, colIndex) => (
                                    <td key={`${rowIndex}-${colIndex}`} className={`px-4 py-2 border-t ${
                                        isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200'
                                    }`}>
                                        {row[column]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} até{' '}
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
                    {pagination.total} registros
                </div>
                <div className="flex gap-2">
                    <PaginationButton
                        onClick={() => onPageChange(1)}
                        disabled={pagination.page === 1}
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </PaginationButton>
                    
                    <PaginationButton
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </PaginationButton>

                    <div className="flex items-center px-4">
                        Página {pagination.page} de {pagination.totalPages}
                    </div>

                    <PaginationButton
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </PaginationButton>

                    <PaginationButton
                        onClick={() => onPageChange(pagination.totalPages)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </PaginationButton>
                </div>
            </div>
        </div>
    );
};

export default DataTable;