import { ComponentType } from "react"
import { MapStateToProps } from "react-redux"
import Task from "src/components/Task"

export type Task = {
  title: string
  description?: string
  id: number
}

export type Action = {
  type: string
  payload: any
}

export type Dispatch = ({ type: string, payload: any }) => void

export type Dispatcher<T = unknown, U = void> = (
  param: T
) => (dispatch: Dispatch) => U

export type AppState = {
  theme: string
  todo: Task[]
  done: Task[]
}

export type Obj = Record<string, unknown>

export type Connected<T = Obj> = ComponentType<T>

export type StateToProps<T> = MapStateToProps<T, Obj, AppState>

export type ValueOf<T> = T extends Obj[] ? T[number] : T[keyof T]
