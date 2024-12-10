export const groupDataByCity = (data, pageSize) => {
    if (!data || !Array.isArray(data)) return { data: [], pagination: { total: 0, totalPages: 0 } };

    // Check if this is sales data by looking for vendedor_nome field
    const isSalesData = data[0]?.vendedor_nome !== undefined;

    const groupedData = data.reduce((acc, curr) => {
        const cityKey = curr.cidade_nome;
        
        if (!acc[cityKey]) {
            acc[cityKey] = {
                cidade_nome: curr.cidade_nome,
                total_contratos: isSalesData ? parseInt(curr.total_contratos || 0) : 1
            };
        } else {
            if (isSalesData) {
                // For sales, sum the total_contratos field
                acc[cityKey].total_contratos += parseInt(curr.total_contratos || 0);
            } else {
                // For cancellations, increment the counter
                acc[cityKey].total_contratos += 1;
            }
        }
        return acc;
    }, {});

    const processedData = Object.values(groupedData);

    return {
        data: processedData,
        pagination: {
            total: processedData.length,
            totalPages: Math.ceil(processedData.length / pageSize)
        }
    };
};