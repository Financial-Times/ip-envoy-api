import knex from '../../db/connect'

async function add({ name, descr }) {
  return (await knex
    .returning('*')
    .insert([{ name, descr }])
    .into('core.department'))[0]
}

export { add }
