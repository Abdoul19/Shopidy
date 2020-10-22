export default () => ({
  elasticsearch: {
    host: parseInt(process.env.ELASTIC_HOST, 10) || '15.236.250.32',
    port: process.env.ELASTIC_PORT || '9200',
  },
  redis: {
    host: parseInt(process.env.REDIS_HOST, 10) || '15.236.250.32',
    port: process.env.REDIS_PORT || '6379',
  },
});
