from flask import Flask, request
from googleapiclient.discovery import build
from iteration_utilities import unique_everseen
import torch
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import requests
import re

print("Checkpoint 1: Loaded all libraries.")

# Handling the authentication
apiKey = 'AIzaSyC1p3hR3ej6J3UD9cKQwkkJiDi_PzqY2G0'
apiServiceName = "youtube"
apiVersion = "v3"
youtube = build(apiServiceName, apiVersion, developerKey=apiKey)

tokenizer = AutoTokenizer.from_pretrained(
    'nlptown/bert-base-multilingual-uncased-sentiment')
model = AutoModelForSequenceClassification.from_pretrained(
    'nlptown/bert-base-multilingual-uncased-sentiment')

print("Checkpoint 2: Authentication done.")


# Utility Functions

def channelStats(youtube, channel_ids):
    all_data = []

    request = youtube.channels().list(
        part="snippet,contentDetails,statistics",
        id=','.join(channel_ids)
    )

    response = request.execute()

    for item in response['items']:
        data = {'channelName': item['snippet']['title'],
                'subscribers': item['statistics']['subscriberCount'],
                'views': item['statistics']['viewCount'],
                'totalVideos': item['statistics']['videoCount'],
                'playlistID': item['contentDetails']['relatedPlaylists']['uploads']
                }

        all_data.append(data)

    return (pd.DataFrame(all_data))


def videoIds(youtube, playlist_id):

    videoIDs = []
    request = youtube.playlistItems().list(
        part="snippet, contentDetails",
        playlistId=playlist_id,
        maxResults=50
    )

    response = request.execute()

    for item in response['items']:
        videoIDs.append(item['contentDetails']['videoId'])

    nextPageToken = response.get('nextPageToken')

    while nextPageToken is not None:
        request = youtube.playlistItems().list(
            part="snippet,contentDetails",
            playlistId=playlist_id,
            maxResults=50,
            pageToken=nextPageToken
        )

        response = request.execute()

        for item in response['items']:
            videoIDs.append(item['contentDetails']['videoId'])

        nextPageToken = response.get('nextPageToken')

    return videoIDs


def fetchVidDetails(youtube, video_ids, keyword):

    videosInfo = []
    for i in range(0, len(video_ids), 50):
        request = youtube.videos().list(
            part="snippet,contentDetails,statistics",
            id=','.join(video_ids[i:i+50])
        )

        response = request.execute()

        for video in response['items']:

            stats_to_keep = {'snippet': ['channelTitle', 'title', 'description', 'tags', 'publishedAt'],
                             'statistics': ['viewCount', 'likeCount', 'dislikeCount', 'favouriteCount', 'commentCount'],
                             'contentDetails': ['duration', 'definition', 'caption']
                             }

            video_info = {}
            video_info['video_id'] = video['id']

            for k in stats_to_keep.keys():
                for v in stats_to_keep[k]:
                    try:
                        video_info[v] = video[k][v]
                    except:
                        video_info[v] = None

            if video_info["tags"] is not None:
                if keyword in video_info["tags"]:
                    if keyword in video_info["tags"]:
                        videosInfo.append(video_info)
                    else:
                        pass

    return pd.DataFrame(videosInfo)


def process_comments(response_items):

    comments = []
    for res in response_items:
        comment = {}
        comment['snippet'] = res['snippet']['topLevelComment']['snippet']
        comment['snippet']['parentId'] = None
        comment['snippet']['commentId'] = res['snippet']['topLevelComment']['id']
        comments.append(comment['snippet'])

    print(f'Finished processing {len(comments)} comments.')
    return comments


def comment_threads(videoID, maxComms):

    commentList = []

    # check if the video has comments or not
    video_response = youtube.videos().list(
        part='snippet,statistics',
        id=videoID
    ).execute()

    if 'items' in video_response:
        video_info = video_response['items'][0]
    snippet = video_info.get('snippet', {})
    statistics = video_info.get('statistics', {})
    comment_count = int(statistics.get('commentCount', 0))

    if comment_count > 0:
        request = youtube.commentThreads().list(
            part='snippet',
            videoId=videoID,
            order='relevance',
            textFormat='plainText'
        )
        response = request.execute()
        commentList.extend(process_comments(response['items']))

        while response.get('nextPageToken', None):
            request = youtube.commentThreads().list(
                part='snippet',
                videoId=videoID,
                order='relevance',
                textFormat='plainText'
            )
            response = request.execute()
            commentList.extend(process_comments(response['items']))

            if len(commentList) > maxComms:
                break

    commentList = list(unique_everseen(commentList))
    return commentList


def SentimentAnalysis(comment):

    # comment = processComment(comment)
    token = tokenizer.encode(comment, return_tensors='pt')
    subject = model(token)
    maxScore = int(torch.argmax(subject.logits))+1

    if maxScore == 3:
        return int(2)
    elif maxScore < 3:
        return int(0)
    else:
        return int(1)


def processComment(text):
    text = re.sub(r'[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-=|]', '', text)
    return text


def makeCommentData(commentsDataFrame, commentCount):
    commentsData = pd.DataFrame()
    commentsData["User"] = commentsDataFrame["authorDisplayName"]
    commentsData["Comment"] = commentsDataFrame["textOriginal"][0:commentCount].apply(
        processComment)
    commentsData["Subject"] = commentsDataFrame["textOriginal"][0:commentCount].apply(
        SentimentAnalysis)
    return commentsData


# ===================================================
# driver Code

app = Flask(__name__)


@app.route('/', methods=['POST','GET'])
def runmain():

    # Defines the channels
    # channel_ids = ['UC7aCpq2edT-Iio2RZC9vYzA']  # Nboxo
    # channel_ids = ['UCE_M8A5yxnLfW0KghEeajjw']  # Apple

    channel_ids = ['UCWwgaK7x0_FR1goeSRazfsQ']  # Samsung
    channel_stats = channelStats(youtube, channel_ids)

    channel_stats
    playlistID = channel_stats["playlistID"][0]
    del channel_stats
    print("Checkpoint 3: Deleted Channel Stats.")

    video_ids = videoIds(youtube, playlistID)

    keyword = "galaxy"

    video_df = fetchVidDetails(youtube, video_ids, keyword)
    print("Checkpoint 4: Video Details Fetched.")

    # Comment Fetch Phase Start =======================================

    print("Checkpoint 5: Initiating Comment Fetches.")

    allComments = pd.DataFrame()

    alldata = {}
    commentsData = []
    videoCounter = 0
    viewCounter = 0
    likeCounter = 0

    for index, row in video_df.iterrows():
        videoID = row.loc["video_id"]
        videoCounter += 1

        viewCount = row.loc["viewCount"]
        viewCounter = viewCounter + int(viewCount)

        likeCount = row.loc["likeCount"]
        if type(likeCount) is str:
            likeCounter = likeCounter + int(likeCount)

        commentCount = row.loc["commentCount"]
        com = comment_threads(videoID, 20)
        commentsdf = pd.DataFrame(com)
        allComments = pd.concat(
            [allComments, commentsdf], axis=0).reset_index(drop=True)

    del video_df
    allComments = allComments.drop_duplicates(subset='textOriginal')
    allComments = allComments.drop_duplicates(subset='textDisplay')
    print(allComments.shape)

    print("Checkpoint 6: Comment Fetche Complete.")

    # Comment Fetch Phase End =======================================

    # Sentiment Analyis Phase

    print("Checkpoint 7: Running Sentiment Analysis.")
    AllCommentsInfo = makeCommentData(allComments, 500)
    allComments.sort_values(by='likeCount', ascending=False, inplace=True)

    # print(AllCommentsInfo[["User", "Subject"]])

    positiveComments = len(AllCommentsInfo[AllCommentsInfo['Subject'] == 1])
    neutralComments = len(AllCommentsInfo[AllCommentsInfo['Subject'] == 2])
    negetiveComments = len(AllCommentsInfo[AllCommentsInfo['Subject'] == 0])

    del AllCommentsInfo
    print(f"Positive Comments: {positiveComments}")
    print(f"Neutral Comments: {neutralComments}")
    print(f"Negative Comments: {negetiveComments}")

    # forming the data for sending
    alldata["positiveComments"] = positiveComments
    alldata["neutralComments"] = neutralComments
    alldata["negetiveComments"] = negetiveComments
    alldata["allComments"] = positiveComments + \
        neutralComments + negetiveComments
    alldata["videoCounter"] = videoCounter
    alldata["viewCounter"] = viewCounter
    alldata["likeCounter"] = likeCounter

    # forming the data for sending
    postive = {
        'id': "postive",
        'label': "postive",
        'value': positiveComments,
        'color': "hsl(291, 70%, 50%)",
    }

    neutral = {
        'id': "neutral",
        'label': "neutral",
        'value': neutralComments,
        'color': "hsl(162, 70%, 50%)",
    }

    negative = {
        'id': "negative",
        'label': "negative",
        'value': negetiveComments,
        'color': "hsl(162, 70%, 50%)",
    }
    
    commentsData.append([postive, neutral, negative])

    # alldata["allComments"] = positiveComments + \
    #     neutralComments + negetiveComments
    # alldata["videoCounter"] = videoCounter
    # alldata["viewCounter"] = viewCounter
    # alldata["likeCounter"] = likeCounter

    # print(alldata)
    return commentsData


if __name__ == '__main__':
    app.run(debug=True)
