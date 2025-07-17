// api/plays.js

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet || !wallet.startsWith('0x')) {
    return new Response(JSON.stringify({ error: 'Invalid wallet address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const query = {
    query: `{
      transactions(tags: [
        { name: "App-Name", values: ["spritetype-irys"] },
        { name: "walletAddress", values: ["${wallet.toLowerCase()}"] }
      ], first: 100) {
        edges {
          node {
            id
          }
        }
      }
    }`
  };

  try {
    const response = await fetch("https://arweave.mainnet.irys.xyz/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    const result = await response.json();
    const count = result?.data?.transactions?.edges?.length || 0;

    return new Response(JSON.stringify({ wallet, playCount: count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from Irys' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
