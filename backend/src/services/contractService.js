const getConnection = require('../database/connection');
const { formatDateForMySQL } = require('../utils/dateUtils');

class ContractService {
    constructor() {
        this.defaultPageSize = 30;
    }

    async getSellerContracts({ startDate, endDate, contractStatus = [], page = 1, pageSize = this.defaultPageSize }) {
        const connection = await getConnection();
        const offset = (page - 1) * pageSize;

        try {
            const baseQuery = `
                SELECT 
                    cliente_contrato_vendedor.nome as cliente_contrato_vendedor_nome, 
                    cliente_contrato_vendedor.id as cliente_contrato_vendedor_id, 
                    cliente_contrato.data_cadastro_sistema as cliente_contrato_data_cadastro_sistema, 
                    vendedor_cidade.nome as vendedor_cidade_nome
                FROM cliente_contrato
                LEFT JOIN vendedor cliente_contrato_vendedor 
                    ON cliente_contrato.id_vendedor = cliente_contrato_vendedor.id
                LEFT JOIN cidade vendedor_cidade 
                    ON cliente_contrato_vendedor.id_cidade = vendedor_cidade.id 
                WHERE (cliente_contrato.data_cadastro_sistema BETWEEN ? AND ? 
                    AND cliente_contrato.status = 'A')
            `;

            const countQuery = `
                SELECT COUNT(*) as total
                FROM cliente_contrato
                WHERE (cliente_contrato.data_cadastro_sistema BETWEEN ? AND ? 
                    AND cliente_contrato.status = 'A')
            `;

            const query = baseQuery + ' LIMIT ? OFFSET ?';

            const dateParams = [
                formatDateForMySQL(startDate),
                formatDateForMySQL(endDate)
            ];

            const [countResult] = await connection.execute(countQuery, dateParams);
            const [rows] = await connection.execute(query, [...dateParams, pageSize, offset]);

            const total = countResult[0].total;

            return {
                data: rows,
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

    async getExactQuery(connection, startDate, endDate) {
        const query = `
            SELECT 
                cliente_contrato_vendedor.nome as cliente_contrato_vendedor_nome, 
                cliente_contrato_vendedor.id as cliente_contrato_vendedor_id, 
                cliente_contrato.data_cadastro_sistema as cliente_contrato_data_cadastro_sistema, 
                vendedor_cidade.nome as vendedor_cidade_nome
            FROM cliente_contrato
            LEFT JOIN vendedor cliente_contrato_vendedor 
                ON cliente_contrato.id_vendedor = cliente_contrato_vendedor.id
            LEFT JOIN cidade vendedor_cidade 
                ON cliente_contrato_vendedor.id_cidade = vendedor_cidade.id 
            WHERE (cliente_contrato.data_cadastro_sistema BETWEEN ? AND ? 
                AND cliente_contrato.status = 'A')
        `;

        const [rows] = await connection.execute(query, [
            formatDateForMySQL(startDate),
            formatDateForMySQL(endDate)
        ]);

        return {
            data: rows,
            totalRecords: rows.length
        };
    }

    async getCanceledContracts({ startDate, endDate, page = 1, pageSize = this.defaultPageSize }) {
        await this.validateDates(startDate, endDate);
        const connection = await getConnection();
        const offset = (page - 1) * pageSize;

        try {
            // Get total cancellations for the period
            const totalCancellationsQuery = `
                SELECT COUNT(*) as total_cancelamentos
                FROM cliente_contrato
                WHERE (
                    cliente_contrato.status_internet = 'D' 
                    AND cliente_contrato.status = 'I' 
                    AND cliente_contrato.data_cancelamento >= ? 
                    AND cliente_contrato.data_cancelamento <= ?
                )
            `;

            const countQuery = `
                SELECT COUNT(*) as total
                FROM cliente_contrato
                WHERE (
                    cliente_contrato.status_internet = 'D' 
                    AND cliente_contrato.status = 'I' 
                    AND cliente_contrato.data_cancelamento >= ? 
                    AND cliente_contrato.data_cancelamento <= ?
                )
            `;

            const query = `
                SELECT 
                    cliente_contrato.status,
                    cliente_contrato.status_internet,
                    DATE_FORMAT(cliente_contrato.data_cancelamento, "%d/%m/%Y") as data_cancelamento,
                    cliente_contrato_fn_areceber_mot_cancelamento.motivo as motivo_cancelamento,
                    cliente_contrato_fn_areceber_mot_cancelamento.id as motivo_id,
                    cliente_contrato_cidade.nome as cidade_nome
                FROM cliente_contrato
                LEFT JOIN fn_areceber_mot_cancelamento cliente_contrato_fn_areceber_mot_cancelamento 
                    ON cliente_contrato.motivo_cancelamento = cliente_contrato_fn_areceber_mot_cancelamento.id
                LEFT JOIN cidade cliente_contrato_cidade 
                    ON cliente_contrato.cidade = cliente_contrato_cidade.id 
                WHERE (
                    cliente_contrato.status_internet = 'D' 
                    AND cliente_contrato.status = 'I' 
                    AND cliente_contrato.data_cancelamento >= ? 
                    AND cliente_contrato.data_cancelamento <= ?
                )
                LIMIT ? OFFSET ?
            `;

            const dateParams = [
                formatDateForMySQL(startDate),
                formatDateForMySQL(endDate)
            ];

            const [totalCancellationsResult] = await connection.execute(totalCancellationsQuery, dateParams);
            const [countResult] = await connection.execute(countQuery, dateParams);
            const [rows] = await connection.execute(query, [...dateParams, pageSize, offset]);

            const total = countResult[0].total;
            const totalCancellations = totalCancellationsResult[0].total_cancelamentos;

            return {
                data: rows,
                totalCancellations,
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

    async validateDates(startDate, endDate) {
        if (!startDate || !endDate) {
            throw new Error('Start date and end date are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format');
        }

        if (start > end) {
            throw new Error('Start date must be before or equal to end date');
        }
    }
}

module.exports = new ContractService();