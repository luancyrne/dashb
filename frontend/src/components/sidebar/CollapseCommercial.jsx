import { CONTRACTS, CONTRACT_STATUS } from "../../services/filters";
import CollapsibleSection from "../collapsesection";

const CollapseCommercial = ({ filters, setFilters, resetFilters, setPageName, isOpen }) => {
    const areDatesValid = filters?.startDate && filters?.endDate;

    const handleContractChange = (id) => {
        if (!areDatesValid) {
            alert('Por favor, selecione o período antes de selecionar o tipo de contrato');
            return;
        }

        if (filters?.contractType === id) {
            const { contractType, contractStatus, ...restFilters } = filters;
            setFilters(restFilters);
        } else {
            setFilters({ ...filters, contractType: id, contractStatus: [] });
        }
    };

    const handleContractStatusChange = (status) => {
        if (!areDatesValid) {
            alert('Por favor, selecione o período antes de selecionar o status do contrato');
            return;
        }

        const currentStatuses = filters?.contractStatus || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter(s => s !== status)
            : [...currentStatuses, status];

        setFilters({ ...filters, contractStatus: newStatuses });
    };

    const handleGroupingChange = () => {
        if (!areDatesValid) {
            alert('Por favor, selecione o período antes de selecionar o agrupamento');
            return;
        }

        setFilters(prev => ({
            ...prev,
            groupByCity: !prev.groupByCity
        }));
    };

    const showContractStatus = filters?.contractType === '2'; // Only show for sales

    return (
        <CollapsibleSection
            resetFilters={resetFilters}
            setPageName={setPageName}
            mainMenu={true}
            pageName='Commercial'
            title="Comercial"
            defaultOpen={isOpen}
            forceOpen={isOpen}
        >
            <CollapsibleSection title="Contratos">
                <div className="space-y-1">
                    {Object.entries(CONTRACTS).map(([id, label]) => (
                        <label key={id} className={`flex items-center ${!areDatesValid ? 'opacity-50' : ''}`}>
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={filters?.contractType === id}
                                onChange={() => handleContractChange(id)}
                                disabled={!areDatesValid}
                            />
                            <span className="text-sm">{label}</span>
                        </label>
                    ))}
                </div>
                {!areDatesValid && (
                    <p className="text-sm text-yellow-500 mt-2">
                        Selecione o período para habilitar os filtros
                    </p>
                )}
            </CollapsibleSection>

            {showContractStatus && (
                <CollapsibleSection title="Status do Contrato">
                    <div className="space-y-1">
                        {Object.entries(CONTRACT_STATUS).map(([status, label]) => (
                            <label key={status} className={`flex items-center ${!areDatesValid ? 'opacity-50' : ''}`}>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={filters?.contractStatus?.includes(status) || false}
                                    onChange={() => handleContractStatusChange(status)}
                                    disabled={!areDatesValid}
                                />
                                <span className="text-sm">{label}</span>
                            </label>
                        ))}
                    </div>
                </CollapsibleSection>
            )}

            <CollapsibleSection title="Agrupamento">
                <div className="space-y-1">
                    <label className={`flex items-center ${!areDatesValid ? 'opacity-50' : ''}`}>
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={filters?.groupByCity || false}
                            onChange={handleGroupingChange}
                            disabled={!areDatesValid}
                        />
                        <span className="text-sm">Agrupar por Cidade</span>
                    </label>
                </div>
            </CollapsibleSection>
        </CollapsibleSection>
    );
};

export default CollapseCommercial;