import { mock } from 'mockjs';

export default {
  'GET /api/listPage': mock({
    data: {
      name: '张三',
      'list|5': [
        {
          'id|+1': 1,
          name: '@name',
        },
      ],
      total: 100,
    },
  }),
};
