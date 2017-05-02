state = {
  'tool': {
    url: String('url, 包含 query'),
    method: String('GET, POST'),
    ':itemType: query, formBody, header': [{
      key: String,
      value: String
    }],
    tabType: 'query,header, body',
    jsonBody: JSON.Stringify({
      ':key': value
    }),
    bodyType: 'form, json',

    shoPopup: Boolean,
    popupType: 'CURL URL',
    popup: {
      content: String,
      title: String
    },
    responseResult: Immutable({
      ':key': value
    }),
    testCurl: String,
    isShowCurlPopup: Boolean,
    history: Immutable([{
      method: String('GET, POST'),
      url: String('url'),
      curl: String
    }]),
    isShowNamePopup: Boolean,
    requestName: String,
    environment: Immutable([{
      name: String,
      url: String
    }]),
    currentEnvironment: Immutable({
      name: String,
      url: String
    }),
    addEnvironment: Immutable({
      name: String,
      url: String
    }),
    isShowEnvironmentPopup: Boolean,
    responseType: 'body  header',
    response: Immutable({
      status: Number,
      statusText: String,
      getAllResponseHeaders: Function
    })
  }
}
