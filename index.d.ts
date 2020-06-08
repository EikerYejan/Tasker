import { ComponentType } from "react"
import { MapStateToProps } from "react-redux"
import Task from "src/components/Task"

export type Task = {
  title: string
  description?: string
}

export type Action = {
  type: string
  payload: any
}

export type Dispatch = ({ type: string, payload: any }) => void

export type AppState = {
  todo: Task[]
  done: Task[]
}

export type Obj = Record<string, unknown>

export type Connected<T = Obj> = ComponentType<T>

export type StateToProps<T> = MapStateToProps<T, Obj, AppState>
