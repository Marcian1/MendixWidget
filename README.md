# Drag and Drop Widget

> ⚠️ **Compatibility & Version Guide**
>
> * **Mendix 11**: Use version `4.x.x` (React 19, `@mendix/pluggable-widgets-tools` ^11.x).
> * **Mendix 10**: Use version `3.x.x` / `4.x.x` (React 18 / Node 18+).
> * **Mendix 9 (9.6+)**: Use version `3.x.x` of the widget.
> * **Mendix 8 & older**: See the legacy documentation [here](https://mendixlabs.github.io/app-services-components/#/web-widgets/drag-and-drop-widget-old).

## Version Upgrade & Compatibility Summary

### Upgrading from Mendix 9 to Mendix 10 Compatibility
When migrating this widget from Mendix 9 to Mendix 10, the following core changes were required:

1. **Pluggable Widget Tools & Build Infrastructure**:
   - Upgraded `@mendix/pluggable-widgets-tools` from older Webpack-based toolchains to `^10.x.x` (modern Rollup/bundler configurations).
   - Bumped Node engine requirement from Node 14/16 to Node 18+ / 20+.
2. **React 18 Alignment**:
   - Mendix 10 transitioned the client web runtime from React 17 to **React 18**.
   - Updated `@types/react`, `@types/react-dom`, and React runtime dependencies to React 18.
   - Ensured hook behavior (`useRef`, `useEffect`, `useMemo`) and `DndProvider` lifecycle handles React 18's Strict Mode and concurrent rendering without unexpected teardowns.
3. **React-DnD & Backend Updates**:
   - Upgraded `react-dnd`, `dnd-core`, `react-dnd-html5-backend`, and `react-dnd-touch-backend` to **v16+**.
   - Updated multi-backend packages (`dnd-multi-backend`, `react-dnd-multi-backend`, `react-dnd-preview`) to eliminate deprecated React lifecycle warnings while preserving touch and keyboard navigation support.
4. **Widget XML & Type Definitions**:
   - Regenerated TypeScript typings (`DraganddropwidgetProps.d.ts`) matching the Mendix 10 Pluggable Widget APIs (`ListValue`, `EditableValue`, `ActionValue`).
   - Aligned `Draganddropwidget.xml` and `package.xml` module paths with Studio Pro 10 expectations.
   - Updated `Draganddropwidget.editorConfig.ts` to match Studio Pro 10 preview and structure mode APIs.

### Upgrading to Mendix 11 Compatibility (v4.0.0)
1. **Tooling**: Upgraded `@mendix/pluggable-widgets-tools` to `^11.15.0` with Node `>=20` and build compatibility hooks.
2. **React 19**: Configured resolutions/overrides for `react` and `react-dom` `^19.0.0` to match Mendix 11 client runtime.
3. **Package Distribution**: Packaged distribution release under `dist/4.0.0/mendix.Draganddropwidget.mpk`.


This is a complete rewrite of the Drag and Drop Widget.

This version supports most everything the old one did but also has keyboard interaction, touch screen interaction and a
more verbose class names to target.

This version also doesn't use custom javascript actions, but uses verbose microflows that any mendix developer can
understand and edit.

## Demo

We have a playable Demo [here](https://dnd-lts-sandbox.mxapps.io/index.html?profile=Responsive)

## How to use the Widget via examples

To show how to use the widget I will be using the examples in the test project. You can find the Example Project
[here](https://github.com/mendixlabs/app-services-components/releases/download/draganddropwidget%403.0.2/dnd_lts.mpk) or
if you only want the Helpers
[here](https://github.com/mendixlabs/app-services-components/releases/download/draganddropwidget%403.0.2/DnD_HelpersModule.mpk)
and the Examples [here](https://dnd-lts-sandbox.mxapps.io/p/example_1?profile=Responsive)

## Examples

<table style="width:100%">
        <tr>
            <th>Name</th>
            <th>Docs</th>
            <th>Demo</th>
            <th>Preview</th>
        </tr>
        <tr>
            <td>Example 1</td>
            <td><a target="_blank" href="https://mendixlabs.github.io/app-services-components/#/web-widgets/dndExamples/example1">Simple List</a></td>
            <td><a target="_blank" href="https://dnd-lts-sandbox.mxapps.io/p/example_1?profile=Responsive">Demo</a></td>
            <td><img width='500' src='https://raw.githubusercontent.com/mendixlabs/app-services-components/main/apps/web-widgets/drag-and-drop-widget/assets/example1/exm1demo.gif'/></td>
        </tr>
        <tr>
            <td>Example 2</td>
            <td><a target="_blank" href="https://mendixlabs.github.io/app-services-components/#/web-widgets/dndExamples/example2">Nested List</a></td>
            <td><a target="_blank" href="https://dnd-lts-sandbox.mxapps.io/p/example_2?profile=Responsive">Demo</a></td>
                        <td><img width='500' src='https://raw.githubusercontent.com/mendixlabs/app-services-components/main/apps/web-widgets/drag-and-drop-widget/assets/example2/ex2demo.gif'/></td>
        </tr>
        <tr>
            <td>Example 3</td>
            <td><a target="_blank" href="https://mendixlabs.github.io/app-services-components/#/web-widgets/dndExamples/example3">Enum List</a></td>
            <td><a target="_blank" href="https://dnd-lts-sandbox.mxapps.io/p/example_3?profile=Responsive">Demo</a></td>
                        <td><img width='500' src='https://raw.githubusercontent.com/mendixlabs/app-services-components/main/apps/web-widgets/drag-and-drop-widget/assets/example3/ex3demo.gif'/></td>
        </tr>

</table>

## CSS Deep Dive

<details><summary>How drag to new Parent works</summary>

## Styling

The widget exposes a lot of class names that you can target for custom styling

**Note:** Pseudo styling, like `:hover`, is not recommended and could lead to some issues.

The widget is wrapped with the class name given in `Unique Container Name` looking something like this:

```html
<!-- some cool HTML -->
<div class="TEXT_FROM_Unique_Container_Name">
    <Widget />
</div>
```

### Generic and Specific Styles

So all css is encapsulated, but if you wanted to write universal styles for 2 or more Widgets, the widget exposes
generic and specific class names: e.g.

```html
<!-- some cool HTML -->
<Widget>
    <div
        class="TEXT_FROM_Unique_Container_Name_dnd_draggable_item
        dnd_draggable_item"
    >
        Drag Me
    </div>
</Widget>
```

So for every class name there is a generic one and specific one prefixed with `Unique Container Name`

### Odd and Even Class Names

As the widget adds and removes class names for all interactions with it it gives odd and even class names.

If there is a class name `draggable` there is a `_not_draggable`. Below is the list of css names on a Draggable element
that is in rest:

```text
Unique_Container_Name_dnd_draggable_item
dnd_draggable_item

Unique_Container_Name__dnd_draggable_not_new // not recommended
dnd_draggable_not_new // not recommended

Unique_Container_Name__dnd_draggable_not_over
dnd_draggable_not_over

Unique_Container_Name__dnd_draggable_not_hover
dnd_draggable_not_hover

Unique_Container_Name__dnd_draggable_not_dragging
dnd_draggable_not_dragging
```

### Special Class names

There is a droppable area at bottom of the widget that takes up the height by its parent/ or the whole empty widget.
This is done for if you want a droppable region bigger that the list is long:

**NOTE** Use with caution as it will always return -1 index. So id you get -1 in you mendix microflow, know that that
dropped item must be added to the bottom of the list

```text
Unique_Container_dnd_draggable_container_droppable
dnd_draggable_container_droppable
```

At the bottom of every iteration in the list there is an empty `div` what can be styles as a spacer, this can be margin,
padding or height/width.

```text
Unique_Container_dnd_draggable_container_not_dragging
dnd_draggable_container_not_dragging

Unique_Container_dnd_draggable_container_dragging
dnd_draggable_container_dragging
```

### Drag Preview

Drag preview has most of the same classnames as the individual items rendered except it is nested a lithe different so
be cause's when it come to nesting/specificity.

-   Drag Preview Container

```text
Unique_Container_dnd_drag_preview_container
dnd_drag_preview_container
```

-   Drag Preview Item

```text
Unique_Container_dnd_draggable_item
dnd_draggable_item

Unique_Container_dnd_drag_preview_item
dnd_drag_preview_item
```

## Some oddities when nesting.

As nesting can cause oddities, and the functionality does depend on on the way you style it.

So lets see some practical examples

**Hover Event**

```scss
//  Mouse Hover Over Item
.dnd_draggable_hover {
    background-color: green;
}
```

<img src='https://raw.githubusercontent.com/mendixlabs/app-services-components/main/apps/web-widgets/drag-and-drop-widget/assets/hover.gif'/>

```scss
//  Space Created Above on Drag Over
.isAbove {
    background-color: blue;
}
//  Space Created Below on Drag Over
.isBelow {
    background-color: red;
}
```

<img src='https://raw.githubusercontent.com/mendixlabs/app-services-components/main/apps/web-widgets/drag-and-drop-widget/assets/above-below.gif'/>

**Dragging Event**

```scss
.dnd_draggable_dragging {
    background-color: brown;
}
```

<img src='https://raw.githubusercontent.com/mendixlabs/app-services-components/main/apps/web-widgets/drag-and-drop-widget/assets/dragging.gif'/>
</detail>
