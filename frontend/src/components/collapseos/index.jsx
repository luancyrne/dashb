import { SECTOR_MAPPING, STATUS_MAP, SUBJECTS } from "../../services/filters";
import CollapsibleSection from "../collapsesection";

const CollapseOss = ({ filters, setFilters, resetFilters, setPageName }) => {
    const handleSectorChange = (id) => {
        const currentSectors = filters?.sectors || [];
        const newSectors = currentSectors.includes(Number(id))
            ? currentSectors.filter(sectorId => sectorId !== Number(id))
            : [...currentSectors, Number(id)];

        setFilters({ ...filters, sectors: newSectors });
    };

    const handleStatusChange = (key) => {
        const currentStatuses = filters?.status || [];
        const newStatuses = currentStatuses.includes(key)
            ? currentStatuses.filter(status => status !== key)
            : [...currentStatuses, key];

        setFilters({ ...filters, status: newStatuses });
    };

    const handleCallTypeChange = (value) => {
        setFilters({ ...filters, callType: value });
    };

    const handleSubjectChange = (id) => {
        const currentSubjects = filters?.subjects || [];
        const newSubjects = currentSubjects.includes(id)
            ? currentSubjects.filter(subjectId => subjectId !== id)
            : [...currentSubjects, id];

        setFilters({ ...filters, subjects: newSubjects });
    };

    const handleGroupingChange = (type) => {
        const currentGrouping = filters?.grouping || [];
        const newGrouping = currentGrouping.includes(type)
            ? currentGrouping.filter(group => group !== type)
            : [...currentGrouping, type];

        setFilters({ ...filters, grouping: newGrouping });
    };

    return (
        <CollapsibleSection resetFilters={resetFilters} setPageName={setPageName} mainMenu={true} pageName='OSs' title="Ordem de Serviço" defaultOpen={false}>
            <CollapsibleSection title="Setores">
                <div className="space-y-1">
                    {Object.entries(SECTOR_MAPPING).map(([id, label]) => (
                        <label key={id} className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={filters?.sectors?.includes(Number(id)) || false}
                                onChange={() => handleSectorChange(id)}
                            />
                            <span className="text-sm">{label}</span>
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Status">
                <div className="space-y-1">
                    {Object.entries(STATUS_MAP).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={filters?.status?.includes(key) || false}
                                onChange={() => handleStatusChange(key)}
                            />
                            <span className="text-sm">{label}</span>
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Tipo de Chamado">
                <div className="space-y-1">
                    {[
                        { value: 'C', label: 'Cliente' },
                        { value: 'E', label: 'Estrutura' },
                        { value: 'Ambos', label: 'Ambos' }
                    ].map(option => (
                        <label key={option.value} className="flex items-center">
                            <input
                                type="radio"
                                name="callType"
                                className="mr-2"
                                checked={filters?.callType === option.value || false}
                                onChange={() => handleCallTypeChange(option.value)}
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Assuntos">
                <div className="space-y-1">
                    {Object.entries(SUBJECTS).map(([id, label]) => (
                        <label key={id} className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={filters?.subjects?.includes(id) || false}
                                onChange={() => handleSubjectChange(id)}
                            />
                            <span className="text-sm">{label}</span>
                        </label>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Agrupamento">
                <div className="space-y-1">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={filters?.grouping?.includes('client') || false}
                            onChange={() => handleGroupingChange('client')}
                        />
                        <span className="text-sm">Agrupar por Cliente</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={filters?.grouping?.includes('attendant') || false}
                            onChange={() => handleGroupingChange('attendant')}
                        />
                        <span className="text-sm">Agrupar por Atendente</span>
                    </label>
                </div>
            </CollapsibleSection>
        </CollapsibleSection>
    );
};

export default CollapseOss;