
export const sign = jest.fn((_payload: any, _secret: any, _options: any, callback: any) => {
  callback(null, 'some arbitrary token')
})

export const verify = jest.fn((_token: any, _secret: any, _options: any, callback: any) => {
  callback(null, {
    _id: '5b9a5da9f90acf05fe816882',
  })
})
