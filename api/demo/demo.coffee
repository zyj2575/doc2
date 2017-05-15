{type, success, fail} = require 'api-doc'

common =
  id: type String, '用户id'
  name: type String, '用户名称'
module.exports =
  name: '子模板板块'
  baseUrl: 'https://www.baidu.com'
  apis: [{
    title: '子模板名称',
    url: '/url/url'
    successResponse: success
      amount: type Number, '注释'
      isShowExperienceGold: type Boolean, '注释'
      recommendInfo: type {
        productImgUrl: type String, '注释'
      }, '注释'
    errorResponse: fail()
  },
    {
      title: '子模板名称1',
      url: '/url2'
      method: 'get',
      query:
        type: type Number, '注释'

      successResponse: success
        superStar: [
          amount: type Number, '注释'
          user: type String, '注释'
        ]
      errorResponse: fail("501 错误")
    }
  ,
    {
      title: '子模板名称1'
      url: '/url2'
      method: 'post'
      body:
        mobile: type String, '注释'
        pwd: type String, '注释'
        code: type String, '注释'
      successResponse: success common
      errorResponse: fail()

    }
  ]
