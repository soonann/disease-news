export const dynamic = 'force-dynamic';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

interface Source {
  id: string;
  name: string;
}

interface Article {
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const getWeekFromNow = (val: Date): boolean => {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  
  return from.getTime() < val.getTime() && to.getTime() > val.getTime();
};

// Function to store articles in database
async function storeArticles(articles: Article[]) {
  try {
    // First, create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS articles (
        url TEXT PRIMARY KEY,
        source_id TEXT REFERENCES sources(id),
        author TEXT,
        title TEXT NOT NULL,
        description TEXT,
        url_to_image TEXT,
        published_at TIMESTAMP WITH TIME ZONE,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Process each article
    for (const article of articles) {
      // First, upsert the source
      await sql`
        INSERT INTO sources (id, name)
        VALUES (${article.source.id || 'unknown'}, ${article.source.name})
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
      `;

      // Then, upsert the article
      await sql`
        INSERT INTO articles (
          url,
          source_id,
          author,
          title,
          description,
          url_to_image,
          published_at,
          content
        ) VALUES (
          ${article.url},
          ${article.source.id || 'unknown'},
          ${article.author},
          ${article.title},
          ${article.description},
          ${article.urlToImage},
          ${article.publishedAt.getUTCDate()},
          ${article.content}
        )
        ON CONFLICT (url) DO UPDATE SET
          author = EXCLUDED.author,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          url_to_image = EXCLUDED.url_to_image,
          published_at = EXCLUDED.published_at,
          content = EXCLUDED.content;
      `;
    }

    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}


const getAllNews = async (page: number): Promise<NewsResponse> => {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const KEYWORD = "measles";
  const url = new URL("https://newsapi.org/v2/everything");
  
  // Add query parameters
  const params = new URLSearchParams({
    apiKey: NEWS_API_KEY || '',
    q: KEYWORD,
    page: page.toString()
  });
  url.search = params.toString();

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert string dates to Date objects
    const processedData = {
      ...data,
      articles: data.articles.map((article: any) => ({
        ...article,
        publishedAt: new Date(article.publishedAt)
      }))
    };

    return processedData;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Get the request's params
    const page = parseInt(request.query.page as string) || 1;

    const news = await getAllNews(page);
    storeArticles(news.articles)

    // Send response
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(news);
  } catch (error) {
    console.error('Handler error:', error);
    response.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
