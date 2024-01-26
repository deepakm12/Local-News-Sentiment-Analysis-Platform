from flask import Flask, jsonify, Response
from flask_cors import CORS
import datetime
import time
import json

from youtube import YouTubeScraper
from youtube import ApiKeys
from model import Sentiment3 , Emotions8 , TopicModelling , ExtendedEmotions
sentiment = Sentiment3()
emotions = Emotions8()
extendedEmotions = ExtendedEmotions()

app = Flask(__name__)
CORS(app)

api_key = ApiKeys.YOUTUBE_API_KEY  # Retrieve the API key from api_keys.py
scraper = YouTubeScraper(api_key)
topic_model = TopicModelling()
sentiment = Sentiment3()
emotion = Emotions8()


@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the home page!'})

@app.route('/getdata/<name>')
def data(name):
    def generate_numbers():
        print("Request Made !")
        total_videos, total_views, total_comments , final_comments , timestamps ,replycount , likecount = scraper.scrape_comments_by_keyword(name)
        
        data = {
            "CommentCount" : total_comments,
            "TotalVideos" : total_videos ,
            "TotalViews" : total_views , 

        } 
        for comment  , timestamp , reply , like in zip(final_comments , timestamps ,replycount , likecount):


            data["comment"] = comment
            data["sentiments"] =  sentiment.get_sentiments(comment[: 300])
            data["emotionss"] = emotion.get_emotions(comment[: 300])
            data["extendedEmotions"] = extendedEmotions.get_extended_emotions(comment[: 300])
            data["timestamp"] = timestamp
            data["ReplyCount"] = reply
            data["LikeCount"] = like

            yield f"data: {json.dumps(data)}\n\n"
        
    return Response(generate_numbers(), mimetype='text/event-stream')



if __name__ == '__main__':
    app.run(debug=True)
