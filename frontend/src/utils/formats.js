function createIpfsUrlFromContentHash(contentHash) {
    if (!contentHash) {
        return ''
    }
    return import.meta.env.VITE_IPFS_ENDPOINT + contentHash
}

export { createIpfsUrlFromContentHash };

