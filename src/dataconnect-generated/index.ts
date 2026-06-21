
export const Connector = {} as any;

const tableMock = {
    query: async () => [],
    get: async () => null,
    create: async (data: any) => data,
    update: async (data: any) => data,
};

const connectorMock = {
    table: () => tableMock,
};

export const getConnector = () => connectorMock;
export const Model = () => ({} as any);
export const Column = () => ({} as any);
export const Table = {} as any;
export const PrimaryColumn = () => ({} as any);
export const CreateTimestamp = () => ({} as any);
export const UpdateTimestamp = () => ({} as any);
export const Relation = {} as any;
export const OneToMany = () => ({} as any);
export const ManyToOne = () => ({} as any);
