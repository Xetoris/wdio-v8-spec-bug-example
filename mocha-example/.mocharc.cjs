module.exports = {
    loader: 'ts-node/esm',
    reporter: 'spec',
    //require: ['ts-node/register'],
    spec: ['./mocha-example/tests/**/*.spec.ts']
};