const { Client } = require('@notionhq/client');
const { v4: uuidv4 } = require('uuid');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

exports.handler = async (event, context) => {
  // Only allow GET, POST, PUT, DELETE methods
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Get all posts
        const response = await notion.databases.query({
          database_id: databaseId,
        });
        
        const posts = response.results.map(page => ({
          id: page.id,
          title: page.properties.title.title[0].text.content,
          slug: page.properties.slug.rich_text[0].text.content,
          content: page.properties.content.rich_text[0].text.content,
          excerpt: page.properties.excerpt.rich_text[0].text.content,
          author: page.properties.author.rich_text[0].text.content,
          date: page.properties.date.date.start,
          category: page.properties.category.select.name,
          tags: page.properties.tags.multi_select.map(tag => tag.name),
          readingTime: page.properties.readingTime.number,
          featured: page.properties.featured.checkbox,
          published: page.properties.published.checkbox,
          publishedAt: page.properties.publishedAt.date?.start,
          updatedAt: page.properties.updatedAt.date?.start,
        }));

        return {
          statusCode: 200,
          body: JSON.stringify(posts),
        };

      case 'POST':
        // Create new post
        const newPost = JSON.parse(event.body);
        const page = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: newPost.title,
                  },
                },
              ],
            },
            slug: {
              rich_text: [
                {
                  text: {
                    content: newPost.slug,
                  },
                },
              ],
            },
            content: {
              rich_text: [
                {
                  text: {
                    content: newPost.content,
                  },
                },
              ],
            },
            excerpt: {
              rich_text: [
                {
                  text: {
                    content: newPost.excerpt,
                  },
                },
              ],
            },
            author: {
              rich_text: [
                {
                  text: {
                    content: newPost.author,
                  },
                },
              ],
            },
            date: {
              date: {
                start: newPost.date,
              },
            },
            category: {
              select: {
                name: newPost.category,
              },
            },
            tags: {
              multi_select: newPost.tags.map(tag => ({ name: tag })),
            },
            readingTime: {
              number: newPost.readingTime,
            },
            featured: {
              checkbox: newPost.featured,
            },
            published: {
              checkbox: newPost.published,
            },
            publishedAt: {
              date: newPost.published ? { start: new Date().toISOString() } : null,
            },
            updatedAt: {
              date: {
                start: new Date().toISOString(),
              },
            },
          },
        });

        return {
          statusCode: 201,
          body: JSON.stringify({ id: page.id }),
        };

      case 'PUT':
        // Update post
        const updatedPost = JSON.parse(event.body);
        await notion.pages.update({
          page_id: updatedPost.id,
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: updatedPost.title,
                  },
                },
              ],
            },
            slug: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.slug,
                  },
                },
              ],
            },
            content: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.content,
                  },
                },
              ],
            },
            excerpt: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.excerpt,
                  },
                },
              ],
            },
            author: {
              rich_text: [
                {
                  text: {
                    content: updatedPost.author,
                  },
                },
              ],
            },
            date: {
              date: {
                start: updatedPost.date,
              },
            },
            category: {
              select: {
                name: updatedPost.category,
              },
            },
            tags: {
              multi_select: updatedPost.tags.map(tag => ({ name: tag })),
            },
            readingTime: {
              number: updatedPost.readingTime,
            },
            featured: {
              checkbox: updatedPost.featured,
            },
            published: {
              checkbox: updatedPost.published,
            },
            publishedAt: {
              date: updatedPost.published ? { start: new Date().toISOString() } : null,
            },
            updatedAt: {
              date: {
                start: new Date().toISOString(),
              },
            },
          },
        });

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true }),
        };

      case 'DELETE':
        // Delete post
        const { id } = JSON.parse(event.body);
        await notion.pages.update({
          page_id: id,
          archived: true,
        });

        return {
          statusCode: 200,
          body: JSON.stringify({ success: true }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 