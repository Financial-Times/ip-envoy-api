jest.mock('../db/sql/channel', () => {
  const tempResult = { result: [] };
  return {
    getForSilo: jest.fn(() => Promise.resolve(tempResult.result)),
    setResult: (newRes) => { tempResult.result = newRes; },
    logSend: jest.fn(() => Promise.resolve({}))
  };
});

jest.mock('../plugins/channels', () => {
  let sendRes = Promise.resolve([true]);
  return {
    setSendRes: (res) => { sendRes = res; },
    registry: {
      byId: {
        123: {
          send: jest.fn(() => sendRes)
        }
      },
      nameToId: {
        channelOutput: 123
      }
    }
  }
});

const channel = require('./channel');
const channelSQL = require('../db/sql/channel');
const channelPlugin = require('../plugins/channels');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Channel Core', () => {
  it('does nothing if no channels to be activated', async () => {
    const res = await channel.activateChannels('123');
    expect(res.length).toBeFalsy();
  });

  it('matches entity row with provided data set', async () => {
    const entityId = 123;
    const data = { [entityId]: { test: 'test' } };
    const entityRows = [{ entityId, channelId: 123, config: '{}' }];
    const res = channel.mergeEntityData(entityRows, data);
    expect(res[0].entityId).toBe(entityId);
    expect(res[0].data).toEqual(data[entityId]);
  });

  it('activates channels with merged entity data', async () => {
    const entityId = 123;
    const data = { [entityId]: { test: 'test' } };
    const entityRows = [{ entityId, channelId: 123 }];
    channelSQL.setResult(entityRows);
    const res = await channel.activateChannels('123', data);
    expect(channelPlugin.registry.byId[entityId].send.mock.calls[0][0][0].data)
      .toEqual(data[entityId]);
    expect(res).toBe(true);
  });

  it('rejects if no siloId given', async () => {
    const rejection = 'no siloId';
    return expect(channel.activateChannels()).rejects.toBe(rejection);
  });

  it('rejects if sending to a channel fails', async () => {
    const rejection = 'problem';
    const entityId = 123;
    const data = { [entityId]: { test: 'test' } };
    const entityRows = [{ entityId, channelId: 123 }];
    channelSQL.setResult(entityRows);
    channelPlugin.setSendRes(Promise.reject('problem'));
    try {
      const res = await channel.activateChannels('123', data);
    } catch (err) {
      expect(err).toBe(rejection);
    }
  });
});
