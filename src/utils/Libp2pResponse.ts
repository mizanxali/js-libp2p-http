export default interface Libp2pResponse<T> {
    data: T;
    status: 'success' | 'error';
    error?: string;
    metadata?: any;
}
