// process all the content from CONTENTFUL CMS
const util = require('util')

const createTags = (assets) => {
  const tags = {}
  assets.forEach((asset) => {
    asset.tags.forEach((tag) => {
      if (tag in tags) return tags[tag].push(asset)
      tags[tag] = [asset]
    })
  })
  return tags
}

const createAssets = (assets) => {
  return assets.map((asset) => {
    asset.tags = asset.contentfulMetadata.tags.map((tag) => tag.id)
    asset.id = asset.sys.id
    delete asset.contentfulMetadata
    delete asset.sys
    return asset
  })
}

const createIcons = (tags) => {
  const icons = {}
  for (const icon of tags.icon) {
    const { title } = icon
    icons[title] = icon
  }

  return icons
}

const asset = {
  name: 'asset',
  transform: (data) => {
    let { items } = data?.assetCollection
    const assets = createAssets(items)
    const tags = createTags(assets)
    const icons = createIcons(tags)

    const content = { assets, tags, icons }
    return content
  },
  query: `
{
  assetCollection {
    items {
      title
      contentType
      description
      url
      size,
      width
      height
      contentfulMetadata {
        tags {
          id
        }
      }
      sys {
        id
      }
    }
  }
}`,
}

const createTaggedLinks = (links) => {
  const tags = {}

  for (const link of links) {
    for (const tag of link.image.contentfulMetadata.tags) {
      const { name } = tag
      name in tags ? tags[name].push(link) : (tags[name] = [link])
    }
  }

  return tags
}

const createNamedLink = (links) => {
  const named = {}

  for (const link of links) {
    named[link.name] = link
  }

  return named
}
const markExternalLinks = (links) => {
  links.forEach((link) => {
    link.href.includes('https:')
      ? (link.external = true)
      : (link.external = false)
  })
}

// TODO: should check for name clashes!!!!
const links = {
  name: 'links',
  transform: (data) => {
    let { items: all } = data?.linksCollection
    markExternalLinks(all)
    const content = {
      links: { all, ...createTaggedLinks(all), ...createNamedLink(all) },
    }
    // console.log(util.inspect(content, undefined, null, true))

    return content
  },
  query: `
            {
              linksCollection {
                items {
                  name
                  description
                  href
                  image {
                    title
                    description
                    contentType
                    fileName
                    size
                    url
                    width
                    height
                    contentfulMetadata {
                      tags {
                        name
                      }
                    }
                  }
                }
              }
            }
  `,
}
const collections = [asset, links]

module.exports = async () => {
  const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

  const contentful = {
    api: process.env.CONTENTFUL_API,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    space: process.env.CONTENTFUL_SPACE,
    token: {
      management: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
      delivery: process.env.CONTENTFUL_DELIVERY_TOKEN,
      preview: process.env.CONTENTFUL_PREVIEW_TOKEN,
    },
  }

  let cms = {}
  for (const collection of collections) {
    const { name, query, transform } = collection
    console.log(`processing ${name} collection`)
    const response = await fetch(contentful.api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${contentful.token.delivery}`,
      },
      body: JSON.stringify({ query }),
    })
    const json = await response.json()
    const content = transform(json.data)
    cms = { ...cms, ...content }
  }

  // console.log(util.inspect(cms, undefined, null, true))
  return cms
}
