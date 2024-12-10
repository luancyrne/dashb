import { useEffect, useState, useCallback } from "react"
import { 
    fetchServiceCalls, 
    fetchSellerContracts, 
    fetchCanceledContracts,
    fetchInventoryMovements 
} from "../services/api";

export const useFilters = () => {
    const [filters, setFilters] = useState({});
    const [pageNameFilter, setPageNameFilter] = useState('');
    const [data, setData] = useState({
        data: [],
        pagination: {
            page: 1,
            pageSize: 30,
            total: 0,
            totalPages: 0
        }
    });
    const [loading, setLoading] = useState(false);

    const areDatesValid = useCallback(() => {
        return filters.startDate && filters.endDate;
    }, [filters.startDate, filters.endDate]);

    const fetchData = useCallback(async (currentPage, currentPageSize) => {
        try {
            if ((pageNameFilter === 'Commercial' || pageNameFilter === 'Inventory') && !areDatesValid()) {
                return;
            }

            setLoading(true);
            let response;

            switch (pageNameFilter) {
                case 'OSs':
                    response = await fetchServiceCalls({
                        ...filters,
                        page: currentPage,
                        pageSize: currentPageSize
                    });
                    break;
                case 'Commercial':
                    if (filters?.contractType === '2') {
                        response = await fetchSellerContracts({
                            ...filters,
                            page: currentPage,
                            pageSize: currentPageSize
                        });
                    } else if (filters?.contractType === '1') {
                        response = await fetchCanceledContracts({
                            ...filters,
                            page: currentPage,
                            pageSize: currentPageSize
                        });
                    }
                    break;
                case 'Inventory':
                    if (filters?.productIds?.length > 0) {
                        response = await fetchInventoryMovements({
                            ...filters,
                            page: currentPage,
                            pageSize: currentPageSize
                        });
                    }
                    break;
                default:
                    break;
            }

            if (response) {
                setData(response);
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, pageNameFilter, areDatesValid]);

    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            if (pageNameFilter === 'Commercial' || pageNameFilter === 'Inventory') {
                if (areDatesValid()) {
                    fetchData(data.pagination.page, data.pagination.pageSize);
                }
            } else {
                fetchData(data.pagination.page, data.pagination.pageSize);
            }
        }
    }, [filters, fetchData, pageNameFilter, areDatesValid, data.pagination.page, data.pagination.pageSize]);

    const resetFilters = () => {
        setFilters({});
        setData({
            data: [],
            pagination: {
                page: 1,
                pageSize: 30,
                total: 0,
                totalPages: 0
            }
        });
        setPageNameFilter('');
    };

    const onPageChange = useCallback((newPage) => {
        if ((pageNameFilter === 'Commercial' || pageNameFilter === 'Inventory') && !areDatesValid()) {
            return;
        }
        fetchData(newPage, data.pagination.pageSize);
    }, [fetchData, data.pagination.pageSize, pageNameFilter, areDatesValid]);

    const onPageSizeChange = useCallback((newPageSize) => {
        if ((pageNameFilter === 'Commercial' || pageNameFilter === 'Inventory') && !areDatesValid()) {
            return;
        }
        fetchData(1, newPageSize);
    }, [fetchData, pageNameFilter, areDatesValid]);

    return {
        filters,
        setFilters,
        resetFilters,
        data,
        loading,
        onPageChange,
        onPageSizeChange,
        setPageNameFilter,
        areDatesValid: areDatesValid()
    };
};