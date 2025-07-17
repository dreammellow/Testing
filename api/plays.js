export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet || !wallet.startsWith('0x')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid wallet' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const query = {
    operationName: "SyncCredentialValue",
    variables: {
      input: {
        address: wallet,
        credentialId: "GCFtLtfrJH" // SpriteType quest ID
      }
    },
    query: `
      mutation SyncCredentialValue($input: SyncCredentialValueInput!) {
        syncCredentialValue(input: $input) {
          value {
            address
            allow
            __typename
          }
          message
          __typename
        }
      }
    `
  };

  try {
    const res = await fetch("https://graphigo.prd.galaxy.eco/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://app.galxe.com",
        "Referer": "https://app.galxe.com",
      },
      body: JSON.stringify(query)
    });

    const data = await res.json();
    const allowed = data?.data?.syncCredentialValue?.value?.allow;

    return new Response(JSON.stringify({
      wallet,
      quest: "Irys SpriteType",
      status: allowed ? "✅ Completed" : "❌ Not yet eligible"
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to contact Galxe API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
