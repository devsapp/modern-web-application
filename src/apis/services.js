const { Request } = require('./request');
const DEFAULT_BASEURL = 'http://registry.devsapp.cn';
const _request = new Request(DEFAULT_BASEURL);


const searchApp = async (ctx) => {
  try {
    const { content } = ctx.request.body;
    const apps = await _request.post('/package/search', content);
    return {
      code: 200,
      data: {
        apps
      }
    };
  } catch (e) {
    return {
      code: 500,
      message: e.message
    }
  }
}



// appCenter/getTags
const getTags = async (ctx) => {
  try {
    const tags = await _request.get('/common/tags');
    return {
      code: 200,
      data: {
        tags
      }
    };
  } catch (e) {
    return {
      code: 500,
      message: e.message
    }
  }
}

// appCenter/getCategory
const getCategorys = async () => {
  try {
    const category = await _request.get('/common/category');
    return {
      code: 200,
      data: {
        category
      }
    };
  } catch (e) {
    return {
      code: 500,
      message: e.message
    }
  }
}

// appCenter/getAppDetail
const getAppDetail = async (ctx) => {
  try {
    const { content } = ctx.request.body;
    const { name } = content;
    const data = await _request.post('/package/content', { name });
    return {
      code: 200,
      data
    };
  } catch (e) {
    return {
      code: 500,
      message: e.message
    }
  }
}


const getSpecialApp = async () => {
  try {
    const apps = await _request.get('/package/special');
    return {
      code: 200,
      data: {
        apps
      }
    };
  } catch (e) {
    return {
      code: 500,
      message: e.message
    }
  }
}

/**
 * 获取专题详情
 * @param channel 
 * @param content 
 */

const getSpecialDetail = async (ctx) => {
  try {
    const { content } = ctx.request.body;
    const apps = await _request.post('/package/special/detail', content);
    return {
      code: 200,
      data: {
        apps
      }
    };
  } catch (e) {
    return {
      code: 500,
      message: e.message
    }
  }
}




module.exports = {
    getSpecialApp,
    searchApp,
    getSpecialApp,
    getTags,
    getSpecialDetail,
    getAppDetail,
    getCategorys

}