const STATUS_MAP = {
    "A": "Aberta",
    "AN": "Análise",
    "EN": "Encaminhada",
    "AS": "Assumida",
    "AG": "Agendada",
    "DS": "Deslocamento",
    "EX": "Execução",
    "F": "Finalizada",
    "RAG": "Reagendar"
};

const SECTOR_MAPPING = {
    1: "Técnico de Campo",
    6: "Suporte",
    4: "Oficial de Redes",
    16: "NOC",
    14: "Comercial",
    11: "Estoque",
    2: "Financeiro",
    15: "Retenção",
    12: "Retirada Equipamentos",
    21: "Supervisão Operacional"
};

const SUBJECTS = {
    1: "Instalação",
    5: "Transferência de Endereço",
    293: "Manutenção LOS",
    48: "Manutenção de Rede",
    35: "Manutenção Externa",
    25: "Manutenção Preventiva",
    2: "Manutenção Interna"
};

const CONTRACTS = {
    1: "Cancelados",
    2: "Vendas"
};

const CONTRACT_STATUS = {
    "P": "Pré-contrato",
    "A": "Ativo",
    "I": "Inativo",
    "N": "Negativado",
    "D": "Desistiu"
};

const INVENTORY_PRODUCTS = {
    326: "DROP (metros)",
    74: "FASTCONECTOR (unitário)",
    322: "ESTICADOR COLORIDO VERDE (unitário)",
    463: "ONU ZTE (unitário)"
};

export { 
    SECTOR_MAPPING, 
    SUBJECTS, 
    STATUS_MAP, 
    CONTRACTS, 
    CONTRACT_STATUS,
    INVENTORY_PRODUCTS 
}