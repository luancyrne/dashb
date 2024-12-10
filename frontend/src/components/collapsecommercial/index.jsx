import { CONTRACTS } from "../../services/filters";
import CollapsibleSection from "../collapsesection";

const Collapsecommercial = ({ filters, setFilters, resetFilters, setPageName }) => {
    const areDatesValid = filters?.startDate && filters?.endDate;

    const handleContractChange = (id) => {
        // Só permite alteração se ambas as datas estiverem preenchidas
        if (!areDatesValid) {
            // Você pode adicionar um alert ou toast aqui
            alert('Por favor, selecione o período antes de selecionar o tipo de contrato');
            return;
        }

        if (filters?.contractType === id) {
            const { contractType, ...restFilters } = filters;
            setFilters(restFilters);
        } else {
            setFilters({ ...filters, contractType: id });
        }
    }

    return (
        <CollapsibleSection
            resetFilters={resetFilters}
            setPageName={setPageName}
            mainMenu={true}
            pageName='Commercial'
            title="Comercial"
            defaultOpen={false}
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
        </CollapsibleSection>
    );
};

export default Collapsecommercial;