export default {
  'GET /api/user/1': {
    success: true,
    data: {
      id: 1,
      name: '张三',
      sex: 'M',
      age: 18,
    },
  },
  'GET /api/users': {
    success: true,
    data: {
      list: [
        {
          id: 1,
          name: '张三',
          sex: 'M',
          age: 18,
        },
      ],
      total: 18,
    },
  },
};
