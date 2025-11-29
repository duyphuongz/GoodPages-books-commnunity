
class MetaPaging {
    page: any;
    limit: any;
    totalItems: any;
    totalPages: any;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

    constructor({
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    }: {
        page: any;
        limit: any;
        totalItems: any;
        totalPages: any;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }) {
        this.page = page;
        this.limit = limit;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.hasNextPage = hasNextPage;
        this.hasPreviousPage = hasPreviousPage;
    }
}

export {
    MetaPaging
}