import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { htmlDecode } from './helpers';

const initialState = {
  activeFeed: 'Popular',
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
};

export const getPostsForFeed = createAsyncThunk(
  'feed/getPostsForFeed',
  async feedName => {
    const route = `https://www.reddit.com/r/${feedName}.json`;
    const response = await fetch(route);
    const json = await response.json();
    return json;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action) => {
      state.activeFeed = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: {
    [getPostsForFeed.pending]: (state, action) => {
      console.log('getPostsForFeed loading');
      state.isLoading = true;
      state.error = null;
    },
    [getPostsForFeed.fulfilled]: (state, action) => {
      console.log('getPostsForFeed payload', action.payload);
      const newPosts = action.payload['data']['children'].map(postObj => {
        const data = postObj['data'];
        const post = {
          id: data['id'],
          permalink: data['permalink'],
          title: htmlDecode(data['title']),
          author: data['author'],
          selftext: data['selftext'],
          selftextHtml: data['selftext_html'],
          subredditName: data['subreddit_name_prefixed'],
          created: data['created'] * 1000,
          score: data['score'],
          upvoteRatio: data['upvote_ratio'],
          numComments: data['num_comments'],
          url: data['url_overridden_by_dest'],
          videoUrl: null,
          mediaEmbed: null,
          isSpoiler: data['spoiler'],
          isLocked: data['locked'],
        };
        // type and mediaEmbed
        if (data['is_self']) {
          post['type'] = 'self';
        } else if (['i.redd.it', 'i.imgur.com'].includes(data['domain'])) {
          if (data['preview'].hasOwnProperty('reddit_video_preview')) {
            post['type'] = 'video';
            post['videoUrl'] =
              data['preview']['reddit_video_preview']['fallback_url'];
          } else {
            post['type'] = 'image';
          }
        } else if (data['is_video']) {
          post['type'] = 'video';
          post['videoUrl'] =
            data['secure_media']['reddit_video']['fallback_url'];
        } else if (data['secure_media_embed'].hasOwnProperty('content')) {
          post['type'] = 'embed';
          post['mediaEmbed'] = htmlDecode(
            data['secure_media_embed']['content']
          );
        }
        // scoreStr
        if (post['score'] < 1000) {
          post['scoreStr'] = post['score'].toString();
        } else {
          post['scoreStr'] = (post['score'] / 1000).toFixed(1) + 'k';
        }
        // filter out or mark stickied?
        return post;
      });
      state.posts = newPosts;
      state.isLoading = false;
      state.error = null;
    },
    [getPostsForFeed.rejected]: (state, action) => {
      console.log('getPostsForFeed error', action.payload);
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setFeed, setPosts, setCurrentPost } = feedSlice.actions;

export const selectActiveFeed = state => state.feed.activeFeed;
export const selectPosts = state => state.feed.posts;
export const selectCurrentPost = state => state.feed.currentPost;
export const selectIsLoading = state => state.feed.isLoading;
export const selectError = state => state.feed.error;

export default feedSlice.reducer;
