import mockjs from 'mockjs';
import { format, delay } from 'roadhog-api-doc';
const noProxy = process.env.NO_PROXY === 'true';
const proxy = {
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
};
export default noProxy ? {} : delay(proxy, 1000);