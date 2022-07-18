import {requestToGateway} from '../others/utils';
import constants from '../others/constants';


const getArtists = () => {
  return requestToGateway('GET', constants.USERS_HOST + constants.APP_ARTIST_LIST_URL)
    .then(response => {
      if (response.status !== 200) {
        console.log(`Response error with status ${response.status}`)
        throw response;
      }
      return response.json();
    });
}

const uploadVerificationVideo = body => {
  return requestToGateway('PATCH', `${constants.USERS_HOST}${constants.PROFILE_VERIFICATION_VIDEO_URL}`, body)
    .then(response => {
      if (response.status !== 200) {
        console.log(`Response error with status ${response.status}`)
        throw response;
      }
      return response.json();
    });
}

const getUser = (userId) => {
  return requestToGateway('GET', `${constants.USERS_HOST}${constants.PROFILE_URL}?userId=${userId}`)
    .then(response => {
      if (response.status !== 200) {
        console.log(`Response error with status ${response.status}`)
        throw response;
      }
      return response.json();
    });
}

export {getArtists, uploadVerificationVideo, getUser};
