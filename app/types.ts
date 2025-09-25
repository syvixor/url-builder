export interface IIcons {
    id: string;
    name: string;
    url: string;
}

export interface IResponse {
    statusCode: number;
    statusMessage: string;
    data: IIcons[];
}