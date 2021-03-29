import { mock } from 'mockjs';

export default {
  'GET /api/listPage': mock({
    data: {
      'list|10': [
        {
          'id|+1': 1,
          name: '@name',
        },
      ],
      total: 100,
    },
  }),
};
