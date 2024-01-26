from flask import Flask , request
from flask_cors import CORS, cross_origin
from flask_restful import Api,Resource ,reqparse

from youtube import YouTubeScraper
from youtube import ApiKeys
from topicmodel import TopicModelling
from model import Emotions8 , Sentiment3

app = Flask(__name__ )
api = Api(app)
cors = CORS(app)


app.config['CORS_HEADERS'] = 'Content-Type'
api_key = ApiKeys.YOUTUBE_API_KEY  # Retrieve the API key from api_keys.py
scraper = YouTubeScraper(api_key)
topic_model = TopicModelling()


class Sentiment (Resource):

    def get(self):
        topic = request.args.get('topic')
        timestamp , comments = scraper.scrape_comments_by_keyword(topic)
        comments_sentiments = []
        print("Found : " + str(len(comments)) + " comments")
        timestamp = timestamp[ : 100]
        comments =  comments[ : 100]
        i = 0
        for comment in comments : 
            # print("done : " + str(i))
            sentiment = model.Sentiment3().get_sentiments(comment[:300])
            comments_sentiments.append(sentiment)
            i += 1
            
        return {

            "message": f"Sentiments of {topic}",
            "comments": comments , 
            "timestamps" : timestamp,
            "sentiment": comments_sentiments,
        }
    

class Emotions (Resource):

    def get(self):
        topic = request.args.get('topic')
        timestamp , comments = scraper.scrape_comments_by_keyword(topic)

        timestamp = timestamp[:100]
        comments = comments[:100]

        comments_sentiments = []

        for comment in comments : 
            sentiment = model.Emotions8().get_emotions(comment)
            comments_sentiments.append(sentiment)

        
        return {

            "message": f"Sentiments of {topic}",
            "comments": comments , 
            "timestamps" : timestamp,
            "sentiment": comments_sentiments,
        }

# class GetStats(Resource):

#     pass


class TopicModelling(Resource):

    def get(self):
        topic = request.args.get('topic')
        print("topic : "  , topic)
        timestamp , comments = scraper.scrape_comments_by_keyword(topic)
        print("GOT : " , len(comments) , " Comments ")
        comments = comments[ : 100]
        modelled_topics = topic_model.get_top_words(comments , 1 , 20)

        return {

            "message" : "Success",
            "topics" : modelled_topics,
        }






api.add_resource(Sentiment, "/sentiment" )
api.add_resource(Emotions, "/emotion" )
api.add_resource(TopicModelling, "/topicmodel" )

if __name__ == "__main__":
    app.run(debug=False)