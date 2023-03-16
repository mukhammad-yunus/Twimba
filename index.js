import { tweetsData } from "./data.js"
import {v4 as uuidv4} from 'https://jspm.dev/uuid';


const displayReply = document.querySelector('.replies')

document.addEventListener('click', function(e){
    if (e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.seeReplies){
        handleReplyClick(e.target.dataset.seeReplies)
    }
    else if(e.target.id === 'input-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.reply){
        handleShowReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.replyBtn){
        handleWriteReplyClick(e.target.dataset.replyBtn)
    }
    else if(e.target.id === 'reply-close-btn'){
        replyCloseBtn()
    }
})

function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isLiked){
        targetTweetObj.likes --
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets --
    }
    else{
        targetTweetObj.retweets ++
    }

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleReplyClick (tweetId){
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}


function handleShowReplyClick(tweetId){
    const targetReplyObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    
    displayReply.style.display = 'block'
    
    displayReply.innerHTML =`
        <div>
            <button class="reply-close-btn" id="reply-close-btn">X</button>
            <div class="tweet">
                <div class="tweet-inner">
                    <div class="line-image">
                        <img src="${targetReplyObj.profilePic}" class="profile-pic">
                        <span class="line"></span>
                    </div>
                    <div>
                        <p class="handle">${targetReplyObj.handle}</p>
                        <p class="tweet-text" id="tweet-text" data-see-replies="${targetReplyObj.uuid}">${targetReplyObj.tweetText}</p>
                        <p class="handle">Replying to <span class="blue">${targetReplyObj.handle}</span></p>
                    </div>
                </div>
                <div class="tweet-inner" id="tweet-inner">
                    <img src="images/scrimbalogo.png" class="profile-pic">
                    <div>
                        <textarea id="reply-input"
                        placeholder="Tweet your reply"></textarea>
                        <button id="reply-btn" data-reply-btn="${targetReplyObj.uuid}">Reply</button>
                    </div>
                </div>
            </div>
        </div>
    `
}

function handleWriteReplyClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    const replyInput = document.getElementById('reply-input')
    targetTweetObj.replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: replyInput.value,
    })
    replyInput.value = ''
    displayReply.style.display = 'none'
    render()
}

function replyCloseBtn(){
   displayReply.style.display = 'none'
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        const newTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }
        tweetsData.unshift(newTweet)
        tweetInput.value = ''
        render()
    }
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
}


function getFeedHtml(){
    let feedHtml = ''
    tweetsData.forEach(function(tweet){

        let likeClass = ''
        if(tweet.isLiked){
            likeClass = "liked"
        }

        let retweetClass = ''
        if(tweet.isRetweeted){
            retweetClass = 'retweeted'
        }
        
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                `
            })
        }
        
        feedHtml +=`
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text" data-see-replies="${tweet.uuid}">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i> ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}"></i> ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i> ${tweet.retweets}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
            </div>`
        })
    return feedHtml
}


function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()



