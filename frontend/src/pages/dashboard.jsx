import { useFilters } from "../hooks/useFilters";
import { usePage } from '../hooks/usePages';
import { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/sidebar/Sidebar";
import DataTable from "../components/datatable";

const ServiceMonitoringDashboard = () => {
    const [pageName, setPageName] = usePage();
    const {
        filters,
        setFilters,
        resetFilters,
        data,
        loading,
        onPageChange,
        onPageSizeChange,
        setPageNameFilter
    } = useFilters();

    useEffect(() => {
        setPageNameFilter(pageName);
    }, [pageName, setPageNameFilter]);

    return (
        <DashboardLayout
            sidebar={
                <Sidebar
                    filters={filters}
                    setFilters={setFilters}
                    resetFilters={resetFilters}
                    setPageName={setPageName}
                    pageName={pageName}
                />
            }
        >
            <DataTable
                data={data}
                loading={loading}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </DashboardLayout>
    );
};

export default ServiceMonitoringDashboard;