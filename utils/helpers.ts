export function toValidHTTPSURI(uri: string) {
    if (uri.includes("ipfs://")) {
        return `https://ipfs.io/ipfs/${uri.split("/").pop()}`;
    }
    return uri;
}

export const deleteUndefined = (obj: Record<string, any> | undefined): void => {
    if (obj) {
        Object.keys(obj).forEach((key: string) => {
            if (obj[key] && typeof obj[key] === 'object') {
                deleteUndefined(obj[key]);
            } else if (typeof obj[key] === 'undefined') {
                delete obj[key]; // eslint-disable-line no-param-reassign
            }
        });
    }
}
