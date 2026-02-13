const fastify = require('fastify')({ logger: true });
const { ChainGrpcBankApi, IndexerGrpcTransactionApi } = require('@injectivelabs/sdk-ts');
const { getNetworkEndpoints, Network } = require('@injectivelabs/networks');

const PORT = process.env.PORT || 3000;

const network = Network.Testnet;
const endpoints = getNetworkEndpoints(network);

const bankApi = new ChainGrpcBankApi(endpoints.grpc);
const txApi = new IndexerGrpcTransactionApi(endpoints.indexer);

fastify.get('/balance/:addr', async (request, reply) => {
  try {
    const { addr } = request.params;

    const balances = await bankApi.fetchBalances(addr);

    return {
      address: addr,
      network: 'injective-testnet',
      balances: balances.balances.map(b => ({
        denom: b.denom,
        amount: b.amount
      }))
    };
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({
      error: 'Failed to fetch balance',
      message: error.message
    });
  }
});

fastify.get('/tx/:addr', async (request, reply) => {
  try {
    const { addr } = request.params;
    const { limit = 10, skip = 0 } = request.query;

    const txs = await txApi.fetchTransactions({
      address: addr,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

    return {
      address: addr,
      network: 'injective-testnet',
      transactions: txs.transactions.map(tx => ({
        hash: tx.txHash,
        height: tx.blockNumber,
        code: tx.code,
        gasUsed: tx.gasUsed,
        gasWanted: tx.gasWanted,
        timestamp: tx.timestamp,
        memo: tx.memo || '',
        messages: tx.messages.map(m => ({
          type: m.type,
          value: m.value
        }))
      })),
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        total: txs.paging?.total || txs.transactions.length
      }
    };
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

fastify.get('/health', async () => {
  return {
    status: 'ok',
    network: 'injective-testnet',
    endpoints: {
      grpc: endpoints.grpc,
      indexer: endpoints.indexer
    },
    timestamp: new Date().toISOString()
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server running on port ${PORT}`);
    fastify.log.info(`Connected to Injective Testnet`);
    fastify.log.info(`gRPC Endpoint: ${endpoints.grpc}`);
    fastify.log.info(`Indexer Endpoint: ${endpoints.indexer}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
