import React from 'react';

export interface TrayItemWidgetProps {
        model: any,
        color?: string,
        name: string
}

export interface TrayItemWidgetState {}

export default class TrayItemWidget extends React.Component<TrayItemWidgetProps, TrayItemWidgetState> {
    constructor(props: TrayItemWidgetProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                style={{ background: this.props.color, borderRadius: "10px", margin: "10px", width: "50%" }}
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
                }}
                className="tray-item col s6"
            >
                {this.props.name}
            </div>
        );
    }
}