exports.seed = async (knex) => {
  // Deletes ALL existing entries
  const netwoks = await knex('networks').del()
  const network_user = await knex('users').where({type: 'network_user'}).first()
  if (network_user) {
    network = await knex('networks').insert({
      user_id: network_user.id,
      business_name: 'looper',
      address: '23 rue de Belleville',
      zip_code: '75019',
      city: 'Paris',
      website: '',
      deposite_type: 'bouteilles',
      image_url: 'https://res.cloudinary.com/alineconsigne/image/upload/v1597926812/networks-logos/looper_lx0csn.png',
    })
  } else {
    console.log('no user found')
  }
}
