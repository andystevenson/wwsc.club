module.exports = {
  name: 'squash',
  description:
    'Founded in 1970, West Warwicks Squash is a thriving hub of activity for all ages and abilities. We run monthly box leagues for all players, several weekly club social sessions and quarterly tournaments. One of only 5 England Squash Performance Hubs in the UK we host the world renowned Rob Owen Academy (ROA). The alumni of the club and ROA include legend of Squash, Jonah Barrington, 6 times British Open Champion, Paul Coll ex World #1 (currently World #5), Sarah-Jane Perry ex England Number #1 / World #5 and many junior & senior world top 50 players. ',
  warwickshireSquashStars: 'https://www.warwickshiresquash.org/squash-stars/',
  wwsc1stTeam:
    'https://warwickshiresquash.leaguemaster.co.uk/cgi-county/icounty.exe/showteamfixtures?divisionid=1&teamid=38',
  wwsc2ndTeam:
    'https://warwickshiresquash.leaguemaster.co.uk/cgi-county/icounty.exe/showteamfixtures?divisionid=4&teamid=39',
  warwickshireLeague: 'https://www.warwickshiresquash.org/',
  coach: {
    name: 'Ali Jafari',
    email: 'ali@westwarwicks.co.uk',
    image:
      'https://images.ctfassets.net/ffrbyg3cfykl/4S37t7PSlIdX2gJX4orkax/19f4d913b1ea7db94470db02acf5bcb8/squash-ali-jafari.webp',
    telephone: '07307 247584',
    social: [{ twitter: '' }, { facebook: '' }],
  },
  newToSquash:
    "Squash is a fast-paced racquet sport that requires agility, strategy, and precision. Played in an enclosed court, the objective is to outmanoeuvre your opponent by hitting a small rubber ball against the front wall using a racquet. Squash provides a great cardiovascular workout while simultaneously enhancing hand-eye coordination, footwork, and mental sharpness. Whether you're a beginner or an experienced player, squash offers a thrilling and challenging experience that can be enjoyed at any age or skill level.",
  juniorProgrammes: [
    // {
    //   name: 'roa-elite-junior-camp',
    //   description: 'ROA Elite Junior Camp ...',
    //   prices: [
    //     {
    //       price: 35,
    //       unit: 'session',
    //       stripe: { price: 'price_1NYjd3F12kDJKsucPBQ7jhd0' },
    //     },
    //   ],
    // },
    {
      name: 'roa-junior-squash-summer-camps',
      description: 'ROA Junior Squash Summer Camps ...',
      prices: [
        {
          price: 35,
          unit: 'day',
          members: true,
          stripe: { price: 'price_1NYjd2F12kDJKsuclEYavJmM' },
        },
        {
          price: 60,
          unit: '2 days',
          members: true,
          stripe: { price: 'price_1NYjd2F12kDJKsucXK1QO0G5' },
        },
        {
          price: 170,
          unit: '6 days',
          members: true,
          stripe: { price: 'price_1NYjd1F12kDJKsucVMN4Bwzb' },
        },
        {
          price: 40,
          unit: 'day',
          members: false,
          stripe: { price: 'price_1NYjd2F12kDJKsucWFR4NF1q' },
        },
        {
          price: 70,
          unit: '2 days',
          members: false,
          stripe: { price: 'price_1NYjd1F12kDJKsucvnVdXzNL' },
        },
        {
          price: 200,
          unit: '6 days',
          members: false,
          stripe: { price: 'price_1NYjd1F12kDJKsucNTS2lk44' },
        },
      ],
      maxPeople: 100,
    },
    {
      name: 'roa-junior-squash-programme',
      description:
        "The Rob Owen Junior Programme offers a comprehensive pathway catering to individuals at all skill levels, from beginner to professional. Our programme provides weekly sessions on Tuesday's and Saturday's, ensuring a structured approach tailored to specific standards and accommodating youngsters from 6-18 years old. Led by our proficient coaches, these sessions are thoughtfully designed to be engaging and address the unique requirements of each participant. Our goal is to cultivate a thriving squash community that welcomes children from every background, promoting inclusivity and accessibility for all.",
      prices: [
        {
          price: 6.5,
          unit: 'session',
          members: true,
          stripe: { price: 'price_1NYjd5F12kDJKsucxFY6mV7s' },
        },
        {
          price: 47,
          unit: '8 weeks',
          members: true,
          stripe: { price: 'price_1NYjd5F12kDJKsucYUwdmFar', quantity: 1 },
        },
        {
          price: 8,
          unit: 'session',
          members: false,
          stripe: { price: 'price_1NYjd6F12kDJKsucaV0QPD4C' },
        },
        {
          price: 60,
          unit: '8 weeks',
          members: false,
          stripe: { price: 'price_1NYjd5F12kDJKsuc0rGq943F', quantity: 1 },
        },
      ],
    },
    {
      name: 'roa-individual-coaching',
      description: 'Junior Individual Coaching ...',
      prices: [
        {
          price: 20,
          unit: 'session',
          members: true,
          stripe: { price: 'price_1NYjd8F12kDJKsucj4zkJmKt' },
        },
        {
          price: 25,
          unit: 'session',
          members: false,
          stripe: { price: 'price_1NYjd7F12kDJKsucKJ2oW9Mn' },
        },
      ],
    },
  ],
  adultProgrammes: [
    {
      name: 'roa-skills-and-drills',
      description: 'Skills and Drills ...',
      prices: [
        {
          price: 10,
          unit: 'session',
          member: true,
          stripe: { price: 'price_1NYjd4F12kDJKsuc83EhBF2F' },
        },
        {
          price: 15,
          unit: 'session',
          members: false,
          stripe: { price: 'price_1NYjd4F12kDJKsucPsOSiQsu' },
        },
      ],
    },
    {
      name: 'roa-club-night',
      description: 'Club Night ...',
      prices: [],
    },
    {
      name: 'roa-individual-adult-coaching',
      description:
        'Adult Coaching. Our esteemed adult squash programme provides a range of offerings including regular group sessions, league and team matches, club nights, and individual coaching. Whether you seek the top tier instruction from our accomplished player-coaches or simply desire a casual game with friends while expanding your social circle, our programme caters to all preferences. With a focus delivering high-quality coaching and fostering a welcoming environment, we strive to fulfil the diverse needs of squash enthusiast at every level of expertise.',
      prices: [
        {
          price: 25,
          unit: 'session',
          members: true,
          stripe: { price: 'price_1NYjd7F12kDJKsucmCEvOzcP' },
        },
        {
          price: 30,
          unit: 'session',
          members: false,
          stripe: { price: 'price_1NYjd6F12kDJKsucA5jxu9pm' },
        },
      ],
    },
  ],
  history: [
    "Renowned as the epitome of squash excellence, Jonah Barrington stands unrivalled in his impact on the sport. From his dominant reign during the 1960s to 1970s, securing six British Open titles and establishing himself as the preeminent British squash player of all time. Barrington's journey is nothing short of extraordinary. Born in Cornwall in 1941 to a working-class family, Barrington's ascent in squash sprouted from modest beginnings. His path to sporting greatness was far from predetermined, as he initially deviated from societal expectations, dropping out of university, and indulging in a fondness for Guinness. However, a fortuitous encounter with Nasrullah Khan, the uncle of the legendary Jahangir Khan, proved transformative for Barrington's trajectory.",
    'Khan imparted invaluable lessons, emphasizing the significance of solo practice, Barrington diligently executed 100 straight drives down the forehand wall and another 100 down the backhand every day. The dedication and commitment to being physically fitter, mentally tougher, and relentlessly wearing down his opponents on court resulted in the rest being history. His legendary climb to dominating world squash, fundamentally altered the landscape of professional squash, leaving an indelible mark on the sport.',
    "It was at West Warwicks where Barrington established his training base later in his career, honing his skills on his beloved court 1. Witnessing Barrington's training sessions at West Warwicks was a young, gifted left-hander named Rob Owen, who would often skip college to glimpse the mesmerizing skill, unwavering passion, and unyielding determination on display. Recognizing potential with the emerging talent, Barrington took Owen under his wing, forming a life long friendship between the two.",
    "This relationship forever changed the history and future of West Warwicks. This thriving squash club became a vibrant hub where court bookings were treasured. Members were privileged to witness one of the sport's greatest luminaries nurturing the talents of one of the most promising young players in the world. For Owen, however, success was measured by more than his own achievements, despite attaining a top-20 world ranking and undeniable lasting presence around squash in England. Driven by a desire to contribute to the game and give back to local players, Owen felt compelled to extend his impact beyond personal accolades. In the face of squash's dwindling popularity and waning fortunes in England over the years, Owen emerged as a vital figure, propelling English, and now international players to surpass their potential.",
    "His transformative work commenced with Chris Ryder, who, under Owen's guidance, developed refined skills and techniques, ultimately reaching a world ranking of 33. Word of Owen's exceptional coaching spread, culminating in the establishment of the Rob Owen academy. In the last decade, Owen has coached some of the most improved players in the world, and plenty more. Nowadays, Rob coaches 3 of the world's top 10 players in Paul Coll, Sarah Jane Perry and Nele Gilis. Also working under robs coaching is rising stars Katie Maliff and Jonah Bryant who both won the u19 European individual championships, as well as English junior champions u13’s and u15’s Smiley and Ali Khalil.",
    "It was impossible for Owen's success to go unnoticed, as squash enthusiast were fascinated behind the secrets of the rapid improvement of players under his tutorage. His unmatched commitment and dedication to his players coupled with his skill and in-depth knowledge of the game resulted in his players benefiting substantially under his tutorage.",
    'A few worthy mentions consist of Joel Makin, who went from outside the world top 100 to top 10 in the world . Jamie Haycocks who reached top 50 in the world, Nathan Lake, Dimitri Steinman, George Parker, Jasmine Hutton, Charlie Lee.',
  ],
  team: [
    {
      name: 'Rob Owen',
      role: 'Programme Leader',
      bio: "Widely considered by experts as one of the best coaches in the world, Rob Owen's squash coaching success in the last decade has been one of the biggest talking points in the squash world. Owen coaches 3 of the worlds top 10 players, as well as many other world ranked players and some of the highest-ranking juniors in the world. Under his tutorage, players are known to improve rapidly and maximise their potential. Rob is renowned for his exceptional guidance and unwavering commitment to players, providing technical, movement and tactical expertise alongside a deep understanding of individual needs. Rob Owen oversees and reviews of all our programmes, as well as continuing to inspire and guide the next generation of squash players towards their potential.",
      image: 'rob-owen-1',
    },
    {
      name: 'Sam Osborne-Wylde',
      role: 'Head Coach',
      bio: 'Sam was a young squash protege and reached the British open final at 12 years old. He has a wealth of experience with over 50 England junior caps to his name. He has an unwavering enthusiasm to impart knowledge for coaching as well as to pass on his insights that he has gained in the last few years from working alongside and with Rob. He is as passionate about coaching at West Warwicks as he is about playing.',
      image: 'sam-osborne-wylde',
    },
    {
      name: 'Jonah Bryant',
      role: 'Head Coach',
      bio: 'Jonah Bryant has a history of squash in his bloodline. His father was a professional player who was taught by the great Jonah Barrington, hence the name Jonah. He was a British junior open u13 winner and reached the final of  the u19 this year with another year left to try and win this prestigious trophy. He was ranked the number one junior in the world in July 2023 and turned professional the same month. He is based in Birmingham and along with Katie Malliff is coached by Rob Owen. Without doubt he is a name to look out for in 2023 and already has a win over world number 35, Lucas Serme. An attacking player with a high degree of sporting intellect he understands the intricacies and subtleties of squash needed to play at the highest level. He has won over 10 British junior titles as well as numerous other tournaments including the European u19 junior championships without dropping a game. Jonah has a unique insight into the sport and has a real ability to coach simply and effectively which he is looking forward to in partnership with Sam Osborne-Wylde. Both Sam and Jonah are already producing rapid improvements working with juniors and adults who have been set in their ways.',
      image: 'jonah-bryant-1',
    },
    {
      name: 'Rosie Kirsch',
      role: 'Assistant Coach',
      bio: 'Rosie is an integral part of the coaching team at West Warwicks and has been working with the junior players for many years. She has helped to create a friendly and  welcoming environment for all. She has played at a high level herself winning numerous county championships as well as being nationally ranked for many years. Her commitment to the club and coaching has been second to none.',
      image: 'rosie-kirsch',
    },
    {
      name: 'James Averill',
      role: 'Assistant Coach',
      bio: 'James Averill	James is the newest recruit to the coaching team and a great example of the improvements possible. He started off as a player in the academy and within the space of 9 months went from being 10 in England to finishing third in the England national championships. James again has plenty of coaching experience and is excited to pass on what he has learned over the last 12 months. Rosie and James are both very dedicated and committed and their engaging and enjoyable sessions make them the perfect fit to coach at West Warwicks with Sam and Jonah.',
      image: 'james-averill',
    },
  ],
  alumni: [
    {
      name: 'Paul Coll',
      bio: "From his Hometown Greymouth to dominating world squash, New Zealander Paul Coll's historic rise to the top of the rankings is one of the most inspiring stories in squash. Since joining Rob Owen at West Warwicks in 2017, Paul climbed from 8th in the world to number 1 in March 2022. Later that year he achieved the most prestigious title in squash for the second time winning the British Open without dropping a game and finished his illustrious season with a commonwealth games gold medal in Birmingham.",
      image: 'paul-coll',
      current: 'true',
    },
    {
      name: 'Sarah-Jane Perry',
      bio: 'Sarah-Jane Perry is a prominent figure in the world of squash, known for her outstanding achievements and deep involvement in the sport.  Born and bred in Birmingham, she has represented her country on various international stages and has notably clinched several titles, including the prestigious British National Champion in 2015 and 2018 and earning silver and bronze medals at the commonwealth games. Perry’s consistency at the top of the game have resulted in her spending the last 10 years in the top 20 of the world rankings. Her contributions extend beyond her personal success, as she actively engages with the Birmingham squash community. Perry often conducts coaching clinics and works to inspire and mentor aspiring squash players in the area. Her passion for the sport and her commitment to promoting the squash scene in Birmingham make Sarah jane Perry a true icon within the squash community.',
      image: 'sarah-jane-perry',
      current: 'true',
    },
    {
      name: 'Nele Gilis',
      bio: "Nele Gilis has emerged as a rising star in the realm of squash working alongside Rob Owen with a notable list of achievements and a recent ascent to the top 6 in the world rankings. Hailing from Belgium, Gilis's work ethic, discipline and tenacity on the biggest stage has put her amongst the best players in the world. With the guidance of Rob Owen, the significant technical and tactical changes have proved evidently beneficial in her pursuit up the world rankings. She continues to make waves in the squash world, fans and enthusiasts eagerly anticipate the exciting path that lies ahead for Gilis.",
      image: 'nele-gilis',
      current: true,
    },
    {
      name: 'Katie Malliff',
      bio: 'Katie Malliff is possibly the most promising of a strong group of young English woman climbing up the PSA rankings. Last year she won the European Junior Championships without dropping a game and despite injury problems throughout much of last year she managed to beat 3 players in the top 25 of the world rankings. As of August 2023 she is ranked 41 in the world and reached the last 16 of the Hong Kong Open which is a prestigious platinum event. An exciting and attacking player who has no obvious weaknesses she has the ability to become a top 10 player and hopefully become one of the great English players.',
      image: 'katie-malliff',
      current: true,
    },
    {
      name: 'Jasmine Hutton',
      bio: 'Jasmine Hutton...',
      image: 'jasmine-hutton',
      current: true,
    },
    {
      name: 'Jonah Bryant',
      bio: 'Jonah Bryant has a history of squash in his bloodline. His father was a professional player who was taught by the great Jonah Barrington, hence the name Jonah. He was a British junior open u13 winner and reached the final of  the u19 this year with another year left to try and win this prestigious trophy. He was ranked the number one junior in the world in July 2023 and turned professional the same month. He is based in Birmingham and along with Katie Malliff is coached by Rob Owen. Without doubt he is a name to look out for in 2023 and already has a win over world number 35, Lucas Serme. An attacking player with a high degree of sporting intellect he understands the intricacies and subtleties of squash needed to play at the highest level.',
      image: 'jonah-bryant-2',
      current: true,
    },
    {
      name: 'Sam Osborne-Wylde',
      bio: 'Sam Osborne-Wylde...',
      image: 'sam-osborne-wylde-2',
      current: true,
    },
    {
      name: 'Hassan Khalil',
      bio: 'Hassan Khalil...',
      image: 'hassan-khalil',
      current: true,
    },
    {
      name: 'Ismail Khalil',
      bio: 'Ismail Khalil...',
      image: 'ismail-khalil',
      current: true,
    },
    {
      name: 'Ali Khalil',
      bio: 'Ali Khalil...',
      image: 'ali-khalil',
      current: true,
    },
    {
      name: 'Charlie Lee',
      bio: 'Charlie Lee...',
      image: 'charlie-lee',
      current: true,
    },
    {
      name: 'Dimitri Steinmann',
      bio: 'Dimitri Steinmann...',
      image: 'dimitri-steinmann',
      current: false,
    },
    {
      name: 'Lewis Anderson',
      bio: 'Lewis Anderson...',
      image: 'lewis-anderson',
      current: false,
    },
    {
      name: 'Joshua Masters',
      bio: 'Joshua Masters...',
      image: 'joshua-masters',
      current: false,
    },
    {
      name: 'Joel Makin',
      bio: 'Joel Makin...',
      image: 'joel-makin',
      current: false,
    },
    {
      name: 'George Parker',
      bio: 'George Parker...',
      image: 'george-parker',
      current: false,
    },
    {
      name: 'Nathan Lake',
      bio: 'Nathan Lake...',
      image: 'nathan-lake',
      current: false,
    },
    {
      name: 'Jan Van Den Herrewegen',
      bio: 'Jan Van Den Herrewegen...',
      image: 'jan-van-den-herrewegen',
      current: false,
    },
    {
      name: 'Jaymie Haycocks',
      bio: 'Jaymie Haycocks...',
      image: 'jaymie-haycocks',
      current: false,
    },
    {
      name: 'Chris Ryder',
      bio: 'Chris Ryder...',
      image: 'chris-ryder',
      current: false,
    },
  ],
  seeTheProfessionals:
    'Rob Owen is often on court together with his current crop of professionals down at West Warwicks where members walking by are treated to glimpses of what it takes to be one of the best players (and coaches) in the world.',
  roaImages: ['squash-roa-2', 'squash-roa-1', 'squash-roa-3'],
  englandSquashMedia: [
    'squash-everyone',
    'squash-fun',
    'squash-social',
    'squash-calories',
    'squash-fit',
    'squash-happy',
    'squash-quick-workout',
    'squash-all-weather',
    'squash-live-longer',
    'squash-affordable',
  ],
  gallery: [
    {
      image:
        'https://images.ctfassets.net/ffrbyg3cfykl/Gmk5IccKogT02F3CbAq3N/aa192c3678523e42f40ee92f5a1d3e9d/squash-kids-session.webp',
    },
    {
      image:
        'https://images.ctfassets.net/ffrbyg3cfykl/4btsLO8eJ0R4EIQHmlQkQo/25191cae0a9108b73f36efb379c3fc58/squash-training-session.webp',
    },
    {
      image:
        'https://images.ctfassets.net/ffrbyg3cfykl/1wUO5dDkP7DmmaNNPrhaw0/5a1b30b96027e21ed10fae1aa29467a7/squash-team-players.webp',
    },
    {
      image:
        'https://images.ctfassets.net/ffrbyg3cfykl/4NfcSL3rJ2Sl1zMJj5V1D1/dc66bdd3d5421ac69eeb28223c8e3bb7/squash-professional-coaches.webp',
    },
    {
      image:
        'https://images.ctfassets.net/ffrbyg3cfykl/101GrhnwfX43JssQGIP5pf/41a029988374a74e3b32ef227e9abc2f/squash-junior-teams.webp',
    },
    {
      image:
        'https://images.ctfassets.net/ffrbyg3cfykl/5pqLfPkDVRaDWEpjo6xfoE/68272d33694354c7a382861434d889dc/squash-professionals.webp',
    },
  ],
  affiliates: [
    {
      name: 'squash england',
      website: 'https://www.englandsquash.com/',
      logo: 'https://images.ctfassets.net/ffrbyg3cfykl/1hr3yaS8fPeisPsE1Odj8K/f513f665f90d54da9bfd8ed8b2a4cf52/squash-england.webp',
    },
    {
      name: 'psa world tour',
      website: 'https://psaworldtour.com/',
      logo: 'https://images.ctfassets.net/ffrbyg3cfykl/08UEDp2Sa6Asdex2d8UaX/08b9c01ad7530f968277e12b975d0ec4/psa-world-tour.webp',
    },
    {
      name: 'psa squash tv',
      website: 'https://psaworldtour.com/tv',
      logo: 'https://images.ctfassets.net/ffrbyg3cfykl/64REiY7RPBtNvEqk3sR4zj/4be764294c269494bd3daa247e7e09f8/squashtv.webp',
      darkBackground: '#252B33',
    },
    {
      name: 'squashskills',
      website: 'https://squashskills.com/',
      logo: 'https://images.ctfassets.net/ffrbyg3cfykl/2KK585g5EJxOhCbp7EcOap/9d71ca16f3977a7bc17fe6a3eee58437/squashskills-logo.svg',
      darkBackground: '#0B0A11',
    },
    {
      name: 'warwickshire squash',
      website: 'https://www.warwickshiresquash.org/',
      logo: 'https://images.ctfassets.net/ffrbyg3cfykl/3BFDKfF7Df3gp3VzSGgJTK/eb472fd901f3a6d0dd2249fef6db2b6a/warwickshire-squash.webp',
    },
  ],
  social: [
    {
      youtube: {
        link: 'https://www.youtube.com/psasquashtv',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/5QEt2Qdrye55JFcHTvKO9d/ed1b8077438f3918315fe746919bbb1f/youtube.svg',
      },
    },
    {
      facebook: {
        link: 'https://www.facebook.com/PSAworldtour',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/5Q3RtYKw5wYexLwepWR7Qz/e0a369980699cd7e1f6eaa9e518eff6f/facebook.svg',
      },
    },
  ],
  charities: [
    {
      name: 'campaign against living miserably',
      website: 'https://www.thecalmzone.net/',
      logo: 'https://images.ctfassets.net/ffrbyg3cfykl/3Sjti8aBXsYleYt9A921kJ/da6963f0ab6be5cc84038e30c7138bc8/calm-logo.svg',
    },
  ],
}
