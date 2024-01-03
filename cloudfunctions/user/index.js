// 云函数入口文件
const cloud = require('wx-server-sdk');
const basicId = require('./basicID/basic.js');
const predict=require('./score_predict/predict.js');
const body=require('./body_data/body.js')
const club=require('./club/club_manage')
const run_step=require('./run_step/step')
// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
      case 'basicId':
        return await basicId.main(event, context);
        break;
      case 'is_Find':
        return await basicId.main(event,context);
        break;
      case 'send_distance':
        return await basicId.main(event,context);
        break;
      case'get_runRecord':
        return await basicId.main(event,context);
        break; 
      case 'get_openid':
        return await basicId.main(event,context);
        break; 
      case'predict':
        return await predict.main(event,context);
        break;
      case'get_info':
       return basicId.main(event,context);
       break; 
      case'bodydata':
      return await body.main(event,context);
      break;
      case'get_total':
      return await basicId.main(event,context);
      break;
      case'club':
      return await club.main(event,context);
      case'step':
      return await run_step.main(event,context);
    }
}