declare module 'express' {
  export type Request = {
    body?: any
  }

  export type Response = {
    status: (code: number) => Response
    json: (body: any) => void
    send?: (body: any) => void
  }

  const express: {
    (): any
    json: (opts: any) => any
    urlencoded?: (opts: any) => any
  }

  export default express
}


