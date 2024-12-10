import { INVENTORY_PRODUCTS } from "../../services/filters";
import CollapsibleSection from "../collapsesection";

const CollapseInventory = ({ filters, setFilters, resetFilters, setPageName, isOpen }) => {
    const areDatesValid = filters?.startDate && filters?.endDate;

    const handleProductChange = (id) => {
        if (!areDatesValid) {
            alert('Por favor, selecione o período antes de selecionar o produto');
            return;
        }

        const currentProducts = filters?.productIds || [];
        const newProducts = currentProducts.includes(id)
            ? currentProducts.filter(productId => productId !== id)
            : [...currentProducts, id];

        setFilters({ ...filters, productIds: newProducts });
    };

    return (
        <CollapsibleSection
            resetFilters={resetFilters}
            setPageName={setPageName}
            mainMenu={true}
            pageName='Inventory'
            title="Estoque"
            defaultOpen={isOpen}
            forceOpen={isOpen}
        >
            <CollapsibleSection title="Produtos">
                <div className="space-y-1">
                    {Object.entries(INVENTORY_PRODUCTS).map(([id, label]) => (
                        <label key={id} className={`flex items-center ${!areDatesValid ? 'opacity-50' : ''}`}>
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={filters?.productIds?.includes(id) || false}
                                onChange={() => handleProductChange(id)}
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

export default CollapseInventory;