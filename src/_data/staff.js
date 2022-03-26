module.exports = {
  name: 'staff',
  people: {
    title: 'Staff',
    email: 'staff@westwarwicks.co.uk',
    emailMessage: 'email staff',
    members: [
      {
        name: 'Andy Stevenson',
        role: 'Acting General Manager',
        image: '/cloudinaried/squash/squash-andy-stevenson.avif',
      },
      {
        name: 'Catherine Aucott',
        role: 'Operations Manager',
        image: '/cloudinaried/staff/catherine-aucott.avif',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Sarah Harrison',
        role: 'Customer Services Manager',
        image: '/cloudinaried/staff/sarah-harrison.avif',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Robert Powell',
        role: 'Head Chef',
        image: '/cloudinaried/staff/rob-powell.avif',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Terry Powell',
        role: 'Assistant Chef',
        image: '/cloudinaried/staff/terry-powell.avif',
        reportsTo: 'Robert Powell',
      },
      {
        name: 'Larisa Arcip',
        role: 'Head of Fitness',
        image: '/cloudinaried/staff/larisa-arcip-headshot.avif',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Dan Spiridon',
        role: 'Personal Trainer',
        image: '/cloudinaried/staff/dan-spiridon-headshot.avif',
        reportsTo: 'Larisa Arcip',
      },
      {
        name: 'Robert Stretton',
        role: 'Head Groundsman',
        image: '/cloudinaried/staff/robert-stretton.avif',
        reportsTo: 'Catherine Aucott',
      },
      {
        name: 'Ben Hunt',
        role: 'Food & Beverage Supervisor',
        image: '/cloudinaried/staff/ben-hunt.avif',
        reportsTo: 'Sarah Harrison',
      },

      {
        name: 'Angela Taylor',
        role: 'Sports & Events Administrator',
        image: '/cloudinaried/staff/angela-taylor.avif',
        reportsTo: 'Sarah Harrison',
      },
    ],
  },
}
