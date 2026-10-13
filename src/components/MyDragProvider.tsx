import { FC, forwardRef, Fragment, ReactNode } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { DndProvider as ReactDndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DND_OPTIONS } from "../utils/general";
interface MyDragInterface {
    children?: ReactNode;
    uuidStringContainer: string;
    isFirefox: boolean;
}

const MyDragProvider = forwardRef<HTMLDivElement, MyDragInterface>(props => {
    return (
        <Fragment>
            <div
                tabIndex={0}
                aria-label="This is a Drag and Drop Region - Press Modifier and D To Pick Up Items. Use Up and Down Arrows to Move Items Higher or Lower or To a new List"
            />
            {props.isFirefox ? (
                <MyDragProviderForFireFox>{props.children}</MyDragProviderForFireFox>
            ) : (
                <MyDragProviderForRest {...props}>{props.children}</MyDragProviderForRest>
            )}
        </Fragment>
    );
});

export default MyDragProvider;

const MyDragProviderForFireFox: FC<{ children?: ReactNode }> = ({ children }) => {
    return <ReactDndProvider backend={HTML5Backend}>{children}</ReactDndProvider>;
};

export const MyDragProviderForRest: FC<Omit<MyDragInterface, "isFirefox">> = ({ children, uuidStringContainer }) => {
    return (
        <DndProvider debugMode={false} options={DND_OPTIONS(uuidStringContainer) as any}>
            {children}
        </DndProvider>
    );
};
