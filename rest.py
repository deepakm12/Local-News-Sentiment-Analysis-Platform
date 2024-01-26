from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.pipeline import make_pipeline
import numpy as np

class SocialMediaFakeNewsDetection:
    def __init__(self, num_topics=15, top_words=5):
        self.vectorizer = TfidfVectorizer(max_df=0.95, min_df=1, stop_words='english')
        self.lsa_model = TruncatedSVD(n_components=num_topics, random_state=42)
        self.num_topics = num_topics
        self.top_words = top_words

    def preprocess_documents(self, documents):
        return [" ".join(doc.lower().split()) for doc in documents]

    def train_lsa_model(self, documents):
        X = self.vectorizer.fit_transform(documents)
        self.lsa_model.fit(X)

    def predict_topics(self, documents):
        X = self.vectorizer.transform(documents)
        topics_probabilities = self.lsa_model.transform(X)
        max_prob_indices = topics_probabilities.argmax(axis=1)
        max_probs = topics_probabilities[np.arange(len(documents)), max_prob_indices]
        return max_probs

    def get_top_words_per_topic(self):
        feature_names = np.array(self.vectorizer.get_feature_names_out())
        topic_top_words = []
        for topic_idx, topic in enumerate(self.lsa_model.components_):
            top_words_idx = topic.argsort()[-self.top_words:][::-1]
            top_words = feature_names[top_words_idx]
            topic_top_words.append({"topic_id": topic_idx + 1, "top_words": top_words})
        return topic_top_words

if __name__ == '__main__':
    numTopics = 15
    topWords = 5
    fake_news_detector = SocialMediaFakeNewsDetection(num_topics=numTopics, top_words=topWords)

    # Example data
    documents = [
        "Scientists discover a new method to cure cancer. Visit https://example.com for more details.",
        "Breaking: UFO sighting reported in a small town!",
        "Election results announced for the upcoming year.",
        "Unconfirmed reports of a new virus outbreak with 100% cure rate!"
    ]

    # Preprocess data
    preprocessed_documents = fake_news_detector.preprocess_documents(documents)

    # Train LSA model
    fake_news_detector.train_lsa_model(preprocessed_documents)

    # Predict topics
    topics_probabilities = fake_news_detector.predict_topics(preprocessed_documents)

    # Get top words for each topic
    topic_top_words = fake_news_detector.get_top_words_per_topic()

    # Output results
    for idx, (topic_prob, top_words) in enumerate(zip(topics_probabilities, topic_top_words)):
        print(f"Topic {top_words['topic_id']} - Probabilities: {topic_prob}")
        print(f"Top {fake_news_detector.top_words} Words for Topic {top_words['topic_id']}: {', '.join(top_words['top_words'])}\n")