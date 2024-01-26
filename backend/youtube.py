import csv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from api_keys import ApiKeys

class YouTubeScraper:
    def __init__(self, api_key):
        self.api_key = api_key
        self.youtube = build("youtube", "v3", developerKey=self.api_key)
        self.total_videos_fetched = 0
        self.total_views = 0
        self.comments_count = 0
        self.total_comments_scraped = []

    def get_comments(self, video_id, max_results=100):
        try:
            comments_response = self.youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                textFormat="plainText",
                maxResults=max(100, max_results),
            ).execute()

            comments = []
            for comment in comments_response["items"]:
                snippet = comment["snippet"]["topLevelComment"]["snippet"]
                comment_text = snippet["textDisplay"]
                comment_time = snippet["publishedAt"]
                reply_count = comment["snippet"]["totalReplyCount"]
                like_count = snippet["likeCount"]
                comments.append({
                    "text": comment_text,
                    "timestamp": comment_time,
                    "reply_count": reply_count,
                    "like_count": like_count
                })
        except HttpError as e:
            if "commentsDisabled" in str(e):
                print(f"Comments are disabled for video: {video_id}")
                comments = []
            else:
                raise

        return comments[:max_results]

    def search_videos(self, keyword, max_results=100):
        search_response = self.youtube.search().list(
            q=keyword,
            part="id",
            type="video",
            maxResults=max_results
        ).execute()

        video_ids = [item["id"]["videoId"] for item in search_response.get("items", [])]

        return video_ids

    def scrape_comments_by_keyword(self, keyword, max_comments=1000):
        video_ids = self.search_videos(keyword)
        self.total_videos_fetched = 0
        self.comments_count = 0
        final_comments = []
        timestamps = []
        replycount = []
        likecount = []


        for video_id in video_ids:
            self.total_videos_fetched += 1
            comments = self.get_comments(video_id, max_results=max_comments)

            for comment in comments:
                self.comments_count += 1
                final_comments.append( comment["text"])
                timestamps.append(comment["timestamp"])
                replycount.append(comment["reply_count"])
                likecount.append(comment["like_count"])

            if (self.comments_count >= max_comments):
                break;
                    
        # Calculate total views
        video_response = self.youtube.videos().list(
            part="statistics",
            id=",".join(video_ids)
        ).execute()

        for video in video_response.get("items", []):
            self.total_views += int(video["statistics"]["viewCount"])

        return self.total_videos_fetched, self.total_views, self.comments_count , final_comments , timestamps , replycount , likecount
    
# # Usage in another file
def main():
    api_key = ApiKeys.YOUTUBE_API_KEY  # Retrieve the API key from api_keys.py

    keyword = "virat kohli"
#     output_csv_file = keyword + "_comments.csv"

    scraper = YouTubeScraper(api_key)
    total_videos, total_views, total_comments , final_comments , timestamps ,replycount , likecount = scraper.scrape_comments_by_keyword(keyword)

    print(f"Total Videos Fetched: {total_videos}")
    print(f"Total Views of Fetched Videos: {total_views}")
    print(f"Total Comments Scraped: {total_comments}")

if __name__ == "__main__":
    main()
