export type Task = {
  title: string
  description?: string
}

export type Action = {
  type: string
  payload: any
}

export type Dispatch = ({ type: string, payload: any }) => void

export type AppState = {}

export type Obj = Record<string, unknown>
