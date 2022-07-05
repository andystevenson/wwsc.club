module.exports = {
  name: 'Prices',
  description:
    'Explore membership and visitor pricing options at West Warwicks',
  benefits: [
    { description: 'No court booking fees!<br>No light fees!' },
    {
      description:
        'Free induction session with coaching in the sport of your choice.',
    },
    {
      description:
        '1 free PT session, per month, for the 1st 6 months following a gym induction.',
    },
    {
      description:
        '15% discount on all drinks at the bar!<br>Food discounts through home dine',
      links: [
        {
          href: 'https://www.home-dine.co.uk/home',
          class: 'home-dine',
          img: '/cloudinaried/restaurant/restaurant-home-dine-logo.avif',
          alt: 'home dine solihull',
        },
      ],
    },
    {
      description: '20% discount on additional adult annual membership!',
    },
    {
      description:
        '£50 upgrade to adult membership buys access to all standard gym classes!',
    },
    {
      description: '50% discount on Room Hire for Events!',
    },
    {
      description: 'Free entry to annual ballot for Wimbledon Tickets!',
    },
  ],
  categories: [
    {
      name: 'membership',
      products: [
        {
          name: 'Dummy',
          description: 'Dummy dummy dummy.',
          conditions: 'No conditions dummy',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 1, nickname: 'dummy-annual' },
            { interval: 'month', price: 1, nickname: 'dummy-monthly' },
          ],
        },
        {
          name: 'Family',
          description: 'All sports and gym with classes.',
          conditions: 'Up to 3 children under 18',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 1000, nickname: 'family-annual' },
            { interval: 'month', price: 100, nickname: 'family-monthly' },
          ],
        },
        {
          name: '+Classes',
          description: 'All sports and gym with classes.',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 600, nickname: 'classes-annual' },
            { interval: 'month', price: 55, nickname: 'classes-monthly' },
          ],
        },
        {
          name: 'Adult',
          description: 'All sports and gym.',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 550, nickname: 'adult-annual' },
            { interval: 'month', price: 50, nickname: 'adult-monthly' },
          ],
        },

        {
          name: 'Off-Peak',
          description: 'All sports and gym.',
          conditions: 'Mon-Fri 08:00-16:00',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 400, nickname: 'off-peak-annual' },
            {
              interval: 'month',
              price: 37.5,
              nickname: 'off-peak-monthly',
            },
          ],
        },
        {
          name: 'Over-65',
          description: 'All sports and gym with classes.',
          conditions: 'Aged 65+',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 400, nickname: 'over-65-annual' },
            {
              interval: 'month',
              price: 37.5,
              nickname: 'over-65-monthly',
            },
          ],
        },
        {
          name: 'Young Adult',
          description: 'All sports and gym with classes.',
          conditions: 'Aged 18-25',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'year', price: 400, nickname: 'young-adult-annual' },
            {
              interval: 'month',
              price: 37.5,
              nickname: 'young-adult-monthly',
            },
          ],
        },
        {
          name: 'Teens',
          description: 'All sports and gym.',
          conditions: 'Aged 12-17',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'year', price: 105, nickname: 'teens-annual' }],
        },
        {
          name: 'Junior',
          description: 'All sports and gym.',
          conditions: 'Aged 7-11',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'year', price: 75, nickname: 'junior-annual' }],
        },
        {
          name: 'Social',
          description: 'Access to Bar + Restaurant at discount prices.',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'year', price: 100, nickname: 'social-annual' }],
        },
      ],
    },
    {
      name: 'classes',
      products: [
        {
          name: 'Member',
          description: 'Group Exercise Class',
          conditions: '12 for the price of 10!',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            {
              interval: 'once',
              price: 3,
              qty: 1,
              nickname: 'classes-member-1',
            },
            {
              interval: 'once',
              price: 30,
              qty: 12,
              nickname: 'classes-member-12',
            },
          ],
        },
        {
          name: 'Visitor',
          description: 'Group Exercise Class',
          conditions: '12 for the price of 10!',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            {
              interval: 'once',
              price: 7,
              qty: 1,
              nickname: 'classes-visitor-1',
            },
            {
              interval: 'once',
              price: 70,
              qty: 12,
              nickname: 'classes-visitor-12',
            },
          ],
        },
      ],
    },
    {
      name: 'visitors',
      products: [
        {
          name: 'DummyVisit',
          description: 'Dummy dummy dummy.',
          conditions: 'With a member',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'once', price: 1, nickname: 'visitors-dummy' }],
        },
        {
          name: 'Guest',
          description: 'Rackets and gym access.',
          conditions: 'With a member',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'once', price: 5, nickname: 'visitors-guest' }],
        },
        {
          name: 'Session',
          description: 'Rackets and gym access.',
          conditions: 'A single booking',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'once', price: 10, nickname: 'visitors-session' },
          ],
        },
        {
          name: 'Day',
          description: 'Rackets and gym access.',
          conditions: 'Up to 3 bookings',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'once', price: 15, nickname: 'visitors-day' }],
        },
        {
          name: 'Week',
          description: 'Rackets and gym access.',
          conditions: '7 days, 2 bookings per day',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [{ interval: 'once', price: 20, nickname: 'visitors-week' }],
        },
        {
          name: '2 Weeks',
          description: 'Rackets and gym access.',
          conditions: '14 days, 2 bookings per day',
          images: ['https://westwarwicks.club/favicon.svg'],
          prices: [
            { interval: 'once', price: 30, nickname: 'visitors-2-week' },
          ],
        },
      ],
    },
  ],
}
