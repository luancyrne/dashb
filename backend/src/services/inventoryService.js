const getConnection = require('../database/connection');

const METER_PRODUCTS = ['326']; // Products measured in meters

const formatQuantity = (quantity, productId) => {
    const value = parseFloat(quantity);
    if (METER_PRODUCTS.includes(productId.toString())) {
        // For products in meters, convert to integer meters
        return `${Math.floor(value)}m`;
    } else {
        // For unit products, remove decimal places
        return Math.floor(value).toString();
    }
};

class InventoryService {
    async getInventoryMovements({ startDate, endDate, productIds, page = 1, pageSize = 30 }) {
        if (!startDate || !endDate || !productIds || !productIds.length) {
            throw new Error('Start date, end date and at least one product ID are required');
        }

        const connection = await getConnection();
        const offset = (page - 1) * pageSize;

        try {
            // Create placeholders for IN clause
            const placeholders = productIds.map(() => '?').join(',');

            const countQuery = `
                SELECT COUNT(DISTINCT f.funcionario) as total
                FROM movimento_produtos mp
                LEFT JOIN su_oss_chamado soc ON mp.id_oss_chamado = soc.id
                LEFT JOIN funcionarios f ON soc.id_tecnico = f.id
                WHERE (
                    soc.data_fechamento >= ? 
                    AND soc.data_fechamento <= ?
                    AND soc.id_assunto = '1'
                    AND mp.id_produto IN (${placeholders})
                )
            `;

            const query = `
                WITH TechnicianProducts AS (
                    SELECT DISTINCT 
                        f.funcionario,
                        mp.id_produto,
                        CASE 
                            WHEN mp.id_produto IN ('${METER_PRODUCTS.join("','")}') 
                            THEN CONCAT(FLOOR(SUM(mp.qtde_saida)), 'm')
                            ELSE CAST(FLOOR(SUM(mp.qtde_saida)) AS CHAR)
                        END as quantidade
                    FROM movimento_produtos mp
                    LEFT JOIN su_oss_chamado soc ON mp.id_oss_chamado = soc.id
                    LEFT JOIN funcionarios f ON soc.id_tecnico = f.id
                    WHERE (
                        soc.data_fechamento >= ? 
                        AND soc.data_fechamento <= ?
                        AND soc.id_assunto = '1'
                        AND mp.id_produto IN (${placeholders})
                    )
                    GROUP BY f.funcionario, mp.id_produto
                )
                SELECT 
                    tp.funcionario as "Técnico"
                    ${productIds.map(productId => `,
                    MAX(CASE WHEN tp.id_produto = '${productId}' THEN tp.quantidade END) as "${
                        METER_PRODUCTS.includes(productId) ? 'DROP (metros)' : 
                        productId === '74' ? 'FASTCONECTOR' :
                        productId === '322' ? 'ESTICADOR COLORIDO VERDE' : 'ONU ZTE'
                    }"`).join('')}
                FROM TechnicianProducts tp
                GROUP BY tp.funcionario
                ORDER BY tp.funcionario
                LIMIT ? OFFSET ?
            `;

            // Prepare parameters for both queries
            const countParams = [startDate, endDate, ...productIds];
            const queryParams = [startDate, endDate, ...productIds, pageSize, offset];

            const [countResult] = await connection.execute(countQuery, countParams);
            const [rows] = await connection.execute(query, queryParams);

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
}

module.exports = new InventoryService();