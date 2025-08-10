import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const channelUrl = 'https://www.youtube.com/@lattergloryministries3882';
    
    // Fetch the channel page
    const response = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch channel: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract video information using regex patterns
    // Look for the latest video in the channel's video grid
    const videoPattern = /"videoId":"([^"]+)"/g;
    // const titlePattern = /"title":"([^"]+)"/g;
    // const thumbnailPattern = /"thumbnail":{"thumbnails":\[{"url":"([^"]+)"/g;
    // const viewCountPattern = /"viewCountText":{"simpleText":"([^"]+)"/g;
    // const publishedTimePattern = /"publishedTimeText":{"simpleText":"([^"]+)"/g;
    
    // Get the first (latest) video ID
    const videoMatch = videoPattern.exec(html);
    if (!videoMatch) {
      throw new Error('No video found');
    }
    
    const videoId = videoMatch[1];
    
    // Get video details from the video page
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const videoResponse = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.status}`);
    }
    
    const videoHtml = await videoResponse.text();
    
    // Extract video title
    const titleMatch = videoHtml.match(/"title":"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Latest Video';
    
    // Extract video description
    const descPattern = /"description":"([^"]+)"/;
    const descMatch = videoHtml.match(descPattern);
    const description = descMatch ? descMatch[1].substring(0, 150) + '...' : 'Watch our latest video';
    
    // Extract view count
    const viewMatch = videoHtml.match(/"viewCount":"([^"]+)"/);
    const viewCount = viewMatch ? parseInt(viewMatch[1]).toLocaleString() : '0';
    
    // Extract published time
    const timeMatch = videoHtml.match(/"publishedTimeText":{"simpleText":"([^"]+)"/);
    const publishedTime = timeMatch ? timeMatch[1] : 'Recently';
    
    // Create thumbnail URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    console.log(thumbnailUrl);
    
    const videoData = {
      id: videoId,
      title: title,
      description: description,
      thumbnail: thumbnailUrl,
      viewCount: viewCount,
      publishedTime: publishedTime,
      url: videoUrl,
      channelName: 'Latter Glory Ministries',
      channelUrl: channelUrl
    };

    return NextResponse.json(videoData);
    
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    
    // Return fallback data if scraping fails
    return NextResponse.json({
      id: 'fallback',
      title: 'Latest Video from Latter Glory Ministries',
      description: 'Watch our latest sermon, teaching, or ministry update on YouTube.',
      thumbnail: '/images/placeholder.jpg',
      viewCount: '0',
      publishedTime: 'Recently',
      url: 'https://www.youtube.com/@lattergloryministries3882',
      channelName: 'Latter Glory Ministries',
      channelUrl: 'https://www.youtube.com/@lattergloryministries3882'
    });
  }
}
