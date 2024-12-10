const getQueries = (groupByField, groupByLabel, sectorsStr, filtersSQL) => {
    if (groupByField) {
        return {
            countQuery: `
          SELECT COUNT(DISTINCT ${groupByField}) as total
          FROM su_oss_chamado
          LEFT JOIN cliente ON su_oss_chamado.id_cliente = cliente.id
          LEFT JOIN empresa_setor ON su_oss_chamado.setor = empresa_setor.id
          LEFT JOIN funcionarios ON su_oss_chamado.id_tecnico = funcionarios.id
          WHERE su_oss_chamado.data_abertura BETWEEN ? AND ?
          AND su_oss_chamado.setor IN (${sectorsStr})
          ${filtersSQL}
        `,
            query: `
          WITH RankedCalls AS (
            SELECT 
              ${groupByField} as GroupField,
              su_oss_chamado.id,
              MAX(funcionarios.funcionario) as Atendente,
              MAX(su_oss_assunto.assunto) as Assunto,
              ROW_NUMBER() OVER (PARTITION BY ${groupByField} ORDER BY su_oss_chamado.data_abertura DESC) as rn
            FROM su_oss_chamado
            LEFT JOIN funcionarios ON su_oss_chamado.id_tecnico = funcionarios.id
            LEFT JOIN su_oss_assunto ON su_oss_chamado.id_assunto = su_oss_assunto.id
            LEFT JOIN cliente ON su_oss_chamado.id_cliente = cliente.id
            WHERE su_oss_chamado.data_abertura BETWEEN ? AND ?
            GROUP BY ${groupByField}, su_oss_chamado.id
          )
          SELECT 
            ${groupByField} as ${groupByLabel},
            COUNT(DISTINCT su_oss_chamado.id) as Total_OS,
            (
              SELECT Atendente 
              FROM RankedCalls 
              WHERE GroupField = ${groupByField} 
              AND rn = 1
              LIMIT 1
            ) as Atendente,
            empresa_setor.setor as Setor,
            MAX(su_oss_chamado.data_abertura) as Abertura,
            GROUP_CONCAT(DISTINCT su_oss_chamado.status) as Status,
            (
              SELECT Assunto 
              FROM RankedCalls 
              WHERE GroupField = ${groupByField} 
              AND rn = 1
              LIMIT 1
            ) as Assunto
          FROM su_oss_chamado
          LEFT JOIN cliente ON su_oss_chamado.id_cliente = cliente.id
          LEFT JOIN empresa_setor ON su_oss_chamado.setor = empresa_setor.id
          LEFT JOIN funcionarios ON su_oss_chamado.id_tecnico = funcionarios.id
          WHERE su_oss_chamado.data_abertura BETWEEN ? AND ?
          AND su_oss_chamado.setor IN (${sectorsStr})
          ${filtersSQL}
          GROUP BY ${groupByField}, empresa_setor.setor
          ORDER BY Total_OS DESC
          LIMIT ? OFFSET ?
        `
        };
    }

    return {
        countQuery: `
        SELECT COUNT(*) as total
        FROM su_oss_chamado
        LEFT JOIN cliente ON su_oss_chamado.id_cliente = cliente.id
        LEFT JOIN empresa_setor ON su_oss_chamado.setor = empresa_setor.id
        WHERE su_oss_chamado.data_abertura BETWEEN ? AND ?
        AND su_oss_chamado.setor IN (${sectorsStr})
        ${filtersSQL}
      `,
        query: `
        SELECT 
          cliente.razao as Cliente,
          su_oss_chamado.id as ID_OS,
          funcionarios.funcionario as Atendente,
          empresa_setor.setor as Setor,
          su_oss_chamado.data_abertura as Abertura,
          su_oss_chamado.status as Status,
          su_oss_assunto.assunto as Assunto
        FROM su_oss_chamado
        LEFT JOIN cliente ON su_oss_chamado.id_cliente = cliente.id
        LEFT JOIN empresa_setor ON su_oss_chamado.setor = empresa_setor.id
        LEFT JOIN su_oss_assunto ON su_oss_chamado.id_assunto = su_oss_assunto.id
        LEFT JOIN funcionarios ON su_oss_chamado.id_tecnico = funcionarios.id
        WHERE su_oss_chamado.data_abertura BETWEEN ? AND ?
        AND su_oss_chamado.setor IN (${sectorsStr})
        ${filtersSQL}
        ORDER BY su_oss_chamado.data_abertura DESC
        LIMIT ? OFFSET ?
      `
    };
};

module.exports = {
    getQueries
};