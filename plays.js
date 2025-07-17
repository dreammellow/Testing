// api/plays.js

export default async function handler(req, res) { const { wallet } = req.query; if (!wallet || !wallet.startsWith("0x")) { return res.status(400).json({ error: "Invalid wallet address" }); }

const query = { query: { transactions(tags: [ { name: "App-Name", values: ["spritetype-irys"] }, { name: "walletAddress", values: ["${wallet.toLowerCase()}"] } ], first: 100) { edges { node { id } } } } };

try { const response = await fetch("https://arweave.net/graphql", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query), });

const result = await response.json();
const count = result?.data?.transactions?.edges?.length || 0;
res.status(200).json({ wallet, playCount: count });

} catch (e) { res.status(500).json({ error: "Failed to fetch from Arweave" }); } }

// Save this file as: api/plays.js

