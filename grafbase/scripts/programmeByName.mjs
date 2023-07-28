import graphql from './graphql.mjs'

export const programmeByName = async (programmeName) => {
  const query = `query FindSessionsByName {
                  programmeSearch(first: 1, filter: {name: {eq: "${programmeName}"}}) {
                    edges {
                      node {
                        id
                        name
                        start
                        end
                        maxPerSession
                        open
                        launched
                        sessions(first: 100) {
                          edges {
                            node {
                              id
                              date
                            }
                          }
                        }
                        dates(first: 100) {
                          edges {
                            node {
                              date
                              start
                              end
                              repeatable
                            }
                          }
                        }
                      }
                    }
                  }
                }`
  const response = await graphql(query)
  // log(inspect(response, { colors: true, depth: null }))
  const { id, name, start, end, maxPerSession, open, launched, sessions } =
    response.data.programmeSearch.edges[0].node
  const programme = {
    id,
    name,
    start,
    end,
    maxPerSession,
    open,
    launched,
    sessions,
  }

  // transform the sessions to something more usable
  programme.sessions = programme.sessions.edges.map((object) => object.node)
  // log(inspect(programme, { colors: true, depth: null }))
  return programme
}

// await programmeByName('roa-club-night')
