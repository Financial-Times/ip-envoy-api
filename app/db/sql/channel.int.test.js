const channelSQL = require('./channel');
const knex = require('../../db/connect');
const { truncateDB } = require('../../testHelpers.js');

describe('Channel Types SQL', () => {
  beforeEach(async () => {
    await truncateDB();
  });

  const channelTypeToAddData = {
    name: 'testChannelType',
    config: {
      pretendKey: 'pretendValue'
    }
  };

  const channelToAddData = {
    name: 'testChannel',
    descr: 'channelDescription',
    config: {
      templateId: 456
    }
  };

  it('Creates new channel type if it doesn\'t exist.', async () => {
    const rsChannelTypesInitial = await knex
      .select('channelTypeId', 'name', 'config')
      .from('core.channelType');
    expect(rsChannelTypesInitial).toHaveLength(0);
    const rsChannelTypeFinal = await channelSQL.haveChannelType(channelTypeToAddData);
    expect(rsChannelTypeFinal.config).toEqual(channelTypeToAddData.config);
  });

  it('Creates new channel if it doesn\'t exist.', async () => {
    const channelTypeId = (await channelSQL.haveChannelType(channelTypeToAddData)).channelTypeId;
    const rsChannelInitial = await knex
      .select('channelId', 'name', 'descr', 'config')
      .from('core.channel');
    expect(rsChannelInitial).toHaveLength(0);
    const rsChannelFinal = await channelSQL.haveChannel(channelToAddData, channelTypeId);
    expect(rsChannelFinal.config).toEqual(channelToAddData.config);
  });
});
