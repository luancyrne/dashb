import axios from 'axios';
import { groupDataByCity } from '../utils/groupingUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
});

export const fetchServiceCalls = async (filters) => {
  try {
    const apiFilters = {
      startDate: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: filters.endDate || new Date().toISOString().split('T')[0],
      sectors: filters.sectors || [],
      status: filters.status || [],
      callType: filters.callType || 'Ambos',
      groupByClient: filters.groupByClient || true,
      groupByAttendant: filters.groupByAttendant || true,
      clientName: filters.clientName || '',
      subjects: filters.subjects || '',
      attendant: filters.attendant || '',
      page: parseInt(filters.page) || 1,
      pageSize: parseInt(filters.pageSize) || 30
    };

    const response = await api.post('/service-calls', apiFilters);

    if (!response.data.pagination) {
      const allData = response.data;
      const startIndex = (apiFilters.page - 1) * apiFilters.pageSize;
      const endIndex = startIndex + apiFilters.pageSize;

      return {
        data: allData.slice(startIndex, endIndex),
        pagination: {
          page: apiFilters.page,
          pageSize: apiFilters.pageSize,
          total: allData.length,
          totalPages: Math.ceil(allData.length / apiFilters.pageSize)
        }
      };
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching service calls:', error);
    throw error;
  }
};

export const fetchSellerContracts = async (filters) => {
  try {
    const apiFilters = {
      startDate: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: filters.endDate || new Date().toISOString().split('T')[0],
      contractType: filters.contractType || '',
      contractStatus: filters.contractStatus || [],
      groupByCity: filters.groupByCity || false,
      page: filters.groupByCity ? 1 : (parseInt(filters.page) || 1),
      pageSize: filters.groupByCity ? 1000000 : (parseInt(filters.pageSize) || 30)
    };

    const response = await api.get('/seller-contracts', {
      params: apiFilters,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (filters.groupByCity && response.data.data) {
      const { data: groupedData, pagination } = groupDataByCity(response.data.data, filters.pageSize || 30);
      
      // Apply pagination after grouping
      const page = parseInt(filters.page) || 1;
      const pageSize = parseInt(filters.pageSize) || 30;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      return {
        ...response.data,
        data: groupedData.slice(startIndex, endIndex),
        pagination: {
          page,
          pageSize,
          total: groupedData.length,
          totalPages: Math.ceil(groupedData.length / pageSize)
        }
      };
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching seller contracts:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Erro ao buscar dados do servidor');
    } else if (error.request) {
      throw new Error('Não foi possível conectar ao servidor');
    } else {
      throw new Error('Erro ao preparar a requisição');
    }
  }
};

export const fetchCanceledContracts = async (filters) => {
  try {
    const apiFilters = {
      startDate: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: filters.endDate || new Date().toISOString().split('T')[0],
      groupByCity: filters.groupByCity || false,
      page: filters.groupByCity ? 1 : (parseInt(filters.page) || 1),
      pageSize: filters.groupByCity ? 1000000 : (parseInt(filters.pageSize) || 30)
    };

    const response = await api.get('/canceled-contracts', {
      params: apiFilters,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (filters.groupByCity && response.data.data) {
      const { data: groupedData, pagination } = groupDataByCity(response.data.data, filters.pageSize || 30);
      
      // Apply pagination after grouping
      const page = parseInt(filters.page) || 1;
      const pageSize = parseInt(filters.pageSize) || 30;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      return {
        ...response.data,
        data: groupedData.slice(startIndex, endIndex),
        pagination: {
          page,
          pageSize,
          total: groupedData.length,
          totalPages: Math.ceil(groupedData.length / pageSize)
        }
      };
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching canceled contracts:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Erro ao buscar dados do servidor');
    } else if (error.request) {
      throw new Error('Não foi possível conectar ao servidor');
    } else {
      throw new Error('Erro ao preparar a requisição');
    }
  }
};

export const fetchInventoryMovements = async (filters) => {
  try {
    const apiFilters = {
      startDate: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: filters.endDate || new Date().toISOString().split('T')[0],
      productIds: filters.productIds,
      page: parseInt(filters.page) || 1,
      pageSize: parseInt(filters.pageSize) || 30
    };

    const response = await api.get('/inventory-movements', {
      params: apiFilters,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching inventory movements:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Erro ao buscar dados do servidor');
    } else if (error.request) {
      throw new Error('Não foi possível conectar ao servidor');
    } else {
      throw new Error('Erro ao preparar a requisição');
    }
  }
};