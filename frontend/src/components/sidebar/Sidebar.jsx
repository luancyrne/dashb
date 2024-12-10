import { Filter, Search } from 'lucide-react';
import DateRangeFilter from '../filters/DateRangeFilters';
import SearchFilter from '../filters/SearchFilter';
import CollapseOss from './CollapseOss';
import CollapseCommercial from './CollapseCommercial';
import CollapseInventory from './CollapseInventory';

const Sidebar = ({ filters, setFilters, resetFilters, setPageName, pageName }) => {
    const handleStartDateChange = (value) => setFilters({ ...filters, startDate: value });
    const handleEndDateChange = (value) => setFilters({ ...filters, endDate: value });
    const handleClientNameChange = (value) => setFilters({ ...filters, clientName: value });
    const handleAttendantChange = (value) => setFilters({ ...filters, attendant: value });

    const handleMenuChange = (newPageName) => {
        if (pageName !== newPageName) {
            resetFilters();
            setPageName(newPageName);
        }
    };

    return (
        <>
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Filtros</h2>
            </div>

            {pageName === 'OSs' && (
                <>
                    <SearchFilter
                        label="Nome do Cliente"
                        value={filters.clientName || ''}
                        onChange={handleClientNameChange}
                        icon={Search}
                    />
                    <SearchFilter
                        label="Atendente"
                        value={filters.attendant || ''}
                        onChange={handleAttendantChange}
                    />
                </>
            )}

            <DateRangeFilter
                startDate={filters.startDate || ''}
                endDate={filters.endDate || ''}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
            />

            <CollapseOss
                filters={filters}
                setFilters={setFilters}
                setPageName={() => handleMenuChange('OSs')}
                resetFilters={resetFilters}
                isOpen={pageName === 'OSs'}
            />
            <CollapseCommercial
                filters={filters}
                setFilters={setFilters}
                setPageName={() => handleMenuChange('Commercial')}
                resetFilters={resetFilters}
                isOpen={pageName === 'Commercial'}
            />
            <CollapseInventory
                filters={filters}
                setFilters={setFilters}
                setPageName={() => handleMenuChange('Inventory')}
                resetFilters={resetFilters}
                isOpen={pageName === 'Inventory'}
            />
        </>
    );
};

export default Sidebar;