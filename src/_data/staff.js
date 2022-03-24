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
        image: '/images/person-circle.svg',
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
        image: '/images/person-circle.svg',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Terry Powell',
        role: 'Assistant Chef',
        image: '/images/person-circle.svg',
        reportsTo: 'Robert Powell',
      },
      {
        name: 'Larisa Arcip',
        role: 'Head of Fitness',
        image: '/images/person-circle.svg',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Dan Spiridon',
        role: 'Personal Trainer',
        image: '/images/person-circle.svg',
        reportsTo: 'Larisa Arcip',
      },
      {
        name: 'Robert Stretton',
        role: 'Head Groundsman',
        image: '/images/person-circle.svg',
        reportsTo: 'Catherine Aucott',
      },
      {
        name: 'Ben Hunt',
        role: 'Food & Beverage Supervisor',
        image: '/images/person-circle.svg',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Jack Harrison',
        role: 'Food & Beverage Supervisor',
        image: '/images/person-circle.svg',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Angela Taylor',
        role: 'Sports & Events Administrator',
        image: '/images/person-circle.svg',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Olivia Kunneke',
        role: 'Sports & Events Administrator',
        image: '/images/person-circle.svg',
        reportsTo: 'Sarah Harrison',
      },
    ],
  },
}
