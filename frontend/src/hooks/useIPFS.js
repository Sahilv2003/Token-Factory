
// frontend/src/hooks/useIPFS.js
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

const auth = 'Basic ' + Buffer.from(
    import.meta.env.VITE_INFURA_IPFS_PROJECT_ID +
    ':' +
    import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET
).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export default client


// // frontend/src/hooks/useIPFS.js
// import { create } from 'ipfs-http-client';
// import { Buffer } from 'buffer';

// const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID;
// const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET;
// const authorization = "Basic " + btoa(projectId + ":" + projectSecret);


// const ipfsClient = create({
//     url: "https://ipfs.infura.io:5001/api/v0",
//     headers: {
//         authorization
//     }
// })

// export default ipfsClient;
