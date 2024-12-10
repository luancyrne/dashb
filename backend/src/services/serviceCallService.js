const getConnection = require('../database/connection');
const STATUS_MAP = require('../constants/status');
const { formatDateForMySQL, formatDateToBR } = require('../utils/dateUtils');

class ServiceCallService {
    constructor() {
        this.defaultPageSize = 30;
    }

    buildFilters(params) {
        const filters = [];
        const {
            callType,
            clientName,
            subjectsStr,
            attendant,
            statusStr
        } = params;

        if (callType !== "Ambos") {
            filters.push(`su_oss_chamado.tipo = '${callType}'`);
        }
        if (clientName) {
            filters.push(`cliente.razao LIKE '%${clientName}%'`);
        }
        if (subjectsStr) {
            filters.push(`su_oss_chamado.id_assunto IN (${subjectsStr})`);
        }
        if (attendant) {
            filters.push(`funcionarios.funcionario LIKE '%${attendant}%'`);
        }
        if (statusStr) {
            filters.push(`su_oss_chamado.status IN (${statusStr})`);
        }

        return filters.length ? 'AND ' + filters.join(' AND ') : '';
    }

    buildQueryParams(groupBy, params) {
        const {
            inicio,
            fim,
            pageSize,
            offset
        } = params;

        return groupBy ?
            [inicio, fim, inicio, fim, pageSize, offset] :
            [inicio, fim, pageSize, offset];
    }

    processResults(rows) {
        return rows.map(row => ({
            ...row,
            Status: STATUS_MAP[row.Status] || row.Status,
            Abertura: formatDateToBR(row.Abertura)
        }));
    }

    async getServiceCalls(params) {
        const {
            startDate,
            endDate,
            sectors,
            status,
            callType,
            groupByClient,
            groupByAttendant,
            clientName,
            subjects,
            attendant,
            page = 1,
            pageSize = this.defaultPageSize,
        } = params;

        if (!startDate || !endDate || !sectors || !sectors.length) {
            throw new Error('Missing required parameters');
        }

        const inicio = formatDateForMySQL(new Date(startDate).setHours(1, 0, 0));
        const fim = formatDateForMySQL(new Date(endDate).setHours(23, 59, 59));
        const statusStr = status.length ? `'${status.join("','")}'` : null;
        const sectorsStr = sectors.join(',');
        const subjectsStr = subjects.length ? subjects.join(',') : null;
        const offset = (page - 1) * pageSize;

        const filtersSQL = this.buildFilters({
            callType,
            clientName,
            subjectsStr,
            attendant,
            statusStr
        });

        const groupByField = groupByClient ? "cliente.razao" :
            groupByAttendant ? "funcionarios.funcionario" : null;
        const groupByLabel = groupByClient ? "Cliente" :
            groupByAttendant ? "Atendente" : null;

        const { query, countQuery } = require('../queries/serviceCallQueries')
            .getQueries(groupByField, groupByLabel, sectorsStr, filtersSQL);

        const connection = await getConnection();

        try {
            const [countResult] = await connection.execute(countQuery, [inicio, fim]);
            const total = countResult[0].total;

            const queryParams = this.buildQueryParams(
                groupByField,
                { inicio, fim, pageSize, offset }
            );

            const [rows] = await connection.execute(query, queryParams);
            const results = this.processResults(rows);

            return {
                data: results,
                pagination: {
                    total,
                    page: Number(page),
                    pageSize: Number(pageSize),
                    totalPages: Math.ceil(total / pageSize)
                }
            };
        } finally {
            await connection.end();
        }
    }
}

module.exports = new ServiceCallService();