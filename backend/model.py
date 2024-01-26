import requests
from topicmodel import SocialMediaFakeNewsDetection
from api_keys import ApiKeys


class Emotions8: 
    API_URL = "https://api-inference.huggingface.co/models/JuliusAlphonso/distilbert-plutchik"
    headers = {"Authorization": f"Bearer {ApiKeys.HUGGING_FACE_KEY}"}

    def query(self , payload):
        response = requests.post(self.API_URL, headers=self.headers, json=payload)
        return response.json()
    
    def get_emotions(self , text):

        while True:
            # print("calling api")
            output = self.query({
                "inputs": text,
            }) 

            if isinstance(output, dict):
                if "error" in output:
                    if "Input is too long" in output:
                        print("ERROR : EMPTY RETURN" )
                        return ""
                    print("ERROR : " , output)
                    continue
            else:
                # print("Fucked")
                break
        
        return output


class Sentiment3 : 
    API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
    headers = {"Authorization": f"Bearer {ApiKeys.HUGGING_FACE_KEY}"}

    def query(self , payload):
        response = requests.post(self.API_URL, headers=self.headers, json=payload)
        return response.json()
	
    def get_sentiments(self , text):

        while True:
            # print("calling api")
            output = self.query({
                "inputs": text,
            }) 

            if isinstance(output, dict):
                if "error" in output:
                    if "Input is too long" in output:
                        print("ERROR : EMPTY RETURN" )
                        return ""
                    print("ERROR : " , output)
                    
                    continue
                
            else:
                # print("Fucked")
                break
    
        return output


class ExtendedEmotions : 
    API_URL = "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions"
    headers = {"Authorization": f"Bearer {ApiKeys.HUGGING_FACE_KEY}"}

    def query(self , payload):
        response = requests.post(self.API_URL, headers=self.headers, json=payload)
        return response.json()
	
    def get_extended_emotions(self , text):

        while True:
            # print("calling api")
            output = self.query({
                "inputs": text,
            }) 

            if isinstance(output, dict):
                if "error" in output:
                    if "Input is too long" in output:
                        print("ERROR : EMPTY RETURN" )
                        return ""
                    print("ERROR : " , output)
                    
                    continue
                
            else:
                # print("Fucked")
                break
    
        return output

class TopicModelling:

    def getTopics(self , documents):
        numTopics = 15
        topWords = 5
        fake_news_detector = SocialMediaFakeNewsDetection(num_topics=numTopics, top_words=topWords)

        # Preprocess data
        preprocessed_documents = fake_news_detector.preprocess_documents(documents)

        # Train LSA model
        fake_news_detector.train_lsa_model(preprocessed_documents)

        # Predict topics
        topics_probabilities = fake_news_detector.predict_topics(preprocessed_documents)

        # Get top words for each topic
        topic_top_words = fake_news_detector.get_top_words_per_topic()

        topic = []
        prob = []

        # # Output results
        # for idx, (topic_prob, top_words) in enumerate(zip(topics_probabilities, topic_top_words)):
        #     print(f"Topic {top_words['topic_id']} - Probabilities: {topic_prob}")
        #     print(f"Top {fake_news_detector.top_words} Words for Topic {top_words['topic_id']}: {', '.join(top_words['top_words'])}\n")

        for topic_prob , topicKeyword in zip(topics_probabilities, topic_top_words):
            prob.append(topic_prob)
            topic.append(topicKeyword['top_words'])

        return prob , topic

# if __name__ == "__main__":
# 
    # y = TopicModelling()

    # comments = [
    #    "Scientists discover a new method to cure cancer. Visit https://example.com for more details.",
    #     "Breaking: UFO sighting reported in a small town!",
    #     "Election results announced for the upcoming year.",
    #     "Unconfirmed reports of a new virus outbreak with 100% cure rate!",
    #     "Unconfirmed reports of a new virus outbreak with 100% cure rate!",
    #     "Unconfirmed reports of a new virus outbreak with 100% cure rate!",
    #     "Unconfirmed reports of a new virus outbreak with 100% cure rate!",

    # ]
    # topic , prob = y.getTopics(comments)
    # for i , j in zip(topic , prob):

    #     print(i , j , end="\n")




    