import { useCallback, useEffect, useMemo, useRef, useState, CSSProperties, FunctionComponent } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { findOrder, getClassNames } from "../utils/general";
import SpaceOnHover from "./SpaceOnHover";

import type { Custom_DragObject, Type_Card_Props } from "../userTypes";

const DroppableItem: FunctionComponent<Type_Card_Props> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const [mouseOver, setMouseOver] = useState(false);
    const classNames = useMemo(() => getClassNames(props.item.uuidContainer), [props.item.uuidContainer]);
    const containerFlex = useMemo(() => {
        return { display: "flex", flexDirection: props.isColumn ? "column" : "row" };
    }, [props.isColumn]);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
        }
    }, []);

    const witchHalveHover = (_hoverItem: any, monitor: DropTargetMonitor): [boolean, boolean] => {
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();

        let isTopHalve = false;
        let isBottomHalve = false;

        // Get vertical middle
        if (clientOffset && hoverBoundingRect) {
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Dropped on the Top Halve of the Card
            if (hoverMiddleY > hoverClientY) {
                isTopHalve = true;
            }
            // Dropped on the Bottom Halve of the Card
            if (hoverMiddleY < hoverClientY) {
                isBottomHalve = true;
            }
        }
        return [isTopHalve, isBottomHalve];
    };

    const [{ draggingItem, isDragging }, drag] = useDrag<
        Custom_DragObject,
        unknown,
        {
            canDrag: boolean;
            isDragging: boolean;
            draggingItem: Custom_DragObject | null;
        }
    >(
        () => ({
            type: props.droppedOnUUID,
            item: () => {
                props.setIsDragging(true);
                return {
                    type: props.droppedOnUUID,
                    item: { ...props, ref }
                };
            },
            canDrag: !props.canDrag,
            end: () => {
                props.setIsDragging(false);
            },
            collect: monitor => ({
                canDrag: monitor.canDrag(),
                isDragging: monitor.isDragging(),
                draggingItem: monitor.getItem()
            })
        }),
        [props, ref]
    );

    // Props is dropped on
    const [{ isTopHalve, isBottomHalve, isNewParent, isOver, isAbove, isBelow }, drop] = useDrop<
        Custom_DragObject,
        unknown,
        {
            isOver: boolean;
            isNewParent: boolean;
            isAbove: boolean;
            isBelow: boolean;
            isTopHalve: boolean;
            dragIndex: number;
            isBottomHalve: boolean;
        }
    >(
        {
            accept: [props.droppedOnUUID, ...props.acceptedUUids],
            collect(monitor) {
                const dragItem = monitor.getItem();
                const dragIndex = dragItem?.item.index ?? -1;
                const isNewParent = props.item.uuidParent !== dragItem?.item.item.uuidParent;
                const [isTopHalve, isBottomHalve] = witchHalveHover(dragItem, monitor);
                return {
                    isOver: monitor.isOver(),
                    isNewParent,
                    isAbove: dragIndex > props.index,
                    isBelow: dragIndex < props.index,
                    isTopHalve,
                    dragIndex,
                    isBottomHalve
                };
            },

            drop(_item, monitor) {
                /**
                 * Runs microflow to Save changes
                 */
                const currentItem = monitor.getItem() || draggingItem;
                if (currentItem) {
                    const isDifferentParent = props.item.uuidParent !== currentItem.item.item.uuidParent;
                    const computedIndex = findOrder(currentItem, monitor, props.index, ref);
                    props.onDrop({
                        droppedOnParentUUID: props.item.uuidParent,
                        currentParentUUID: currentItem.item.item.uuidParent,
                        draggedUUID: currentItem.item.item.uuidCurrent,
                        droppedOnUUID: props.item.uuidCurrent,
                        index: isDifferentParent ? (computedIndex as number) : props.index
                    });
                }
            }
        },
        [props, ref, draggingItem]
    );

    const showHoverStyle = mouseOver && !props.isDragging;

    const setRefs = useCallback(
        (el: HTMLDivElement | null) => {
            (ref as any).current = el;
            drag(drop(el));
        },
        [drag, drop]
    );

    return (
        <div
            data-containing-uuid={props.droppedOnUUID}
            data-uuid={props.item.uuidCurrent}
            ref={setRefs}
            draggable="true"
            aria-label={props.item.ariaTitle + " inside " + props.item.ariaOfParent}
            aria-grabbed={isDragging ? "true" : "false"}
            style={{ ...(containerFlex as CSSProperties) }}
            className={`${isDragging ? classNames.dnd_draggable_dragging : classNames.dnd_draggable_not_dragging}`}
        >
            <div style={{ ...(containerFlex as CSSProperties), width: "100%" }}>
                <SpaceOnHover
                    id="isAbove"
                    isColumn={props.isColumn}
                    height={dimensions.height}
                    width={dimensions.width}
                    activateHeight={isNewParent ? isOver && isTopHalve : isOver && isAbove}
                />
                <div
                    tabIndex={0}
                    onMouseEnter={() => setMouseOver(true)}
                    onMouseLeave={() => setMouseOver(false)}
                    style={{ display: "flex", flexDirection: "column" }}
                    className={`${classNames.dnd_draggable_item}
                    ${isDragging ? classNames.dnd_draggable_dragging : classNames.dnd_draggable_not_dragging}
                    ${props.item.isNewInHere ? classNames.dnd_draggable_new : classNames.dnd_draggable_not_new}
                    ${isOver ? classNames.dnd_draggable_over : classNames.dnd_draggable_not_over}
                    ${showHoverStyle ? classNames.dnd_draggable_hover : classNames.dnd_draggable_not_hover}
                    `}
                >
                    {props.children}
                </div>
                <SpaceOnHover
                    id="isBelow"
                    isColumn={props.isColumn}
                    height={dimensions.height}
                    width={dimensions.width}
                    activateHeight={isNewParent ? isOver && isBottomHalve : isOver && isBelow}
                />
            </div>
            <div className={`${classNames.dnd_spacer}`}></div>
        </div>
    );
};

export default DroppableItem;
