import axios from 'axios';
import oauth from 'oauth-signature';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import qs from 'qs';

const endpoint = 'https://api.7digital.com/1.2';
const consumerKey = '[KEY]';
const consumerSecret = '[SECRET]';


const getPlayList = async (params: any) => {
  const id = '[ID]';
  const url = `${endpoint}/playlists/${id}`;
  const oath = createAuthorisation('GET', url, params);

  const response = await axios.get(url, {
    params,
    headers: {
      Authorization: oath,
      Accept: 'application/json',
    }
  });
  console.log('>>>', response.data)
}

const createUser = async (params: any) => {
  const url = `${endpoint}/user/create`;
  const oath = createAuthorisation('GET', url, params);

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: oath,
        Accept: 'application/json',
      }
    });
    console.log(response.data);
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

  const oath = createAuthorisation('POST', url, data);

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

const createAuthorisation = (method: 'GET' | 'POST', url: string, params: any) => {

  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).replace(/[^a-z]/, '').substring(2),
    oauth_timestamp: Math.floor(new Date().getTime() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
  }

  const data = {
    ...oauthParams,
    ...params,
  };

  const signature = oauth.generate('POST', url, data, consumerSecret, '',
    { encodeSignature: true });

  const authorisation = qs.stringify({
    ...oauthParams,
    oauth_signature: signature,
  }, {
    delimiter: ','
  });
  return `OAuth ${authorisation}`;
}

/**
 * UNCOMMENCT TO RUN EXAMPLES
 */

// getPlayList({
//   country: 'AU'
// });
// createUser({
//   userID: '[userId]',
//   country: 'AU'
// });
// createSubscription();