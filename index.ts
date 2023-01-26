import axios from 'axios';
import oauth from 'oauth-signature';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const endpoint = 'https://api.7digital.com/1.2';
const consumerKey = '[KEY]';
const consumerSecret = '[SECRET]';


const getPlayList = async () => {
  const id = '[PLAYLIST_ID]]';
  const url = `${endpoint}/playlists/${id}`;
  const params = {
    country: 'AU'
  }
  const authParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).replace(/[^a-z]/, '').substring(2),
    oauth_timestamp: Math.floor(new Date().getTime() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    country: 'AU'
  };

  const signature = oauth.generate('GET', url, authParams, consumerSecret, '',
    { encodeSignature: true });

  const oath = `OAuth oauth_consumer_key="${consumerKey}",oauth_signature_method="${authParams.oauth_signature_method}",oauth_signature="${signature}",oauth_timestamp="${authParams.oauth_timestamp}",oauth_nonce="${authParams.oauth_nonce}",oauth_version="${authParams.oauth_version}"`

  const response = await axios.get(url, {
    params,
    headers: {
      Authorization: oath,
      Accept: 'application/json',
    }
  });
  console.log('>>>', response.data)
}

const createUser = async () => {
  const url = `${endpoint}/user/create`;
  const params = {
    userID: '[userId]',
    country: 'AU'
  }
  const authParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).replace(/[^a-z]/, '').substring(2),
    oauth_timestamp: Math.floor(new Date().getTime() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    ...params,
  };

  const signature = oauth.generate('GET', url, authParams, consumerSecret, '',
    { encodeSignature: true });

  const oath = `OAuth oauth_consumer_key="${consumerKey}",oauth_signature_method="${authParams.oauth_signature_method}",oauth_signature="${signature}",oauth_timestamp="${authParams.oauth_timestamp}",oauth_nonce="${authParams.oauth_nonce}",oauth_version="${authParams.oauth_version}"`

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: oath,
        Accept: 'application/json',
      }
    });
  } catch (error: any) {
    console.error(error.response);
  }
}

const createSubscription = async () => {
  const url = `${endpoint}/user/unlimitedStreaming`;

  const activatedAt = dayjs().utc().format();
  const expiryDate = dayjs().add(1, 'month').utc().format();
  const data = {
    userId: '[userId]',
    planCode: 'standard-unlimited-streaming',
    status: 'active',
    currency: 'AUD',
    recurringFee: 0,
    country: 'AU',
    activatedAt,
    currentPeriodStartDate: activatedAt,
    expiryDate,
  };

  const authParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).replace(/[^a-z]/, '').substring(2),
    oauth_timestamp: Math.floor(new Date().getTime() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    ...data
  };

  const signature = oauth.generate('POST', url, authParams, consumerSecret, '',
    { encodeSignature: true });

  const oath = `OAuth oauth_consumer_key="${consumerKey}",oauth_signature_method="${authParams.oauth_signature_method}",oauth_signature="${signature}",oauth_timestamp="${authParams.oauth_timestamp}",oauth_nonce="${authParams.oauth_nonce}",oauth_version="${authParams.oauth_version}"`

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: oath,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    console.log('>>>', response.data)
  } catch (error: any) {
    console.error(error.response);
  }
}

getPlayList();
// createUser();
// createSubscription();