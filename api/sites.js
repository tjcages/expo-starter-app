import * as Types from "../store/types";

export const listSites = (bearer) => (dispatch) => {
  //GET request
  fetch("https://api.webflow.com/sites", {
    method: "GET",
    headers: {
      "Accept-Version": "1.0.0",
      Authorization: `Bearer ${bearer}`,
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      //Success
      return dispatch({
        type: Types.UPDATE_SITES,
        payload: { sites: responseJson.sort(sortSites) },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      alert(JSON.stringify(error));
      console.error(error);
    });
};

export const selectSite = (siteId) => (dispatch) => {
  if (siteId) {
    return dispatch({
      type: Types.SELECT_SITE,
      payload: { selectedSite: siteId },
    });
  } else {
    // remove selected site and it's collections
    return [
      dispatch({
        type: Types.SELECT_SITE,
        payload: { selectedSite: siteId },
      }),
      dispatch({
        type: Types.UPDATE_COLLECTIONS,
        payload: { collections: null },
      }),
    ];
  }
};

export const listDomains = (bearer, site) => (dispatch) => {
  //GET request
  fetch(`https://api.webflow.com/sites/${site._id}/domains`, {
    method: "GET",
    headers: {
      "Accept-Version": "1.0.0",
      Authorization: `Bearer ${bearer}`,
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      //Success
      // don't forget to add the staging site!
      const stagingDomain = {
        _id: "staging",
        name: `${site.shortName}.webflow.io`,
      };
      const domains = [...responseJson, stagingDomain];

      return dispatch({
        type: Types.UPDATE_DOMAINS,
        payload: { site: site._id, domains: domains },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      alert(JSON.stringify(error));
      console.error(error);
    });
};

export const updateDomainSelection = (site, domain, selected) => (dispatch) => {
  return dispatch({
    type: Types.UPDATE_DOMAIN_SELECTION,
    payload: { site, domain, selected },
  });
};

export const publishSite = (bearer, siteId, domains) => (dispatch) => {
  //POST request
  const domainsJSON = JSON.stringify({ domains: domains });

  fetch(`https://api.webflow.com/sites/${siteId}/publish`, {
    method: "POST",
    body: domainsJSON,
    headers: {
      "Accept-Version": "1.0.0",
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      //Success
      console.log(responseJson);
      dispatch({
        type: Types.PUBLISH_SUCCESS,
        payload: { response: responseJson, pending: false },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      alert(JSON.stringify(error));
      console.error(error);
    });
};

export const updatePublishStatus = (status) => (dispatch) => {
  dispatch({
    type: Types.PUBLISH_STATUS,
    payload: { status },
  });
};

function sortSites(a, b) {
  // return the most recently published sites first
  if (a.lastPublished > b.lastPublished) {
    return -1;
  }
  if (a.lastPublished < b.lastPublished) {
    return 1;
  }
  return 0;
}
