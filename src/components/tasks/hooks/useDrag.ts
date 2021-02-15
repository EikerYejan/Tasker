import { RefObject } from 'react'
import {
  useDrag,
  useDrop,
  DropTargetMonitor,
  DragSourceMonitor,
} from 'react-dnd'
import { XYCoord } from 'dnd-core'
import { DragItem } from '@types'

type Params = {
  ref: RefObject<HTMLLIElement>
  index: number
  id: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
}

type Return = [any, any, boolean] // eslint-disable-line

type UseDrangNDrop = ({ ...args }: Params) => Return

const useDragNDrop: UseDrangNDrop = ({ ref, index, id, moveItem }) => {
  /**
   * Set drop target
   */
  const [, drop] = useDrop({
    accept: 'task',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      // eslint-disable-next-line
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line
      item.index = hoverIndex
    },
  })

  /**
   * Set drag source
   */
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'task', id, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  /**
   *
   */
  // const dragFunc = drag(drop(ref))

  /**
   * Return
   */
  return [drag, drop, isDragging]
}

export default useDragNDrop
