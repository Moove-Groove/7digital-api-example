import axios from 'axios';
import oauth from 'oauth-signature';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import qs from 'qs';

const endpoint = 'https://api.7digital.com/1.2';
const consumerKey = '[key]';
const consumerSecret = '[secret]';


const getPlayList = async (params: { id: string, country: string }) => {

  const url = `${endpoint}/playlists/${params.id}`;
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

const createSubscription = async (params: { userId: string }) => {
  const url = `${endpoint}/user/unlimitedStreaming`;

  const activatedAt = dayjs().utc().format();
  const expiryDate = dayjs().add(1, 'month').utc().format();
  const data = {
    userId: params.userId,
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

const logSubscriberStream = async (params: { userId: string, country: string, playLogItem: any[] }) => {
  const { userId, country, playLogItem } = params;
  const url = `${endpoint}/user/subscription/log?userId=${userId}&country=${country}`;

  const data = { playLogItem };
  const oath = createAuthorisation('POST', url, data);
  console.log('========== OAUTH', oath)
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: oath,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log('>>>', response.data)
  } catch (error: any) {
    console.error(error.response.data);
  }
}

const createAuthorisation = (method: 'GET' | 'POST', url: string, params: any) => {

  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: Math.random().toString(36).replace(/[^a-z]/, '').substring(2),
    oauth_timestamp: Math.floor(new Date().getTime() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
  }

  const data = {
    ...oauthParams,
    ...params,
  };

  console.log('DATA TO BE AUTHORISED', data)
  console.log('URL TO BE AUTHORISED', url)

  const signature = oauth.generate(method, url, data, consumerSecret, '',
    { encodeSignature: true });

  console.log('>>>>>>>>>>>>>>>', oauthParams)

  // manually create the oath string
  let authParams: string[] = [`oauth_signature="${encodeURIComponent(signature)}"`];
  for (const [key, value] of Object.entries(oauthParams)) {
    authParams.push(`${key}="${value}"`);
  }
  const authStr = authParams.join(',');
  console.log('=========1>', authStr)

  // use QS to stringify the oauth params
  const authorisation = qs.stringify({
    ...oauthParams,
    oauth_signature: signature,
  }, {
    delimiter: ','
  });
  console.log('=========2>', authorisation)

  return `OAuth ${authStr}`;
  // return `OAuth ${authorisation}`;
}

/**
 * UNCOMMENT TO RUN EXAMPLES
 */

// getPlayList({
//   id: '60e2e3f565c9a45be0e0ca7e',
//   country: 'AU'
// });

logSubscriberStream({
  userId: 'brandewijn_20230214',
  country: 'AU',
  playLogItem:  [
    {
      "trackId": "149477",
      "releaseId": "14411",
      "formatId": "56",
      "playMode": "online",
      "dateTimePlayed": "2023-02-15T00:42:51.711Z",
      "totalTimePlayed": 0,
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }]
});

// createUser({
//   userID: '[userId],
//   country: 'AU'
// });

// createSubscription({
//   userId: 'brandewijn_20230214',
// });