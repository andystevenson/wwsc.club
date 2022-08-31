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
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/4f6GusQ1NNrh2ObQ93XJpC/fbe5e48083ec2d2f8621dbdc1af7b141/me.webp?w=64&h=64&fit=thumb',
      },
      {
        name: 'Catherine Aucott',
        role: 'Operations Manager',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/26apEtpVY1GPMosUqN2unC/9b455ebb7fdce6db83c3aa304876e588/catherine-aucott.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Sarah Harrison',
        role: 'Customer Services Manager',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/3izoVGMwEGpd5DhcnYJunt/f01e1b2dfbb98030fb9fe64789161149/sarah-harrison.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Leyla Priestly',
        role: 'Bar Manager',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/Z76I1FmxEBxXMwGy9z7kB/f6032a90d9b3a20fcfe398405f77edd1/leyla-priestly.jpg',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Robert Powell',
        role: 'Head Chef',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/4yBPo8SKw6jgi8IAcCb60N/720345f5758fbf58dabdd17e1bb34562/rob-powell.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Sarah Harrison',
      },
      {
        name: 'Terry Powell',
        role: 'Assistant Chef',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/65LCHpjdyTN1hvAYwiVGrv/a65d1611d9a74cdd26e84c0f07fe607e/terry-powell.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Robert Powell',
      },
      {
        name: 'Jack Harrison',
        role: 'Apprentice Chef',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/4oFgM4IOYyVUEvhuAO90tj/e5f4c7b3bcb74682659aa956a359e64b/jack-harrison.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Robert Powell',
      },
      {
        name: 'Larisa Arcip',
        role: 'Head of Fitness',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/6Kpop1r2JvXrGcY6GpC2lH/db113f2fdbb0479dcd65a40198c891d9/larisa-arcip-headshot.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Andy Stevenson',
      },
      {
        name: 'Dan Spiridon',
        role: 'Personal Trainer',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/2R8ayR0i0E72mzksGP933F/a95929d61e07e8b6d9dfe3205f3bc092/dan-spiridon-headshot.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Larisa Arcip',
      },
      {
        name: 'Robert Stretton',
        role: 'Head Groundsman',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/4k2NgzKYXDBmzSvzRiAIri/7d06fbe337e79075a69a4865465b611e/robert-stretton.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Catherine Aucott',
      },
      {
        name: 'Angela Taylor',
        role: 'Sports & Events Administrator',
        image:
          'https://images.ctfassets.net/ffrbyg3cfykl/6dQEUN0sKOxxkdP5KIHAKh/cf5e70e9cdfecd172e521b8d1a053ffc/angela-taylor.webp?w=64&h=64&fit=thumb',
        reportsTo: 'Sarah Harrison',
      },
    ],
  },
}
