import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
require('dotenv').config()
import heroStyles from '../components/hero.module.css'
const contentful = require('contentful-management')
const axios = require('axios');

let config = {
  method: 'get',
  url: 'http://data.nba.net/prod/v1/2020/players/201142_profile.json',
  headers: { }
};
const playerStats = axios(config).then((response) => {
  return(response.data.league.standard.stats.latest);
}).catch((error) => {
  console.log(error);
});

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
})

// Create content type
client.getSpace(process.env.CONTENTFUL_SPACE_ID)
.then((space) => space.getEnvironment('master'))
.then((environment) => environment.createContentTypeWithId('playerProfile', {
    name: "Player Profile",
    description: "",
    displayField: null,
    fields: [
      {
        id: "seasonYear",
        name: "Saison ",
        type: "Date",
        localized: true,
      },
      {
        id: "ppg",
        name: "Punkte pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "rpg",
        name: "Rebounds pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "apg",
        name: "Assists pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "mpg",
        name: "Minuten pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "topg",
        name: "Turnover pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "spg",
        name: "Steals pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "bpg",
        name: "Blocks pro Spiel",
        type: "Number",
        localized: false,
      },
      {
        id: "tpp",
        name: "Dreierquote",
        type: "Number",
        localized: false,
      },
      {
        id: "ftp",
        name: "Freiwurfquote",
        type: "Number",
        localized: false,
      },
      {
        id: "fgp",
        name: "Korbquote",
        type: "Number",
        localized: false,
      },
      {
        id: "assists",
        name: "Assists Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "blocks",
        name: "Blocks Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "steals",
        name: "Steals Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "turnovers",
        name: "Turnover Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "offReb",
        name: "Offensive Rebounds Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "defReb",
        name: "Defensive Rebounds Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "totReb",
        name: "Rebounds Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "fgm",
        name: "Erfolgreiche Körbe",
        type: "Integer",
        localized: false,
      },
      {
        id: "fga",
        name: "Korbversuche Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "tpm",
        name: "Erfolgreiche Dreier Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "tpa",
        name: "Dreierversuche Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "ftm",
        name: "Erfolgreiche Freiwürfe Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "fta",
        name: "Freiwurfversuche Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "pFouls",
        name: "persönliche Fouls Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "points",
        name: "Punkte Gesamt",
        type: "Integer",
        localized: false,
      },
      {
        id: "gamesPlayed",
        name: "Spiele gespielt",
        type: "Integer",
        localized: false,
      },
      {
        id: "gamesStarted",
        name: "Spiele Gesamt als Starter",
        type: "Integer",
        localized: false,
      },
      {
        id: "plusMinus",
        name: "Plus-Minus Wertung",
        type: "Integer",
        localized: false,
      },
      {
        id: "min",
        name: "gespielte Minuten Gesamt",
        type: "Integer",
        localized: false,
      }
    ]
}))
.then((contentType) => console.log(contentType))
.catch(console.error)

// Update content type
client.getSpace(process.env.CONTENTFUL_SPACE_ID)
.then((space) => space.getEnvironment('master'))
.then((environment) => environment.getContentType('playerProfile'))
.then((contentType) => {
  contentType.name = 'New content type name'
  return contentType.update()
})
.then((contentType) => console.log(`Content type ${contentType.sys.id} renamed.`))
.catch(console.error)


class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <Helmet title={`${post.title} | ${siteTitle}`} />
          <div className={heroStyles.hero}>
            <Img
              className={heroStyles.heroImage}
              alt={post.title}
              fluid={post.heroImage.fluid}
            />
          </div>
          <div className="wrapper">
            <h1 className="section-headline">{post.title}</h1>
            <p
              style={{
                display: 'block',
              }}
            >
              {post.publishDate}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: post.body.childMarkdownRemark.html,
              }}
            />
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate(formatString: "MMMM Do, YYYY")
      heroImage {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
